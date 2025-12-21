from django.urls import path
from . import views

app_name = 'flights'

urlpatterns = [
    path('', views.flight_list, name='flight_list'),
    path('<int:pk>/', views.flight_detail, name='flight_detail'),
    path('<int:pk>/book/', views.flight_book, name='flight_book'),
    path('search/', views.flight_search, name='flight_search'),
]
