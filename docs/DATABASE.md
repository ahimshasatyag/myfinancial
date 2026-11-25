# Database Schema & Migrations - budgetku

Database didukung oleh PostgreSQL di Supabase dengan skema modular:

## Tabel Utama
1. `profiles`: Profil pengguna tertaut ke `auth.users`.
2. `user_settings`: Preferensi mata uang, tema, dan format waktu.
3. `accounts`: Rekening bank, kas, dompet digital, kartu kredit.
4. `categories`: Kategori pemasukan/pengeluaran terstruktur hierarkis.
5. `transactions`: Transaksi pengeluaran & pemasukan.
6. `account_transfers`: Transfer antar rekening/dompet tanpa mendistorsi arus kas.
7. `transaction_attachments`: Metadata struk tersimpan di Supabase Storage.
8. `tags` & `transaction_tags`: Pelabelan fleksibel per transaksi.
9. `budgets` & `budget_categories`: Plafon anggaran per periode & kategori.
10. `savings_goals`: Target tabungan spesifik.
11. `recurring_transactions` & `runs`: Template jadwal pengeluaran rutin.

## Views
- `account_balances`: Perhitungan saldo real-time akun.
- `monthly_cash_flow`: Ringkasan pendapatan & belanja bulanan.
- `monthly_category_spend`: Pembagian belanja per kategori.
- `budget_progress`: Persentase penggunaan dan sisa anggaran.
- `savings_goal_progress`: Akumulasi tabungan dan sisa target.
