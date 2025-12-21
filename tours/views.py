from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required

from django.db.models import Q
from .models import Tour
from hotels.models import Hotel
from users.models import User
from flights.models import Flight


def index(request):
    """Главная страница"""
    return render(request, 'tours/index.html')


def tour_list(request):
    """Список туров"""
    tours = Tour.objects.filter(is_public=True)
    return render(request, 'tours/tour_list.html', {'tours': tours})


def tour_detail(request, pk):
    """Детальная страница тура"""
    tour = get_object_or_404(Tour, pk=pk)
    return render(request, 'tours/tour_detail.html', {'tour': tour})


@login_required
def tour_create(request):
    """Создание тура (конструктор)"""
    flights = Flight.objects.select_related('airline', 'from_city', 'to_city').order_by('departure_time')
    hotels = Hotel.objects.select_related('city').order_by('-rating', 'name')
    search_query = request.GET.get('friend_search', '').strip()

    friends_qs = User.objects.all()
    if request.user.is_authenticated:
        friends_qs = friends_qs.exclude(id=request.user.id)

    if search_query:
        id_filter = Q()
        if search_query.isdigit():
            id_filter = Q(id=int(search_query))
        friends = friends_qs.filter(
            Q(username__icontains=search_query) |
            Q(first_name__icontains=search_query) |
            Q(last_name__icontains=search_query) |
            id_filter
        )[:10]
    else:
        friends = friends_qs.order_by('?')[:3]

    context = {
        'flights': flights,
        'hotels': hotels,
        'friends': friends,
        'friend_search': search_query,
    }
    return render(request, 'tours/tour_create.html', context)


@login_required
def tour_edit(request, pk):
    """Редактирование тура"""
    tour = get_object_or_404(Tour, pk=pk, user=request.user)
    return render(request, 'tours/tour_edit.html', {'tour': tour})


@login_required
def tour_delete(request, pk):
    """Удаление тура"""
    tour = get_object_or_404(Tour, pk=pk, user=request.user)
    if request.method == 'POST':
        tour.delete()
        return redirect('tours:tour_list')
    return render(request, 'tours/tour_delete.html', {'tour': tour})
