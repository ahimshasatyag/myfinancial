-- 202611250002_create_user_settings.sql
do $$ begin
  create type public.theme_mode as enum ('light', 'dark', 'system');
exception when duplicate_object then null; end $$;

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme public.theme_mode not null default 'system',
  preferred_currency varchar(3) not null default 'IDR',
  timezone text not null default 'Asia/Jakarta',
  language_code varchar(10) not null default 'id',
  week_starts_on smallint not null default 1,
  hide_balances boolean not null default false,
  notifications_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_settings_currency_format check (preferred_currency ~ '^[A-Z]{3}$'),
  constraint user_settings_week_start check (week_starts_on between 0 and 6)
);

create trigger trg_user_settings_updated_at
before update on public.user_settings
for each row execute function public.set_updated_at();
