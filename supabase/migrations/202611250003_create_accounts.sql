-- 202611250003_create_accounts.sql
do $$ begin
  create type public.account_type as enum (
    'cash', 'bank', 'e_wallet', 'credit_card', 'investment', 'other'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name varchar(100) not null,
  account_type public.account_type not null,
  institution_name varchar(120),
  account_number_last4 varchar(4),
  currency_code varchar(3) not null default 'IDR',
  opening_balance numeric(20,2) not null default 0,
  icon varchar(60),
  color varchar(20),
  notes text,
  is_active boolean not null default true,
  include_in_total boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint accounts_name_not_blank check (length(trim(name)) > 0),
  constraint accounts_currency_format check (currency_code ~ '^[A-Z]{3}$'),
  constraint accounts_last4_format check (account_number_last4 is null or account_number_last4 ~ '^[0-9]{4}$'),
  constraint accounts_user_id_id_unique unique (id, user_id)
);

create unique index if not exists accounts_user_name_unique on public.accounts (user_id, lower(name));
create index if not exists accounts_user_active_idx on public.accounts (user_id, is_active);

create trigger trg_accounts_updated_at
before update on public.accounts
for each row execute function public.set_updated_at();
