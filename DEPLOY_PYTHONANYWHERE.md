# IT Navigator — PythonAnywhere ga deploy

Django API + React SPA **bitta domen**da ishlaydi (`https://USERNAME.pythonanywhere.com`).

- `/` → React (register, home, …)
- `/api/` → REST API
- `/admin/` → Django admin
- `/health/` → `{"status":"ok"}`

Frontend build `frontend/dist` ichida; Django WhiteNoise orqali beriladi.

---

## 1. Tayyorgarlik

| Narsa | Qayerdan |
|-------|----------|
| [PythonAnywhere](https://www.pythonanywhere.com) akkaunt | Ro‘yxatdan o‘ting |
| GitHub repo | Kod push qiling |
| PostgreSQL | Tavsiya: [Neon](https://neon.tech) yoki [Supabase](https://supabase.com) (bepul) |
| Groq API kalit | [console.groq.com](https://console.groq.com) |
| Telegram bot | BotFather |

> **Free rejim cheklovi:** tashqi API (Groq, Telegram) uchun PythonAnywhere **Whitelist** kerak bo‘lishi mumkin (Web → Account → Allowlist). Yoki **Hacker** ($5/oy) rejimga o‘ting — cheklov yo‘q.

---

## 2. Kodni yuklash

**Bash console** oching (Dashboard → Consoles → Bash):

```bash
cd ~
git clone https://github.com/SIZNING-USER/IT-navigator.git it-navigator
cd it-navigator
```

Yoki **Files** orqali zip yuklab, `~/it-navigator` ga oching.

---

## 3. Virtual environment va paketlar

```bash
cd ~/it-navigator
python3.10 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

PythonAnywhere Web tab da **Virtualenv** yo‘lini ko‘rsating:

```text
/home/USERNAME/it-navigator/venv
```

(`USERNAME` o‘rniga o‘z loginingiz)

---

## 4. Frontend build

PythonAnywhere da Node.js har doim bo‘lmaydi — **lokal kompyuteringizda** build qilib, `frontend/dist` ni serverga yuboring.

**Lokal (Windows):**

```powershell
cd frontend
npm ci
npm run build
```

`frontend/dist` papkasini serverga yuboring:

- **Git:** `dist` ni repo ga qo'shing va `git push` (yoki)
- **Files:** PythonAnywhere Files tab orqali `~/it-navigator/frontend/dist` ga yuklang

**Serverda yangilash (git bo'lsa):**

```bash
cd ~/it-navigator
git pull
```

`frontend/.env.production` da allaqachon:

```env
VITE_API_URL=/api
```

Bu bir xil domen uchun to‘g‘ri — qayta build shart emas, agar API URL o‘zgarmasa.

---

## 5. `.env` fayl

Serverda `~/it-navigator/.env` yarating (`.env.example` dan nusxa):

```env
SECRET_KEY=uzun-random-kalit-bu-yerga
DEBUG=False
ALLOWED_HOSTS=USERNAME.pythonanywhere.com

DATABASE_URL=postgresql://USER:PASS@HOST:5432/it_navigator

SECURE_SSL_REDIRECT=False

LANGUAGE_CODE=uz
TIME_ZONE=Asia/Tashkent

GROQ_API_KEY=gsk_...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

| O‘zgaruvchi | Izoh |
|-------------|------|
| `ALLOWED_HOSTS` | Aniq domen: `USERNAME.pythonanywhere.com` |
| `DATABASE_URL` | Tashqi PostgreSQL (Neon/Supabase) |
| `SECURE_SSL_REDIRECT` | `False` — PA HTTPS ni o‘zi beradi, redirect loop bo‘lmasin |
| `CORS_*` | Bir domen bo‘lsa kerak emas |

---

## 6. Database va dastlabki ma’lumot

```bash
cd ~/it-navigator
source venv/bin/activate
python manage.py migrate
python manage.py seed_demo
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

Batafsil: **[DATABASE.md](DATABASE.md)**

---

## 7. Web app (WSGI)

Dashboard → **Web** → **Add a new web app**:

1. **Manual configuration** (Django emas — o‘z WSGI faylimiz bor)
2. Python versiya: **3.10** (yoki lokal venv bilan mos)
3. **Virtualenv:** `/home/USERNAME/it-navigator/venv`
4. **Code:** `/home/USERNAME/it-navigator`

**WSGI configuration file** ni oching (`/var/www/USERNAME_pythonanywhere_com_wsgi.py`) va quyidagiga almashtiring (yoki `deploy/wsgi_pythonanywhere.example.py` dan nusxa oling):

```python
import sys

path = '/home/USERNAME/it-navigator'
if path not in sys.path:
    sys.path.insert(0, path)

from config.wsgi import application
```

`USERNAME` ni o‘zgartiring. **Save** → **Reload** web app.

> Barcha WSGI mantiq `config/wsgi.py` da — PA faylida faqat `sys.path` va import yetarli.

---

## 8. Static files (Web tab)

**Static files** bo‘limida qo‘shing:

| URL | Directory |
|-----|-----------|
| `/static/` | `/home/USERNAME/it-navigator/staticfiles` |

**Reload** qiling.

React `assets/` fayllari WhiteNoise orqali `frontend/dist` dan beriladi — alohida mapping shart emas.

---

## 9. Tekshirish

| URL | Kutilgan natija |
|-----|-----------------|
| `https://USERNAME.pythonanywhere.com/health/` | `{"status":"ok"}` |
| `https://USERNAME.pythonanywhere.com/` | Register sahifa |
| `https://USERNAME.pythonanywhere.com/api/directions/` | Yo‘nalishlar JSON |
| `https://USERNAME.pythonanywhere.com/admin/` | Admin login |

**Error log:** Web tab → **Log files** → `error.log`

---

## 10. Yangilash (keyingi deploylar)

```bash
cd ~/it-navigator
git pull
source venv/bin/activate
pip install -r requirements.txt   # yangi paket bo‘lsa
python manage.py migrate
python manage.py collectstatic --noinput
```

Frontend o‘zgarganda — lokalda `npm run build`, `git push`, serverda `git pull`.

Web tab → **Reload**.

---

## 11. Muammolar

| Belgilar | Yechim |
|----------|--------|
| **DisallowedHost** | `.env` da `ALLOWED_HOSTS=USERNAME.pythonanywhere.com` |
| **502 / Something went wrong** | `error.log` o‘qing; venv yo‘li va `pip install` to‘g‘rimi |
| **Frontend yo‘q / 503 matn** | `frontend/dist/index.html` bormi? Lokalda `npm run build` → push |
| **Admin stil yo‘q** | `collectstatic --noinput` + Web tab `/static/` mapping |
| **Yo‘nalishlar bo‘sh** | `python manage.py seed_demo` |
| **Groq / Telegram ishlamaydi** | Free rejimda API whitelist; yoki Hacker rejim |
| **Redirect loop** | `SECURE_SSL_REDIRECT=False` |
| **DB ulanmaydi** | `DATABASE_URL` to‘g‘ri; Neon/Supabase da IP cheklov yo‘q ekanini tekshiring |

---

## 12. Loyihadagi fayllar

| Fayl | Vazifa |
|------|--------|
| `config/wsgi.py` | Django + WhiteNoise (SPA) |
| `deploy/wsgi_pythonanywhere.example.py` | PA WSGI fayli namunasi |
| `config/settings.py` | `.env`, PostgreSQL, static |
| `frontend/.env.production` | `VITE_API_URL=/api` |
| `requirements.txt` | Django, whitenoise, psycopg2, … |
| `common/management/commands/seed_demo.py` | Demo kontent |
