# PostgreSQL — IT Navigator

Django **jadvallarni qo‘lda ochmaydi** — `migrate` buyrug‘i model asosida PostgreSQL da table yaratadi.

## Nima saqlanadi?

### Foydalanuvchilar (users)
| Jadval | Nima |
|--------|------|
| `auth_user` | Django login (telefon `username` sifatida) |
| `users_profile` | Ism, telefon, til, onboarding |

### Kontent (demo + admin)
| Jadval | Nima |
|--------|------|
| `directions_direction` | IT yo‘nalishlar (frontend, backend, …) |
| `tasks_minitask` | Mini vazifalar |
| `tasks_usertaskcompletion` | Foydalanuvchi vazifa natijalari |
| `roadmap_roadmapstep` | Roadmap qadamlari |
| `roadmap_userroadmapprogress` | Roadmap progress |
| `motivation_motivationalmessage` | Motivatsion matnlar |
| `testsystem_testsession` | Test sessiyalari |
| `testsystem_useranswer` | Test javoblari |
| `ai_mentor_chatsession` | AI mentor chatlar |
| `ai_mentor_chatmessage` | Chat xabarlar |

### Django tizim
| Jadval | Nima |
|--------|------|
| `django_migrations` | Qaysi migratsiya ishlagan |
| `django_session` | Sessiyalar (admin) |
| `django_admin_log` | Admin log |

---

## 1. Lokal PostgreSQL

### O‘rnatish (Windows)
1. [PostgreSQL](https://www.postgresql.org/download/windows/) o‘rnating
2. pgAdmin yoki `psql` oching

### Database yaratish (psql yoki pgAdmin SQL)

```sql
CREATE DATABASE it_navigator;
CREATE USER itnav WITH PASSWORD 'SizningParol123';
ALTER ROLE itnav SET client_encoding TO 'utf8';
GRANT ALL PRIVILEGES ON DATABASE it_navigator TO itnav;
```

PostgreSQL 15+ da schema huquqi:

```sql
\c it_navigator
GRANT ALL ON SCHEMA public TO itnav;
```

### `.env` sozlash

`.env` faylida SQLite o‘rniga:

```env
DATABASE_URL=postgresql://itnav:SizningParol123@localhost:5432/it_navigator
```

> `sqlite:///db.sqlite3` — faqat lokal test; production **PostgreSQL** ishlatadi.

---

## 2. CMD / PowerShell — jadvallarni ochish (migrate)

Loyiha papkasida:

```powershell
cd "D:\Loyilalar\IT navigator"
.\venv\Scripts\activate
```

**Barcha jadvallarni yaratish:**

```powershell
python manage.py migrate
```

**Demo ma’lumot (yo‘nalishlar, vazifalar, motivatsiya):**

```powershell
python manage.py seed_demo
```

**Admin panel uchun superuser:**

```powershell
python manage.py createsuperuser
```

**Telefon formatini birlashtirish (eski yozuvlar bo‘lsa):**

```powershell
python manage.py normalize_phones
```

**Qaysi jadvallar borligini ko‘rish:**

```powershell
python manage.py showmigrations
python manage.py dbshell
```

`dbsql` ichida PostgreSQL:

```sql
\dt
SELECT * FROM directions_direction;
SELECT id, username FROM auth_user;
```

Chiqish: `\q`

---

## 3. Production (PythonAnywhere)

Batafsil qo‘llanma: **[DEPLOY_PYTHONANYWHERE.md](DEPLOY_PYTHONANYWHERE.md)**

Qisqacha — Bash console:

```bash
cd ~/it-navigator
source venv/bin/activate
python manage.py migrate
python manage.py seed_demo
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

---

## 4. SQLite → PostgreSQL ko‘chirish

Eski `db.sqlite3` dan yangi Postgres ga:

```powershell
# .env da DATABASE_URL=postgresql://... bo‘lsin
python manage.py migrate
python manage.py seed_demo
# Foydalanuvchilarni qayta register qilish yoki dumpdata/loaddata kerak bo‘lishi mumkin
```

---

## 5. Tekshirish

```powershell
python manage.py shell -c "from directions.models import Direction; print(Direction.objects.count())"
```

`6` yoki undan ko‘p — `seed_demo` ishlagan.
