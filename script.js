// script.js - Полная версия с всеми функциями

// Simple and effective JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(10, 10, 10, 0.98)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(10, 10, 10, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            }
        }
    });

    // Auth Modal functionality (только закрытие, не открытие!)
    const authModal = document.getElementById('authModal');
    const closeAuth = document.getElementById('closeAuth');

    if (closeAuth && authModal) {
        closeAuth.addEventListener('click', function() {
            authModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    if (authModal) {
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                authModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    }

    // Appointment form handling
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show success modal
            const successModal = document.getElementById('successModal');
            if (successModal) {
                successModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Reset form
                this.reset();
            } else {
                alert('Заявка отправлена! Мы свяжемся с вами для подтверждения записи.');
            }
        });
    }

    // Close success modal
    const closeSuccess = document.getElementById('closeSuccess');
    const successModal = document.getElementById('successModal');
    
    if (closeSuccess && successModal) {
        closeSuccess.addEventListener('click', function() {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Simple animations on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.vp-appear').forEach(function(el) {
        observer.observe(el);
    });

    // Filter functionality
    initFilters();
    
    // Zone modals functionality
    initZoneModals();
});

// Filter functionality
function initFilters() {
    // Program filters
    const programButtons = document.querySelectorAll('.category-btn');
    const programCards = document.querySelectorAll('.program-card');
    
    if (programButtons.length > 0) {
        programButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                programButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                programCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }

    // Trainer filters
    const trainerButtons = document.querySelectorAll('.trainer-category-btn');
    const trainerCards = document.querySelectorAll('.trainer-card');
    
    if (trainerButtons.length > 0) {
        trainerButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                trainerButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const specialization = this.getAttribute('data-specialization');
                
                trainerCards.forEach(card => {
                    if (specialization === 'all' || card.getAttribute('data-specialization') === specialization) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Функционал для модальных окон зон
function initZoneModals() {
    // Открытие модальных окон
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const zone = this.getAttribute('data-zone');
            const modal = document.getElementById(zone + 'Modal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Закрытие модальных окон
    document.querySelectorAll('.close-zone').forEach(btn => {
        btn.addEventListener('click', function() {
            const zone = this.getAttribute('data-zone');
            const modal = document.getElementById(zone + 'Modal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Закрытие по клику на фон
    document.querySelectorAll('.zone-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.zone-modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
}

// Animation on load for index.html
if (document.querySelector('.fade-in')) {
    window.addEventListener('load', () => {
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    });
}

// Intersection Observer for animations
if (document.querySelector('.vp-appear')) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.vp-appear').forEach(el => {
        observer.observe(el);
    });
}

// Header hide on scroll for index.html
if (document.getElementById('header')) {
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;
    });
}
// Функционал для модальных окон тренеров
function initTrainerModals() {
    // Открытие модальных окон тренеров при клике на карточку
    document.querySelectorAll('.trainer-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Проверяем, не был ли клик по кнопке записи
            if (!e.target.closest('.appointment-btn')) {
                const trainer = this.getAttribute('data-trainer');
                const modal = document.getElementById(`trainerModal_${trainer}`);
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        });
    });

    // Открытие модального окна записи при клике на кнопку "Записаться"
    document.querySelectorAll('.appointment-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие события
            const trainer = this.getAttribute('data-trainer');
            const appointmentModal = document.getElementById('appointmentModal');
            const trainerSelect = document.getElementById('appointmentTrainerSelect');
            
            if (appointmentModal && trainerSelect) {
                // Устанавливаем выбранного тренера в селект
                trainerSelect.value = trainer;
                appointmentModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Открытие модального окна записи при клике на кнопку консультации
    const consultationBtn = document.getElementById('consultationBtn');
    if (consultationBtn) {
        consultationBtn.addEventListener('click', function() {
            const appointmentModal = document.getElementById('appointmentModal');
            if (appointmentModal) {
                appointmentModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Закрытие модальных окон тренеров
    document.querySelectorAll('.close-trainer').forEach(btn => {
        btn.addEventListener('click', function() {
            const trainer = this.getAttribute('data-trainer');
            const modal = document.getElementById(`trainerModal_${trainer}`);
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Закрытие модального окна записи
    const closeAppointment = document.getElementById('closeAppointment');
    if (closeAppointment) {
        closeAppointment.addEventListener('click', function() {
            const appointmentModal = document.getElementById('appointmentModal');
            if (appointmentModal) {
                appointmentModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Закрытие по клику на фон
    document.querySelectorAll('.trainer-modal, .appointment-modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.trainer-modal.active, .appointment-modal.active').forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });

    // Обработка формы записи
    const appointmentForm = document.getElementById('trainerAppointmentForm');
    const successModal = document.getElementById('successModal');
    const closeSuccess = document.getElementById('closeSuccess');

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Показываем состояние загрузки
            const submitBtn = this.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const loader = submitBtn.querySelector('.btn-loader');
            
            btnText.textContent = 'Отправка...';
            if (loader) loader.style.display = 'block';
            submitBtn.disabled = true;

            // Имитация отправки на сервер
            setTimeout(() => {
                if (successModal) {
                    successModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
                
                // Сбрасываем форму
                btnText.textContent = 'Отправить заявку';
                if (loader) loader.style.display = 'none';
                submitBtn.disabled = false;
                appointmentForm.reset();
                
                // Закрываем модальное окно записи
                const appointmentModal = document.getElementById('appointmentModal');
                if (appointmentModal) {
                    appointmentModal.classList.remove('active');
                }
            }, 2000);
        });
    }

    if (closeSuccess && successModal) {
        closeSuccess.addEventListener('click', function() {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initTrainerModals();
});
// Fix for appointment form clickability
function fixAppointmentFormClickability() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        console.log('Fixing appointment form clickability...');
        
        // Force enable all form elements
        const formElements = appointmentForm.querySelectorAll('input, select, textarea, button');
        
        formElements.forEach(element => {
            // Remove disabled and readonly attributes
            element.removeAttribute('disabled');
            element.removeAttribute('readonly');
            
            // Force styles for clickability
            element.style.pointerEvents = 'auto';
            element.style.cursor = element.tagName === 'SELECT' ? 'pointer' : 'text';
            element.style.opacity = '1';
            element.style.zIndex = '1000';
            element.style.position = 'relative';
            
            // Special handling for checkboxes
            if (element.type === 'checkbox') {
                element.style.cursor = 'pointer';
                element.style.width = '20px';
                element.style.height = '20px';
                element.style.margin = '0 10px 0 0';
                element.style.display = 'inline-block';
                element.style.verticalAlign = 'middle';
            }
            
            // Special handling for select dropdowns
            if (element.tagName === 'SELECT') {
                element.style.appearance = 'auto';
                element.style.webkitAppearance = 'menulist';
                element.style.mozAppearance = 'menulist';
            }
            
            // Add event listeners to debug
            element.addEventListener('click', function(e) {
                console.log(`Clicked on: ${this.id || this.name || this.tagName}`);
                e.stopPropagation();
            });
            
            element.addEventListener('focus', function() {
                console.log(`Focused: ${this.id || this.name || this.tagName}`);
                this.style.borderColor = '#FFDE00';
                this.style.boxShadow = '0 0 0 2px rgba(255, 222, 0, 0.2)';
            });
            
            element.addEventListener('blur', function() {
                this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                this.style.boxShadow = 'none';
            });
        });
        
        // Also fix labels for checkboxes
        const checkboxLabels = appointmentForm.querySelectorAll('.goal-checkbox, .agreement-checkbox');
        checkboxLabels.forEach(label => {
            label.style.cursor = 'pointer';
            label.style.pointerEvents = 'auto';
            label.style.position = 'relative';
            label.style.zIndex = '1000';
            
            // Make the entire label clickable
            label.addEventListener('click', function(e) {
                const checkbox = this.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    console.log(`Checkbox ${checkbox.name} toggled to: ${checkbox.checked}`);
                    
                    // Trigger change event
                    const event = new Event('change', { bubbles: true });
                    checkbox.dispatchEvent(event);
                }
                e.stopPropagation();
            });
        });
        
        console.log('Appointment form fixed. Total elements:', formElements.length);
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on appointment page
    if (window.location.pathname.includes('appointment.html')) {
        // Fix immediately
        fixAppointmentFormClickability();
        
        // Fix again after a short delay to catch any dynamically added elements
        setTimeout(fixAppointmentFormClickability, 500);
        setTimeout(fixAppointmentFormClickability, 1000);
        setTimeout(fixAppointmentFormClickability, 2000);
    }
});

// Also run when auth state changes (user logs in/out)
if (window.authManager) {
    const originalUpdateUI = window.authManager.updateUI;
    window.authManager.updateUI = function() {
        const result = originalUpdateUI.call(this);
        
        // Fix appointment form if we're on that page
        if (window.location.pathname.includes('appointment.html')) {
            setTimeout(fixAppointmentFormClickability, 100);
        }
        
        return result;
    };
}

// Функция для обработки параметров тренеров в URL
function handleTrainerParameter() {
    const urlParams = new URLSearchParams(window.location.search);
    const trainer = urlParams.get('trainer');
    
    if (trainer && document.getElementById('trainerSelect')) {
        document.getElementById('trainerSelect').value = trainer;
        console.log('Trainer selected from URL:', trainer);
    }
}

// Функция для улучшения кликабельности форм
function fixAppointmentFormClickability() {
    const appointmentForm = document.getElementById('appointmentForm');
    
    if (appointmentForm) {
        console.log('Fixing appointment form clickability...');
        
        const formElements = appointmentForm.querySelectorAll('input, select, textarea, button');
        
        formElements.forEach(element => {
            element.removeAttribute('disabled');
            element.removeAttribute('readonly');
            
            element.style.pointerEvents = 'auto';
            element.style.cursor = element.tagName === 'SELECT' ? 'pointer' : 'text';
            element.style.opacity = '1';
            element.style.zIndex = '1000';
            element.style.position = 'relative';
        });
        
        console.log('Appointment form fixed. Total elements:', formElements.length);
    }
}

// Вызываем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('appointment.html')) {
        handleTrainerParameter();
        fixAppointmentFormClickability();
        
        // Фикс повторно через небольшие интервалы
        setTimeout(fixAppointmentFormClickability, 500);
        setTimeout(fixAppointmentFormClickability, 1000);
    }
});