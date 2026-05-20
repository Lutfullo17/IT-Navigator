from django.contrib import admin
from .models import ChatSession, ChatMessage


class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ('role', 'content', 'created_at')
    can_delete = False


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'message_count', 'created_at', 'updated_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'title')
    readonly_fields = ('created_at', 'updated_at')
    inlines = [ChatMessageInline]
    date_hierarchy = 'created_at'

    @admin.display(description='Xabarlar')
    def message_count(self, obj):
        return obj.messages.count()


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('session', 'role', 'content_short', 'created_at')
    list_filter = ('role',)
    search_fields = ('content', 'session__user__username')
    readonly_fields = ('created_at',)

    @admin.display(description='Matn')
    def content_short(self, obj):
        return obj.content[:50]
