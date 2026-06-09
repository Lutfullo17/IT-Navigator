# PythonAnywhere uchun frontend build (serverda Node.js kerak emas).
# Ishlatish: .\scripts\build-for-pa.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Push-Location (Join-Path $root "frontend")
try {
    npm ci
    npm run build
    if (-not (Test-Path "dist\index.html")) {
        throw "Build muvaffaqiyatsiz: dist\index.html topilmadi"
    }
    Write-Host ""
    Write-Host "Tayyor: frontend\dist" -ForegroundColor Green
    Write-Host "Keyin: git add frontend/dist && git commit && git push"
    Write-Host "Serverda: cd ~/it-navigator && git pull && Reload web app"
}
finally {
    Pop-Location
}
