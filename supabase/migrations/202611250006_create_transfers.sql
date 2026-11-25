-- 202611250006_create_transfers.sql
do $$ begin
  create type public.goal_transfer_action as enum ('contribution', 'withdrawal');
exception when duplicate_object then null; end $$;

create table if not exists public.account_transfers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  from_account_id uuid not null,
  to_account_id uuid not null,
  goal_id uuid,
  goal_action public.goal_transfer_action,
  amount numeric(20,2) not null,
  currency_code varchar(3) not null default 'IDR',
  transfer_date date not null default current_date,
  transfer_time time,
  reference_number varchar(120),
  description text,
  notes text,
  status public.transaction_status not null default 'completed',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint account_transfers_amount_positive check (amount > 0),
  constraint account_transfers_different_accounts check (from_account_id <> to_account_id),
  constraint account_transfers_currency_format check (currency_code ~ '^[A-Z]{3}$'),
  constraint account_transfers_user_id_id_unique unique (id, user_id),
  constraint account_transfers_from_account_same_user_fk foreign key (from_account_id, user_id) references public.accounts(id, user_id) on delete restrict,
  constraint account_transfers_to_account_same_user_fk foreign key (to_account_id, user_id) references public.accounts(id, user_id) on delete restrict
);

create index if not exists account_transfers_user_date_idx on public.account_transfers (user_id, transfer_date desc);
create index if not exists account_transfers_from_account_date_idx on public.account_transfers (from_account_id, transfer_date desc);
create index if not exists account_transfers_to_account_date_idx on public.account_transfers (to_account_id, transfer_date desc);

create trigger trg_account_transfers_updated_at
before update on public.account_transfers
for each row execute function public.set_updated_at();
