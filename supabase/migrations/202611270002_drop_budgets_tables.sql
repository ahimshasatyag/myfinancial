-- 202611270002_drop_budgets_tables.sql
-- Menghapus view, tabel, dan enum lama fitur Anggaran (budgets) yang telah digantikan oleh Goals

drop view if exists public.budget_progress cascade;
drop table if exists public.budget_categories cascade;
drop table if exists public.budgets cascade;
drop type if exists public.budget_period_type cascade;

-- Refresh schema cache PostgREST
notify pgrst, 'reload schema';
