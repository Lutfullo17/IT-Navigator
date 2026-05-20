from django.contrib import admin
from .models import MotivationalMessage


@admin.register(MotivationalMessage)
class MotivationalMessageAdmin(admin.ModelAdmin):
    list_display = ('text_short', 'category', 'order', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('text',)
    ordering = ('category', 'order')
    list_editable = ('order', 'is_active')

    @admin.display(description='Matn')
    def text_short(self, obj):
        return obj.text[:60] + '...' if len(obj.text) > 60 else obj.text
