from django.contrib import admin
from .models import TestSession, UserAnswer


class UserAnswerInline(admin.TabularInline):
    model = UserAnswer
    extra = 0
    readonly_fields = ('question_index', 'question_text', 'selected_option')


@admin.register(TestSession)
class TestSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'started_at', 'completed_at', 'is_completed', 'results_count')
    list_filter = ('is_completed', 'started_at')
    search_fields = ('user__username',)
    readonly_fields = ('questions', 'results', 'started_at')
    inlines = [UserAnswerInline]
    date_hierarchy = 'started_at'

    @admin.display(description='Natijalar')
    def results_count(self, obj):
        return len(obj.results) if obj.results else 0


@admin.register(UserAnswer)
class UserAnswerAdmin(admin.ModelAdmin):
    list_display = ('session', 'question_index', 'question_short', 'selected_option')
    list_filter = ('session__is_completed',)
    search_fields = ('session__user__username', 'question_text')

    @admin.display(description='Savol')
    def question_short(self, obj):
        return obj.question_text[:50]
