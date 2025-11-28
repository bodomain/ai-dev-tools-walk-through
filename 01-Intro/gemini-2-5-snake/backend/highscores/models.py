from django.db import models


class Score(models.Model):
    name = models.CharField(max_length=100, blank=True, default='Player')
    score = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-score', 'created_at']

    def __str__(self):
        return f"{self.name} - {self.score}"
