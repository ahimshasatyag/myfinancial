-- 202611270003_create_debts_table.sql
-- Tabel Utang & Piutang (debts) + riwayat pembayaran (debt_payments), view, trigger, & RLS

do $$ begin
  create type public.debt_type as enum ('payable', 'receivable');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.debt_status as enum ('active', 'paid', 'overdue');
exception when duplicate_object then null; end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1. Tabel utama: public.debts
create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.debt_type not null default 'payable',
  counterparty_name varchar(150) not null,
  title varchar(150) not null,
  principal_amount numeric(20,2) not null,
  paid_amount numeric(20,2) not null default 0,
  currency_code varchar(3) not null default 'IDR',
  due_date date,
  status public.debt_status not null default 'active',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint debts_title_not_blank check (length(trim(title)) > 0),
  constraint debts_counterparty_not_blank check (length(trim(counterparty_name)) > 0),
  constraint debts_principal_positive check (principal_amount > 0),
  constraint debts_paid_non_negative check (paid_amount >= 0),
  constraint debts_currency_format check (currency_code ~ '^[A-Z]{3}$'),
  constraint debts_user_id_id_unique unique (id, user_id)
);

create index if not exists debts_user_status_idx
  on public.debts (user_id, type, status, created_at desc);

drop trigger if exists trg_debts_updated_at on public.debts;
create trigger trg_debts_updated_at
before update on public.debts
for each row execute function public.set_updated_at();

-- 2. Tabel riwayat pembayaran / cicilan utang
create table if not exists public.debt_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  debt_id uuid not null,
  amount numeric(20,2) not null,
  payment_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  constraint debt_payments_amount_positive check (amount > 0),
  constraint debt_payments_debt_same_user_fk
    foreign key (debt_id, user_id)
    references public.debts(id, user_id)
    on delete cascade
);

create index if not exists debt_payments_debt_date_idx
  on public.debt_payments (debt_id, payment_date desc);

-- 3. Trigger otomatis update paid_amount & status saat ada pembayaran
create or replace function public.sync_debt_paid_amount()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_delta numeric(20,2);
  v_debt_id uuid;
  v_new_paid numeric(20,2);
  v_principal numeric(20,2);
begin
  if tg_op = 'INSERT' then
    v_debt_id := new.debt_id;
    v_delta := new.amount;
  elsif tg_op = 'DELETE' then
    v_debt_id := old.debt_id;
    v_delta := -old.amount;
  else
    return new;
  end if;

  update public.debts
  set paid_amount = greatest(paid_amount + v_delta, 0)
  where id = v_debt_id
  returning paid_amount, principal_amount into v_new_paid, v_principal;

  if v_new_paid >= v_principal then
    update public.debts set status = 'paid' where id = v_debt_id;
  elsif v_new_paid < v_principal then
    update public.debts set status = 'active' where id = v_debt_id and status = 'paid';
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_debt_payments_sync on public.debt_payments;
create trigger trg_debt_payments_sync
after insert or delete on public.debt_payments
for each row execute function public.sync_debt_paid_amount();

-- 4. View ringkasan progres utang & piutang
create or replace view public.debts_overview
with (security_invoker = true)
as
select
  d.id as debt_id,
  d.user_id,
  d.type,
  d.counterparty_name,
  d.title,
  d.principal_amount,
  d.paid_amount,
  greatest(d.principal_amount - d.paid_amount, 0)::numeric(20,2) as remaining_amount,
  case
    when d.principal_amount > 0
      then least(round((d.paid_amount / d.principal_amount) * 100, 1), 100)
    else 0
  end as progress_percentage,
  d.currency_code,
  d.due_date,
  d.status,
  d.notes,
  d.created_at,
  d.updated_at
from public.debts d;

-- 5. Row Level Security (RLS)
alter table public.debts enable row level security;
revoke all on table public.debts from anon, authenticated;
grant select, insert, update, delete on table public.debts to authenticated;

drop policy if exists debts_select_own on public.debts;
create policy debts_select_own on public.debts for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists debts_insert_own on public.debts;
create policy debts_insert_own on public.debts for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists debts_update_own on public.debts;
create policy debts_update_own on public.debts for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists debts_delete_own on public.debts;
create policy debts_delete_own on public.debts for delete to authenticated
  using ((select auth.uid()) = user_id);

alter table public.debt_payments enable row level security;
revoke all on table public.debt_payments from anon, authenticated;
grant select, insert, update, delete on table public.debt_payments to authenticated;

drop policy if exists debt_payments_select_own on public.debt_payments;
create policy debt_payments_select_own on public.debt_payments for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists debt_payments_insert_own on public.debt_payments;
create policy debt_payments_insert_own on public.debt_payments for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists debt_payments_delete_own on public.debt_payments;
create policy debt_payments_delete_own on public.debt_payments for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select on public.debts_overview to authenticated;

-- Refresh schema cache PostgREST agar endpoint /rest/v1/debts langsung aktif
notify pgrst, 'reload schema';
