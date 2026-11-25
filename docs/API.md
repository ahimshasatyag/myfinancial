# API & Integrasi Backend - budgetku

## Supabase Client
Aplikasi berkomunikasi langsung dengan Supabase PostgreSQL melalui `@supabase/supabase-js` dengan autentikasi berbasis JWT yang disimpan di Expo SecureStore.

## Edge Functions
- `generate-monthly-report`: Membuat agregat laporan bulanan.
- `process-recurring-transactions`: Eksekusi otomatis transaksi terjadwal.
