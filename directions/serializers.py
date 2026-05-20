from rest_framework import serializers

from .constants import DIRECTION_LABELS, DIRECTION_SIMPLE_DESC, get_direction_label
from .models import Direction


class DirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direction
        fields = [
            'id',
            'slug',
            'name',
            'short_description',
            'who_is_it_for',
            'difficulty',
            'math_needed',
            'what_you_learn',
            'job_market',
            'real_life_example',
            'is_active',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        slug = instance.slug
        data['name'] = get_direction_label(slug, data.get('name'))
        if slug in DIRECTION_SIMPLE_DESC:
            data['short_description'] = DIRECTION_SIMPLE_DESC[slug]
        return data
