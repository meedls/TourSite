from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import Hotel, Review


def hotel_list(request):
    """Список отелей"""
    hotels = Hotel.objects.all()
    return render(request, 'hotels/hotel_list.html', {'hotels': hotels})


def hotel_detail(request, pk):
    """Детальная страница отеля"""
    hotel = get_object_or_404(Hotel, pk=pk)
    reviews = hotel.reviews.all()
    return render(request, 'hotels/hotel_detail.html', {'hotel': hotel, 'reviews': reviews})


@login_required
def hotel_book(request, pk):
    """Бронирование отеля"""
    hotel = get_object_or_404(Hotel, pk=pk)
    return render(request, 'hotels/hotel_book.html', {'hotel': hotel})


@login_required
def review_create(request, pk):
    """Создание отзыва"""
    hotel = get_object_or_404(Hotel, pk=pk)
    if request.method == 'POST':
        rating = request.POST.get('rating')
        text = request.POST.get('text')
        Review.objects.create(hotel=hotel, user=request.user, rating=rating, text=text)
        return redirect('hotels:hotel_detail', pk=pk)
    return render(request, 'hotels/review_create.html', {'hotel': hotel})


@login_required
def review_like(request, pk):
    """Лайк отзыва"""
    review = get_object_or_404(Review, pk=pk)
    if request.user in review.dislikes.all():
        review.dislikes.remove(request.user)
    review.likes.add(request.user)
    return redirect('hotels:hotel_detail', pk=review.hotel.pk)


@login_required
def review_dislike(request, pk):
    """Дизлайк отзыва"""
    review = get_object_or_404(Review, pk=pk)
    if request.user in review.likes.all():
        review.likes.remove(request.user)
    review.dislikes.add(request.user)
    return redirect('hotels:hotel_detail', pk=review.hotel.pk)
