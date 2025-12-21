from django.contrib import admin
from .models import Hotel, HotelImage, HotelService, Review


class HotelImageInline(admin.TabularInline):
    model = HotelImage
    extra = 1


class HotelServiceInline(admin.TabularInline):
    model = HotelService
    extra = 1


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'rating', 'price_min', 'price_max')
    search_fields = ('name', 'city__name', 'address')
    list_filter = ('city', 'rating')
    ordering = ('-rating', 'name')
    inlines = [HotelImageInline, HotelServiceInline]


@admin.register(HotelImage)
class HotelImageAdmin(admin.ModelAdmin):
    list_display = ('hotel',)
    search_fields = ('hotel__name',)


@admin.register(HotelService)
class HotelServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'hotel', 'price')
    search_fields = ('name', 'hotel__name')
    list_filter = ('hotel',)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('hotel', 'user', 'rating', 'created_at', 'likes_count', 'dislikes_count')
    search_fields = ('hotel__name', 'user__username', 'text')
    list_filter = ('rating', 'created_at', 'hotel')
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    filter_horizontal = ('likes', 'dislikes')
