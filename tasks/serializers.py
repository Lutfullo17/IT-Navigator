from rest_framework import serializers

from .models import MiniTask, UserTaskCompletion


class MiniTaskSerializer(serializers.ModelSerializer):
    direction_name = serializers.CharField(source='direction.name', read_only=True)
    direction_slug = serializers.CharField(source='direction.slug', read_only=True)

    class Meta:
        model = MiniTask
        fields = [
            'id',
            'direction_name',
            'direction_slug',
            'title',
            'description',
            'instruction',
            'task_data',
            'order',
        ]


class CompleteTaskSerializer(serializers.Serializer):
    liked = serializers.BooleanField(required=True)


class UserTaskCompletionSerializer(serializers.ModelSerializer):
    task = MiniTaskSerializer(read_only=True)

    class Meta:
        model = UserTaskCompletion
        fields = ['id', 'task', 'is_completed', 'liked', 'completed_at']
