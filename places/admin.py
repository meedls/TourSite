from django.contrib import admin
from .models import City, Place


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country')
    search_fields = ('name', 'country')
    list_filter = ('country',)
    ordering = ('name',)


@admin.register(Place)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'rating')
    search_fields = ('name', 'city__name')
    list_filter = ('city', 'rating')
    ordering = ('-rating', 'name')
