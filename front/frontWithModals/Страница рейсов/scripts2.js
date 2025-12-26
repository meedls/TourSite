// Файл: modal.js

document.addEventListener('DOMContentLoaded', function() {
    // Получаем элементы
    const modal = document.getElementById('baggage-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const confirmCloseBtn = document.getElementById('confirm-close');
    const selectButtons = document.querySelectorAll('.condition-btn');
    
    // Функция для открытия модального окна
    function openModal() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    }
    
    // Функция для закрытия модального окна
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Восстанавливаем скролл
    }
    
    // Открытие модального окна при нажатии на кнопку "Выбрать"
    selectButtons.forEach(button => {
        button.addEventListener('click', openModal);
    });
    
    // Закрытие модального окна при нажатии на крестик
    closeModalBtn.addEventListener('click', closeModal);
    
    // Закрытие модального окна при нажатии на кнопку "Закрыть"
    confirmCloseBtn.addEventListener('click', closeModal);
    
    // Закрытие модального окна при клике на оверлей
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие модального окна при нажатии клавиши ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    // Предотвращаем закрытие при клике на само модальное окно
    modal.querySelector('.modal-container').addEventListener('click', function(event) {
        event.stopPropagation();
    });
});