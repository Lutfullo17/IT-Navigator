from django.db import models
from django.contrib.auth.models import User

from directions.models import Direction


class RoadmapStep(models.Model):
    RESOURCE_TYPES = [
        ('youtube', 'YouTube'),
        ('practice', 'Amaliy mashq'),
        ('article', 'Maqola'),
        ('course', 'Kurs'),
        ('other', 'Boshqa'),
    ]

    direction = models.ForeignKey(Direction, on_delete=models.CASCADE, related_name='roadmap_steps')
    title = models.CharField(max_length=200)
    description = models.TextField()
    order = models.PositiveIntegerField(default=0)
    resource_url = models.URLField(blank=True, default='')
    resource_type = models.CharField(max_length=20, choices=RESOURCE_TYPES, default='other')
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.direction.name} - {self.title}'


class UserRoadmapProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='roadmap_progress')
    step = models.ForeignKey(RoadmapStep, on_delete=models.CASCADE, related_name='user_progress')
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'step']

    def __str__(self):
        return f'{self.user.username} - {self.step.title}'
