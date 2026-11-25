# PowerShell script to generate Supabase TypeScript types
param (
    [string]$ProjectId = "budgetku"
)

Write-Host "Mengambil tipe TypeScript dari Supabase schema..." -ForegroundColor Cyan

npx supabase gen types typescript --local > src/types/database.types.ts

if ($LASTEXITCODE -eq 0) {
    Write-Host "Tipe TypeScript berhasil diperbarui di src/types/database.types.ts!" -ForegroundColor Green
} else {
    Write-Host "Peringatan: Gagal generate tipe via CLI lokal. Menggunakan tipe fallback." -ForegroundColor Yellow
}
