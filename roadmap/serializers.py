from rest_framework import serializers

from directions.constants import get_direction_label
from .models import RoadmapStep, UserRoadmapProgress


class RoadmapStepSerializer(serializers.ModelSerializer):
    direction_name = serializers.SerializerMethodField()
    direction_slug = serializers.CharField(source='direction.slug', read_only=True)
    is_completed = serializers.SerializerMethodField()

    class Meta:
        model = RoadmapStep
        fields = [
            'id',
            'direction_name',
            'direction_slug',
            'title',
            'description',
            'order',
            'resource_url',
            'resource_type',
            'is_completed',
        ]

    def get_direction_name(self, obj):
        return get_direction_label(obj.direction.slug, obj.direction.name)

    def get_is_completed(self, obj):
        user = self.context.get('user')
        if not user or not user.is_authenticated:
            return False

        return UserRoadmapProgress.objects.filter(
            user=user,
            step=obj,
            is_completed=True,
        ).exists()


class UserRoadmapProgressSerializer(serializers.ModelSerializer):
    step = RoadmapStepSerializer(read_only=True)

    class Meta:
        model = UserRoadmapProgress
        fields = ['id', 'step', 'is_completed', 'completed_at']
