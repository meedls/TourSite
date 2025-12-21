from django.urls import path
from . import views

app_name = 'hotels'

urlpatterns = [
    path('', views.hotel_list, name='hotel_list'),
    path('<int:pk>/', views.hotel_detail, name='hotel_detail'),
    path('<int:pk>/book/', views.hotel_book, name='hotel_book'),
    path('<int:pk>/review/', views.review_create, name='review_create'),
    path('review/<int:pk>/like/', views.review_like, name='review_like'),
    path('review/<int:pk>/dislike/', views.review_dislike, name='review_dislike'),
]
