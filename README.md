# budgetku 💳

Aplikasi Manajemen Keuangan Pribadi (Personal Finance) Modern berbasis React Native, Expo Router, dan Supabase dengan arsitektur Monochrome Glassmorphism Design System.

## Fitur Utama
- **Monochrome & Glassmorphism UI**: Mengikuti standar palet kontras tinggi `#F5F5F5` / `#090909`, `#FFFFFF` / `#151515`, `#171717` / `#F5F5F5`.
- **Manajemen Akun & Dompet**: Rekening bank, kas, e-wallet, dan kartu kredit.
- **Pencatatan Pemasukan & Pengeluaran**: Riwayat cepat, filter multi-tipe, dan kalkulator agregasi.
- **Transfer Antar Akun**: Bebas inflasi pemasukan/pengeluaran semu.
- **Alokasi Anggaran (Budgets)**: Pantau plafon dan persentase penggunaan.
- **Target Tabungan (Savings Goals)**: Capai target tabungan finansial Anda.
- **Jadwal Pengeluaran Rutin**: Transaksi berkala otomatis.
- **Privasi Terjamin**: Fitur sembunyikan saldo dan RLS Supabase.

## Struktur Direktori
Struktur proyek mengikuti prinsip Feature-Driven Architecture di dalam `src/`:
- `src/app/`: File-based routing Expo Router (Auth & Protected tabs).
- `src/components/`: Glass UI primitives, Chart SVG, dan layout.
- `src/features/`: Modul fitur terisolasi (Dashboard, Transactions, Accounts, Budgets, Savings, dll).
- `src/theme/`: Sistem token desain monokrom & efek blur glass.
- `supabase/`: Migrasi database SQL, RLS, functions, dan seed.

## Cara Menjalankan
```bash
# Jalankan Expo server
npx expo start

# Jalankan Typecheck
npx tsc --noEmit
```
