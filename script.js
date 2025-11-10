// Основные переменные и инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех функций
    initNavigation();
    initPageTransitions();
    initLikeButtons();
    initServiceButtons();
    initContactForm();
    initScrollEffects();
    initModal();
    initAnimations();
});

// Навигация между страницами
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a, .btn[data-page]');
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinksContainer = document.querySelector('.nav-links');

    // Обработка кликов по навигации
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId);

                // Закрываем мобильное меню если открыто
                if (navLinksContainer.classList.contains('active')) {
                    navLinksContainer.classList.remove('active');
                }
            }
        });
    });

    // Мобильное меню
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function() {
            navLinksContainer.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Плавные переходы между страницами
function initPageTransitions() {
    // Показываем первую страницу при загрузке
    showPage('home');
}

function showPage(pageId) {
    // Скрыть все страницы
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Показать выбранную страницу с анимацией
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        setTimeout(() => {
            targetPage.classList.add('active');

            // Прокрутка к верху страницы
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Запуск анимаций для элементов на новой странице
            animatePageElements(targetPage);
        }, 50);
    }

    // Обновление активного состояния в навигации
    updateActiveNavLink(pageId);
}

function updateActiveNavLink(pageId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

// Кнопки лайков для котиков
function initLikeButtons() {
    const likeButtons = document.querySelectorAll('.like-btn');

    likeButtons.forEach(button => {
        // Загружаем сохраненные лайки из localStorage
        const catName = button.getAttribute('data-cat');
        const savedLikes = localStorage.getItem(`likes_${catName}`) || 0;
        const likeCount = button.querySelector('.like-count');
        likeCount.textContent = savedLikes;

        // Проверяем, лайкал ли пользователь этого котика
        const hasLiked = localStorage.getItem(`hasLiked_${catName}`);
        if (hasLiked) {
            button.classList.add('liked');
            button.querySelector('i').className = 'fas fa-heart';
        }

        button.addEventListener('click', function() {
            const catName = this.getAttribute('data-cat');
            const likeCount = this.querySelector('.like-count');
            let currentLikes = parseInt(likeCount.textContent);
            const hasLiked = localStorage.getItem(`hasLiked_${catName}`);

            if (hasLiked) {
                // Убираем лайк
                currentLikes--;
                likeCount.textContent = currentLikes;
                this.classList.remove('liked');
                this.querySelector('i').className = 'far fa-heart';
                localStorage.removeItem(`hasLiked_${catName}`);

                // Анимация убирания лайка
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            } else {
                // Добавляем лайк
                currentLikes++;
                likeCount.textContent = currentLikes;
                this.classList.add('liked');
                this.querySelector('i').className = 'fas fa-heart';
                localStorage.setItem(`hasLiked_${catName}`, 'true');

                // Анимация добавления лайка
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);

                // Создаем эффект "сердечко"
                createHeartEffect(this);
            }

            // Сохраняем количество лайков
            localStorage.setItem(`likes_${catName}`, currentLikes);
        });
    });
}

// Эффект появления сердечек при лайке
function createHeartEffect(button) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.style.position = 'absolute';
    heart.style.fontSize = '20px';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';

    const rect = button.getBoundingClientRect();
    heart.style.left = rect.left + rect.width / 2 + 'px';
    heart.style.top = rect.top + 'px';

    document.body.appendChild(heart);

    // Анимация сердечка
    const animation = heart.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: 'translateY(-50px) scale(1.5)', opacity: 0.7 },
        { transform: 'translateY(-100px) scale(0.5)', opacity: 0 }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });

    animation.onfinish = () => {
        document.body.removeChild(heart);
    };
}

// Кнопки услуг
function initServiceButtons() {
    const serviceButtons = document.querySelectorAll('.service-btn');

    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceName = this.getAttribute('data-service');

            // Анимация нажатия кнопки
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);

            // Показываем модальное окно
            showModal(
                `Запись на "${serviceName}"`,
                `Спасибо за интерес к услуге "${serviceName}"! Мы свяжемся с вами в ближайшее время для уточнения деталей.`
            );

            // Записываем в историю действий
            const actions = JSON.parse(localStorage.getItem('service_actions') || '[]');
            actions.push({
                service: serviceName,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('service_actions', JSON.stringify(actions));
        });
    });
}

// Форма обратной связи
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Получаем данные формы
            const formData = new FormData(this);
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Валидация
            if (!name || !email || !message) {
                showModal('Ошибка', 'Пожалуйста, заполните все поля формы.');
                return;
            }

            // Имитация отправки
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Показываем сообщение об успехе
                showModal('Сообщение отправлено!', `Спасибо, ${name}! Мы получили ваше сообщение и свяжемся с вами в ближайшее время.`);

                // Сбрасываем форму
                contactForm.reset();

                // Восстанавливаем кнопку
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Сохраняем в историю
                const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
                messages.push({
                    name: name,
                    email: email,
                    message: message,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('contact_messages', JSON.stringify(messages));
            }, 2000);
        });
    }
}

// Эффекты при скролле
function initScrollEffects() {
    const header = document.querySelector('header');

    window.addEventListener('scroll', function() {
        // Эффект прозрачности хедера
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Анимация появления элементов при скролле
        animateOnScroll();
    });
}

// Анимация элементов при скролле
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .contact-item');

    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Модальное окно
function initModal() {
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close-modal');

    if (modal && closeModal) {
        // Закрытие модального окна
        closeModal.addEventListener('click', hideModal);

        // Закрытие при клике вне окна
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal();
            }
        });

        // Закрытие по ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                hideModal();
            }
        });
    }
}

function showModal(title, text) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');

    if (modal && modalTitle && modalText) {
        modalTitle.textContent = title;
        modalText.textContent = text;
        modal.style.display = 'block';

        // Автоматическое закрытие через 5 секунд для успешных сообщений
        if (title.includes('отправлено') || title.includes('Спасибо')) {
            setTimeout(hideModal, 5000);
        }
    }
}

function hideModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Анимации при загрузке страницы
function initAnimations() {
    // Задержка для начальной анимации
    setTimeout(() => {
        animatePageElements(document.querySelector('.page.active'));
    }, 500);
}

function animatePageElements(page) {
    const elements = page.querySelectorAll('.service-card, .portfolio-item, .contact-item, .about');

    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// Дополнительные эффекты для улучшения UX
function initAdditionalEffects() {
    // Эффект параллакса для героя
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }

    // Случайное мурлыкание при наведении на котиков
    const catImages = document.querySelectorAll('.portfolio-img img, .about-img img');
    catImages.forEach(img => {
        img.addEventListener('mouseenter', function() {
            // Случайное воспроизведение звука мурлыкания (только если пользователь взаимодействовал со страницей)
            if (document.querySelector('body').classList.contains('user-interacted')) {
                playPurrSound();
            }
        });
    });

    // Отмечаем, что пользователь взаимодействовал со страницей
    document.addEventListener('click', function() {
        document.querySelector('body').classList.add('user-interacted');
    });
}

// Воспроизведение звука мурлыкания (опционально)
function playPurrSound() {
    // В реальном проекте здесь был бы код для воспроизведения звука
    console.log('Мурррр... 🐱');
}

// Анимация для логотипа
function initLogoAnimation() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            const pawIcon = this.querySelector('.fa-paw');
            pawIcon.style.transform = 'rotate(15deg) scale(1.2)';
            setTimeout(() => {
                pawIcon.style.transform = 'rotate(0) scale(1)';
            }, 300);
        });
    }
}

// Инициализация дополнительных эффектов
initAdditionalEffects();
initLogoAnimation();

// Анимация для социальных иконок
const socialIcons = document.querySelectorAll('.social-links a');
socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) rotate(5deg)';
    });

    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0)';
    });
});

// Эффект печатной машинки для заголовка
function initTypewriterEffect() {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;

        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

    // Запускаем эффект только если страница загружена и видима
    setTimeout(typeWriter, 1000);
    }
}

// Запускаем эффект печатной машинки
initTypewriterEffect();