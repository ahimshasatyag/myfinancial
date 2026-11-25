-- Starter categories seed
insert into public.categories (id, user_id, name, transaction_type, icon, is_default, sort_order)
values
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'Makanan & Minuman', 'expense', 'utensils', true, 1),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'Transportasi', 'expense', 'car', true, 2),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'Belanja', 'expense', 'shopping-bag', true, 3),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'Tagihan', 'expense', 'receipt', true, 4),
  ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'Hiburan', 'expense', 'clapperboard', true, 5),
  ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'Gaji', 'income', 'briefcase-business', true, 1),
  ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'Freelance', 'income', 'laptop', true, 2),
  ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'Investasi', 'income', 'chart-no-axes-combined', true, 3)
on conflict do nothing;
