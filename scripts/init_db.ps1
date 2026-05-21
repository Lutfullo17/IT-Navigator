# PostgreSQL / SQLite — jadvallar + demo ma'lumot
# Ishlatish: .\scripts\init_db.ps1

$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

$python = Join-Path $PWD "venv\Scripts\python.exe"
if (-not (Test-Path $python)) {
    Write-Error "venv topilmadi. Avval: python -m venv venv && pip install -r requirements.txt"
}

Write-Host "=== migrate (jadvallar) ===" -ForegroundColor Cyan
& $python manage.py migrate

Write-Host "=== seed_demo (yo'nalishlar, vazifalar, ...) ===" -ForegroundColor Cyan
& $python manage.py seed_demo

Write-Host "=== Tayyor ===" -ForegroundColor Green
Write-Host "Admin: python manage.py createsuperuser"
Write-Host "Batafsil: DATABASE.md"
