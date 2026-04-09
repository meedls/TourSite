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
def use_slider(request):
    ach = Achievement.objects.get(code='use_slider')

    obj, created = UserAchievement.objects.get_or_create(
        user=request.user,
        achievement=ach
    )

    return JsonResponse({
        "unlocked": created,
        "name": ach.title,
        "description": ach.description
    })
@login_required
def scroll_footer(request):
    ach = Achievement.objects.get(code='scroll_footer')

    obj, created = UserAchievement.objects.get_or_create(
        user=request.user,
        achievement=ach
    )

    return JsonResponse({
        "unlocked": created,
        "name": ach.title,
        "description": ach.description
    })
@login_required
def select_city(request):
    ach = Achievement.objects.get(code='select_city')

    obj, created = UserAchievement.objects.get_or_create(
        user=request.user,
        achievement=ach
    )

    return JsonResponse({
        "unlocked": created,
        "name": ach.title,
        "description": ach.description
    })
@login_required
def select_hotel(request):
    ach = Achievement.objects.get(code='select_hotel')

    obj, created = UserAchievement.objects.get_or_create(
        user=request.user,
        achievement=ach
    )

    return JsonResponse({
        "unlocked": created,
        "name": ach.title,
        "description": ach.description
    })
@login_required
def start_booking(request):
    ach = Achievement.objects.get(code='start_booking')

    obj, created = UserAchievement.objects.get_or_create(
        user=request.user,
        achievement=ach
    )

    return JsonResponse({
        "unlocked": created,
        "name": ach.title,
        "description": ach.description
    })
@login_required
def buy_ticket_click(request):
    ach = Achievement.objects.get(code='buy_ticket_click')

    obj, created = UserAchievement.objects.get_or_create(
        user=request.user,
        achievement=ach
    )

    return JsonResponse({
        "unlocked": created,
        "name": ach.title,
        "description": ach.description
    })
@login_required
def open_friends_achievement(request):
    ach = Achievement.objects.get(code='open_friends')

    obj, created = UserAchievement.objects.get_or_create(
        user=request.user,
        achievement=ach
    )

    return JsonResponse({
        "unlocked": created,
        "name": ach.title,
        "description": ach.description
    })
@login_required
def unlock_friend_added(request):
    achievement = Achievement.objects.filter(code="friend_added").first()

    if not achievement:
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
@login_required
def unlock_group_tour(request):
    achievement = Achievement.objects.filter(code="group_tour").first()

    if not achievement:
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

@login_required
def unlock_only_friend(request):
    achievement = Achievement.objects.filter(code="only_friend_tour").first()

    if not achievement:
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
@login_required
def time_spent(request):
    ach = Achievement.objects.get(code='time_spent')

    obj, created = UserAchievement.objects.get_or_create(
        user=request.user,
        achievement=ach
    )

    return JsonResponse({
        "unlocked": created,
        "name": ach.title,
        "description": ach.description
    })