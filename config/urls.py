from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/directions/', include('directions.urls')),
    path('api/users/', include('users.urls')),
    path('api/test/', include('testsystem.urls')),
    path('api/mentor/', include('ai_mentor.urls')),
]
