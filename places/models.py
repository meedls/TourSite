from django.db import models


class City(models.Model):
    """Города"""
    name = models.CharField(max_length=200, verbose_name='Название')
    country = models.CharField(max_length=200, verbose_name='Страна')
    description = models.TextField(blank=True, verbose_name='Описание')
    image = models.ImageField(upload_to='cities/', blank=True, null=True, verbose_name='Изображение')

    class Meta:
        verbose_name = 'Город'
        verbose_name_plural = 'Города'
        ordering = ['name']

    def __str__(self):
        return f'{self.name}, {self.country}'


class Place(models.Model):
    """Достопримечательности"""
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='places', verbose_name='Город')
    name = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    image = models.ImageField(upload_to='places/', blank=True, null=True, verbose_name='Изображение')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0, verbose_name='Рейтинг')

    class Meta:
        verbose_name = 'Достопримечательность'
        verbose_name_plural = 'Достопримечательности'
        ordering = ['-rating', 'name']

    def __str__(self):
        return f'{self.name} ({self.city.name})'
