import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tour_project.settings')
django.setup()

from users.models import User

try:
    user = User.objects.get(username='admin')
    user.set_password('admin')
    user.save()
    print("Пароль успешно установлен для пользователя admin")
except User.DoesNotExist:
    print("Пользователь admin не найден")
