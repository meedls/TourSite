from django.db import models
from places.models import City


class Airline(models.Model):
    """Авиакомпании"""
    name = models.CharField(max_length=200, verbose_name='Название')
    logo = models.ImageField(upload_to='airlines/', blank=True, null=True, verbose_name='Логотип')

    class Meta:
        verbose_name = 'Авиакомпания'
        verbose_name_plural = 'Авиакомпании'
        ordering = ['name']

    def __str__(self):
        return self.name


class Flight(models.Model):
    """Рейсы"""
    CLASS_CHOICES = [
        ('economy', 'Эконом'),
        ('business', 'Бизнес'),
        ('first', 'Первый класс'),
    ]

    airline = models.ForeignKey(Airline, on_delete=models.CASCADE, related_name='flights', verbose_name='Авиакомпания')
    from_city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='flights_from', verbose_name='Откуда')
    to_city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='flights_to', verbose_name='Куда')
    departure_time = models.DateTimeField(verbose_name='Время вылета')
    arrival_time = models.DateTimeField(verbose_name='Время прилета')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Цена')
    class_type = models.CharField(max_length=20, choices=CLASS_CHOICES, default='economy', verbose_name='Класс')

    class Meta:
        verbose_name = 'Рейс'
        verbose_name_plural = 'Рейсы'
        ordering = ['departure_time']

    def __str__(self):
        return f'{self.airline.name}: {self.from_city.name} -> {self.to_city.name}'

    @property
    def duration(self):
        """Длительность полета"""
        return self.arrival_time - self.departure_time
