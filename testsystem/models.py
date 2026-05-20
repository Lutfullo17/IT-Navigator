from django.db import models
from django.contrib.auth.models import User


class TestSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='test_sessions')
    questions = models.JSONField(default=list, blank=True)
    results = models.JSONField(default=list, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.username} - {self.started_at:%Y-%m-%d %H:%M}'


class UserAnswer(models.Model):
    session = models.ForeignKey(TestSession, on_delete=models.CASCADE, related_name='answers')
    question_index = models.PositiveIntegerField()
    question_text = models.TextField()
    selected_option = models.CharField(max_length=255)

    class Meta:
        unique_together = ['session', 'question_index']

    def __str__(self):
        return f'{self.session.user.username} - savol {self.question_index}'
