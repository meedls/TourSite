document.addEventListener('DOMContentLoaded', function() {
    // Элементы модального окна регистрации
    const registrationModal = document.getElementById('registrationModal');
    const closeRegistrationBtn = document.getElementById('closeModal');
    let loginBtn = document.querySelector('.btn-login'); // Кнопка "Вход" справа
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const registrationForm = document.getElementById('registrationForm');
    
    // Элементы модального окна подтверждения
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirmationBtn = document.getElementById('closeConfirmationModal');
    const confirmBtn = document.getElementById('confirmBtn');
    const code1 = document.getElementById('code1');
    const code2 = document.getElementById('code2');
    const code3 = document.getElementById('code3');
    const code4 = document.getElementById('code4');
    
    // Элементы модального окна профиля
    const profileModal = document.getElementById('profileModal');
    const closeProfileBtn = document.getElementById('closeProfileModal');
    const logoutBtn = document.getElementById('logoutBtn');
    const bookingsDetailsBtn = document.getElementById('bookingsDetailsBtn');
    const navProfileBtn = document.getElementById('navProfileBtn'); // Кнопка "Профиль" в навигации
    
    // Элементы модального окна бронирований
    const bookingsModal = document.getElementById('bookingsModal');
    const closeBookingsBtn = document.getElementById('closeBookingsModal');
    const hotelsSection = document.getElementById('hotelsSection');
    
    // Элементы модального окна оплаты
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentBtn = document.getElementById('closePaymentModal');
    const paymentMethodItem = document.getElementById('paymentMethodItem'); // Уже есть
    const paymentForm = document.getElementById('paymentForm');
    const cardNumberInput = document.getElementById('cardNumber');
    const cardNameInput = document.getElementById('cardName');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCvcInput = document.getElementById('cardCvc');
    const paymentAmount = document.getElementById('paymentAmount');
    const payButtonAmount = document.getElementById('payButtonAmount');
    const changeAmountBtn = document.getElementById('changeAmountBtn');
    const cvcHelpBtn = document.getElementById('cvcHelpBtn');
    const mastercardLogo = document.getElementById('mastercardLogo');
    const mirLogo = document.getElementById('mirLogo');
    const visaLogo = document.getElementById('visaLogo');
    const cardTypeBadge = document.getElementById('cardTypeBadge');
    const savedCardsList = document.getElementById('savedCardsList');
    const noSavedCards = document.getElementById('noSavedCards');
    
    // Получаем информацию профиля
    const profileUserName = document.getElementById('profileUserName');
    const profileUserId = document.getElementById('profileUserId');
    
    // Получаем все интерактивные элементы профиля
    const favoriteCitiesItem = document.getElementById('favoriteCitiesItem');
    const friendsItem = document.getElementById('friendsItem');
    const subscribersItem = document.getElementById('subscribersItem');
    const supportItem = document.getElementById('supportItem');
    const termsItem = document.getElementById('termsItem');
    
    // Переменные для хранения данных (без сохранения в localStorage)
    let generatedSmsCode = '';
    let userEmail = '';
    let userPassword = '';
    let isLoggedIn = false;
    let currentUser = null;
    
    // Данные о сохраненных картах
    let savedCards = [];
    let selectedPaymentMethod = 'visa';
    let currentAmount = 8000;
    
    // Тестовые данные бронирований отелей (только 2 отеля)
    const mockBookings = {
        hotels: [
            {
                id: 1,
                name: "Soluxe Hotel Moscow",
                stars: 5,
                priceRange: "15.000 - 25.000 ₽",
                description: "Пятизвездочный отель с 340 номерами, спа-центром и 3 ресторанами в центре Москвы",
                photo: "https://cdn1.ozonusercontent.com/s3/hotels-media-01/c1200/AZX2n54-erC7g-DTfpeUgA.jpg",
                checkIn: "15.05.2024",
                checkOut: "20.05.2024",
                guests: 2,
                status: "Подтверждено"
            },
            {
                id: 2,
                name: "Cosmos Selection Moscow Arbat",
                stars: 4,
                priceRange: "12.000 - 20.000 ₽",
                description: "Гостиница в историческом районе Арбат с видом на Москву-реку и современными номерами",
                photo: "https://images.cdn-cian.ru/images/cosmos-selection-arbat-apartments-moskva-jk-2550820005-10.jpg",
                checkIn: "10.06.2024",
                checkOut: "17.06.2024",
                guests: 3,
                status: "Подтверждено"
            }
        ]
    };
    
    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
    
    // Функция для открытия модального окна
    function openModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Функция для закрытия модального окна
    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Функция валидации email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Функция сброса полей ввода кода
    function resetCodeInputs() {
        const codeInputs = [code1, code2, code3, code4];
        codeInputs.forEach(input => {
            if (input) input.value = '';
        });
    }
    
    // Функция сброса всей формы подтверждения
    function resetConfirmationForm() {
        resetCodeInputs();
        generatedSmsCode = '';
        userEmail = '';
        userPassword = '';
    }
    
    // Функция обновления кнопок навигации
    function updateNavigationButtons() {
        if (isLoggedIn) {
            // Скрываем кнопку "Вход"
            if (loginBtn) {
                loginBtn.style.display = 'none';
            }
            
            // Показываем кнопку "Профиль" в навигации
            if (navProfileBtn) {
                navProfileBtn.style.display = 'block';
            }
        } else {
            // Показываем кнопку "Вход"
            if (loginBtn) {
                loginBtn.style.display = 'block';
            }
            
            // Скрываем кнопку "Профиль" в навигации
            if (navProfileBtn) {
                navProfileBtn.style.display = 'none';
            }
        }
    }
    
    // Функция обновления информации в профиле
    function updateProfileInfo() {
        if (currentUser) {
            // Обновляем имя пользователя
            if (profileUserName) {
                profileUserName.textContent = currentUser.name || 'Иван Иванов';
            }
            
            // Обновляем ID пользователя
            if (profileUserId) {
                profileUserId.textContent = `ID: ${currentUser.id || '123456789'}`;
            }
        }
    }
    
    // Функция для входа пользователя (без сохранения в localStorage)
    function loginUser(userData) {
        currentUser = {
            name: userData.name || userData.email.split('@')[0] || 'Новый пользователь',
            email: userData.email,
            id: generateUserId()
        };
        
        // НЕ сохраняем в localStorage
        isLoggedIn = true;
        
        // Обновляем кнопки навигации
        updateNavigationButtons();
        
        // Обновляем информацию в профиле
        updateProfileInfo();
        
        // Обновляем счетчик бронирований
        updateBookingsCount();
        
        console.log('Пользователь вошел:', currentUser);
    }
    
    // Функция для выхода пользователя (без удаления из localStorage)
    function logoutUser() {
        // Очищаем данные пользователя (только в памяти)
        currentUser = null;
        isLoggedIn = false;
        
        // Обновляем кнопки навигации
        updateNavigationButtons();
        
        console.log('Пользователь вышел');
    }
    
    // Генерация ID пользователя
    function generateUserId() {
        return Math.floor(100000000 + Math.random() * 900000000).toString();
    }
    
    // Функция для генерации звездного рейтинга
    function generateStars(rating, maxStars = 5) {
        let stars = '';
        for (let i = 0; i < maxStars; i++) {
            if (i < rating) {
                stars += '★';
            } else {
                stars += '☆';
            }
        }
        return stars;
    }
    
    // Функция для отображения отелей
    function renderHotels() {
        if (!hotelsSection) return;
        
        hotelsSection.innerHTML = '';
        
        if (!mockBookings.hotels || mockBookings.hotels.length === 0) {
            hotelsSection.innerHTML = '<div class="no-bookings"><i class="fas fa-bed"></i><p>У вас пока нет забронированных отелей</p></div>';
            return;
        }
        
        mockBookings.hotels.forEach(hotel => {
            const hotelHTML = `
                <div class="hotel-item" data-hotel-id="${hotel.id}">
                    <div class="image-circle">
                        <img src="${hotel.photo}" alt="${hotel.name}" class="hotel-icon">
                    </div>
                    <div class="hotel-info">
                        <div class="hotel-name">${hotel.name}</div>
                        <div class="hotel-details">
                            <div class="hotel-rating">
                                <div class="hotel-stars">${generateStars(hotel.stars)}</div>
                                <div class="hotel-price-range">${hotel.priceRange}</div>
                            </div>
                            <div class="hotel-dates">
                                <span class="date-label">Заезд:</span> ${hotel.checkIn}
                                <span class="date-label">Выезд:</span> ${hotel.checkOut}
                            </div>
                            <div class="hotel-guests">
                                <span class="guest-label">Гостей:</span> ${hotel.guests}
                            </div>
                            <div class="hotel-status ${getStatusClass(hotel.status)}">
                                ${hotel.status}
                            </div>
                        </div>
                        <div class="hotel-description">${hotel.description}</div>
                    </div>
                </div>
            `;
            hotelsSection.innerHTML += hotelHTML;
        });
    }
    
    // Функция для получения класса статуса
    function getStatusClass(status) {
        const statusClasses = {
            'Подтверждено': 'status-confirmed',
            'Ожидает оплаты': 'status-pending',
            'Активно': 'status-active',
            'Отменено': 'status-cancelled'
        };
        return statusClasses[status] || '';
    }
    
    // Функция для открытия модального окна бронирований
    function openBookingsModal() {
        if (!isLoggedIn) {
            alert('Для просмотра бронирований необходимо войти в систему.');
            return;
        }
        
        // Загружаем данные бронирований
        renderHotels();
        
        // Показываем модальное окно
        openModal(bookingsModal);
    }
    
    // Функция для закрытия модального окна бронирований
    function closeBookingsModal() {
        closeModal(bookingsModal);
    }
    
    // Функция обработки клика по элементам профиля
    function handleProfileItemClick(itemTitle) {
        const messages = {
            'Избранные города': 'Здесь хранятся города, которые вы добавили в избранное для быстрого доступа к информации о них.',
            'Друзья': 'Список ваших друзей в TravelHub. Вы можете добавлять новых друзей, отправлять им приглашения и просматривать их путешествия.',
            'Подписчики': 'Пользователи, которые следят за вашими путешествиями и обновлениями профиля.',
            'Поддержка': 'Свяжитесь с нашей службой поддержки для решения любых вопросов или проблем.',
            'Условия использования': 'Ознакомьтесь с правилами использования сервиса TravelHub, политикой конфиденциальности и другими важными документами.'
        };
        
        alert(`${itemTitle}\n\n${messages[itemTitle]}\n\nРаздел находится в активной разработке и скоро будет доступен полностью.`);
    }
    
    // Функция для получения количества бронирований
    function getBookingsCount() {
        return mockBookings.hotels.length;
    }
    
    // Функция для обновления счетчика в профиле
    function updateBookingsCount() {
        const bookingsCount = document.querySelector('.bookings-header .count');
        if (bookingsCount) {
            const total = getBookingsCount();
            bookingsCount.textContent = `(${total})`;
        }
    }
    
    // Функция для форматирования номера карты
    function formatCardNumber(value) {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    }
    
    // Функция для форматирования срока действия
    function formatExpiry(value) {
        const v = value.replace(/[^0-9]/g, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4);
        }
        return v;
    }
    
    // Функция для определения типа карты по номеру
    function detectCardType(number) {
        // Убираем пробелы
        const cleanNumber = number.replace(/\s/g, '');
        
        // Visa: начинается с 4
        if (/^4/.test(cleanNumber)) {
            return 'visa';
        }
        
        // MasterCard: начинается с 51-55 или 2221-2720
        if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
            return 'mastercard';
        }
        
        // МИР: начинается с 2200-2204
        if (/^220[0-4]/.test(cleanNumber)) {
            return 'mir';
        }
        
        return 'unknown';
    }
    
    // Функция для обновления иконки типа карты
    function updateCardTypeBadge(number) {
        const cardType = detectCardType(number);
        let logoUrl = '';
        let altText = '';
        
        switch (cardType) {
            case 'visa':
                logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg';
                altText = 'Visa';
                break;
            case 'mastercard':
                logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg';
                altText = 'MasterCard';
                break;
            case 'mir':
                logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Mir-logo.SVG.svg/1024px-Mir-logo.SVG.svg.png';
                altText = 'МИР';
                break;
            default:
                if (cardTypeBadge) {
                    cardTypeBadge.style.display = 'none';
                }
                return;
        }
        
        if (cardTypeBadge) {
            cardTypeBadge.style.display = 'flex';
            cardTypeBadge.innerHTML = `<img src="${logoUrl}" alt="${altText}" class="badge-image">`;
        }
    }
    
    // Функция для обновления выбранного метода оплаты
    function updateSelectedPaymentMethod(method) {
        // Убираем активный класс у всех логотипов
        [mastercardLogo, mirLogo, visaLogo].forEach(logo => {
            if (logo) logo.classList.remove('active');
        });
        
        // Добавляем активный класс выбранному логотипу
        switch (method) {
            case 'mastercard':
                if (mastercardLogo) mastercardLogo.classList.add('active');
                break;
            case 'mir':
                if (mirLogo) mirLogo.classList.add('active');
                break;
            case 'visa':
                if (visaLogo) visaLogo.classList.add('active');
                break;
        }
        
        selectedPaymentMethod = method;
    }
    
    // Функция для обновления суммы
    function updateAmount(newAmount) {
        currentAmount = newAmount;
        const formattedAmount = new Intl.NumberFormat('ru-RU').format(newAmount);
        
        // Обновляем отображение суммы
        if (paymentAmount) {
            paymentAmount.textContent = `${formattedAmount} ₽`;
        }
        if (payButtonAmount) {
            payButtonAmount.textContent = `${formattedAmount} ₽`;
        }
    }
    
    // Функция для отображения сохраненных карт
    function renderSavedCards() {
        if (!savedCardsList || !noSavedCards) return;
        
        savedCardsList.innerHTML = '';
        
        if (savedCards.length === 0) {
            noSavedCards.style.display = 'block';
            savedCardsList.style.display = 'none';
            return;
        }
        
        noSavedCards.style.display = 'none';
        savedCardsList.style.display = 'block';
        
        savedCards.forEach((card, index) => {
            const cardItem = document.createElement('div');
            cardItem.className = 'saved-card-item';
            cardItem.dataset.cardId = card.id;
            
            // Определяем URL логотипа
            let logoUrl = '';
            let cardName = '';
            switch (card.type) {
                case 'visa':
                    logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg';
                    cardName = 'Visa';
                    break;
                case 'mastercard':
                    logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg';
                    cardName = 'MasterCard';
                    break;
                case 'mir':
                    logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Mir-logo.SVG.svg/1024px-Mir-logo.SVG.svg.png';
                    cardName = 'МИР';
                    break;
            }
            
            // Маскируем номер карты
            const maskedNumber = `**** ${card.number.slice(-4)}`;
            
            cardItem.innerHTML = `
                <div class="card-info-left">
                    <div class="card-icon">
                        <img src="${logoUrl}" alt="${cardName}">
                    </div>
                    <div class="card-details">
                        <div class="card-number">${maskedNumber}</div>
                        <div class="card-name">${card.name}</div>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="delete-card-btn" data-card-id="${card.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Добавляем обработчик выбора карты
            cardItem.addEventListener('click', function(e) {
                if (!e.target.closest('.delete-card-btn')) {
                    // Заполняем форму данными карты
                    if (cardNumberInput) cardNumberInput.value = formatCardNumber(card.number);
                    if (cardNameInput) cardNameInput.value = card.name;
                    if (cardExpiryInput) cardExpiryInput.value = card.expiry;
                    if (cardCvcInput) cardCvcInput.value = card.cvc;
                    updateCardTypeBadge(card.number);
                    updateSelectedPaymentMethod(card.type);
                }
            });
            
            savedCardsList.appendChild(cardItem);
        });
        
        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll('.delete-card-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const cardId = this.dataset.cardId;
                removeSavedCard(cardId);
            });
        });
    }
    
    // Функция для добавления сохраненной карты
    function addSavedCard(cardData) {
        const newCard = {
            id: Date.now(),
            number: cardData.number.replace(/\s/g, ''),
            name: cardData.name,
            expiry: cardData.expiry,
            cvc: cardData.cvc,
            type: detectCardType(cardData.number)
        };
        
        savedCards.push(newCard);
        renderSavedCards();
        return newCard.id;
    }
    
    // Функция для удаления сохраненной карты
    function removeSavedCard(cardId) {
        if (confirm('Вы уверены, что хотите удалить эту карту?')) {
            savedCards = savedCards.filter(card => card.id != cardId);
            renderSavedCards();
            console.log('Карта удалена:', cardId);
        }
    }
    
    // Функция для открытия модального окна оплаты
    function openPaymentModal() {
        if (!isLoggedIn) {
            alert('Для управления способами оплаты необходимо войти в систему.');
            return;
        }
        
        // Обновляем отображение сохраненных карт
        renderSavedCards();
        
        // Сбрасываем форму
        if (paymentForm) paymentForm.reset();
        updateCardTypeBadge('');
        
        // Обновляем сумму
        updateAmount(currentAmount);
        
        // Сбрасываем выбранный метод оплаты
        updateSelectedPaymentMethod('visa');
        
        // Показываем модальное окно
        openModal(paymentModal);
    }
    
    // Функция для закрытия модального окна оплаты
    function closePaymentModal() {
        closeModal(paymentModal);
    }
    
    // Алгоритм Луна для проверки номера карты
    function isValidCardNumber(number) {
        if (number.length < 13 || number.length > 19) return false;
        
        let sum = 0;
        let isEven = false;
        
        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i), 10);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return (sum % 10) === 0;
    }
    
    // Проверка срока действия карты
    function isValidExpiry(expiry) {
        if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) return false;
        
        const [month, year] = expiry.split('/').map(Number);
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        if (month < 1 || month > 12) return false;
        if (year < currentYear) return false;
        if (year === currentYear && month < currentMonth) return false;
        
        return true;
    }
    
    // Функция валидации данных карты
    function validateCardData(cardData) {
        // Проверка номера карты (Luhn algorithm)
        if (!isValidCardNumber(cardData.number)) {
            alert('Пожалуйста, введите корректный номер карты.');
            return false;
        }
        
        // Проверка имени
        if (!cardData.name || cardData.name.length < 2) {
            alert('Пожалуйста, введите имя на карте.');
            return false;
        }
        
        // Проверка срока действия
        if (!isValidExpiry(cardData.expiry)) {
            alert('Пожалуйста, введите корректный срок действия карты (ММ/ГГ).');
            return false;
        }
        
        // Проверка CVC
        if (!cardData.cvc || cardData.cvc.length !== 3 || !/^\d{3}$/.test(cardData.cvc)) {
            alert('Пожалуйста, введите корректный CVC/CVV код (3 цифры).');
            return false;
        }
        
        return true;
    }
    
    // Имитация процесса оплаты
    function processPayment(cardData) {
        // Показываем индикатор загрузки
        const payButton = document.getElementById('payButton');
        if (!payButton) return;
        
        const originalContent = payButton.innerHTML;
        payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка...';
        payButton.disabled = true;
        
        // Имитация задержки платежа
        setTimeout(() => {
            // Сброс кнопки
            payButton.innerHTML = originalContent;
            payButton.disabled = false;
            
            // В 80% случаев успешная оплата
            if (Math.random() > 0.2) {
                // Успешная оплата
                alert(`✅ Оплата на сумму ${currentAmount} ₽ прошла успешно!\n\nСпасибо за использование TravelHub!`);
                
                // Предлагаем сохранить карту
                if (confirm('Хотите сохранить данные этой карты для будущих платежей?')) {
                    const cardId = addSavedCard(cardData);
                    alert(`Карта сохранена под номером ${cardId}`);
                }
                
                // Закрываем модальное окно
                closePaymentModal();
            } else {
                // Ошибка оплаты
                alert('❌ Оплата не прошла. Пожалуйста, проверьте данные карты или попробуйте другую карту.');
            }
        }, 2000);
    }
    
    // Инициализация кнопок при загрузке
    function initializeNavigation() {
        // Изначально скрываем кнопку "Профиль" в навигации
        if (navProfileBtn) {
            navProfileBtn.style.display = 'none';
        }
        
        // НЕ проверяем статус входа из localStorage
        // При каждой загрузке страницы пользователь не авторизован
        isLoggedIn = false;
        currentUser = null;
        
        // Обновляем счетчик бронирований
        updateBookingsCount();
    }
    
    // === ИНИЦИАЛИЗАЦИЯ ===
    
    // Инициализируем навигацию
    initializeNavigation();
    
    // === ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ РЕГИСТРАЦИИ ===
    
    // Открыть модальное окно регистрации при нажатии на кнопку "Вход"
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!isLoggedIn) {
                openModal(registrationModal);
            }
        });
    }
    
    // Закрыть модальное окно регистрации
    if (closeRegistrationBtn) {
        closeRegistrationBtn.addEventListener('click', function() {
            closeModal(registrationModal);
        });
    }
    
    // Показать/скрыть пароль
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Меняем иконку
            if (type === 'text') {
                togglePassword.textContent = '🙈';
            } else {
                togglePassword.textContent = '👁️';
            }
        });
    }
    
    // Обработка формы регистрации
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = passwordInput.value;
            
            // Базовая валидация
            if (!email || !password) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Пожалуйста, введите корректный email');
                return;
            }
            
            if (password.length < 6) {
                alert('Пароль должен содержать минимум 6 символов');
                return;
            }
            
            // Сохраняем данные пользователя (только в памяти)
            userEmail = email;
            userPassword = password;
            
            // Генерация 4-значного кода для SMS
            generatedSmsCode = Math.floor(1000 + Math.random() * 9000).toString(); // 1000-9999
            
            // Показать SMS код в alert (имитация отправки SMS)
            alert(`SMS с кодом подтверждения отправлен!\nВаш код: ${generatedSmsCode}\n\nВведите его в следующем окне для подтверждения регистрации.`);
            
            // Закрываем окно регистрации и открываем окно подтверждения
            closeModal(registrationModal);
            openModal(confirmationModal);
            
            // Автофокус на первое поле ввода кода
            setTimeout(() => {
                if (code1) code1.focus();
            }, 100);
            
            // Очищаем форму регистрации
            registrationForm.reset();
        });
    }
    
    // === ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ ПОДТВЕРЖДЕНИЯ ===
    
    // Закрыть модальное окно подтверждения
    if (closeConfirmationBtn) {
        closeConfirmationBtn.addEventListener('click', function() {
            closeModal(confirmationModal);
            resetConfirmationForm();
        });
    }
    
    // Автоматическое перемещение между полями ввода кода
    const codeInputs = [code1, code2, code3, code4];
    
    codeInputs.forEach((input, index) => {
        if (input) {
            input.addEventListener('input', function(e) {
                // Проверяем, что введена цифра
                if (!/^[0-9]$/.test(this.value)) {
                    this.value = '';
                    return;
                }
                
                // Переходим к следующему полю, если текущее заполнено
                if (this.value.length === 1 && index < codeInputs.length - 1) {
                    const nextInput = codeInputs[index + 1];
                    if (nextInput) nextInput.focus();
                }
            });
            
            // Обработка клавиш Backspace
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value === '' && index > 0) {
                    const prevInput = codeInputs[index - 1];
                    if (prevInput) prevInput.focus();
                }
            });
        }
    });
    
    // Кнопка подтверждения SMS кода
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            // Получаем введенный код
            const enteredCode = (code1?.value || '') + (code2?.value || '') + (code3?.value || '') + (code4?.value || '');
            
            // Проверяем, что все поля заполнены
            if (enteredCode.length !== 4) {
                alert('Пожалуйста, введите все 4 цифры кода');
                return;
            }
            
            // Проверяем код
            if (enteredCode === generatedSmsCode) {
                // Регистрируем пользователя (только в памяти, не в localStorage)
                const emailInput = document.getElementById('email');
                const email = emailInput?.value || userEmail;
                loginUser({
                    email: email,
                    name: email.split('@')[0] || 'Новый пользователь'
                });
                
                // Показываем сообщение об успехе
                alert('Регистрация успешно завершена! Добро пожаловать в TravelHub!');
                
                // Закрываем окно подтверждения
                closeModal(confirmationModal);
                
                // Сбрасываем форму подтверждения
                resetConfirmationForm();
            } else {
                alert('Неверный код подтверждения. Пожалуйста, проверьте SMS и попробуйте снова.');
                
                // Очищаем поля ввода
                resetCodeInputs();
                if (code1) code1.focus();
            }
        });
    }
    
    // === ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ ПРОФИЛЯ ===
    
    // Обработчик клика по кнопке "Профиль" в навигации
    if (navProfileBtn) {
        navProfileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!isLoggedIn) {
                alert('Для доступа к профилю необходимо войти в систему.');
                return;
            }
            
            openModal(profileModal);
        });
    }
    
    // Закрытие модального окна профиля по крестику
    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', function() {
            closeModal(profileModal);
        });
    }
    
    // Обработчик кнопки "Выход" в профиле
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите выйти?')) {
                logoutUser();
                closeModal(profileModal);
                alert('Вы успешно вышли из аккаунта.');
            }
        });
    }
    
    // Обработчик кнопки "Подробнее" в бронированиях
    if (bookingsDetailsBtn) {
        bookingsDetailsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openBookingsModal();
        });
    }
    
    // === ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ МОДАЛЬНОГО ОКНА БРОНИРОВАНИЙ ===
    
    // Закрытие модального окна бронирований
    if (closeBookingsBtn) {
        closeBookingsBtn.addEventListener('click', function() {
            closeBookingsModal();
        });
    }
    
    // === ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ МОДАЛЬНОГО ОКНА ОПЛАТЫ ===
    
    // Обработчик для элемента "Способ оплаты" в профиле
    if (paymentMethodItem) {
        // Добавляем новый обработчик
        paymentMethodItem.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openPaymentModal();
        });
        
        // Также обновляем обработчик для стрелки
        const paymentArrowBtn = paymentMethodItem.querySelector('.arrow-btn');
        if (paymentArrowBtn) {
            paymentArrowBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openPaymentModal();
            });
        }
    }
    
    // Закрытие модального окна оплаты
    if (closePaymentBtn) {
        closePaymentBtn.addEventListener('click', function() {
            closePaymentModal();
        });
    }
    
    // === ОБЩИЕ ОБРАБОТЧИКИ СОБЫТИЙ ===
    
    // Закрытие модальных окон при клике вне их
    registrationModal.addEventListener('click', function(e) {
        if (e.target === registrationModal) {
            closeModal(registrationModal);
        }
    });
    
    confirmationModal.addEventListener('click', function(e) {
        if (e.target === confirmationModal) {
            closeModal(confirmationModal);
            resetConfirmationForm();
        }
    });
    
    profileModal.addEventListener('click', function(e) {
        if (e.target === profileModal) {
            closeModal(profileModal);
        }
    });
    
    bookingsModal.addEventListener('click', function(e) {
        if (e.target === bookingsModal) {
            closeBookingsModal();
        }
    });
    
    paymentModal.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            closePaymentModal();
        }
    });
    
    // Закрытие модальных окон при нажатии Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (registrationModal.style.display === 'flex') {
                closeModal(registrationModal);
            }
            if (confirmationModal.style.display === 'flex') {
                closeModal(confirmationModal);
                resetConfirmationForm();
            }
            if (profileModal.style.display === 'flex') {
                closeModal(profileModal);
            }
            if (bookingsModal.style.display === 'flex') {
                closeBookingsModal();
            }
            if (paymentModal.style.display === 'flex') {
                closePaymentModal();
            }
        }
    });
    
    // Обработчики для интерактивных элементов профиля
    const interactiveItems = [
        { element: favoriteCitiesItem, title: 'Избранные города' },
        { element: friendsItem, title: 'Друзья' },
        { element: subscribersItem, title: 'Подписчики' },
        { element: supportItem, title: 'Поддержка' },
        { element: termsItem, title: 'Условия использования' }
    ];
    
    interactiveItems.forEach(item => {
        if (item.element) {
            item.element.addEventListener('click', function() {
                handleProfileItemClick(item.title);
            });
            
            // Также обрабатываем клик по кнопке со стрелкой
            const arrowBtn = item.element.querySelector('.arrow-btn');
            if (arrowBtn) {
                arrowBtn.addEventListener('click', function(e) {
                    e.stopPropagation(); // Предотвращаем всплытие события
                    handleProfileItemClick(item.title);
                });
            }
        }
    });
    
    // Обработчики для элементов бронирований
    document.addEventListener('click', function(e) {
        // Обработка клика на отель
        if (e.target.closest('.hotel-item')) {
            const hotelElement = e.target.closest('.hotel-item');
            const hotelId = hotelElement.dataset.hotelId;
            const hotel = mockBookings.hotels.find(h => h.id == hotelId);
            
            if (hotel) {
                console.log('Выбран отель:', hotel);
                // Показываем детали бронирования
                alert(`Детали бронирования:\n\n🏨 Отель: ${hotel.name}\n⭐ Рейтинг: ${hotel.stars} звезд\n💰 Цена: ${hotel.priceRange}\n📅 Заезд: ${hotel.checkIn}\n📅 Выезд: ${hotel.checkOut}\n👥 Гостей: ${hotel.guests}\n📋 Статус: ${hotel.status}\n\n${hotel.description}`);
            }
        }
    });
    
    // === ОБРАБОТЧИКИ ДЛЯ ФОРМЫ ОПЛАТЫ ===
    
    // Обработка изменения номера карты
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            // Форматируем номер карты
            this.value = formatCardNumber(this.value);
            
            // Обновляем иконку типа карты
            updateCardTypeBadge(this.value);
            
            // Автоматически определяем тип карты для выбора метода оплаты
            const cardType = detectCardType(this.value);
            if (cardType !== 'unknown') {
                updateSelectedPaymentMethod(cardType);
            }
        });
    }
    
    // Обработка изменения срока действия
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            // Форматируем срок действия
            this.value = formatExpiry(this.value);
        });
    }
    
    // Ограничение ввода только цифр для CVC
    if (cardCvcInput) {
        cardCvcInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    // Обработка клика по логотипам платежных систем
    if (mastercardLogo) {
        mastercardLogo.addEventListener('click', function() {
            updateSelectedPaymentMethod('mastercard');
        });
    }
    
    if (mirLogo) {
        mirLogo.addEventListener('click', function() {
            updateSelectedPaymentMethod('mir');
        });
    }
    
    if (visaLogo) {
        visaLogo.addEventListener('click', function() {
            updateSelectedPaymentMethod('visa');
        });
    }
    
    // Кнопка изменения суммы
    if (changeAmountBtn) {
        changeAmountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const newAmount = prompt('Введите новую сумму оплаты (в рублях):', currentAmount);
            if (newAmount && !isNaN(newAmount) && newAmount > 0) {
                updateAmount(parseInt(newAmount));
            }
        });
    }
    
    // Кнопка помощи по CVC
    if (cvcHelpBtn) {
        cvcHelpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('CVC/CVV — это трехзначный код безопасности на обратной стороне вашей карты (для Visa/MasterCard) или четырехзначный код на лицевой стороне (для American Express).\n\nЭтот код необходим для подтверждения онлайн-платежей.');
        });
    }
    
    // Обработка отправки формы оплаты
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Собираем данные формы
            const cardData = {
                number: cardNumberInput.value.replace(/\s/g, ''),
                name: cardNameInput.value.trim(),
                expiry: cardExpiryInput.value.trim(),
                cvc: cardCvcInput.value.trim(),
                type: selectedPaymentMethod
            };
            
            // Базовая валидация
            if (!validateCardData(cardData)) {
                return;
            }
            
            // Имитация процесса оплаты
            processPayment(cardData);
        });
    }
    
    // === ТЕСТОВЫЕ ФУНКЦИИ ===
    
    // Функция для имитации успешной регистрации (для тестирования)
    window.simulateSuccessfulRegistration = function(userEmail, userName) {
        loginUser({
            email: userEmail || 'test@example.com',
            name: userName || 'Тестовый пользователь'
        });
        
        // Закрываем окно регистрации (если открыто)
        if (registrationModal && registrationModal.style.display === 'flex') {
            closeModal(registrationModal);
        }
        
        alert(`Регистрация успешно завершена! Добро пожаловать, ${userName || 'Тестовый пользователь'}!`);
    };
    
    // Функция для открытия профиля извне
    window.openUserProfile = function() {
        if (!isLoggedIn) {
            alert('Для доступа к профилю необходимо войти в систему.');
            return;
        }
        openModal(profileModal);
    };
    
    // Функция для получения статуса авторизации
    window.getLoginStatus = function() {
        return isLoggedIn;
    };
    
    // Функция для получения данных пользователя
    window.getCurrentUser = function() {
        return currentUser;
    };
    
    // Функция для выхода из системы
    window.logout = function() {
        logoutUser();
        alert('Вы вышли из системы.');
    };
    
    // Функция для открытия окна бронирований
    window.openBookingsModal = function() {
        openBookingsModal();
    };
    
    // Функция для добавления тестового бронирования отеля
    window.addTestBooking = function(data) {
        const newId = mockBookings.hotels.length > 0 ? 
            Math.max(...mockBookings.hotels.map(h => h.id)) + 1 : 1;
        
        const newBooking = {
            id: newId,
            name: data.name || "Новый отель",
            stars: data.stars || 3,
            priceRange: data.priceRange || "5.000 - 10.000 ₽",
            description: data.description || "Описание отеля",
            photo: data.photo || "https://via.placeholder.com/100x60",
            checkIn: data.checkIn || "01.01.2024",
            checkOut: data.checkOut || "07.01.2024",
            guests: data.guests || 2,
            status: data.status || "Подтверждено"
        };
        
        mockBookings.hotels.push(newBooking);
        
        // Обновляем отображение, если окно открыто
        if (bookingsModal.style.display === 'flex') {
            renderHotels();
        }
        
        // Обновляем счетчик
        updateBookingsCount();
        
        console.log('Бронирование отеля добавлено:', newBooking);
        return newBooking.id;
    };
    
    // Функция для удаления бронирования
    window.removeBooking = function(id) {
        const initialLength = mockBookings.hotels.length;
        mockBookings.hotels = mockBookings.hotels.filter(hotel => hotel.id !== id);
        
        if (mockBookings.hotels.length < initialLength) {
            // Обновляем отображение, если окно открыто
            if (bookingsModal.style.display === 'flex') {
                renderHotels();
            }
            
            // Обновляем счетчик
            updateBookingsCount();
            
            console.log('Бронирование удалено:', id);
            return true;
        }
        
        console.log('Бронирование не найдено:', id);
        return false;
    };
    
    // Функция для получения всех бронирований
    window.getAllBookings = function() {
        return [...mockBookings.hotels];
    };
    
    // Функция для очистки всех бронирований
    window.clearAllBookings = function() {
        if (confirm('Вы уверены, что хотите удалить все бронирования?')) {
            mockBookings.hotels = [];
            
            if (bookingsModal.style.display === 'flex') {
                renderHotels();
            }
            
            // Обновляем счетчик
            updateBookingsCount();
            
            console.log('Все бронирования очищены');
        }
    };
    
    // Функция для получения количества бронирований
    window.getBookingsCount = function() {
        return getBookingsCount();
    };
    
    // Функция для открытия окна оплаты извне
    window.openPaymentModal = function() {
        openPaymentModal();
    };
    
    // Функция для добавления тестовой карты
    window.addTestCard = function() {
        const testCards = [
            {
                number: '4242424242424242',
                name: 'ИВАН ИВАНОВ',
                expiry: '12/25',
                cvc: '123',
                type: 'visa'
            },
            {
                number: '5555555555554444',
                name: 'ПЕТР ПЕТРОВ',
                expiry: '08/24',
                cvc: '456',
                type: 'mastercard'
            },
            {
                number: '2200123456789010',
                name: 'АННА СИДОРОВА',
                expiry: '05/26',
                cvc: '789',
                type: 'mir'
            }
        ];
        
        const randomCard = testCards[Math.floor(Math.random() * testCards.length)];
        const cardId = addSavedCard(randomCard);
        console.log('Тестовая карта добавлена:', cardId);
        return cardId;
    };
    
    // Функция для получения всех сохраненных карт
    window.getSavedCards = function() {
        return [...savedCards];
    };
    
    // Функция для очистки всех сохраненных карт
    window.clearAllCards = function() {
        if (confirm('Вы уверены, что хотите удалить все сохраненные карты?')) {
            savedCards = [];
            renderSavedCards();
            console.log('Все карты удалены');
        }
    };
    
    // Функция для изменения суммы оплаты
    window.setPaymentAmount = function(amount) {
        if (amount && !isNaN(amount) && amount > 0) {
            updateAmount(parseInt(amount));
            return true;
        }
        return false;
    };
    
    // Обработчик для кнопки "В путешествие"
    const travelBtn = document.querySelector('.btn-primary');
    if (travelBtn && travelBtn.textContent.includes('В путешествие')) {
        travelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Открываем страницу сборки тура
            const filePath = "E:\\Project X\\Сайт (Project X)\\Собери свой тур\\stran.sst.html";
            window.open(filePath, '_blank');
        });
    }
    
    console.log('Все модули инициализированы (без сохранения в localStorage)');
    console.log('Доступные тестовые функции:');
    console.log('1. Регистрация и профиль:');
    console.log('   - window.simulateSuccessfulRegistration("test@example.com", "Имя")');
    console.log('   - window.openUserProfile()');
    console.log('   - window.getLoginStatus()');
    console.log('   - window.getCurrentUser()');
    console.log('   - window.logout()');
    console.log('');
    console.log('2. Бронирования:');
    console.log('   - window.openBookingsModal()');
    console.log('   - window.addTestBooking({name: "Отель", stars: 4})');
    console.log('   - window.removeBooking(1)');
    console.log('   - window.getAllBookings()');
    console.log('   - window.clearAllBookings()');
    console.log('   - window.getBookingsCount()');
    console.log('');
    console.log('3. Оплата:');
    console.log('   - window.openPaymentModal()');
    console.log('   - window.addTestCard()');
    console.log('   - window.getSavedCards()');
    console.log('   - window.clearAllCards()');
    console.log('   - window.setPaymentAmount(10000)');
    console.log('');
    console.log('Примечание: данные НЕ сохраняются после перезагрузки страницы');
});