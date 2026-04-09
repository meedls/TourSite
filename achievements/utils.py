from .models import Achievement, UserAchievement

def give_achievement(user, code):
    if not user.is_authenticated:
        return None

    achievement = Achievement.objects.filter(code=code).first()
    if not achievement:
        return None

    obj, created = UserAchievement.objects.get_or_create(
        user=user,
        achievement=achievement
    )

    if created:
        return achievement  # новое достижение
    return None