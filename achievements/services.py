from .models import Achievement, UserAchievement


def give_achievement(user, code):
    """Выдать достижение пользователю"""
    try:
        achievement = Achievement.objects.get(code=code)
    except Achievement.DoesNotExist:
        return

    # если уже есть — ничего не делаем
    if UserAchievement.objects.filter(user=user, achievement=achievement).exists():
        return

    UserAchievement.objects.create(user=user, achievement=achievement)