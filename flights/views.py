from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Flight


def flight_list(request):
    """Список рейсов"""
    flights = Flight.objects.all()
    return render(request, 'flights/flight_list.html', {'flights': flights})


def flight_detail(request, pk):
    """Детальная страница рейса"""
    flight = get_object_or_404(Flight, pk=pk)
    return render(request, 'flights/flight_detail.html', {'flight': flight})


def flight_search(request):
    """Поиск рейсов"""
    from_city = request.GET.get('from_city')
    to_city = request.GET.get('to_city')
    date = request.GET.get('date')

    flights = Flight.objects.all()
    if from_city:
        flights = flights.filter(from_city__name__icontains=from_city)
    if to_city:
        flights = flights.filter(to_city__name__icontains=to_city)

    return render(request, 'flights/flight_search.html', {'flights': flights})


@login_required
def flight_book(request, pk):
    """Бронирование рейса"""
    flight = get_object_or_404(Flight, pk=pk)
    return render(request, 'flights/flight_book.html', {'flight': flight})
