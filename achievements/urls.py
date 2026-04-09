from django.urls import path
from .views import api_achievements

urlpatterns = [
    path("api/", api_achievements, name="api_achievements"),
]