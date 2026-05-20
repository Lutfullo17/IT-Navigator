from rest_framework import serializers

from .models import ChatSession, ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'created_at']
        read_only_fields = ['id', 'role', 'created_at']


class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = ['id', 'title', 'messages', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SendMessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=2000)
    language = serializers.ChoiceField(choices=['uz', 'ru', 'en'], default='uz')

    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError('Xabar bo\'sh bo\'lmasin')
        return value.strip()
