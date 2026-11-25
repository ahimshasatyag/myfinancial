# PowerShell verification script for budgetku
Write-Host "=== Memeriksa Kualitas Project budgetku ===" -ForegroundColor Cyan

Write-Host "`n1. Menjalankan TypeScript Compiler Check (tsc)..." -ForegroundColor Yellow
npx tsc --noEmit

if ($LASTEXITCODE -eq 0) {
    Write-Host "Typecheck PASSED!" -ForegroundColor Green
} else {
    Write-Host "Typecheck FAILED!" -ForegroundColor Red
    exit 1
}

Write-Host "`nSemua pengecekan berhasil!" -ForegroundColor Green
