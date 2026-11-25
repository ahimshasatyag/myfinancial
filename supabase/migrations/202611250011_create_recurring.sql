-- 202611250011_create_recurring.sql
do $$ begin
  create type public.recurrence_frequency as enum (
    'daily', 'weekly', 'monthly', 'yearly'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.recurring_run_status as enum (
    'created', 'skipped', 'failed'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.recurring_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null,
  category_id uuid,
  transaction_type public.transaction_type not null,
  amount numeric(20,2) not null,
  currency_code varchar(3) not null default 'IDR',
  title varchar(150) not null,
  merchant varchar(150),
  payment_method public.payment_method,
  description text,
  frequency public.recurrence_frequency not null,
  interval_value integer not null default 1,
  start_date date not null,
  end_date date,
  next_run_date date not null,
  last_run_at timestamptz,
  is_active boolean not null default true,
  auto_create boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint recurring_amount_positive check (amount > 0),
  constraint recurring_interval_positive check (interval_value > 0),
  constraint recurring_valid_dates check (end_date is null or end_date >= start_date),
  constraint recurring_currency_format check (currency_code ~ '^[A-Z]{3}$'),
  constraint recurring_title_not_blank check (length(trim(title)) > 0),
  constraint recurring_user_id_id_unique unique (id, user_id),
  constraint recurring_account_same_user_fk foreign key (account_id, user_id) references public.accounts(id, user_id) on delete restrict,
  constraint recurring_category_same_user_fk foreign key (category_id, user_id) references public.categories(id, user_id) on delete restrict
);

create index if not exists recurring_user_next_run_idx on public.recurring_transactions (user_id, next_run_date) where is_active = true;

create table if not exists public.recurring_transaction_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recurring_transaction_id uuid not null,
  transaction_id uuid,
  scheduled_for date not null,
  status public.recurring_run_status not null default 'created',
  error_message text,
  created_at timestamptz not null default now(),
  constraint recurring_runs_unique unique (recurring_transaction_id, scheduled_for),
  constraint recurring_runs_created_has_transaction check (status <> 'created' or transaction_id is not null),
  constraint recurring_runs_recurring_same_user_fk foreign key (recurring_transaction_id, user_id) references public.recurring_transactions(id, user_id) on delete cascade,
  constraint recurring_runs_transaction_same_user_fk foreign key (transaction_id, user_id) references public.transactions(id, user_id) on delete restrict
);

create trigger trg_recurring_transactions_updated_at
before update on public.recurring_transactions
for each row execute function public.set_updated_at();
