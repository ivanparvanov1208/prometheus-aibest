import os
from pathlib import Path
import environ
import pymysql

env = environ.Env()
environ.Env.read_env()
pymysql.install_as_MySQLdb()

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = env('SECRET_KEY', default='django-insecure-restructured-key-2026')
DEBUG = env.bool('DEBUG', default=True)
ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=["localhost", "127.0.0.1", "api.attendlyapp.xyz", "mc.holybluds.eu"])

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'drf_spectacular',
    'users.apps.UsersConfig',
    'events.apps.EventsConfig',
    'colorfield',
    'admin_interface'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 's86_website',
        'USER': 'u86_77ja7udrQW',
        'PASSWORD': '12Pu1Gt9ia3.=wtOY5gtkAa1',
        'HOST': '46.55.162.239',
        'PORT': '3306',
    }
}
AUTH_USER_MODEL = 'users.User'
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework.authentication.TokenAuthentication'],
    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated'],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

CORS_ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:5173", "https://attendlyapp.xyz", "https://api.attendlyapp.xyz"]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = ["https://attendlyapp.xyz", "https://api.attendlyapp.xyz"]
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
