# UI/UX & Design System - budgetku

## Standar Desain Monochrome & Glassmorphism

Sesuai dengan spesifikasi desain resmi (Standar Desain Bagian 10):

| Komponen | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| **Screen (Latar Belakang Layar)** | `#F5F5F5` | `#090909` |
| **Card (Kartu Konten)** | `#FFFFFF` | `#151515` |
| **Input (Field Form)** | `#F7F7F7` | `#1D1D1D` |
| **Button (Tombol Utama)** | `#171717` | `#F5F5F5` |
| **Button Text (Teks Tombol)** | `#FFFFFF` | `#111111` |
| **Modal (Popup / Sheet)** | `#FFFFFF` | `#1D1D1D` |
| **Bottom Tab (Navigasi Bawah)** | White glass (`rgba(255, 255, 255, 0.88)` + blur) | Dark glass (`rgba(21, 21, 21, 0.88)` + blur) |
| **Border (Garis Pembatas)** | `#E5E5E5` | `#303030` |

### Prinsip Desain
- **Monokromatik**: Hierarki visual dibangun dari kontras grayscale dan ketebalan tipografi, bukan warna-warni yang mengalihkan perhatian.
- **Glassmorphism**: Lapisan blur halus (`expo-blur`) pada bottom tab bar dan elemen melayang untuk kedalaman visual premium.
- **Aksen Semantik Minimal**: Warna hijau (`#10B981`) dan merah (`#EF4444`) hanya digunakan secara terukur untuk indikator pemasukan dan pengeluaran.
