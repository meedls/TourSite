from django.contrib import admin
from .models import Airline, Flight


@admin.register(Airline)
class AirlineAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = ('airline', 'from_city', 'to_city', 'departure_time', 'arrival_time', 'price', 'class_type')
    search_fields = ('airline__name', 'from_city__name', 'to_city__name')
    list_filter = ('airline', 'class_type', 'departure_time')
    ordering = ('departure_time',)
    date_hierarchy = 'departure_time'
