from rest_framework import serializers

from .models import RoadmapStep, UserRoadmapProgress


class RoadmapStepSerializer(serializers.ModelSerializer):
    direction_name = serializers.CharField(source='direction.name', read_only=True)
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
