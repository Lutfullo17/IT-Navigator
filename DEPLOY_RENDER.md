# IT Navigator — Render ga deploy

Django API + React SPA **bitta domen**da ishlaydi (`https://it-navigator.onrender.com`).

- `/` → React (register, home, …)
- `/api/` → REST API
- `/admin/` → Django admin
- `/health/` → `{"status":"ok"}`

Frontend build Render da avtomatik (`build.sh`); Django WhiteNoise orqali beriladi.

---

## 1. Tayyorgarlik

| Narsa | Qayerdan |
|-------|----------|
| [Render](https://render.com) akkaunt | GitHub bilan ro'yxatdan o'ting |
| GitHub repo | Kod push qiling |
| Groq API kalit | [console.groq.com](https://console.groq.com) |
| Telegram bot | BotFather |

> **Free rejim:** Web servis 15 daqiqa faolsizlikdan keyin uxlaydi (birinchi so'rov sekin). PostgreSQL free 90 kundan keyin o'chiriladi — production uchun paid rejim tavsiya.

---

## 2. Blueprint orqali deploy (tavsiya)

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
2. GitHub repongizni ulang
3. `render.yaml` avtomatik o'qiladi — **Apply**
4. **Environment** bo'limida qo'lda qo'shing:
   - `GROQ_API_KEY`
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
5. Deploy tugagach URL: `https://it-navigator.onrender.com` (yoki siz tanlagan nom)

`ALLOWED_HOSTS` va `CSRF_TRUSTED_ORIGINS` Render hostname uchun **avtomatik** to'ldiriladi (`RENDER_EXTERNAL_HOSTNAME` / `RENDER_EXTERNAL_URL`).

---

## 3. Qo'lda Web Service (Blueprint siz)

**New** → **Web Service** → repo tanlang:

| Sozlama | Qiymat |
|---------|--------|
| Runtime | Python 3 |
| Build Command | `./build.sh` |
| Start Command | `gunicorn config.wsgi:application` |
| Health Check Path | `/health/` |

**Environment variables:**

```env
PYTHON_VERSION=3.12.8
NODE_VERSION=20
DEBUG=false
SECRET_KEY=<uzun-random-kalit>
SECURE_SSL_REDIRECT=false
DATABASE_URL=<Render PostgreSQL connection string>
GROQ_API_KEY=gsk_...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
LANGUAGE_CODE=uz
TIME_ZONE=Asia/Tashkent
```

PostgreSQL: **New** → **PostgreSQL** → Web Service da `DATABASE_URL` ni ulang.

---

## 4. Dastlabki ma'lumot va admin

Deploy muvaffaqiyatli bo'lgach, **Shell** (yoki lokalda `DATABASE_URL` bilan):

```bash
python manage.py seed_demo
python manage.py createsuperuser
```

`seed_demo` — yo'nalishlar va demo kontent. `migrate` har build da avtomatik ishlaydi.

---

## 5. Tekshirish

| URL | Kutilgan natija |
|-----|-----------------|
| `https://SIZNING-APP.onrender.com/health/` | `{"status":"ok"}` |
| `https://SIZNING-APP.onrender.com/` | Register sahifa |
| `https://SIZNING-APP.onrender.com/api/directions/` | Yo'nalishlar JSON |
| `https://SIZNING-APP.onrender.com/admin/` | Admin login |

**Loglar:** Dashboard → servis → **Logs**

---

## 6. Yangilash (keyingi deploylar)

GitHub ga `git push` — Render avtomatik qayta build qiladi:

1. `pip install -r requirements.txt`
2. `npm ci && npm run build` (frontend)
3. `collectstatic` + `migrate`
4. Gunicorn ishga tushadi

Frontend API URL: `frontend/.env.production` da `VITE_API_URL=/api` (bir xil domen).

---

## 7. Muammolar

| Belgilar | Yechim |
|----------|--------|
| **DisallowedHost** | `RENDER_EXTERNAL_HOSTNAME` avtomatik qo'shiladi; qo'lda `ALLOWED_HOSTS` kerak emas |
| **Build failed (npm)** | `NODE_VERSION=20` env o'rnatilganini tekshiring |
| **Frontend yo'q / 503** | Build logda `npm run build` muvaffaqiyatli bo'lganini ko'ring |
| **DB ulanmaydi** | `DATABASE_URL` Render PostgreSQL bilan bog'langan; SSL `settings.py` da yoqilgan |
| **Redirect loop** | `SECURE_SSL_REDIRECT=false` |
| **Yo'nalishlar bo'sh** | Shell: `python manage.py seed_demo` |
| **Groq / Telegram ishlamaydi** | Dashboard → Environment → kalitlar to'g'ri kiritilganini tekshiring |
| **Free tier sekin** | Birinchi so'rov 30–60 s (cold start) — normal |

---

## 8. Loyihadagi fayllar

| Fayl | Vazifa |
|------|--------|
| `render.yaml` | Blueprint: Web + PostgreSQL |
| `build.sh` | Frontend build, static, migrate |
| `config/wsgi.py` | Django + WhiteNoise (SPA) |
| `config/settings.py` | Render hostname, PostgreSQL SSL |
| `frontend/.env.production` | `VITE_API_URL=/api` |
| `requirements.txt` | Django, gunicorn, whitenoise, psycopg2 |
