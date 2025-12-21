from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from flights.models import Airline, Flight
from places.models import City


class Command(BaseCommand):
    help = 'Создает тестовые рейсы и авиакомпании для демонстрации'

    def handle(self, *args, **options):
        # Города
        ulyanovsk, _ = City.objects.get_or_create(
            name='Ульяновск',
            defaults={'country': 'Россия'}
        )

        moscow, _ = City.objects.get_or_create(
            name='Москва',
            defaults={'country': 'Россия'}
        )

        spb, _ = City.objects.get_or_create(
            name='Санкт-Петербург',
            defaults={'country': 'Россия'}
        )

        # Авиакомпании
        s7, _ = Airline.objects.get_or_create(name='S7 Airlines')
        aeroflot, _ = Airline.objects.get_or_create(name='Аэрофлот')
        utair, _ = Airline.objects.get_or_create(name='UTair')

        now = timezone.now().replace(minute=0, second=0, microsecond=0)
        today_morning = now.replace(hour=8)

        flights_data = [
            # Ульяновск — Санкт-Петербург
            {
                'airline': s7,
                'from_city': ulyanovsk,
                'to_city': spb,
                'departure_time': today_morning,
                'arrival_time': today_morning + timedelta(hours=2, minutes=15),
                'price': 8000,
                'class_type': 'business',
            },
            {
                'airline': aeroflot,
                'from_city': ulyanovsk,
                'to_city': spb,
                'departure_time': today_morning + timedelta(hours=4),
                'arrival_time': today_morning + timedelta(hours=6, minutes=30),
                'price': 7500,
                'class_type': 'economy',
            },
            {
                'airline': utair,
                'from_city': ulyanovsk,
                'to_city': spb,
                'departure_time': today_morning + timedelta(hours=9, minutes=30),
                'arrival_time': today_morning + timedelta(hours=12),
                'price': 6800,
                'class_type': 'economy',
            },
            # Москва — Санкт-Петербург
            {
                'airline': aeroflot,
                'from_city': moscow,
                'to_city': spb,
                'departure_time': today_morning + timedelta(hours=1),
                'arrival_time': today_morning + timedelta(hours=2, minutes=20),
                'price': 5200,
                'class_type': 'economy',
            },
            {
                'airline': s7,
                'from_city': moscow,
                'to_city': spb,
                'departure_time': today_morning + timedelta(hours=3),
                'arrival_time': today_morning + timedelta(hours=4, minutes=25),
                'price': 6100,
                'class_type': 'business',
            },
        ]

        created_count = 0
        for data in flights_data:
            flight, created = Flight.objects.get_or_create(
                airline=data['airline'],
                from_city=data['from_city'],
                to_city=data['to_city'],
                departure_time=data['departure_time'],
                defaults=data,
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'Создан рейс: {flight.airline.name} '
                        f'{flight.from_city.name} → {flight.to_city.name} '
                        f'({flight.departure_time:%d.%m %H:%M})'
                    )
                )
            else:
                self.stdout.write(
                    self.style.WARNING(
                        f'Рейс уже существует: {flight.airline.name} '
                        f'{flight.from_city.name} → {flight.to_city.name} '
                        f'({flight.departure_time:%d.%m %H:%M})'
                    )
                )

        self.stdout.write(self.style.SUCCESS(f'\nВсего создано рейсов: {created_count}'))


