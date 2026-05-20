from django.contrib import admin
from .models import TestSession, UserAnswer


class UserAnswerInline(admin.TabularInline):
    model = UserAnswer
    extra = 0
    readonly_fields = ('question_index', 'question_text', 'selected_option')


@admin.register(TestSession)
class TestSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'started_at', 'completed_at', 'is_completed')
    list_filter = ('is_completed',)
    search_fields = ('user__username',)
    readonly_fields = ('questions', 'results')
    inlines = [UserAnswerInline]
