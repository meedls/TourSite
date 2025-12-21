from django.urls import path
from . import views

app_name = 'tours'

urlpatterns = [
    path('', views.index, name='index'),
    path('tours/', views.tour_create, name='tour_create'),  # Страница "Собери свой тур"
    path('tours/list/', views.tour_list, name='tour_list'),  # Список готовых туров
    path('tours/<int:pk>/', views.tour_detail, name='tour_detail'),
    path('tours/<int:pk>/edit/', views.tour_edit, name='tour_edit'),
    path('tours/<int:pk>/delete/', views.tour_delete, name='tour_delete'),
]
