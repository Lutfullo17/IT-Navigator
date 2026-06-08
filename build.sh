#!/usr/bin/env bash
set -o errexit

echo "==> Python paketlar o'rnatilmoqda..."
pip install --upgrade pip
pip install -r requirements.txt

echo "==> Frontend build..."
cd frontend
npm ci
npm run build
cd ..

echo "==> Static fayllar yig'ilmoqda..."
python manage.py collectstatic --no-input

echo "==> Database migratsiyasi..."
python manage.py migrate --no-input

echo "==> Build tugadi."
