-- 202611250005_create_transactions.sql
do $$ begin
  create type public.payment_method as enum (
    'cash', 'debit_card', 'credit_card', 'bank_transfer', 'qris', 'e_wallet', 'other'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.transaction_status as enum (
    'pending', 'completed', 'cancelled'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.transactions (
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
  transaction_date date not null default current_date,
  transaction_time time,
  reference_number varchar(120),
  description text,
  notes text,
  status public.transaction_status not null default 'completed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transactions_amount_positive check (amount > 0),
  constraint transactions_currency_format check (currency_code ~ '^[A-Z]{3}$'),
  constraint transactions_title_not_blank check (length(trim(title)) > 0),
  constraint transactions_user_id_id_unique unique (id, user_id),
  constraint transactions_account_same_user_fk foreign key (account_id, user_id) references public.accounts(id, user_id) on delete restrict,
  constraint transactions_category_same_user_fk foreign key (category_id, user_id) references public.categories(id, user_id) on delete restrict
);

create index if not exists transactions_user_date_idx on public.transactions (user_id, transaction_date desc);
create index if not exists transactions_user_type_date_idx on public.transactions (user_id, transaction_type, transaction_date desc);
create index if not exists transactions_account_date_idx on public.transactions (account_id, transaction_date desc);

create trigger trg_transactions_updated_at
before update on public.transactions
for each row execute function public.set_updated_at();
