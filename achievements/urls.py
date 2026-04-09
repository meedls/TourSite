from django.urls import path
from .views import unlock_telegram
from .views import api_achievements

urlpatterns = [
    path("api/", api_achievements, name="api_achievements"),
path("telegram/", unlock_telegram, name="unlock_telegram"),
]