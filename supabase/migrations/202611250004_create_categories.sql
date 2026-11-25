-- 202611250004_create_categories.sql
do $$ begin
  create type public.transaction_type as enum ('income', 'expense');
exception when duplicate_object then null; end $$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid,
  name varchar(100) not null,
  transaction_type public.transaction_type not null,
  icon varchar(60),
  color varchar(20),
  description text,
  is_default boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_not_blank check (length(trim(name)) > 0),
  constraint categories_not_own_parent check (parent_id is null or parent_id <> id),
  constraint categories_user_id_id_unique unique (id, user_id),
  constraint categories_parent_same_user_fk foreign key (parent_id, user_id) references public.categories(id, user_id) on delete restrict
);

create unique index if not exists categories_user_type_parent_name_unique
  on public.categories (user_id, transaction_type, coalesce(parent_id, '00000000-0000-0000-0000-000000000000'::uuid), lower(name));
create index if not exists categories_user_type_active_idx on public.categories (user_id, transaction_type, is_active);

create trigger trg_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();
