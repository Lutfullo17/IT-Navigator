"""

Django settings for config project.

"""



from pathlib import Path

import os



from dotenv import load_dotenv



BASE_DIR = Path(__file__).resolve().parent.parent



load_dotenv(BASE_DIR / '.env')





def env_bool(key, default=False):

    value = os.environ.get(key, str(default))

    return value.lower() in ('true', '1', 'yes')





SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-change-me')

DEBUG = env_bool('DEBUG', True)

ALLOWED_HOSTS = [

    host.strip()

    for host in os.environ.get('ALLOWED_HOSTS', '127.0.0.1,localhost').split(',')

    if host.strip()

]



INSTALLED_APPS = [

    'django.contrib.admin',

    'django.contrib.auth',

    'django.contrib.contenttypes',

    'django.contrib.sessions',

    'django.contrib.messages',

    'django.contrib.staticfiles',

    'rest_framework',

    'corsheaders',

    'users',

    'rest_framework_simplejwt',

    'drf_spectacular',

    'common',

    'ai_mentor',

    'directions',

    'motivation',

    'progress',

    'recommendations',

    'roadmap',

    'tasks',

    'testsystem',

]



MIDDLEWARE = [

    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.security.SecurityMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',

    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',

    'django.contrib.auth.middleware.AuthenticationMiddleware',

    'django.contrib.messages.middleware.MessageMiddleware',

    'django.middleware.clickjacking.XFrameOptionsMiddleware',

]



ROOT_URLCONF = 'config.urls'



TEMPLATES = [

    {

        'BACKEND': 'django.template.backends.django.DjangoTemplates',

        'DIRS': [BASE_DIR / 'templates'],

        'APP_DIRS': True,

        'OPTIONS': {

            'context_processors': [

                'django.template.context_processors.request',

                'django.contrib.auth.context_processors.auth',

                'django.contrib.messages.context_processors.messages',

            ],

        },

    },

]



WSGI_APPLICATION = 'config.wsgi.application'



REST_FRAMEWORK = {

    'DEFAULT_AUTHENTICATION_CLASSES': (

        'rest_framework_simplejwt.authentication.JWTAuthentication',

    ),

}



DATABASES = {

    'default': {

        'ENGINE': 'django.db.backends.sqlite3',

        'NAME': BASE_DIR / 'db.sqlite3',

    }

}



AUTH_PASSWORD_VALIDATORS = [

    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},

    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},

    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},

    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},

]



LANGUAGE_CODE = os.environ.get('LANGUAGE_CODE', 'uz')

TIME_ZONE = os.environ.get('TIME_ZONE', 'Asia/Tashkent')

USE_I18N = True

USE_TZ = True



STATIC_URL = 'static/'

CORS_ALLOW_ALL_ORIGINS = env_bool('CORS_ALLOW_ALL_ORIGINS', True)



GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')

TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_CHAT_ID = os.environ.get('TELEGRAM_CHAT_ID', '')


