from django.contrib import admin
from .models import Tour, TourCity, TourFlight, TourHotel, TourPlace, TourParticipant, Favorite, Booking


class TourCityInline(admin.TabularInline):
    model = TourCity
    extra = 1


class TourFlightInline(admin.TabularInline):
    model = TourFlight
    extra = 1


class TourHotelInline(admin.TabularInline):
    model = TourHotel
    extra = 1


class TourPlaceInline(admin.TabularInline):
    model = TourPlace
    extra = 1


class TourParticipantInline(admin.TabularInline):
    model = TourParticipant
    extra = 1


@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'start_date', 'end_date', 'is_public', 'created_at')
    search_fields = ('name', 'user__username', 'description')
    list_filter = ('is_public', 'created_at', 'start_date')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    inlines = [TourCityInline, TourFlightInline, TourHotelInline, TourPlaceInline, TourParticipantInline]


@admin.register(TourCity)
class TourCityAdmin(admin.ModelAdmin):
    list_display = ('tour', 'city', 'order', 'arrival_date', 'departure_date')
    search_fields = ('tour__name', 'city__name')
    list_filter = ('city',)
    ordering = ('tour', 'order')


@admin.register(TourFlight)
class TourFlightAdmin(admin.ModelAdmin):
    list_display = ('tour', 'flight')
    search_fields = ('tour__name', 'flight__airline__name')


@admin.register(TourHotel)
class TourHotelAdmin(admin.ModelAdmin):
    list_display = ('tour', 'hotel', 'check_in', 'check_out')
    search_fields = ('tour__name', 'hotel__name')
    list_filter = ('hotel',)


@admin.register(TourPlace)
class TourPlaceAdmin(admin.ModelAdmin):
    list_display = ('tour', 'place', 'visit_date', 'visit_time')
    search_fields = ('tour__name', 'place__name')
    list_filter = ('visit_date',)
    ordering = ('visit_date', 'visit_time')


@admin.register(TourParticipant)
class TourParticipantAdmin(admin.ModelAdmin):
    list_display = ('tour', 'user', 'status')
    search_fields = ('tour__name', 'user__username')
    list_filter = ('status',)


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ('user', 'content_type', 'object_id', 'created_at')
    search_fields = ('user__username',)
    list_filter = ('content_type', 'created_at')
    ordering = ('-created_at',)


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'booking_type', 'status', 'created_at')
    search_fields = ('user__username',)
    list_filter = ('booking_type', 'status', 'created_at')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
