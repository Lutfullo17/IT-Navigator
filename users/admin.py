from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'preferred_language', 'onboarding_completed', 'created_at')
    list_filter = ('preferred_language', 'onboarding_completed')
    search_fields = ('user__username', 'user__email')
