from django.urls import path
from . import views

app_name = 'places'

urlpatterns = [
    path('cities/', views.city_list, name='city_list'),
    path('cities/<int:pk>/', views.city_detail, name='city_detail'),
    path('places/', views.place_list, name='place_list'),
    path('places/<int:pk>/', views.place_detail, name='place_detail'),
]
