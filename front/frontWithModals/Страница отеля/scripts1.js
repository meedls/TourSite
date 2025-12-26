// Ждем загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        // Получаем элементы
        const selectButton = document.querySelector('.select-button');
        const modal = document.getElementById('minibarModal');
        const closeModal = document.getElementById('closeModal');
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalSubmitButton = document.querySelector('.modal-submit-button');
        
        // Проверяем, что элементы существуют
        if (selectButton && modal && closeModal && modalOverlay && modalSubmitButton) {
            // Открытие модального окна при нажатии на кнопку "Выбрать"
            selectButton.addEventListener('click', function() {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
            });
            
            // Закрытие модального окна при нажатии на крестик
            closeModal.addEventListener('click', function() {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto'; // Восстанавливаем скролл страницы
            });
            
            // Закрытие модального окна при нажатии на overlay
            modalOverlay.addEventListener('click', function(e) {
                if (e.target === modalOverlay) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto'; // Восстанавливаем скролл страницы
                }
            });
            
            // Обработка нажатия на кнопку "Сохранить выбор"
            modalSubmitButton.addEventListener('click', function() {
                // Получаем все выбранные чекбоксы
                const selectedCheckboxes = document.querySelectorAll('.modal-content .checkbox-input:checked');
                const selectedItems = [];
                
                // Собираем выбранные пункты
                selectedCheckboxes.forEach(checkbox => {
                    const optionText = checkbox.closest('.option-item').querySelector('.option-text').textContent;
                    selectedItems.push(optionText);
                });
                
                // Выводим сообщение о сохранении (в реальном приложении здесь была бы отправка данных на сервер)
                if (selectedItems.length > 0) {
                    alert('Вы выбрали: ' + selectedItems.join(', '));
                } else {
                    alert('Вы не выбрали ни одного пункта');
                }
                
                // Закрываем модальное окно
                modal.classList.remove('active');
                document.body.style.overflow = 'auto'; // Восстанавливаем скролл страницы
            });
            
            // Закрытие модального окна при нажатии клавиши Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto'; // Восстанавливаем скролл страницы
                }
            });
        }
    });