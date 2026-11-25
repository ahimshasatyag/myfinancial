-- 202611250010_create_savings.sql
do $$ begin
  create type public.goal_status as enum (
    'active', 'completed', 'paused', 'cancelled'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name varchar(150) not null,
  description text,
  target_amount numeric(20,2) not null,
  currency_code varchar(3) not null default 'IDR',
  target_date date,
  status public.goal_status not null default 'active',
  icon varchar(60),
  color varchar(20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint savings_goals_target_positive check (target_amount > 0),
  constraint savings_goals_currency_format check (currency_code ~ '^[A-Z]{3}$'),
  constraint savings_goals_name_not_blank check (length(trim(name)) > 0),
  constraint savings_goals_user_id_id_unique unique (id, user_id)
);

create index if not exists savings_goals_user_status_idx on public.savings_goals (user_id, status);

create trigger trg_savings_goals_updated_at
before update on public.savings_goals
for each row execute function public.set_updated_at();

-- Add goal foreign key to account_transfers
alter table public.account_transfers
  add constraint account_transfers_goal_same_user_fk
  foreign key (goal_id, user_id)
  references public.savings_goals(id, user_id)
  on delete restrict;
