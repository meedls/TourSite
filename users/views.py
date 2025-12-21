from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import User, Friendship
from .forms import UserRegistrationForm, UserLoginForm


def login_view(request):
    """Вход"""
    if request.user.is_authenticated:
        return redirect('tours:index')

    if request.method == 'POST':
        form = UserLoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'Добро пожаловать, {username}!')
                next_url = request.GET.get('next', 'tours:index')
                return redirect(next_url)
            else:
                messages.error(request, 'Неверное имя пользователя или пароль.')
        else:
            messages.error(request, 'Ошибка при входе. Проверьте введенные данные.')
    else:
        form = UserLoginForm()

    return render(request, 'users/login.html', {'form': form})


def logout_view(request):
    """Выход"""
    logout(request)
    messages.info(request, 'Вы вышли из системы.')
    return redirect('tours:index')


def register_view(request):
    """Регистрация"""
    if request.user.is_authenticated:
        return redirect('tours:index')

    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Аккаунт {username} успешно создан! Теперь вы можете войти.')
            login(request, user)
            return redirect('tours:index')
        else:
            messages.error(request, 'Ошибка при регистрации. Проверьте введенные данные.')
    else:
        form = UserRegistrationForm()

    return render(request, 'users/register.html', {'form': form})


@login_required
def profile_view(request):
    """Профиль пользователя"""
    return render(request, 'users/profile.html')


@login_required
def profile_edit(request):
    """Редактирование профиля"""
    return render(request, 'users/profile_edit.html')


@login_required
def friends_list(request):
    """Список друзей"""
    friendships = Friendship.objects.filter(user=request.user, status='accepted')
    return render(request, 'users/friends_list.html', {'friendships': friendships})


@login_required
def friends_search(request):
    """Поиск друзей"""
    query = request.GET.get('q', '')
    users = User.objects.filter(username__icontains=query).exclude(id=request.user.id)[:10]
    return render(request, 'users/friends_search.html', {'users': users, 'query': query})


@login_required
def friend_add(request, user_id):
    """Добавить в друзья"""
    friend = get_object_or_404(User, id=user_id)
    Friendship.objects.get_or_create(user=request.user, friend=friend)
    return redirect('users:friends_list')
