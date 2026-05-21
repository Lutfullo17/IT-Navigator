# IT Navigator — Railway ga deploy

Loyiha ikki usulda deploy qilinadi:

1. **Bitta service (tavsiya)** — Django + React bir URL (`it-navigator-production.up.railway.app`). Build frontend’ni ham qiladi, `/` → `/register`.
2. **Ikki service** — alohida Backend API va Frontend static.

## 1. Tayyorgarlik

- GitHub repoga kod push qiling
- [railway.app](https://railway.app) da akkaunt

## 2. Backend service

1. **New Project** → **Deploy from GitHub** → reponi tanlang
2. **Add PostgreSQL** — `DATABASE_URL` avtomatik ulanadi
3. Backend service **Settings** → **Root Directory** bo‘sh (loyiha ildizi)
4. **Variables** qo‘shing:

| O‘zgaruvchi | Qiymat |
|-------------|--------|
| `SECRET_KEY` | Railway **Generate** (uzun random) |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `.up.railway.app` (yulduzcha `*` emas — Django `.up.railway.app` qabul qiladi) |
| `SECURE_SSL_REDIRECT` | `False` (Railway uchun majburiy emas; `True` health checkni buzishi mumkin) |
| `CORS_ALLOWED_ORIGINS` | `https://SIZNING-FRONTEND.up.railway.app` |
| `CSRF_TRUSTED_ORIGINS` | `https://SIZNING-FRONTEND.up.railway.app` |
| `GROQ_API_KEY` | Groq kalitingiz |
| `TELEGRAM_BOT_TOKEN` | Bot token |
| `TELEGRAM_CHAT_ID` | Chat ID |

`DATABASE_URL` PostgreSQL dan keladi — qo‘lda yozish shart emas.

5. Deploy tugagach **Settings → Networking → Generate Domain** (masalan `it-navigator-production.up.railway.app`)
6. Tekshirish:
   - `https://YOUR-DOMAIN/health/` → `{"status":"ok"}`
   - `https://YOUR-DOMAIN/` → React (register/login)
   - `https://YOUR-DOMAIN/api/` — API

Bitta service uchun `VITE_API_URL` odatda kerak emas — `frontend/.env.production` da `/api` (shu domen).

### Migratsiya va demo ma’lumot

Railway **Shell** (backend service):

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_demo
```

## 3. Frontend service

1. Xuddi project ichida **New Service** → GitHub repo (yoki **Add Service**)
2. **Root Directory:** `frontend`
3. **Variables:**

| O‘zgaruvchi | Qiymat |
|-------------|--------|
| `VITE_API_URL` | `https://YOUR-BACKEND.up.railway.app/api` |

4. Deploy (build `npm ci && npm run build`)
5. **Generate Domain** (masalan `it-navigator.up.railway.app`)
6. Backend dagi `CORS_ALLOWED_ORIGINS` va `CSRF_TRUSTED_ORIGINS` ni frontend URL bilan yangilang → backend **Redeploy**

## 4. Tartib (muhim)

```text
1. PostgreSQL + Backend deploy
2. Backend domain olish
3. Frontend: VITE_API_URL = backend URL → Frontend deploy
4. Frontend domain → Backend CORS/CSRF yangilash → Backend redeploy
```

`VITE_*` o‘zgaruvchilari **build** paytida kodga yoziladi — API URL o‘zgarganda frontend qayta deploy qilinadi.

## 5. Fayllar (loyihada)

| Fayl | Vazifa |
|------|--------|
| `railway.toml` | Backend build/start |
| `Procfile` | Gunicorn |
| `frontend/railway.toml` | Frontend build/start |
| `requirements.txt` | gunicorn, whitenoise, PostgreSQL |

## 6. Muammolar

| Belgilar | Yechim |
|----------|--------|
| CORS xatosi | `CORS_ALLOWED_ORIGINS` da frontend URL to‘g‘ri va `https://` bilan |
| 502 / DisallowedHost | `ALLOWED_HOSTS=.up.railway.app` yoki aniq backend domen |
| Container to‘xtaydi (Stopping Container) | `SECURE_SSL_REDIRECT=False`, health: `/health/`, redeploy |
| `npm: command not found` | `nixpacks.toml` da `providers = ["python", "node"]` bo‘lishi kerak |
| Admin stil yo‘q | `collectstatic` buildda ishlaydi (`railway.toml`) |
| API ulanmaydi | Frontend `VITE_API_URL` va qayta build |
| Telegram ishlamaydi | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` backend Variables |
