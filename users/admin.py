from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from .models import Profile


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    extra = 0
    fields = ('full_name', 'phone', 'preferred_language', 'onboarding_completed', 'created_at')
    readonly_fields = ('created_at',)


class UserAdmin(BaseUserAdmin):
    inlines = [ProfileInline]
    list_display = ('username', 'email', 'is_staff', 'date_joined')
    search_fields = ('username', 'email')


admin.site.unregister(User)
admin.site.register(User, UserAdmin)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'full_name', 'phone', 'preferred_language', 'onboarding_completed', 'created_at')
    list_filter = ('preferred_language', 'onboarding_completed')
    search_fields = ('user__username', 'full_name', 'phone')
