from django.contrib import admin
from .models import MotivationalMessage


@admin.register(MotivationalMessage)
class MotivationalMessageAdmin(admin.ModelAdmin):
    list_display = ('text', 'category', 'order', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('text',)
    ordering = ('category', 'order')
