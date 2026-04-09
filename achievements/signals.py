from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

from achievements.utils import give_achievement
from users.models import Friendship

User = get_user_model()


@receiver(post_save, sender=User)
def give_new_user_achievement(sender, instance, created, **kwargs):
    if created:
        give_achievement(instance, "new_user")


@receiver(post_save, sender=Friendship)
def friendship_achievement(sender, instance, created, **kwargs):
    # если дружба подтверждена
    if instance.status == 'accepted':
        give_achievement(instance.user, "friend_added")
        give_achievement(instance.friend, "friend_added")