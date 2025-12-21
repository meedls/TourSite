from django.core.management.base import BaseCommand
from hotels.models import Hotel, HotelService
from tours.models import City


class Command(BaseCommand):
    help = 'Создает тестовые отели для демонстрации'

    def handle(self, *args, **kwargs):
        # Получаем или создаем города
        moscow, _ = City.objects.get_or_create(
            name='Москва',
            defaults={'country': 'Россия'}
        )

        spb, _ = City.objects.get_or_create(
            name='Санкт-Петербург',
            defaults={'country': 'Россия'}
        )

        # Создаем отели
        hotels_data = [
            {
                'name': 'Soluxe Hotel Moscow',
                'city': moscow,
                'address': 'улица Вильгельма Пика, 16',
                'description': 'Пятизвездочный отель с 340 номерами, включая люксы с панорамным видом на город.',
                'rating': 5,
                'price_min': 15000,
                'price_max': 25000,
            },
            {
                'name': 'Cosmos Selection Moscow Arbat',
                'city': moscow,
                'address': 'улица Новый Арбат, 2',
                'description': 'Гостиница в историческом и финансовом центре на Новом Арбате, есть завтрак и прачечная.',
                'rating': 5,
                'price_min': 12000,
                'price_max': 20000,
            },
            {
                'name': 'Гранд Отель Европа',
                'city': spb,
                'address': 'Михайловская улица, 1/7',
                'description': 'Легендарный отель в самом центре Санкт-Петербурга с видом на Невский проспект.',
                'rating': 5,
                'price_min': 18000,
                'price_max': 35000,
            },
            {
                'name': 'Астория',
                'city': spb,
                'address': 'Большая Морская улица, 39',
                'description': 'Исторический отель рядом с Исаакиевским собором и Дворцовой площадью.',
                'rating': 5,
                'price_min': 16000,
                'price_max': 28000,
            },
        ]

        created_count = 0
        for hotel_data in hotels_data:
            hotel, created = Hotel.objects.get_or_create(
                name=hotel_data['name'],
                defaults=hotel_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Создан отель: {hotel.name}')
                )

                # Добавляем услуги
                services = [
                    {'name': 'Бесплатный Wi-Fi', 'description': 'Высокоскоростной интернет во всех номерах'},
                    {'name': 'Завтрак', 'description': 'Шведский стол', 'price': 1500},
                    {'name': 'Парковка', 'description': 'Охраняемая парковка', 'price': 500},
                    {'name': 'Трансфер', 'description': 'Трансфер из/в аэропорт', 'price': 3000},
                ]

                for service_data in services:
                    service, _ = HotelService.objects.get_or_create(
                        hotel=hotel,
                        name=service_data['name'],
                        defaults=service_data
                    )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Отель уже существует: {hotel.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\nВсего создано отелей: {created_count}')
        )
