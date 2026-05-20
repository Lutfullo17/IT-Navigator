from django.contrib import admin
from .models import MiniTask, UserTaskCompletion


@admin.register(MiniTask)
class MiniTaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'direction', 'order', 'is_active')
    list_filter = ('direction', 'is_active')
    search_fields = ('title', 'description')
    ordering = ('direction', 'order')


@admin.register(UserTaskCompletion)
class UserTaskCompletionAdmin(admin.ModelAdmin):
    list_display = ('user', 'task', 'is_completed', 'liked', 'completed_at')
    list_filter = ('is_completed', 'liked', 'task__direction')
    search_fields = ('user__username', 'task__title')
