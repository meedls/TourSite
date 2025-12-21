from django.shortcuts import render, get_object_or_404
from .models import City, Place


def city_list(request):
    """Список городов"""
    cities = City.objects.all()
    return render(request, 'places/city_list.html', {'cities': cities})


def city_detail(request, pk):
    """Детальная страница города"""
    city = get_object_or_404(City, pk=pk)
    places = city.places.all()
    return render(request, 'places/city_detail.html', {'city': city, 'places': places})


def place_list(request):
    """Список достопримечательностей"""
    places = Place.objects.all()
    return render(request, 'places/place_list.html', {'places': places})


def place_detail(request, pk):
    """Детальная страница достопримечательности"""
    place = get_object_or_404(Place, pk=pk)
    return render(request, 'places/place_detail.html', {'place': place})
