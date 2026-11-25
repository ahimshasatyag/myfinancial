# Arsitektur Aplikasi - budgetku

Aplikasi dibangun menggunakan arsitektur modular berbasis fitur (Feature-Driven Architecture) dan Expo Router:

```
src/
├── app/          # File-based routing Expo Router
├── components/   # UI Primitives, layout, chart, & komponen bersama
├── constants/    # Konfigurasi aplikasi & rute
├── features/     # Modul independen (auth, dashboard, transactions, dll)
├── hooks/        # React custom hooks
├── lib/          # Integrasi pihak ketiga (Supabase, React Query)
├── providers/    # Context providers (Theme, Auth, Query)
├── services/     # Cross-cutting business logic
├── store/        # Client state management (Zustand)
├── theme/        # Monochrome design system
├── types/        # TypeScript type definitions
└── utils/        # Helper murni (format, tanggal, kalkulasi)
```
