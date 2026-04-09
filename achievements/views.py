from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Achievement, UserAchievement


@login_required
def api_achievements(request):
    achievements = Achievement.objects.all()
    user_achievements = set(
        UserAchievement.objects.filter(user=request.user)
        .values_list('achievement__id', flat=True)
    )

    data = []

    for ach in achievements:
        data.append({
            "id": ach.id,
            "name": ach.title,
            "description": ach.description,
            "unlocked": ach.id in user_achievements
        })

    return JsonResponse({"achievements": data})


@login_required
def unlock_telegram(request):
    try:
        achievement = Achievement.objects.get(code="explorer")
    except Achievement.DoesNotExist:
        return JsonResponse({"unlocked": False})

    obj, created = UserAchievement.objects.get_or_create(
        user=request.user,
        achievement=achievement
    )

    if created:
        return JsonResponse({
            "unlocked": True,
            "name": achievement.title,
            "description": achievement.description
        })

    return JsonResponse({"unlocked": False})