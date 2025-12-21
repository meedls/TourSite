# Настройка 3D модели Земли

Для корректной работы 3D модели Земли на странице "Собери свой тур" необходимо скопировать файлы из верстки.

## Шаги установки:

### 1. Скопируйте 3D модель
Скопируйте папку `59-earth` из `front/Собери свой тур/` в `static/models/`:

```powershell
# Создайте директорию для моделей
New-Item -ItemType Directory -Path "static/models" -Force

# Скопируйте файл модели
Copy-Item "front/Собери свой тур/59-earth/earth 2.glb" "static/models/earth.glb"
```

### 2. Скопируйте текстуры (если есть)
Если в папке `59-earth` есть текстуры, скопируйте их:

```powershell
# Создайте директорию для текстур
New-Item -ItemType Directory -Path "static/textures" -Force

# Скопируйте текстуры (если они есть в папке 59-earth)
Copy-Item "front/Собери свой тур/59-earth/*.jpg" "static/textures/" -ErrorAction SilentlyContinue
Copy-Item "front/Собери свой тур/59-earth/*.png" "static/textures/" -ErrorAction SilentlyContinue
```

### 3. Проверьте структуру файлов

После копирования структура должна быть:
```
static/
├── js/
│   └── earth.js          ✓ (уже создан)
├── models/
│   └── earth.glb         ← нужно скопировать
└── textures/             ← нужно скопировать (если есть)
    ├── earth_color.jpg
    ├── earth_normal.jpg
    ├── earth_roughness.jpg
    ├── earth_metallic.jpg
    └── earth_night.jpg
```

### 4. Альтернатива: Упрощенная версия без текстур

Если текстур нет или возникают проблемы, можно использовать упрощенную версию.
Отредактируйте `static/js/earth.js` и замените код загрузки модели на:

```javascript
// Создаем простую сферу вместо загрузки модели
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
    color: 0x2233ff,
    roughness: 0.7,
    metalness: 0.2
});
const earth = new THREE.Mesh(geometry, material);
scene.add(earth);

// Добавляем вращение
function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.001;
    controls.update();
    renderer.render(scene, camera);
}
```

## Проверка работы

1. Запустите сервер: `python manage.py runserver`
2. Откройте страницу: http://127.0.0.1:8000/tours/create/
3. В header должна отображаться 3D модель Земли

## Возможные проблемы

### Модель не загружается
- Проверьте консоль браузера (F12) на наличие ошибок
- Убедитесь, что файл `earth.glb` находится в `static/models/`
- Проверьте пути к файлам в `earth.js`

### Текстуры не применяются
- Текстуры опциональны, модель будет работать и без них
- Если текстур нет, используйте упрощенную версию выше

---

**Примечание:** 3D модель добавляет интерактивность на страницу конструктора туров. Пользователи могут вращать Землю мышью, приближать и отдалять её.
