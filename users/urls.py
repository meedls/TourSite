from django.urls import path
from . import views

app_name = 'users'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('profile/', views.profile_view, name='profile'),
    path('profile/edit/', views.profile_edit, name='profile_edit'),
    path('friends/', views.friends_list, name='friends_list'),
    path('friends/search/', views.friends_search, name='friends_search'),
    path('friends/add/<int:user_id>/', views.friend_add, name='friend_add'),
]
