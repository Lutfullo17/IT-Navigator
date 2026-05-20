from rest_framework import serializers
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
