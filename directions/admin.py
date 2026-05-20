from django.contrib import admin
from .models import Direction


@admin.register(Direction)
class DirectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'difficulty', 'is_active', 'created_at')
    list_filter = ('is_active', 'difficulty')
    search_fields = ('name', 'slug', 'short_description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('is_active',)
    ordering = ('name',)

    fieldsets = (
        ('Asosiy', {
            'fields': ('name', 'slug', 'difficulty', 'is_active'),
        }),
        ('Tushuntirish (oddiy til)', {
            'fields': ('short_description', 'who_is_it_for', 'real_life_example'),
        }),
        ('Qo\'shimcha', {
            'fields': ('math_needed', 'what_you_learn', 'job_market'),
        }),
    )
