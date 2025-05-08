document.addEventListener('DOMContentLoaded', function() {
    // Инициализация библиотеки анимаций AOS
    AOS.init({
        duration: 800,
        once: false,
        mirror: true
    });
    
    // Добавление класса при прокрутке для изменения стиля шапки
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    });
    
    // Мобильное меню
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Закрытие меню при клике на ссылку
        const mobileMenuLinks = document.querySelectorAll('.mobile-menu__item a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }
    
    // Кнопка прокрутки наверх
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('active');
            } else {
                scrollToTopBtn.classList.remove('active');
            }
        });
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // FAQ аккордеон
    const faqItems = document.querySelectorAll('.faq__item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq__question');
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Закрыть все активные элементы
                faqItems.forEach(faqItem => {
                    faqItem.classList.remove('active');
                });
                
                // Если текущий элемент был неактивен, открываем его
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // Калькулятор цен
    initPriceCalculator();
    
    // Переключение темы
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        // Проверка сохраненной темы
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.querySelector('i').classList.remove('fa-moon');
            themeToggle.querySelector('i').classList.add('fa-sun');
        }
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            const isDark = document.body.classList.contains('dark-theme');
            const icon = themeToggle.querySelector('i');
            
            if (isDark) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Модальное окно
    const promoModal = document.getElementById('promoModal');
    
    if (promoModal) {
        // Показать модальное окно через 5 секунд после загрузки страницы
        const hasSeenModal = sessionStorage.getItem('hasSeenModal');
        
        if (!hasSeenModal) {
            setTimeout(function() {
                promoModal.classList.add('active');
            }, 5000);
        }
        
        // Закрытие модального окна
        const closeModalBtn = promoModal.querySelector('.modal__close');
        const dismissModalBtn = promoModal.querySelector('.modal__dismiss');
        const modalCloseAfterClick = promoModal.querySelector('.modal-close-after-click');
        
        closeModalBtn.addEventListener('click', function() {
            promoModal.classList.remove('active');
            sessionStorage.setItem('hasSeenModal', 'true');
        });
        
        dismissModalBtn.addEventListener('click', function() {
            promoModal.classList.remove('active');
            // Не сохраняем в sessionStorage, чтобы показать снова позже
        });
        
        if (modalCloseAfterClick) {
            modalCloseAfterClick.addEventListener('click', function() {
                promoModal.classList.remove('active');
                sessionStorage.setItem('hasSeenModal', 'true');
            });
        }
        
        // Обновление обратного отсчета
        function updateCountdown() {
            // Установим фиксированную дату окончания акции (например, через 3 дня)
            const now = new Date();
            const endDate = new Date(now);
            endDate.setDate(now.getDate() + 3);
            endDate.setHours(23, 59, 59, 0);
            
            const diff = endDate - now;
            
            // Вычисляем дни, часы, минуты
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            
            // Обновляем элементы
            document.getElementById('countdown-days').textContent = String(days).padStart(2, '0');
            document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
        }
        
        // Обновляем каждую минуту
        updateCountdown();
        setInterval(updateCountdown, 60000);
    }
    
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Lazy Loading для изображений
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window && lazyImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback для браузеров без поддержки IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    // Обработка отправки формы
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получение данных формы
            const formData = new FormData(contactForm);
            const formValues = {};
            
            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }
            
            // Анимация отправки
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';
            
            // Имитация отправки данных на сервер
            setTimeout(function() {
                // Успешная отправка
                submitButton.textContent = 'Отправлено ✓';
                submitButton.style.backgroundColor = '#4CAF50';
                
                // Сброс формы
                contactForm.reset();
                
                // Возврат кнопки в исходное состояние
                setTimeout(function() {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = '';
                }, 3000);
                
                // Сообщение об успешной отправке
                showNotification('Спасибо! Мы свяжемся с вами в ближайшее время.');
            }, 1500);
        });
    }
    
    // Функция показа уведомления
    function showNotification(message) {
        // Проверяем, существует ли уже уведомление
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification__content">
                <i class="fas fa-check-circle"></i>
                <p>${message}</p>
            </div>
        `;
        
        // Добавляем стили для уведомления
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = 'white';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        
        // Стили для содержимого уведомления
        const content = notification.querySelector('.notification__content');
        content.style.display = 'flex';
        content.style.alignItems = 'center';
        
        // Стили для иконки
        const icon = notification.querySelector('i');
        icon.style.color = '#4CAF50';
        icon.style.fontSize = '24px';
        icon.style.marginRight = '10px';
        
        // Темная тема
        if (document.body.classList.contains('dark-theme')) {
            notification.style.backgroundColor = '#333';
            notification.style.color = '#fff';
        }
        
        // Добавляем уведомление в DOM
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Автоматическое скрытие уведомления
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Анимация счетчика
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 секунды
            const step = Math.ceil(target / (duration / 16)); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current >= target) {
                    counter.textContent = target;
                } else {
                    counter.textContent = current;
                    requestAnimationFrame(updateCounter);
                }
            };
            
            updateCounter();
        });
    }
    
    // Наблюдатель пересечений для запуска анимации счетчиков при прокрутке
    const counterSection = document.querySelector('.doctor');
    
    if (counterSection) {
        const observerOptions = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        observer.observe(counterSection);
    }
    
    // Анимация появления элементов при скролле
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animateElements.length > 0) {
        const animateObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    animateObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(element => {
            animateObserver.observe(element);
        });
    }
    
    // Эффект параллакс для фоновых изображений
    window.addEventListener('scroll', function() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const elementPosition = element.offsetTop;
            const distance = (scrollPosition - elementPosition) * 0.3;
            
            if (distance > -500 && distance < 500) {
                element.style.backgroundPositionY = distance + 'px';
            }
        });
    });
    
    // Календарь записи на приём
    const calendarContainer = document.getElementById('calendarDays');
    const currentMonthElem = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const selectedDateElem = document.getElementById('selectedDate');
    const timeSlotsContainer = document.getElementById('timeSlots');
    const bookingSubmitBtn = document.getElementById('bookingSubmit');
    
    if (calendarContainer && dayjs) {
        // Инициализация dayjs с русской локализацией
        dayjs.locale('ru');
        
        // Текущая дата для календаря
        let currentDate = dayjs();
        
        // Выбранная дата и время
        let selectedDay = null;
        let selectedTimeSlot = null;
        
        // Данные о забронированных днях (в реальном приложении это будет загружаться с сервера)
        const bookedDays = [
            dayjs().add(1, 'day').format('YYYY-MM-DD'),
            dayjs().add(3, 'day').format('YYYY-MM-DD'),
            dayjs().add(5, 'day').format('YYYY-MM-DD'),
            dayjs().add(10, 'day').format('YYYY-MM-DD')
        ];
        
        // Данные о забронированных слотах времени
        const bookedTimeSlots = {
            [dayjs().add(2, 'day').format('YYYY-MM-DD')]: ['10:00', '12:00', '16:00'],
            [dayjs().add(4, 'day').format('YYYY-MM-DD')]: ['09:00', '11:00', '15:00']
        };
        
        // Все возможные временные слоты
        const allTimeSlots = [
            '09:00', '10:00', '11:00', '12:00', 
            '13:00', '14:00', '15:00', '16:00', 
            '17:00', '18:00', '19:00'
        ];
        
        // Обновление месяца в заголовке
        function updateMonthTitle() {
            currentMonthElem.textContent = currentDate.format('MMMM YYYY');
        }
        
        // Рендеринг календаря
        function renderCalendar() {
            // Очистка текущего содержимого
            calendarContainer.innerHTML = '';
            
            // Обновление заголовка месяца
            updateMonthTitle();
            
            // Получаем первый день месяца
            const firstDayOfMonth = currentDate.startOf('month');
            // Получаем день недели для первого дня (0 - воскресенье, 6 - суббота)
            let firstDayWeekday = firstDayOfMonth.day();
            // Корректируем день недели для начала с понедельника (0 - понедельник, 6 - воскресенье)
            firstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;
            
            // Получаем последний день предыдущего месяца
            const lastDayPrevMonth = firstDayOfMonth.subtract(1, 'day').date();
            
            // Получаем количество дней в текущем месяце
            const daysInMonth = currentDate.daysInMonth();
            
            // Добавляем дни из предыдущего месяца
            for (let i = 0; i < firstDayWeekday; i++) {
                const dayElem = document.createElement('div');
                dayElem.className = 'calendar__day calendar__day--other-month';
                dayElem.textContent = lastDayPrevMonth - firstDayWeekday + i + 1;
                calendarContainer.appendChild(dayElem);
            }
            
            // Добавляем дни текущего месяца
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElem = document.createElement('div');
                dayElem.className = 'calendar__day';
                dayElem.textContent = day;
                
                // Формат даты YYYY-MM-DD для текущего дня
                const currentDayFormatted = currentDate.date(day).format('YYYY-MM-DD');
                const today = dayjs().format('YYYY-MM-DD');
                
                // Проверяем, является ли день текущим
                if (currentDayFormatted === today) {
                    dayElem.classList.add('calendar__day--today');
                }
                
                // Проверяем, забронирован ли день
                if (bookedDays.includes(currentDayFormatted)) {
                    dayElem.classList.add('calendar__day--booked');
                } else {
                    // Добавляем обработчик только для незабронированных дней
                    dayElem.addEventListener('click', () => selectDay(currentDayFormatted, dayElem));
                    
                    // Если есть доступные слоты, показываем метку
                    if (bookedTimeSlots[currentDayFormatted]) {
                        if (bookedTimeSlots[currentDayFormatted].length < allTimeSlots.length) {
                            dayElem.classList.add('calendar__day--available');
                        }
                    } else {
                        dayElem.classList.add('calendar__day--available');
                    }
                }
                
                // Если день уже выбран, добавляем соответствующий класс
                if (selectedDay === currentDayFormatted) {
                    dayElem.classList.add('calendar__day--selected');
                }
                
                calendarContainer.appendChild(dayElem);
            }
            
            // Определяем, сколько дней из следующего месяца нужно добавить
            const cellsToFill = 42 - (firstDayWeekday + daysInMonth);
            
            // Добавляем дни из следующего месяца
            for (let i = 1; i <= cellsToFill; i++) {
                const dayElem = document.createElement('div');
                dayElem.className = 'calendar__day calendar__day--other-month';
                dayElem.textContent = i;
                calendarContainer.appendChild(dayElem);
            }
        }
        
        // Функция выбора дня
        function selectDay(dayFormatted, element) {
            // Сначала снимаем выделение со всех дней
            const allDays = document.querySelectorAll('.calendar__day');
            allDays.forEach(day => day.classList.remove('calendar__day--selected'));
            
            // Отмечаем выбранный день
            element.classList.add('calendar__day--selected');
            selectedDay = dayFormatted;
            
            // Форматируем выбранную дату для отображения
            const formattedDate = dayjs(dayFormatted).format('DD MMMM YYYY');
            selectedDateElem.textContent = formattedDate;
            
            // Отображаем доступные временные слоты
            renderTimeSlots(dayFormatted);
            
            // Сбрасываем выбранное время
            selectedTimeSlot = null;
            bookingSubmitBtn.disabled = true;
        }
        
        // Рендеринг временных слотов
        function renderTimeSlots(date) {
            // Очищаем контейнер
            timeSlotsContainer.innerHTML = '';
            
            // Получаем забронированные слоты для выбранного дня
            const bookedSlotsForDay = bookedTimeSlots[date] || [];
            
            // Добавляем все возможные слоты
            allTimeSlots.forEach(time => {
                const slotElem = document.createElement('div');
                slotElem.className = 'calendar__time-slot';
                slotElem.textContent = time;
                
                // Проверяем, забронирован ли слот
                if (bookedSlotsForDay.includes(time)) {
                    slotElem.classList.add('calendar__time-slot--booked');
                } else {
                    // Обработчик для свободных слотов
                    slotElem.addEventListener('click', () => selectTimeSlot(time, slotElem));
                }
                
                timeSlotsContainer.appendChild(slotElem);
            });
        }
        
        // Функция выбора временного слота
        function selectTimeSlot(time, element) {
            // Сначала снимаем выделение со всех слотов
            const allSlots = document.querySelectorAll('.calendar__time-slot');
            allSlots.forEach(slot => slot.classList.remove('calendar__time-slot--selected'));
            
            // Отмечаем выбранный слот
            element.classList.add('calendar__time-slot--selected');
            selectedTimeSlot = time;
            
            // Активируем кнопку отправки формы
            bookingSubmitBtn.disabled = false;
        }
        
        // Инициализация календаря
        renderCalendar();
        
        // Обработчики для кнопок переключения месяцев
        prevMonthBtn.addEventListener('click', () => {
            currentDate = currentDate.subtract(1, 'month');
            renderCalendar();
        });
        
        nextMonthBtn.addEventListener('click', () => {
            currentDate = currentDate.add(1, 'month');
            renderCalendar();
        });
        
        // Обработчик для отправки формы бронирования
        if (bookingSubmitBtn) {
            bookingSubmitBtn.addEventListener('click', function() {
                const name = document.getElementById('bookingName').value;
                const phone = document.getElementById('bookingPhone').value;
                const petType = document.getElementById('bookingPetType').value;
                const comment = document.getElementById('bookingComment').value;
                
                if (!name || !phone || !petType || !selectedDay || !selectedTimeSlot) {
                    showNotification('Пожалуйста, заполните все обязательные поля');
                    return;
                }
                
                // Анимация отправки
                const originalText = bookingSubmitBtn.textContent;
                bookingSubmitBtn.disabled = true;
                bookingSubmitBtn.textContent = 'Отправка...';
                
                // Имитация отправки данных на сервер
                setTimeout(function() {
                    // "Бронируем" выбранное время
                    if (!bookedTimeSlots[selectedDay]) {
                        bookedTimeSlots[selectedDay] = [];
                    }
                    bookedTimeSlots[selectedDay].push(selectedTimeSlot);
                    
                    // Если все слоты забронированы, отмечаем день как полностью забронированный
                    if (bookedTimeSlots[selectedDay].length === allTimeSlots.length) {
                        bookedDays.push(selectedDay);
                    }
                    
                    // Обновляем календарь
                    renderCalendar();
                    
                    // Сбрасываем форму
                    document.getElementById('bookingName').value = '';
                    document.getElementById('bookingPhone').value = '';
                    document.getElementById('bookingPetType').value = '';
                    document.getElementById('bookingComment').value = '';
                    selectedDay = null;
                    selectedTimeSlot = null;
                    selectedDateElem.textContent = 'Выберите дату в календаре';
                    timeSlotsContainer.innerHTML = '';
                    
                    // Сообщение об успешной отправке
                    showNotification('Вы успешно записаны на приём! Ожидайте звонка для подтверждения.');
                    
                    // Возврат кнопки в исходное состояние
                    setTimeout(function() {
                        bookingSubmitBtn.textContent = originalText;
                        bookingSubmitBtn.disabled = true;
                    }, 2000);
                }, 1500);
            });
        }
    }
    
    // Улучшенная обработка изображений
    const imageContainers = document.querySelectorAll('.img-container');
    
    // Добавляем оверлеи и подписи к изображениям
    imageContainers.forEach(container => {
        // Проверяем существование изображения в контейнере
        const img = container.querySelector('img');
        if (!img) return;
        
        // Добавляем класс для плавной анимации загрузки
        img.classList.add('lazy');
        
        // Создаем оверлей с подписью
        const overlay = document.createElement('div');
        overlay.className = 'img-overlay';
        
        // Получаем текст alt атрибута или создаем типовой
        const caption = document.createElement('div');
        caption.className = 'img-caption';
        caption.textContent = img.alt || 'Ветеринарная помощь на дому';
        
        // Собираем элементы
        overlay.appendChild(caption);
        container.appendChild(overlay);
        
        // Добавляем эффект при наведении
        container.addEventListener('mouseenter', () => {
            overlay.style.opacity = '1';
            img.style.transform = 'scale(1.05)';
        });
        
        container.addEventListener('mouseleave', () => {
            overlay.style.opacity = '0';
            img.style.transform = 'scale(1)';
        });
    });
    
    // Улучшенная загрузка изображений
    const allImages = document.querySelectorAll('img[data-src], .lazy');
    
    if ('IntersectionObserver' in window && allImages.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Если есть data-src, используем его
                    if (img.dataset.src) {
                        // Предзагрузка изображения
                        const preloadImage = new Image();
                        preloadImage.src = img.dataset.src;
                        
                        preloadImage.onload = () => {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                            img.classList.remove('lazy');
                        };
                    } else {
                        // Если data-src нет, просто добавляем класс loaded
                        img.classList.add('loaded');
                        img.classList.remove('lazy');
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '0px 0px 200px 0px' // Загружаем изображения на 200px ниже видимой области
        });
        
        allImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback для браузеров без поддержки IntersectionObserver
        allImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            img.classList.add('loaded');
            img.classList.remove('lazy');
        });
    }
});

// Инициализация калькулятора цен
function initPriceCalculator() {
    const calculatePriceBtn = document.getElementById('calculatePrice');
    if (!calculatePriceBtn) return;

    calculatePriceBtn.addEventListener('click', calculatePrice);

    // Добавляем анимации при наведении для селектов
    const selectElements = document.querySelectorAll('.calculator__select');
    selectElements.forEach(select => {
        select.addEventListener('mouseover', () => {
            select.classList.add('select-hover');
        });
        select.addEventListener('mouseout', () => {
            select.classList.remove('select-hover');
        });
    });

    // Инициализация кликабельных дополнительных услуг
    initAdditionalServices();

    // Инициализируем блок результатов
    animateBenefitsList();
}

// Инициализация кликабельных дополнительных услуг
function initAdditionalServices() {
    const additionalServices = document.querySelectorAll('.additional-service');
    
    additionalServices.forEach(service => {
        service.addEventListener('click', function() {
            // Получаем тип услуги из data-атрибута
            const serviceType = this.getAttribute('data-service');
            
            // Находим соответствующий чекбокс
            let checkboxId;
            switch(serviceType) {
                case 'urgent':
                    checkboxId = 'urgentVisit';
                    break;
                case 'night':
                    checkboxId = 'nightVisit';
                    break;
                case 'weekend':
                    checkboxId = 'weekend';
                    break;
                default:
                    return;
            }
            
            const checkbox = document.getElementById(checkboxId);
            if (!checkbox) return;
            
            // Переключаем состояние чекбокса
            checkbox.checked = !checkbox.checked;
            
            // Переключаем класс выбранной услуги
            this.classList.toggle('selected', checkbox.checked);
            
            // Анимация выбора
            if (checkbox.checked) {
                animateSelection(this);
            }
        });
    });
    
    // Проверяем начальное состояние чекбоксов и устанавливаем классы соответственно
    const checkboxes = ['urgentVisit', 'nightVisit', 'weekend'];
    checkboxes.forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
            const service = document.querySelector(`.additional-service[data-service="${getServiceType(id)}"]`);
            if (service) {
                service.classList.add('selected');
            }
        }
    });
}

// Получение типа услуги по id чекбокса
function getServiceType(checkboxId) {
    switch(checkboxId) {
        case 'urgentVisit':
            return 'urgent';
        case 'nightVisit':
            return 'night';
        case 'weekend':
            return 'weekend';
        default:
            return '';
    }
}

// Анимация выбора дополнительной услуги
function animateSelection(element) {
    // Добавляем временный класс для анимации
    element.classList.add('pulse-animation');
    
    // Удаляем класс после окончания анимации
    setTimeout(() => {
        element.classList.remove('pulse-animation');
    }, 700);
}

// Функция расчета цены
function calculatePrice() {
    const petType = document.getElementById('petType').value;
    const serviceType = document.getElementById('serviceType').value;
    const location = document.getElementById('location').value;
    const urgentVisit = document.getElementById('urgentVisit').checked;
    const nightVisit = document.getElementById('nightVisit').checked;
    const weekend = document.getElementById('weekend').checked;

    // Базовые цены по типу услуги
    const servicePrices = {
        'consultation': 800,
        'vaccination': 1500,
        'treatment': 1800,
        'surgery': 3000,
        'analysis': 600
    };

    // Коэффициенты по типу питомца
    const petCoefficients = {
        'cat': 1,
        'dog': 1.2,
        'rodent': 0.8,
        'bird': 1.1,
        'exotic': 1.5
    };

    // Стоимость выезда по локации
    const locationFees = {
        'tula': 0,
        'tula-region-near': 300,
        'tula-region-medium': 600,
        'tula-region-far': 1000
    };

    // Базовая стоимость
    let basePrice = servicePrices[serviceType] * petCoefficients[petType];
    
    // Доплата за выезд
    let travelFee = locationFees[location];

    // Дополнительные услуги
    let additionalFees = 0;
    if (urgentVisit) additionalFees += 500;
    if (nightVisit) additionalFees += 800;
    if (weekend) additionalFees += 300;

    // Итоговая стоимость
    let totalPrice = basePrice + travelFee + additionalFees;

    // Анимация отображения результата
    displayCalculatedPrice(totalPrice);
}

// Функция отображения рассчитанной цены с анимацией
function displayCalculatedPrice(price) {
    const priceElement = document.getElementById('calculatedPrice');
    
    // Сначала добавляем плейсхолдер с анимацией
    priceElement.innerHTML = `<div class="placeholder-animation"><span>—</span></div>`;
    
    // Затем с задержкой показываем фактическую цену
    setTimeout(() => {
        priceElement.textContent = price;
        
        // Добавляем анимацию числа
        priceElement.classList.add('price-animated');
        
        // Удаляем анимацию через некоторое время
        setTimeout(() => {
            priceElement.classList.remove('price-animated');
        }, 1000);
    }, 800);
    
    // Обновляем список преимуществ с анимацией
    animateBenefitsList();
}

// Анимация списка преимуществ
function animateBenefitsList() {
    const benefitItems = document.querySelectorAll('.benefits-item');
    
    benefitItems.forEach((item, index) => {
        // Сначала скрываем все элементы
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        // Затем с задержкой показываем
        setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 * (index + 1));
    });
}