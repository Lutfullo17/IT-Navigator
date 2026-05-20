from django.db import models
from django.contrib.auth.models import User

from directions.models import Direction


class MiniTask(models.Model):
    direction = models.ForeignKey(Direction, on_delete=models.CASCADE, related_name='mini_tasks')
    title = models.CharField(max_length=200)
    description = models.TextField()
    instruction = models.TextField()
    task_data = models.JSONField(default=dict, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f'{self.direction.name} - {self.title}'


class UserTaskCompletion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='task_completions')
    task = models.ForeignKey(MiniTask, on_delete=models.CASCADE, related_name='completions')
    is_completed = models.BooleanField(default=False)
    liked = models.BooleanField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ['user', 'task']

    def __str__(self):
        return f'{self.user.username} - {self.task.title}'
