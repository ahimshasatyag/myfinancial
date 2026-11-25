# Keamanan & Kebijakan RLS - budgetku

## Row Level Security (RLS)
Setiap tabel publik dilindungi RLS:
- Semua query dibatasi ke `auth.uid() = user_id`.
- Anonimous role diblokir dari akses data finansial.

## Penyimpanan Kredensial
- Token otentikasi disimpan aman menggunakan hardware keystore perangkat via `expo-secure-store`.
