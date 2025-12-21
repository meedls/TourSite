from django.db import models
from django.conf import settings
from places.models import City


class Hotel(models.Model):
    """Отели"""
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='hotels', verbose_name='Город')
    name = models.CharField(max_length=200, verbose_name='Название')
    address = models.CharField(max_length=300, verbose_name='Адрес')
    description = models.TextField(blank=True, verbose_name='Описание')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0, verbose_name='Рейтинг')
    price_min = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Минимальная цена')
    price_max = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Максимальная цена')

    class Meta:
        verbose_name = 'Отель'
        verbose_name_plural = 'Отели'
        ordering = ['-rating', 'name']

    def __str__(self):
        return f'{self.name} ({self.city.name})'


class HotelImage(models.Model):
    """Фотографии отелей"""
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='images', verbose_name='Отель')
    image = models.ImageField(upload_to='hotels/', verbose_name='Изображение')

    class Meta:
        verbose_name = 'Фото отеля'
        verbose_name_plural = 'Фото отелей'

    def __str__(self):
        return f'Фото {self.hotel.name}'


class HotelService(models.Model):
    """Услуги отелей"""
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='services', verbose_name='Отель')
    name = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name='Цена')

    class Meta:
        verbose_name = 'Услуга отеля'
        verbose_name_plural = 'Услуги отелей'

    def __str__(self):
        return f'{self.name} ({self.hotel.name})'


class Review(models.Model):
    """Отзывы на отели"""
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='reviews', verbose_name='Отель')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews', verbose_name='Пользователь')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], verbose_name='Оценка')
    text = models.TextField(verbose_name='Текст отзыва')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_reviews', blank=True, verbose_name='Лайки')
    dislikes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='disliked_reviews', blank=True, verbose_name='Дизлайки')

    class Meta:
        verbose_name = 'Отзыв'
        verbose_name_plural = 'Отзывы'
        ordering = ['-created_at']

    def __str__(self):
        return f'Отзыв от {self.user.username} на {self.hotel.name}'

    @property
    def likes_count(self):
        return self.likes.count()

    @property
    def dislikes_count(self):
        return self.dislikes.count()
