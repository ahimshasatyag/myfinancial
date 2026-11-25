-- 202611250014_signup_bootstrap_and_prd_views.sql
-- PRD 10.1: saat user baru dibuat, otomatis buat profile, user_settings, dan default categories.
-- PRD 11.2: reporting views sesuai nama baseline (monthly_financial_summary, category_expense_summary).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(left(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), 120), ''))
  on conflict (id) do nothing;

  insert into public.user_settings (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.categories (user_id, name, transaction_type, icon, is_default, sort_order)
  values
    (new.id, 'Makanan & Minuman', 'expense', 'utensils', true, 1),
    (new.id, 'Transportasi', 'expense', 'car', true, 2),
    (new.id, 'Belanja', 'expense', 'shopping-bag', true, 3),
    (new.id, 'Tagihan', 'expense', 'receipt', true, 4),
    (new.id, 'Rumah Tangga', 'expense', 'home', true, 5),
    (new.id, 'Kesehatan', 'expense', 'heart-pulse', true, 6),
    (new.id, 'Pendidikan', 'expense', 'graduation-cap', true, 7),
    (new.id, 'Hiburan', 'expense', 'clapperboard', true, 8),
    (new.id, 'Perawatan Pribadi', 'expense', 'sparkles', true, 9),
    (new.id, 'Lain-lain', 'expense', 'tag', true, 10),
    (new.id, 'Gaji', 'income', 'briefcase-business', true, 1),
    (new.id, 'Freelance', 'income', 'laptop', true, 2),
    (new.id, 'Bonus', 'income', 'gift', true, 3),
    (new.id, 'Investasi', 'income', 'chart-no-axes-combined', true, 4),
    (new.id, 'Hadiah', 'income', 'gift', true, 5),
    (new.id, 'Lain-lain', 'income', 'tag', true, 6)
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill: user yang sudah terdaftar sebelum trigger ada.
insert into public.profiles (id, full_name)
select u.id, nullif(left(trim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), 120), '')
from auth.users u
on conflict (id) do nothing;

insert into public.user_settings (user_id)
select u.id from auth.users u
on conflict (user_id) do nothing;

insert into public.categories (user_id, name, transaction_type, icon, is_default, sort_order)
select u.id, c.name, c.transaction_type::public.transaction_type, c.icon, true, c.sort_order
from auth.users u
cross join (values
  ('Makanan & Minuman', 'expense', 'utensils', 1),
  ('Transportasi', 'expense', 'car', 2),
  ('Belanja', 'expense', 'shopping-bag', 3),
  ('Tagihan', 'expense', 'receipt', 4),
  ('Rumah Tangga', 'expense', 'home', 5),
  ('Kesehatan', 'expense', 'heart-pulse', 6),
  ('Pendidikan', 'expense', 'graduation-cap', 7),
  ('Hiburan', 'expense', 'clapperboard', 8),
  ('Perawatan Pribadi', 'expense', 'sparkles', 9),
  ('Lain-lain', 'expense', 'tag', 10),
  ('Gaji', 'income', 'briefcase-business', 1),
  ('Freelance', 'income', 'laptop', 2),
  ('Bonus', 'income', 'gift', 3),
  ('Investasi', 'income', 'chart-no-axes-combined', 4),
  ('Hadiah', 'income', 'gift', 5),
  ('Lain-lain', 'income', 'tag', 6)
) as c(name, transaction_type, icon, sort_order)
where not exists (select 1 from public.categories x where x.user_id = u.id)
on conflict do nothing;

-- Reporting views (hanya transaksi completed yang masuk laporan; transfer tidak masuk income/expense).
create or replace view public.monthly_financial_summary
with (security_invoker = true)
as
select
  t.user_id,
  date_trunc('month', t.transaction_date)::date as month,
  t.currency_code,
  coalesce(sum(t.amount) filter (where t.transaction_type = 'income'), 0)::numeric(20,2) as total_income,
  coalesce(sum(t.amount) filter (where t.transaction_type = 'expense'), 0)::numeric(20,2) as total_expense,
  (
    coalesce(sum(t.amount) filter (where t.transaction_type = 'income'), 0)
    - coalesce(sum(t.amount) filter (where t.transaction_type = 'expense'), 0)
  )::numeric(20,2) as net_cash_flow,
  count(*)::int as transaction_count
from public.transactions t
where t.status = 'completed'
group by t.user_id, date_trunc('month', t.transaction_date), t.currency_code;

create or replace view public.category_expense_summary
with (security_invoker = true)
as
select
  t.user_id,
  date_trunc('month', t.transaction_date)::date as month,
  t.currency_code,
  t.category_id,
  c.name as category_name,
  sum(t.amount)::numeric(20,2) as total_expense,
  count(*)::int as transaction_count
from public.transactions t
left join public.categories c on c.id = t.category_id and c.user_id = t.user_id
where t.status = 'completed' and t.transaction_type = 'expense'
group by t.user_id, date_trunc('month', t.transaction_date), t.currency_code, t.category_id, c.name;

grant select on public.monthly_financial_summary, public.category_expense_summary to authenticated;
