#!/bin/sh
set -e

PORT="${PORT:-8000}"

# Gunicorn darhol ishga tushadi (Railway healthcheck), keyin migrate + seed_demo
gunicorn config.wsgi:application \
    --bind "0.0.0.0:${PORT}" \
    --workers 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile - &
GUNICORN_PID=$!

python manage.py migrate --noinput
python manage.py seed_demo

wait "$GUNICORN_PID"
