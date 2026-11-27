-- 202611270004_create_investments_table.sql
-- Tabel Investasi (investments) + riwayat transaksi investasi (investment_transactions), view, trigger, & RLS

do $$ begin
  create type public.investment_category as enum (
    'stock', 'mutual_fund', 'gold', 'crypto', 'bond', 'deposit', 'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.investment_tx_type as enum (
    'buy', 'sell', 'dividend'
  );
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

-- 1. Tabel utama: public.investments
create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name varchar(150) not null,
  symbol varchar(30),
  category public.investment_category not null default 'mutual_fund',
  platform varchar(100),
  invested_amount numeric(20,2) not null default 0,
  current_value numeric(20,2) not null default 0,
  currency_code varchar(3) not null default 'IDR',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint investments_name_not_blank check (length(trim(name)) > 0),
  constraint investments_invested_non_negative check (invested_amount >= 0),
  constraint investments_current_non_negative check (current_value >= 0),
  constraint investments_currency_format check (currency_code ~ '^[A-Z]{3}$'),
  constraint investments_user_id_id_unique unique (id, user_id)
);

create index if not exists investments_user_category_idx
  on public.investments (user_id, category, created_at desc);

drop trigger if exists trg_investments_updated_at on public.investments;
create trigger trg_investments_updated_at
before update on public.investments
for each row execute function public.set_updated_at();

-- 2. Tabel riwayat transaksi investasi (beli, jual, dividen)
create table if not exists public.investment_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  investment_id uuid not null,
  tx_type public.investment_tx_type not null default 'buy',
  amount numeric(20,2) not null,
  tx_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  constraint investment_tx_amount_positive check (amount > 0),
  constraint investment_tx_investment_same_user_fk
    foreign key (investment_id, user_id)
    references public.investments(id, user_id)
    on delete cascade
);

create index if not exists investment_tx_investment_date_idx
  on public.investment_transactions (investment_id, tx_date desc);

-- 3. Trigger otomatis update invested_amount & current_value saat ada transaksi investasi
create or replace function public.sync_investment_on_transaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_inv_id uuid;
  v_invested_delta numeric(20,2) := 0;
  v_value_delta numeric(20,2) := 0;
  v_type public.investment_tx_type;
  v_amt numeric(20,2);
  v_sign numeric := 1;
begin
  if tg_op = 'INSERT' then
    v_inv_id := new.investment_id;
    v_type := new.tx_type;
    v_amt := new.amount;
    v_sign := 1;
  elsif tg_op = 'DELETE' then
    v_inv_id := old.investment_id;
    v_type := old.tx_type;
    v_amt := old.amount;
    v_sign := -1;
  else
    return new;
  end if;

  if v_type = 'buy' then
    v_invested_delta := v_amt * v_sign;
    v_value_delta := v_amt * v_sign;
  elsif v_type = 'sell' then
    v_invested_delta := -v_amt * v_sign;
    v_value_delta := -v_amt * v_sign;
  elsif v_type = 'dividend' then
    v_invested_delta := 0;
    v_value_delta := v_amt * v_sign;
  end if;

  update public.investments
  set
    invested_amount = greatest(invested_amount + v_invested_delta, 0),
    current_value = greatest(current_value + v_value_delta, 0)
  where id = v_inv_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_investment_tx_sync on public.investment_transactions;
create trigger trg_investment_tx_sync
after insert or delete on public.investment_transactions
for each row execute function public.sync_investment_on_transaction();

-- 4. View ringkasan portofolio investasi (profit/loss & return %)
create or replace view public.investments_overview
with (security_invoker = true)
as
select
  i.id as investment_id,
  i.user_id,
  i.name,
  i.symbol,
  i.category,
  i.platform,
  i.invested_amount,
  i.current_value,
  (i.current_value - i.invested_amount)::numeric(20,2) as profit_loss,
  case
    when i.invested_amount > 0
      then round(((i.current_value - i.invested_amount) / i.invested_amount) * 100, 2)
    else 0
  end as return_percentage,
  i.currency_code,
  i.notes,
  i.created_at,
  i.updated_at
from public.investments i;

-- 5. Row Level Security (RLS)
alter table public.investments enable row level security;
revoke all on table public.investments from anon, authenticated;
grant select, insert, update, delete on table public.investments to authenticated;

drop policy if exists investments_select_own on public.investments;
create policy investments_select_own on public.investments for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists investments_insert_own on public.investments;
create policy investments_insert_own on public.investments for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists investments_update_own on public.investments;
create policy investments_update_own on public.investments for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists investments_delete_own on public.investments;
create policy investments_delete_own on public.investments for delete to authenticated
  using ((select auth.uid()) = user_id);

alter table public.investment_transactions enable row level security;
revoke all on table public.investment_transactions from anon, authenticated;
grant select, insert, update, delete on table public.investment_transactions to authenticated;

drop policy if exists investment_tx_select_own on public.investment_transactions;
create policy investment_tx_select_own on public.investment_transactions for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists investment_tx_insert_own on public.investment_transactions;
create policy investment_tx_insert_own on public.investment_transactions for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists investment_tx_delete_own on public.investment_transactions;
create policy investment_tx_delete_own on public.investment_transactions for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select on public.investments_overview to authenticated;

-- Refresh schema cache PostgREST agar endpoint /rest/v1/investments langsung aktif
notify pgrst, 'reload schema';
