from django.db import models


class Direction(models.Model):
    slug = models.SlugField(unique=True, max_length=50)
    name = models.CharField(max_length=100)

    short_description = models.TextField()
    who_is_it_for = models.TextField()
    difficulty = models.CharField(max_length=50)
    math_needed = models.CharField(max_length=200)
    what_you_learn = models.TextField()
    job_market = models.TextField()
    real_life_example = models.TextField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name