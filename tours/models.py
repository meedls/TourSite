from django.db import models
from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from places.models import City, Place
from flights.models import Flight
from hotels.models import Hotel


class Tour(models.Model):
    """Туры"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tours', verbose_name='Создатель')
    name = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    start_date = models.DateField(verbose_name='Дата начала')
    end_date = models.DateField(verbose_name='Дата окончания')
    is_public = models.BooleanField(default=True, verbose_name='Публичный')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    class Meta:
        verbose_name = 'Тур'
        verbose_name_plural = 'Туры'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} ({self.user.username})'


class TourCity(models.Model):
    """Города в туре"""
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='cities', verbose_name='Тур')
    city = models.ForeignKey(City, on_delete=models.CASCADE, verbose_name='Город')
    order = models.IntegerField(default=0, verbose_name='Порядок')
    arrival_date = models.DateField(verbose_name='Дата прибытия')
    departure_date = models.DateField(verbose_name='Дата отъезда')

    class Meta:
        verbose_name = 'Город в туре'
        verbose_name_plural = 'Города в туре'
        ordering = ['order']

    def __str__(self):
        return f'{self.city.name} в туре {self.tour.name}'


class TourFlight(models.Model):
    """Рейсы в туре"""
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='flights', verbose_name='Тур')
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE, verbose_name='Рейс')

    class Meta:
        verbose_name = 'Рейс в туре'
        verbose_name_plural = 'Рейсы в туре'

    def __str__(self):
        return f'{self.flight} в туре {self.tour.name}'


class TourHotel(models.Model):
    """Отели в туре"""
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='hotels', verbose_name='Тур')
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, verbose_name='Отель')
    check_in = models.DateField(verbose_name='Дата заезда')
    check_out = models.DateField(verbose_name='Дата выезда')

    class Meta:
        verbose_name = 'Отель в туре'
        verbose_name_plural = 'Отели в туре'

    def __str__(self):
        return f'{self.hotel.name} в туре {self.tour.name}'


class TourPlace(models.Model):
    """Достопримечательности в туре"""
    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='places', verbose_name='Тур')
    place = models.ForeignKey(Place, on_delete=models.CASCADE, verbose_name='Место')
    visit_date = models.DateField(verbose_name='Дата посещения')
    visit_time = models.TimeField(blank=True, null=True, verbose_name='Время посещения')

    class Meta:
        verbose_name = 'Место в туре'
        verbose_name_plural = 'Места в туре'
        ordering = ['visit_date', 'visit_time']

    def __str__(self):
        return f'{self.place.name} в туре {self.tour.name}'


class TourParticipant(models.Model):
    """Участники тура"""
    STATUS_CHOICES = [
        ('invited', 'Приглашен'),
        ('accepted', 'Принял'),
        ('declined', 'Отклонил'),
    ]

    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='participants', verbose_name='Тур')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tour_participations', verbose_name='Пользователь')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='invited', verbose_name='Статус')

    class Meta:
        verbose_name = 'Участник тура'
        verbose_name_plural = 'Участники туров'
        unique_together = ['tour', 'user']

    def __str__(self):
        return f'{self.user.username} в туре {self.tour.name}'


class Favorite(models.Model):
    """Избранное"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites', verbose_name='Пользователь')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата добавления')

    class Meta:
        verbose_name = 'Избранное'
        verbose_name_plural = 'Избранное'
        unique_together = ['user', 'content_type', 'object_id']
        ordering = ['-created_at']

    def __str__(self):
        return f'Избранное {self.user.username}'


class Booking(models.Model):
    """Бронирования"""
    BOOKING_TYPE_CHOICES = [
        ('flight', 'Рейс'),
        ('hotel', 'Отель'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Ожидание'),
        ('confirmed', 'Подтверждено'),
        ('cancelled', 'Отменено'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings', verbose_name='Пользователь')
    booking_type = models.CharField(max_length=20, choices=BOOKING_TYPE_CHOICES, verbose_name='Тип бронирования')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='Статус')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    class Meta:
        verbose_name = 'Бронирование'
        verbose_name_plural = 'Бронирования'
        ordering = ['-created_at']

    def __str__(self):
        return f'Бронирование {self.booking_type} от {self.user.username}'
