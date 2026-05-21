from django.contrib import admin
from django.urls import path, include

import config.admin  # noqa: F401 — admin panel branding
from common.views import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/directions/', include('directions.urls')),
    path('api/users/', include('users.urls')),
    path('api/test/', include('testsystem.urls')),
    path('api/mentor/', include('ai_mentor.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/roadmap/', include('roadmap.urls')),
    path('api/motivation/', include('motivation.urls')),
    path('api/progress/', include('progress.urls')),
    path('api/health/', health_check),
    path('api/feedback/', include('common.urls')),
]
