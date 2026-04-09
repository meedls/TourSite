from django.urls import path
from .views import unlock_telegram, unlock_only_friend, unlock_group_tour, unlock_friend_added, \
    open_friends_achievement, buy_ticket_click, start_booking, select_hotel, select_city, scroll_footer, use_slider, \
    time_spent
from .views import api_achievements

urlpatterns = [
    path("api/", api_achievements, name="api_achievements"),
    path("telegram/", unlock_telegram, name="unlock_telegram"),
    path("only-friend/", unlock_only_friend, name="unlock_only_friend"),
    path('group-tour/', unlock_group_tour, name="unlock_group_tour"),
    path('friend-added/', unlock_friend_added, name="unlock_friend_added"),
    path('open-friends/', open_friends_achievement, name="open_friends_achievement"),
    path('buy-ticket/', buy_ticket_click, name="buy_ticket_click"),
    path('start-booking/', start_booking, name="start_booking"),
    path('select-hotel/', select_hotel, name="select_hotel"),
    path('select-city/', select_city, name="select_city"),
    path('scroll-footer/', scroll_footer, name="scroll_footer"),
    path('use-slider/', use_slider, name="use_slider"),
    path('time-spent/', time_spent, name="time_spent"),
]