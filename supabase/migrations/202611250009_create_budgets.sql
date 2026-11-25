-- 202611250009_create_budgets.sql
do $$ begin
  create type public.budget_period_type as enum (
    'weekly', 'monthly', 'yearly', 'custom'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name varchar(120) not null,
  period_type public.budget_period_type not null default 'monthly',
  period_start date not null,
  period_end date not null,
  total_amount numeric(20,2) not null,
  currency_code varchar(3) not null default 'IDR',
  rollover_enabled boolean not null default false,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint budgets_valid_period check (period_end >= period_start),
  constraint budgets_amount_positive check (total_amount > 0),
  constraint budgets_currency_format check (currency_code ~ '^[A-Z]{3}$'),
  constraint budgets_name_not_blank check (length(trim(name)) > 0),
  constraint budgets_user_id_id_unique unique (id, user_id)
);

create index if not exists budgets_user_period_idx on public.budgets (user_id, period_start desc, period_end);

create table if not exists public.budget_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  budget_id uuid not null,
  category_id uuid not null,
  limit_amount numeric(20,2) not null,
  created_at timestamptz not null default now(),
  constraint budget_categories_amount_positive check (limit_amount > 0),
  constraint budget_categories_unique unique (budget_id, category_id),
  constraint budget_categories_budget_same_user_fk foreign key (budget_id, user_id) references public.budgets(id, user_id) on delete cascade,
  constraint budget_categories_category_same_user_fk foreign key (category_id, user_id) references public.categories(id, user_id) on delete restrict
);

create index if not exists budget_categories_budget_idx on public.budget_categories (budget_id);

create trigger trg_budgets_updated_at
before update on public.budgets
for each row execute function public.set_updated_at();
