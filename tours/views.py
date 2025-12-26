from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required

from django.db.models import Q, Exists, OuterRef, Min, Max
from datetime import timedelta, date
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models.functions import Extract
from .models import Tour, TourFlight, TourHotel, TourPlace, TourParticipant
from hotels.models import Hotel
from users.models import User
from places.models import City
from flights.models import Flight, Airline


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


def tour_create(request):
    """Создание тура (конструктор)"""
    roundtrip = request.GET.get('roundtrip') in ['1', 'true', 'on']
    raw_from = request.GET.get('from_city')
    raw_to = request.GET.get('to_city')
    from_city_id = raw_from if raw_from and raw_from.isdigit() else None
    to_city_id = raw_to if raw_to and raw_to.isdigit() else None
    class_type = request.GET.get('class_type')
    if class_type not in ['economy', 'business', 'first']:
        class_type = ''
    passengers_raw = request.GET.get('passengers')
    try:
        passengers = max(1, int(passengers_raw)) if passengers_raw else 1
    except ValueError:
        passengers = 1
    date_str = request.GET.get('date') or ''
    
    # Новые фильтры
    price_min = request.GET.get('price_min')
    price_max = request.GET.get('price_max')
    airlines_str = request.GET.get('airlines', '')
    departure_time_filter = request.GET.get('departure_time', '')
    transfers = request.GET.get('transfers', '')
    luggage = request.GET.get('luggage', '')

    flights_qs = Flight.objects.select_related('airline', 'from_city', 'to_city')

    if from_city_id:
        flights_qs = flights_qs.filter(from_city_id=int(from_city_id))
    if to_city_id:
        flights_qs = flights_qs.filter(to_city_id=int(to_city_id))
    if class_type:
        flights_qs = flights_qs.filter(class_type=class_type)

    if roundtrip:
        reverse_exists = Exists(
            Flight.objects.filter(
                from_city_id=OuterRef('to_city_id'),
                to_city_id=OuterRef('from_city_id'),
            )
        )
        flights_qs = flights_qs.annotate(has_return=reverse_exists).filter(has_return=True)

    date_filter = None
    if date_str:
        try:
            from datetime import datetime
            date_filter = datetime.strptime(date_str, '%Y-%m-%d').date()
        except Exception:
            date_filter = None
    base_for_dates = flights_qs
    if date_filter:
        flights_qs = flights_qs.filter(departure_time__date=date_filter)

    # Фильтр по цене
    if price_min:
        try:
            flights_qs = flights_qs.filter(price__gte=float(price_min))
        except ValueError:
            pass
    if price_max:
        try:
            flights_qs = flights_qs.filter(price__lte=float(price_max))
        except ValueError:
            pass

    # Фильтр по авиакомпаниям
    if airlines_str:
        airline_ids = [aid for aid in airlines_str.split(',') if aid.isdigit()]
        if airline_ids:
            flights_qs = flights_qs.filter(airline_id__in=airline_ids)

    # Фильтр по времени вылета
    if departure_time_filter:
        time_filters = Q()
        time_periods = departure_time_filter.split(',')
        for period in time_periods:
            if period == 'morning':
                time_filters |= Q(departure_time__hour__gte=6, departure_time__hour__lt=12)
            elif period == 'day':
                time_filters |= Q(departure_time__hour__gte=12, departure_time__hour__lt=18)
            elif period == 'evening':
                time_filters |= Q(departure_time__hour__gte=18, departure_time__hour__lt=24)
            elif period == 'night':
                time_filters |= Q(departure_time__hour__gte=0, departure_time__hour__lt=6)
        if time_filters:
            flights_qs = flights_qs.filter(time_filters)

    flights = flights_qs.order_by('departure_time')

    # Фильтры отелей
    hotel_price_min = request.GET.get('hotel_price_min')
    hotel_price_max = request.GET.get('hotel_price_max')
    hotel_ratings_str = request.GET.get('hotel_ratings', '')

    hotels_qs = Hotel.objects.select_related('city')

    # Фильтр по цене отелей
    if hotel_price_min:
        try:
            hotels_qs = hotels_qs.filter(price_min__gte=float(hotel_price_min))
        except ValueError:
            pass
    if hotel_price_max:
        try:
            hotels_qs = hotels_qs.filter(price_max__lte=float(hotel_price_max))
        except ValueError:
            pass

    # Фильтр по звёздности (рейтингу)
    if hotel_ratings_str:
        rating_filters = Q()
        for r in hotel_ratings_str.split(','):
            try:
                rating_val = int(r)
                if rating_val == 0:
                    # Без звёзд - рейтинг < 1
                    rating_filters |= Q(rating__lt=1)
                else:
                    # Для конкретного количества звёзд фильтруем по диапазону (например, 5 звёзд = рейтинг от 4.5 до 5.0)
                    rating_filters |= Q(rating__gte=rating_val-0.5, rating__lt=rating_val+0.5)
            except ValueError:
                pass
        if rating_filters:
            hotels_qs = hotels_qs.filter(rating_filters)

    hotels = hotels_qs.order_by('-rating', 'name')
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

    from_cities = City.objects.filter(
        id__in=Flight.objects.values_list('from_city_id', flat=True)
    ).order_by('name')
    to_cities = City.objects.filter(
        id__in=Flight.objects.values_list('to_city_id', flat=True)
    ).order_by('name')

    selected_from_city = City.objects.filter(id=from_city_id).first() if from_city_id else None
    selected_to_city = City.objects.filter(id=to_city_id).first() if to_city_id else None

    # Даты: от самой ранней, 5 подряд
    date_options = []
    first_flight = base_for_dates.order_by('departure_time').first()
    if first_flight:
        start_date = first_flight.departure_time.date()
        for i in range(5):
            d = start_date + timedelta(days=i)
            count = base_for_dates.filter(departure_time__date=d).count()
            date_options.append({'date': d, 'has_flights': count > 0})

    class_label_map = {
        'economy': 'эконом',
        'business': 'бизнес',
        'first': 'первый класс',
    }
    class_label = class_label_map.get(class_type or 'economy', 'эконом')

    # Получаем список всех авиакомпаний
    airlines_list = Airline.objects.all().order_by('name')
    
    # Обрабатываем выбранные авиакомпании для шаблона
    selected_airline_ids = set()
    if airlines_str:
        selected_airline_ids = {int(aid) for aid in airlines_str.split(',') if aid.isdigit()}
    
    # Обрабатываем выбранное время вылета для шаблона
    selected_departure_times = set()
    if departure_time_filter:
        selected_departure_times = set(departure_time_filter.split(','))
    
    # Получаем диапазон цен для слайдера рейсов
    price_stats = Flight.objects.aggregate(min_price=Min('price'), max_price=Max('price'))
    price_min_default = int(price_stats.get('min_price', 0) or 0)
    price_max_default = int(price_stats.get('max_price', 50000) or 50000)
    
    # Обрабатываем выбранные рейтинги отелей для шаблона
    selected_hotel_ratings = set()
    if hotel_ratings_str:
        for r in hotel_ratings_str.split(','):
            try:
                selected_hotel_ratings.add(int(r))
            except ValueError:
                pass
    
    # Получаем диапазон цен для слайдера отелей
    hotel_price_stats = Hotel.objects.aggregate(min_price=Min('price_min'), max_price=Max('price_max'))
    hotel_price_min_default = int(hotel_price_stats.get('min_price', 0) or 0)
    hotel_price_max_default = int(hotel_price_stats.get('max_price', 10000) or 10000)

    context = {
        'flights': flights,
        'hotels': hotels,
        'friends': friends,
        'friend_search': search_query,
        'roundtrip': roundtrip,
        'from_city_id': from_city_id,
        'to_city_id': to_city_id,
        'selected_from_city': selected_from_city,
        'selected_to_city': selected_to_city,
        'class_type': class_type or 'economy',
        'class_label': class_label,
        'passengers': passengers,
        'date_str': date_str,
        'from_cities': from_cities,
        'to_cities': to_cities,
        'date_options': date_options,
        'airlines_list': airlines_list,
        'selected_airline_ids': selected_airline_ids,
        'selected_departure_times': selected_departure_times,
        'price_min': price_min or '',
        'price_max': price_max or '',
        'airlines': airlines_str,
        'departure_time': departure_time_filter,
        'transfers': transfers,
        'luggage': luggage,
        'price_min_default': price_min_default,
        'price_max_default': price_max_default,
        'selected_hotel_ratings': selected_hotel_ratings,
        'hotel_price_min': hotel_price_min or '',
        'hotel_price_max': hotel_price_max or '',
        'hotel_ratings': hotel_ratings_str,
        'hotel_price_min_default': hotel_price_min_default,
        'hotel_price_max_default': hotel_price_max_default,
    }
    return render(request, 'tours/tour_create.html', context)


@login_required
def tour_build(request):
    """Создание тура по выбранным сущностям"""
    if request.method != 'POST':
        return redirect('tours:tour_create')

    flights_ids = [fid for fid in request.POST.get('selected_flights', '').split(',') if fid.isdigit()]
    hotels_ids = [hid for hid in request.POST.get('selected_hotels', '').split(',') if hid.isdigit()]
    places_ids = [pid for pid in request.POST.get('selected_places', '').split(',') if pid.isdigit()]
    friends_ids = [uid for uid in request.POST.get('selected_friends', '').split(',') if uid.isdigit()]

    flights_qs = Flight.objects.filter(id__in=flights_ids).select_related('from_city', 'to_city')
    hotels_qs = Hotel.objects.filter(id__in=hotels_ids)
    places_qs = Place.objects.filter(id__in=places_ids)
    friends_qs = User.objects.filter(id__in=friends_ids).exclude(id=request.user.id)

    today = date.today()
    start_date = today
    end_date = today + timedelta(days=3)
    if flights_qs.exists():
        first_depart = flights_qs.order_by('departure_time').first().departure_time.date()
        last_arrive = flights_qs.order_by('-arrival_time').first().arrival_time.date()
        start_date = first_depart
        end_date = max(last_arrive, first_depart)

    tour = Tour.objects.create(
        user=request.user,
        name=f'Тур {start_date.strftime("%d.%m")} - {end_date.strftime("%d.%m")}',
        description='Собран автоматически из выбранных рейсов, отелей и мест.',
        start_date=start_date,
        end_date=end_date,
        is_public=False,
    )

    for f in flights_qs:
        TourFlight.objects.create(tour=tour, flight=f)

    for h in hotels_qs:
        TourHotel.objects.create(tour=tour, hotel=h, check_in=start_date, check_out=end_date)

    for p in places_qs:
        TourPlace.objects.create(tour=tour, place=p, visit_date=start_date)

    TourParticipant.objects.get_or_create(tour=tour, user=request.user, defaults={'status': 'accepted'})
    for u in friends_qs:
        TourParticipant.objects.get_or_create(tour=tour, user=u, defaults={'status': 'invited'})

    messages.success(request, 'Тур создан из выбранных элементов.')
    return redirect('tours:tour_detail', pk=tour.pk)


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
