-- 202611270001_create_goals_table.sql
-- Tabel Goals (menggantikan tampilan Anggaran di tab utama) + riwayat kontribusi & RLS

do $$ begin
  create type public.goal_status as enum (
    'active', 'completed', 'paused', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.goal_contribution_type as enum (
    'contribution', 'withdrawal'
  );
exception when duplicate_object then null; end $$;

-- 1. Tabel utama: public.goals
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name varchar(150) not null,
  description text,
  target_amount numeric(20,2) not null,
  current_amount numeric(20,2) not null default 0,
  currency_code varchar(3) not null default 'IDR',
  target_date date,
  status public.goal_status not null default 'active',
  icon varchar(60) default 'target',
  color varchar(20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint goals_name_not_blank check (length(trim(name)) > 0),
  constraint goals_target_amount_positive check (target_amount > 0),
  constraint goals_current_amount_non_negative check (current_amount >= 0),
  constraint goals_currency_format check (currency_code ~ '^[A-Z]{3}$'),
  constraint goals_user_id_id_unique unique (id, user_id)
);

create index if not exists goals_user_status_idx
  on public.goals (user_id, status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_goals_updated_at on public.goals;
create trigger trg_goals_updated_at
before update on public.goals
for each row execute function public.set_updated_at();

-- 2. Tabel riwayat kontribusi / penarikan dana goal
create table if not exists public.goal_contributions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null,
  action public.goal_contribution_type not null default 'contribution',
  amount numeric(20,2) not null,
  contribution_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now(),
  constraint goal_contributions_amount_positive check (amount > 0),
  constraint goal_contributions_goal_same_user_fk
    foreign key (goal_id, user_id)
    references public.goals(id, user_id)
    on delete cascade
);

create index if not exists goal_contributions_goal_date_idx
  on public.goal_contributions (goal_id, contribution_date desc);

-- 3. Trigger otomatis memperbarui current_amount & status goal saat ada kontribusi/penarikan
create or replace function public.sync_goal_amount_on_contribution()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_delta numeric(20,2);
  v_goal_id uuid;
  v_new_amount numeric(20,2);
  v_target numeric(20,2);
begin
  if tg_op = 'INSERT' then
    v_goal_id := new.goal_id;
    v_delta := case when new.action = 'contribution' then new.amount else -new.amount end;
  elsif tg_op = 'DELETE' then
    v_goal_id := old.goal_id;
    v_delta := case when old.action = 'contribution' then -old.amount else old.amount end;
  else
    return new;
  end if;

  update public.goals
  set current_amount = greatest(current_amount + v_delta, 0)
  where id = v_goal_id
  returning current_amount, target_amount into v_new_amount, v_target;

  if v_new_amount >= v_target then
    update public.goals set status = 'completed' where id = v_goal_id and status = 'active';
  elsif v_new_amount < v_target then
    update public.goals set status = 'active' where id = v_goal_id and status = 'completed';
  end if;

  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_goal_contributions_sync on public.goal_contributions;
create trigger trg_goal_contributions_sync
after insert or delete on public.goal_contributions
for each row execute function public.sync_goal_amount_on_contribution();

-- 4. View ringkasan progres goals (security_invoker = true agar mengikuti RLS pemanggil)
create or replace view public.goals_overview
with (security_invoker = true)
as
select
  g.id as goal_id,
  g.user_id,
  g.name,
  g.description,
  g.target_amount,
  g.current_amount as saved_amount,
  greatest(g.target_amount - g.current_amount, 0)::numeric(20,2) as remaining_amount,
  case
    when g.target_amount > 0
      then least(round((g.current_amount / g.target_amount) * 100, 1), 100)
    else 0
  end as progress_percentage,
  g.currency_code,
  g.target_date,
  g.status,
  g.icon,
  g.color,
  g.created_at,
  g.updated_at
from public.goals g;

-- 5. Row Level Security (RLS)
alter table public.goals enable row level security;
revoke all on table public.goals from anon, authenticated;
grant select, insert, update, delete on table public.goals to authenticated;

drop policy if exists goals_select_own on public.goals;
create policy goals_select_own on public.goals for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists goals_insert_own on public.goals;
create policy goals_insert_own on public.goals for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists goals_update_own on public.goals;
create policy goals_update_own on public.goals for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists goals_delete_own on public.goals;
create policy goals_delete_own on public.goals for delete to authenticated
  using ((select auth.uid()) = user_id);

alter table public.goal_contributions enable row level security;
revoke all on table public.goal_contributions from anon, authenticated;
grant select, insert, update, delete on table public.goal_contributions to authenticated;

drop policy if exists goal_contributions_select_own on public.goal_contributions;
create policy goal_contributions_select_own on public.goal_contributions for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists goal_contributions_insert_own on public.goal_contributions;
create policy goal_contributions_insert_own on public.goal_contributions for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists goal_contributions_delete_own on public.goal_contributions;
create policy goal_contributions_delete_own on public.goal_contributions for delete to authenticated
  using ((select auth.uid()) = user_id);

grant select on public.goals_overview to authenticated;

-- Refresh schema cache PostgREST agar endpoint /rest/v1/goals langsung aktif
notify pgrst, 'reload schema';
