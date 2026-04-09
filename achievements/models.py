from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Achievement(models.Model):
    """Справочник достижений"""
    code = models.CharField(max_length=100, unique=True, verbose_name='Код')
    title = models.CharField(max_length=255, verbose_name='Название')
    description = models.TextField(verbose_name='Описание')
    icon = models.ImageField(upload_to='achievements/', blank=True, null=True)

    class Meta:
        verbose_name = 'Достижение'
        verbose_name_plural = 'Достижения'

    def __str__(self):
        return self.title


class UserAchievement(models.Model):
    """Полученные достижения"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    achieved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'achievement')
        verbose_name = 'Достижение пользователя'
        verbose_name_plural = 'Достижения пользователей'

    def __str__(self):
        return f"{self.user} - {self.achievement}"