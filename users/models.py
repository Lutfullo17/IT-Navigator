from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    LANGUAGE_CHOICES = [
        ('uz', 'O\'zbek'),
        ('ru', 'Rus'),
        ('en', 'Ingliz'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=120, blank=True)
    phone = models.CharField(max_length=20, unique=True, blank=True, null=True)
    preferred_language = models.CharField(max_length=5, choices=LANGUAGE_CHOICES, default='uz')
    onboarding_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
