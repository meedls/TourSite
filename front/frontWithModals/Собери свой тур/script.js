document.addEventListener('DOMContentLoaded', function() {
    // === ЭЛЕМЕНТЫ МОДАЛЬНЫХ ОКОН ===
    
    // Регистрация
    const registrationModal = document.getElementById('registrationModal');
    const closeRegistrationBtn = document.getElementById('closeModal');
    let loginBtn = document.querySelector('.btn-login');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const registrationForm = document.getElementById('registrationForm');
    
    // Подтверждение SMS
    const confirmationModal = document.getElementById('confirmationModal');
    const closeConfirmationBtn = document.getElementById('closeConfirmationModal');
    const confirmBtn = document.getElementById('confirmBtn');
    const code1 = document.getElementById('code1');
    const code2 = document.getElementById('code2');
    const code3 = document.getElementById('code3');
    const code4 = document.getElementById('code4');
    
    // Профиль
    const profileModal = document.getElementById('profileModal');
    const closeProfileBtn = document.getElementById('closeProfileModal');
    const logoutBtn = document.getElementById('logoutBtn');
    const bookingsDetailsBtn = document.getElementById('bookingsDetailsBtn');
    const navProfileBtn = document.getElementById('navProfileBtn');
    
    // Бронирования
    const bookingsModal = document.getElementById('bookingsModal');
    const closeBookingsBtn = document.getElementById('closeBookingsModal');
    const hotelsSection = document.getElementById('hotelsSection');
    
    // Оплата
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentBtn = document.getElementById('closePaymentModal');
    const paymentMethodItem = document.getElementById('paymentMethodItem');
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
    
    // Элементы профиля
    const profileUserName = document.getElementById('profileUserName');
    const profileUserId = document.getElementById('profileUserId');
    const favoriteCitiesItem = document.getElementById('favoriteCitiesItem');
    const friendsItem = document.getElementById('friendsItem');
    const subscribersItem = document.getElementById('subscribersItem');
    const supportItem = document.getElementById('supportItem');
    const termsItem = document.getElementById('termsItem');
    
    // Выбор города
    const cityModalOverlay = document.getElementById('cityModalOverlay');
    const cityModalClose = document.getElementById('cityModalClose');
    const cityBtn = document.querySelector('.city-btn');
    
    // Выбор городов для "Туда" и "Обратно"
    const citiesSelectionModal = document.getElementById('citiesSelectionModal');
    const closeCitiesSelectionBtn = document.getElementById('closeCitiesSelectionModal');
    const toBtn = document.querySelector('.to-btn');
    const backBtn = document.querySelector('.back-btn');
    const citiesSelectionTitle = document.getElementById('citiesSelectionTitle');
    const cityItems = document.querySelectorAll('#citiesSelectionModal .city-name');
    
    // Выбор городов для location-btn
    const locationBtns = document.querySelectorAll('.location-btn');
    const locationContent = document.querySelectorAll('.location-content');
    
    // === ПЕРЕМЕННЫЕ ===
    
    let generatedSmsCode = '';
    let userEmail = '';
    let userPassword = '';
    let isLoggedIn = false;
    let currentUser = null;
    let savedCards = [];
    let selectedPaymentMethod = 'visa';
    let currentAmount = 8000;
    let currentSelectionType = ''; // 'from', 'to', 'back', 'city'
    
    // Тестовые данные
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
    
    // === ОСНОВНЫЕ ФУНКЦИИ ===
    
    function openModal(modal) {
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeModal(modal) {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    function openCityModal() {
        if (cityModalOverlay) {
            cityModalOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeCityModal() {
        if (cityModalOverlay) {
            cityModalOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    function selectCity(cityName) {
        const cityBtnText = document.querySelector('.city-btn .btn-text');
        if (cityBtnText) {
            cityBtnText.textContent = cityName;
        }
        closeCityModal();
    }
    
    function openCitiesSelectionModal(type) {
        currentSelectionType = type;
        
        if (citiesSelectionTitle) {
            citiesSelectionTitle.textContent = type === 'to' ? 'Куда' : 'Обратно';
        }
        
        if (citiesSelectionModal) {
            citiesSelectionModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeCitiesSelectionModal() {
        if (citiesSelectionModal) {
            citiesSelectionModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        currentSelectionType = '';
    }
    
    function openCitiesSelectionForLocation(locationType, currentCity) {
        currentSelectionType = locationType;
        
        if (citiesSelectionTitle) {
            citiesSelectionTitle.textContent = locationType === 'from' ? 'Откуда' : 'Куда';
        }
        
        // Если есть текущий город, можем его подсветить в списке
        if (currentCity) {
            highlightCityInList(currentCity);
        }
        
        if (citiesSelectionModal) {
            citiesSelectionModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function selectCityForDirection(cityName) {
        if (!currentSelectionType) return;
        
        const btnElement = currentSelectionType === 'to' ? toBtn : backBtn;
        const btnText = btnElement.querySelector('.btn-text');
        
        if (btnText) {
            btnText.textContent = cityName;
        }
        
        closeCitiesSelectionModal();
        
        // Обновляем информацию в основной секции поиска
        if (currentSelectionType === 'to') {
            const locationContent = document.querySelectorAll('.location-content')[1]; // Второй элемент "Куда"
            if (locationContent) {
                locationContent.innerHTML = `${cityName} <span class="location-code">${getCityCode(cityName)}</span>`;
            }
        }
        
        console.log(`Выбран город для ${currentSelectionType}: ${cityName}`);
    }
    
    function selectCityForLocation(locationType, cityName) {
        const locationIndex = locationType === 'from' ? 0 : 1;
        const cityCode = getCityCode(cityName);
        
        if (locationContent[locationIndex]) {
            locationContent[locationIndex].innerHTML = `${cityName} <span class="location-code">${cityCode}</span>`;
        }
        
        closeCitiesSelectionModal();
        
        console.log(`Выбран город для ${locationType}: ${cityName} (${cityCode})`);
    }
    
    function highlightCityInList(cityName) {
        // Сначала убираем выделение у всех городов
        document.querySelectorAll('.cities-selection-container .city-name').forEach(city => {
            city.style.backgroundColor = 'transparent';
            city.style.color = '#333';
            city.style.fontWeight = '500';
        });
        
        // Находим и выделяем нужный город
        document.querySelectorAll('.cities-selection-container .city-name').forEach(city => {
            if (city.textContent.trim() === cityName) {
                city.style.backgroundColor = 'rgba(26, 35, 126, 0.1)';
                city.style.color = '#1a237e';
                city.style.fontWeight = '600';
            }
        });
    }
    
    function getCityCode(cityName) {
        // Маппинг городов на их коды аэропортов
        const cityCodes = {
            'Санкт-Петербург': 'LED',
            'Москва': 'MOW',
            'Владивосток': 'VVO',
            'Самара': 'KUF',
            'Сахалин': 'UUS',
            'Тюмень': 'TJM',
            'Челябинск': 'CEK',
            'Чебоксары': 'CSY',
            'Магадан': 'GDX',
            'Новосибирск': 'OVB',
            'Екатеринбург': 'SVX',
            'Красноярск': 'KJA',
            'Казань': 'KZN',
            'Нижний Новгород': 'GOJ',
            'Омск': 'OMS',
            'Ростов-на-Дону': 'ROV',
            'Уфа': 'UFA',
            'Волгоград': 'VOG',
            'Баратаевка': 'ULV'
        };
        
        return cityCodes[cityName] || cityName.substring(0, 3).toUpperCase();
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function resetCodeInputs() {
        [code1, code2, code3, code4].forEach(input => {
            if (input) input.value = '';
        });
    }
    
    function resetConfirmationForm() {
        resetCodeInputs();
        generatedSmsCode = '';
        userEmail = '';
        userPassword = '';
    }
    
    function updateNavigationButtons() {
        if (isLoggedIn) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (navProfileBtn) navProfileBtn.style.display = 'block';
        } else {
            if (loginBtn) loginBtn.style.display = 'block';
            if (navProfileBtn) navProfileBtn.style.display = 'none';
        }
    }
    
    function updateProfileInfo() {
        if (currentUser) {
            if (profileUserName) {
                profileUserName.textContent = currentUser.name || 'Иван Иванов';
            }
            if (profileUserId) {
                profileUserId.textContent = `ID: ${currentUser.id || '123456789'}`;
            }
        }
    }
    
    function loginUser(userData) {
        currentUser = {
            name: userData.name || userData.email.split('@')[0] || 'Новый пользователь',
            email: userData.email,
            id: generateUserId()
        };
        
        isLoggedIn = true;
        updateNavigationButtons();
        updateProfileInfo();
        updateBookingsCount();
        
        console.log('Пользователь вошел:', currentUser);
    }
    
    function logoutUser() {
        currentUser = null;
        isLoggedIn = false;
        updateNavigationButtons();
        console.log('Пользователь вышел');
    }
    
    function generateUserId() {
        return Math.floor(100000000 + Math.random() * 900000000).toString();
    }
    
    function generateStars(rating, maxStars = 5) {
        let stars = '';
        for (let i = 0; i < maxStars; i++) {
            stars += i < rating ? '★' : '☆';
        }
        return stars;
    }
    
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
    
    function getStatusClass(status) {
        const statusClasses = {
            'Подтверждено': 'status-confirmed',
            'Ожидает оплаты': 'status-pending',
            'Активно': 'status-active',
            'Отменено': 'status-cancelled'
        };
        return statusClasses[status] || '';
    }
    
    function openBookingsModal() {
        if (!isLoggedIn) {
            alert('Для просмотра бронирований необходимо войти в систему.');
            return;
        }
        
        renderHotels();
        openModal(bookingsModal);
    }
    
    function closeBookingsModal() {
        closeModal(bookingsModal);
    }
    
    function handleProfileItemClick(itemTitle) {
        const messages = {
            'Друзья': 'Список ваших друзей в TravelHub.',
            'Подписчики': 'Пользователи, которые следят за вашими путешествиями.',
            'Поддержка': 'Свяжитесь с нашей службой поддержки.',
            'Условия использования': 'Ознакомьтесь с правилами использования сервиса.'
        };
        
        alert(`${itemTitle}\n\n${messages[itemTitle]}\n\nРаздел находится в разработке.`);
    }
    
    function getBookingsCount() {
        return mockBookings.hotels.length;
    }
    
    function updateBookingsCount() {
        const bookingsCount = document.querySelector('.bookings-header .count');
        if (bookingsCount) {
            bookingsCount.textContent = `(${getBookingsCount()})`;
        }
    }
    
    // Функции для оплаты
    function formatCardNumber(value) {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        return parts.length ? parts.join(' ') : value;
    }
    
    function formatExpiry(value) {
        const v = value.replace(/[^0-9]/g, '');
        return v.length >= 2 ? v.substring(0, 2) + '/' + v.substring(2, 4) : v;
    }
    
    function detectCardType(number) {
        const cleanNumber = number.replace(/\s/g, '');
        if (/^4/.test(cleanNumber)) return 'visa';
        if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) return 'mastercard';
        if (/^220[0-4]/.test(cleanNumber)) return 'mir';
        return 'unknown';
    }
    
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
                if (cardTypeBadge) cardTypeBadge.style.display = 'none';
                return;
        }
        
        if (cardTypeBadge) {
            cardTypeBadge.style.display = 'flex';
            cardTypeBadge.innerHTML = `<img src="${logoUrl}" alt="${altText}" class="badge-image">`;
        }
    }
    
    function updateSelectedPaymentMethod(method) {
        [mastercardLogo, mirLogo, visaLogo].forEach(logo => {
            if (logo) logo.classList.remove('active');
        });
        
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
    
    function updateAmount(newAmount) {
        currentAmount = newAmount;
        const formattedAmount = new Intl.NumberFormat('ru-RU').format(newAmount);
        
        if (paymentAmount) paymentAmount.textContent = `${formattedAmount} ₽`;
        if (payButtonAmount) payButtonAmount.textContent = `${formattedAmount} ₽`;
    }
    
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
            
            cardItem.addEventListener('click', function(e) {
                if (!e.target.closest('.delete-card-btn')) {
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
        
        document.querySelectorAll('.delete-card-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const cardId = this.dataset.cardId;
                if (confirm('Удалить карту?')) {
                    savedCards = savedCards.filter(card => card.id != cardId);
                    renderSavedCards();
                }
            });
        });
    }
    
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
    
    function openPaymentModal() {
        if (!isLoggedIn) {
            alert('Для управления оплатой необходимо войти в систему.');
            return;
        }
        
        renderSavedCards();
        if (paymentForm) paymentForm.reset();
        updateCardTypeBadge('');
        updateAmount(currentAmount);
        updateSelectedPaymentMethod('visa');
        openModal(paymentModal);
    }
    
    function closePaymentModal() {
        closeModal(paymentModal);
    }
    
    function handleFavoriteCitiesClick() {
        alert('Избранные города\n\nРаздел находится в разработке.');
    }
    
    // === ИНИЦИАЛИЗАЦИЯ ===
    
    function initializeNavigation() {
        if (navProfileBtn) navProfileBtn.style.display = 'none';
        isLoggedIn = false;
        currentUser = null;
        updateBookingsCount();
    }
    
    // === ОБРАБОТЧИКИ СОБЫТИЙ ===
    
    // Регистрация
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (!isLoggedIn) openModal(registrationModal);
        });
    }
    
    if (closeRegistrationBtn) {
        closeRegistrationBtn.addEventListener('click', function() {
            closeModal(registrationModal);
        });
    }
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.textContent = type === 'text' ? '🙈' : '👁️';
        });
    }
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = passwordInput.value;
            
            if (!email || !password) {
                alert('Заполните все поля');
                return;
            }
            
            if (!isValidEmail(email)) {
                alert('Введите корректный email');
                return;
            }
            
            if (password.length < 6) {
                alert('Пароль должен содержать минимум 6 символов');
                return;
            }
            
            userEmail = email;
            userPassword = password;
            generatedSmsCode = Math.floor(1000 + Math.random() * 9000).toString();
            
            alert(`SMS с кодом подтверждения отправлен!\nВаш код: ${generatedSmsCode}`);
            
            closeModal(registrationModal);
            openModal(confirmationModal);
            
            setTimeout(() => { if (code1) code1.focus(); }, 100);
            registrationForm.reset();
        });
    }
    
    // Подтверждение SMS
    if (closeConfirmationBtn) {
        closeConfirmationBtn.addEventListener('click', function() {
            closeModal(confirmationModal);
            resetConfirmationForm();
        });
    }
    
    const codeInputs = [code1, code2, code3, code4];
    codeInputs.forEach((input, index) => {
        if (input) {
            input.addEventListener('input', function(e) {
                if (!/^[0-9]$/.test(this.value)) {
                    this.value = '';
                    return;
                }
                
                if (this.value.length === 1 && index < codeInputs.length - 1) {
                    const nextInput = codeInputs[index + 1];
                    if (nextInput) nextInput.focus();
                }
            });
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Backspace' && this.value === '' && index > 0) {
                    const prevInput = codeInputs[index - 1];
                    if (prevInput) prevInput.focus();
                }
            });
        }
    });
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const enteredCode = (code1?.value || '') + (code2?.value || '') + (code3?.value || '') + (code4?.value || '');
            
            if (enteredCode.length !== 4) {
                alert('Введите все 4 цифры кода');
                return;
            }
            
            if (enteredCode === generatedSmsCode) {
                const emailInput = document.getElementById('email');
                const email = emailInput?.value || userEmail;
                loginUser({
                    email: email,
                    name: email.split('@')[0] || 'Новый пользователь'
                });
                
                alert('Регистрация успешно завершена! Добро пожаловать в TravelHub!');
                closeModal(confirmationModal);
                resetConfirmationForm();
            } else {
                alert('Неверный код подтверждения.');
                resetCodeInputs();
                if (code1) code1.focus();
            }
        });
    }
    
    // Профиль
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
    
    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', function() {
            closeModal(profileModal);
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Вы уверены, что хотите выйти?')) {
                logoutUser();
                closeModal(profileModal);
                alert('Вы успешно вышли из аккаунта.');
            }
        });
    }
    
    // Бронирования
    if (bookingsDetailsBtn) {
        bookingsDetailsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openBookingsModal();
        });
    }
    
    if (closeBookingsBtn) {
        closeBookingsBtn.addEventListener('click', function() {
            closeBookingsModal();
        });
    }
    
    // Оплата
    if (paymentMethodItem) {
        paymentMethodItem.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openPaymentModal();
        });
        
        const paymentArrowBtn = paymentMethodItem.querySelector('.arrow-btn');
        if (paymentArrowBtn) {
            paymentArrowBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openPaymentModal();
            });
        }
    }
    
    if (closePaymentBtn) {
        closePaymentBtn.addEventListener('click', function() {
            closePaymentModal();
        });
    }
    
    // Избранные города
    if (favoriteCitiesItem) {
        favoriteCitiesItem.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleFavoriteCitiesClick();
        });
        
        const favoriteArrowBtn = favoriteCitiesItem.querySelector('.arrow-btn');
        if (favoriteArrowBtn) {
            favoriteArrowBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                handleFavoriteCitiesClick();
            });
        }
    }
    
    // Выбор города
    if (cityBtn) {
        cityBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCityModal();
        });
    }
    
    if (cityModalClose) {
        cityModalClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeCityModal();
        });
    }
    
    // Выбор городов для "Туда" и "Обратно"
    if (toBtn) {
        toBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCitiesSelectionModal('to');
        });
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openCitiesSelectionModal('back');
        });
    }
    
    if (closeCitiesSelectionBtn) {
        closeCitiesSelectionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            closeCitiesSelectionModal();
        });
    }
    
    // Обработчики для location-btn
    if (locationBtns.length > 0) {
        locationBtns.forEach((btn, index) => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const locationType = index === 0 ? 'from' : 'to';
                let currentCity = '';
                
                // Получаем текущий город из контента
                if (locationContent[index]) {
                    const text = locationContent[index].textContent || locationContent[index].innerText;
                    // Убираем код аэропорта (ULV, LED и т.д.)
                    currentCity = text.replace(/\s*[A-Z]{3}$/, '').trim();
                }
                
                openCitiesSelectionForLocation(locationType, currentCity);
            });
        });
    }
    
    // Закрытие по клику вне окна
    const modals = [registrationModal, confirmationModal, profileModal, bookingsModal, paymentModal, cityModalOverlay, citiesSelectionModal];
    modals.forEach(modal => {
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    if (this === registrationModal) closeModal(registrationModal);
                    if (this === confirmationModal) {
                        closeModal(confirmationModal);
                        resetConfirmationForm();
                    }
                    if (this === profileModal) closeModal(profileModal);
                    if (this === bookingsModal) closeBookingsModal();
                    if (this === paymentModal) closePaymentModal();
                    if (this === cityModalOverlay) closeCityModal();
                    if (this === citiesSelectionModal) closeCitiesSelectionModal();
                }
            });
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (registrationModal && registrationModal.style.display === 'flex') closeModal(registrationModal);
            if (confirmationModal && confirmationModal.style.display === 'flex') {
                closeModal(confirmationModal);
                resetConfirmationForm();
            }
            if (profileModal && profileModal.style.display === 'flex') closeModal(profileModal);
            if (bookingsModal && bookingsModal.style.display === 'flex') closeBookingsModal();
            if (paymentModal && paymentModal.style.display === 'flex') closePaymentModal();
            if (cityModalOverlay && cityModalOverlay.style.display === 'flex') closeCityModal();
            if (citiesSelectionModal && citiesSelectionModal.style.display === 'flex') closeCitiesSelectionModal();
        }
    });
    
    // Элементы профиля
    const interactiveItems = [
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
            
            const arrowBtn = item.element.querySelector('.arrow-btn');
            if (arrowBtn) {
                arrowBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    handleProfileItemClick(item.title);
                });
            }
        }
    });
    
    // Выбор города из списка (первое модальное окно)
    const cityNames = document.querySelectorAll('.cities-list .city-name');
    cityNames.forEach(cityName => {
        cityName.addEventListener('click', function() {
            const selectedCity = this.textContent;
            selectCity(selectedCity);
        });
    });
    
    // Обработка выбора города из списка для всех типов выбора
    cityItems.forEach(cityName => {
        cityName.addEventListener('click', function() {
            const selectedCity = this.textContent;
            
            if (currentSelectionType === 'from' || currentSelectionType === 'to') {
                selectCityForLocation(currentSelectionType, selectedCity);
            } else if (currentSelectionType === 'to' || currentSelectionType === 'back') {
                selectCityForDirection(selectedCity);
            }
        });
    });
    
    // Обработчики для отелей
    document.addEventListener('click', function(e) {
        if (e.target.closest('.hotel-item')) {
            const hotelElement = e.target.closest('.hotel-item');
            const hotelId = hotelElement.dataset.hotelId;
            const hotel = mockBookings.hotels.find(h => h.id == hotelId);
            
            if (hotel) {
                alert(`Детали бронирования:\n\n🏨 Отель: ${hotel.name}\n⭐ Рейтинг: ${hotel.stars} звезд\n💰 Цена: ${hotel.priceRange}\n📅 Заезд: ${hotel.checkIn}\n📅 Выезд: ${hotel.checkOut}\n👥 Гостей: ${hotel.guests}\n📋 Статус: ${hotel.status}\n\n${hotel.description}`);
            }
        }
    });
    
    // Обработчики для формы оплаты
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            this.value = formatCardNumber(this.value);
            updateCardTypeBadge(this.value);
            const cardType = detectCardType(this.value);
            if (cardType !== 'unknown') updateSelectedPaymentMethod(cardType);
        });
    }
    
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            this.value = formatExpiry(this.value);
        });
    }
    
    if (cardCvcInput) {
        cardCvcInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    }
    
    if (mastercardLogo) mastercardLogo.addEventListener('click', () => updateSelectedPaymentMethod('mastercard'));
    if (mirLogo) mirLogo.addEventListener('click', () => updateSelectedPaymentMethod('mir'));
    if (visaLogo) visaLogo.addEventListener('click', () => updateSelectedPaymentMethod('visa'));
    
    if (changeAmountBtn) {
        changeAmountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const newAmount = prompt('Введите новую сумму оплаты (в рублях):', currentAmount);
            if (newAmount && !isNaN(newAmount) && newAmount > 0) {
                updateAmount(parseInt(newAmount));
            }
        });
    }
    
    if (cvcHelpBtn) {
        cvcHelpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('CVC/CVV — это трехзначный код безопасности на обратной стороне вашей карты.');
        });
    }
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cardData = {
                number: cardNumberInput.value.replace(/\s/g, ''),
                name: cardNameInput.value.trim(),
                expiry: cardExpiryInput.value.trim(),
                cvc: cardCvcInput.value.trim(),
                type: selectedPaymentMethod
            };
            
            // Имитация оплаты
            const payButton = document.getElementById('payButton');
            if (!payButton) return;
            
            const originalContent = payButton.innerHTML;
            payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка...';
            payButton.disabled = true;
            
            setTimeout(() => {
                payButton.innerHTML = originalContent;
                payButton.disabled = false;
                
                if (Math.random() > 0.2) {
                    alert(`✅ Оплата на сумму ${currentAmount} ₽ прошла успешно!\n\nСпасибо!`);
                    if (confirm('Хотите сохранить данные этой карты?')) {
                        addSavedCard(cardData);
                    }
                    closePaymentModal();
                } else {
                    alert('❌ Оплата не прошла. Проверьте данные карты.');
                }
            }, 2000);
        });
    }
    
    // Тестовые функции
    window.simulateSuccessfulRegistration = function(userEmail, userName) {
        loginUser({
            email: userEmail || 'test@example.com',
            name: userName || 'Тестовый пользователь'
        });
        
        if (registrationModal && registrationModal.style.display === 'flex') {
            closeModal(registrationModal);
        }
        
        alert(`Регистрация успешно завершена! Добро пожаловать, ${userName || 'Тестовый пользователь'}!`);
    };
    
    window.openUserProfile = function() {
        if (!isLoggedIn) {
            alert('Для доступа к профилю необходимо войти в систему.');
            return;
        }
        openModal(profileModal);
    };
    
    window.getLoginStatus = function() { return isLoggedIn; };
    window.getCurrentUser = function() { return currentUser; };
    window.logout = function() { logoutUser(); alert('Вы вышли из системы.'); };
    window.openBookingsModal = openBookingsModal;
    window.openPaymentModal = openPaymentModal;
    window.openCitiesSelection = function(type) {
        openCitiesSelectionModal(type || 'to');
    };
    window.getCurrentSelectionType = function() {
        return currentSelectionType;
    };
    
    // Инициализация
    initializeNavigation();
    
    console.log('Все модальные окна инициализированы, включая окно выбора городов для location-btn');
});