from django.db import models


class MotivationalMessage(models.Model):
    CATEGORY_CHOICES = [
        ('general', 'Umumiy'),
        ('beginner', 'Boshlovchi'),
        ('struggling', 'Qiynalayotgan'),
        ('after_test', 'Testdan keyin'),
        ('learning', 'O\'rganish jarayoni'),
    ]

    text = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.text[:50]
