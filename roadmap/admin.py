from django.contrib import admin
from .models import RoadmapStep, UserRoadmapProgress


@admin.register(RoadmapStep)
class RoadmapStepAdmin(admin.ModelAdmin):
    list_display = ('title', 'direction', 'order', 'resource_type', 'is_active')
    list_filter = ('direction', 'resource_type', 'is_active')
    search_fields = ('title', 'description')
    ordering = ('direction', 'order')


@admin.register(UserRoadmapProgress)
class UserRoadmapProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'step', 'is_completed', 'completed_at')
    list_filter = ('is_completed', 'step__direction')
    search_fields = ('user__username', 'step__title')
