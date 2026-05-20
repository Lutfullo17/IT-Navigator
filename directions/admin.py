from django.contrib import admin
from .models import Direction


@admin.register(Direction)
class DirectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'difficulty', 'is_active', 'created_at')
    list_filter = ('is_active', 'difficulty')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
