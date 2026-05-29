// data.js - Тестовые данные для демонстрации функционала
class TestDataManager {
    constructor() {
        console.log('TestDataManager инициализирован');
        this.initTestData();
    }

    initTestData() {
        // Проверяем, нужно ли создавать тестовые данные
        if (!localStorage.getItem('test_data_created')) {
            console.log('Создаем тестовые данные...');
            this.createTestPurchases();
            this.createTestReviews();
            this.createTestAppointments();
            localStorage.setItem('test_data_created', 'true');
            console.log('Тестовые данные созданы успешно');
        } else {
            console.log('Тестовые данные уже существуют');
        }
    }

    createTestPurchases() {
        console.log('Создаем тестовые покупки...');
        const purchases = {
            // Иван Смирнов (id: 101)
            101: [
                {
                    id: 1,
                    productId: 1,
                    productName: 'Протеин Gold Standard 2.27кг',
                    quantity: 1,
                    price: 4500,
                    total: 4500,
                    date: '2024-01-15T14:30:00',
                    status: 'completed'
                },
                {
                    id: 2,
                    productId: 3,
                    productName: 'Креатин моногидрат',
                    quantity: 1,
                    price: 1200,
                    total: 1200,
                    date: '2024-01-18T16:45:00',
                    status: 'completed'
                },
                {
                    id: 3,
                    productId: 5,
                    productName: 'L-карнитин 120 капсул',
                    quantity: 1,
                    price: 1800,
                    total: 1800,
                    date: '2024-01-20T11:20:00',
                    status: 'pending'
                }
            ],
            // Ольга Волкова (id: 102)
            102: [
                {
                    id: 4,
                    productId: 7,
                    productName: 'Йога-мат премиум',
                    quantity: 1,
                    price: 2500,
                    total: 2500,
                    date: '2024-01-12T09:15:00',
                    status: 'completed'
                },
                {
                    id: 5,
                    productId: 8,
                    productName: 'Бутылка для воды 750мл',
                    quantity: 2,
                    price: 800,
                    total: 1600,
                    date: '2024-01-16T13:40:00',
                    status: 'completed'
                }
            ],
            // Алексей Комаров (id: 103)
            103: [
                {
                    id: 6,
                    productId: 2,
                    productName: 'BCAA 5000 400г',
                    quantity: 2,
                    price: 3200,
                    total: 6400,
                    date: '2024-01-08T18:30:00',
                    status: 'completed'
                },
                {
                    id: 7,
                    productId: 4,
                    productName: 'Предтренировочный комплекс',
                    quantity: 1,
                    price: 2800,
                    total: 2800,
                    date: '2024-01-14T19:15:00',
                    status: 'completed'
                },
                {
                    id: 8,
                    productId: 6,
                    productName: 'Гейнер Serious Mass 5.4кг',
                    quantity: 1,
                    price: 5500,
                    total: 5500,
                    date: '2024-01-22T10:45:00',
                    status: 'pending'
                }
            ],
            // Елена Новикова (id: 104)
            104: [
                {
                    id: 9,
                    productId: 9,
                    productName: 'Полотенце для фитнеса',
                    quantity: 3,
                    price: 500,
                    total: 1500,
                    date: '2024-01-13T15:20:00',
                    status: 'completed'
                },
                {
                    id: 10,
                    productId: 10,
                    productName: 'Перчатки для тренировок',
                    quantity: 1,
                    price: 1200,
                    total: 1200,
                    date: '2024-01-19T17:30:00',
                    status: 'completed'
                }
            ],
            // Дмитрий Морозов (id: 105)
            105: [
                {
                    id: 11,
                    productId: 1,
                    productName: 'Протеин Gold Standard 2.27кг',
                    quantity: 3,
                    price: 4500,
                    total: 13500,
                    date: '2024-01-09T12:00:00',
                    status: 'completed'
                },
                {
                    id: 12,
                    productId: 11,
                    productName: 'Пояс для тяжелой атлетики',
                    quantity: 1,
                    price: 3500,
                    total: 3500,
                    date: '2024-01-17T20:15:00',
                    status: 'completed'
                },
                {
                    id: 13,
                    productId: 12,
                    productName: 'Эластичные бинты на колени',
                    quantity: 2,
                    price: 900,
                    total: 1800,
                    date: '2024-01-23T14:50:00',
                    status: 'pending'
                }
            ]
        };

        Object.keys(purchases).forEach(userId => {
            localStorage.setItem(`fitness_purchases_${userId}`, JSON.stringify(purchases[userId]));
        });
        console.log('Тестовые покупки созданы для пользователей:', Object.keys(purchases));
    }

    createTestReviews() {
        console.log('Создаем тестовые отзывы...');
        const reviews = {
            101: [
                {
                    id: 1,
                    productId: 1,
                    productName: 'Протеин Gold Standard 2.27кг',
                    rating: 5,
                    text: 'Отличный протеин! Вкус ванильного мороженого просто бомба. Растворяется без комочков, смешивается легко. За месяц использования прибавил 2кг чистой массы.',
                    date: '2024-01-20T10:30:00',
                    published: true
                },
                {
                    id: 2,
                    productId: 5,
                    productName: 'L-карнитин 120 капсул',
                    rating: 4,
                    text: 'Хороший L-карнитин, помогает при кардио тренировках. Чувствуется прилив энергии. Минус - капсулы довольно крупные.',
                    date: '2024-01-18T14:20:00',
                    published: true
                }
            ],
            102: [
                {
                    id: 3,
                    productId: 7,
                    productName: 'Йога-мат премиум',
                    rating: 5,
                    text: 'Прекрасный коврик для йоги! Не скользит, приятный на ощупь, достаточно толстый для комфортных занятий. Запах быстро выветрился.',
                    date: '2024-01-15T11:45:00',
                    published: true
                },
                {
                    id: 4,
                    productId: 8,
                    productName: 'Бутылка для воды 750мл',
                    rating: 3,
                    text: 'Бутылка удобная, но крышка протекает если не дожать до конца. Дизайн симпатичный.',
                    date: '2024-01-17T16:30:00',
                    published: true
                }
            ],
            103: [
                {
                    id: 5,
                    productId: 2,
                    productName: 'BCAA 5000 400г',
                    rating: 5,
                    text: 'Лучшие BCAA на рынке! Принимаю во время тренировки, действительно уменьшают усталость и ускоряют восстановление. Вкус лимона освежающий.',
                    date: '2024-01-10T19:15:00',
                    published: true
                },
                {
                    id: 6,
                    productId: 4,
                    productName: 'Предтренировочный комплекс',
                    rating: 4,
                    text: 'Хороший предтреник, дает энергию и фокус. Минус - может вызывать покалывание у чувствительных людей.',
                    date: '2024-01-16T20:45:00',
                    published: true
                }
            ],
            104: [
                {
                    id: 7,
                    productId: 9,
                    productName: 'Полотенце для фитнеса',
                    rating: 5,
                    text: 'Отличные полотенца! Быстро впитывают влагу, не линяют после стирки. Размер идеальный для тренировок.',
                    date: '2024-01-14T13:10:00',
                    published: true
                },
                {
                    id: 8,
                    productId: 10,
                    productName: 'Перчатки для тренировок',
                    rating: 2,
                    text: 'Разочарован. Швы начали расходиться после двух недель использования. За такую цену ожидал лучшего качества.',
                    date: '2024-01-21T18:25:00',
                    published: false
                }
            ],
            105: [
                {
                    id: 9,
                    productId: 1,
                    productName: 'Протеин Gold Standard 2.27кг',
                    rating: 5,
                    text: 'Пользуюсь этим протеином уже несколько лет. Качество стабильно высокое. Шоколадный вкус - самый лучший!',
                    date: '2024-01-12T15:40:00',
                    published: true
                },
                {
                    id: 10,
                    productId: 11,
                    productName: 'Пояс для тяжелой атлетики',
                    rating: 5,
                    text: 'Отличный пояс! Хорошо поддерживает спину при работе с большими весами. Материал качественный, регулируется легко.',
                    date: '2024-01-19T21:00:00',
                    published: true
                }
            ]
        };

        Object.keys(reviews).forEach(userId => {
            localStorage.setItem(`fitness_reviews_${userId}`, JSON.stringify(reviews[userId]));
        });
        console.log('Тестовые отзывы созданы для пользователей:', Object.keys(reviews));
    }

    createTestAppointments() {
        console.log('Создаем тестовые записи на тренировки...');
        const appointments = {
            101: [
                {
                    id: 1,
                    trainerId: 1,
                    trainerName: 'Алексей Петров',
                    program: 'Силовая тренировка (грудь, трицепс)',
                    date: '2024-01-25T19:00:00',
                    time: '19:00',
                    status: 'confirmed',
                    notes: 'Работа над жимом лежа'
                },
                {
                    id: 2,
                    trainerId: 1,
                    trainerName: 'Алексей Петров',
                    program: 'Силовая тренировка (спина, бицепс)',
                    date: '2024-01-27T19:00:00',
                    time: '19:00',
                    status: 'pending',
                    notes: ''
                },
                {
                    id: 3,
                    trainerId: 1,
                    trainerName: 'Алексей Петров',
                    program: 'Силовая тренировка (ноги)',
                    date: '2024-01-22T18:30:00',
                    time: '18:30',
                    status: 'completed',
                    notes: 'Приседания со штангой, выпады'
                }
            ],
            102: [
                {
                    id: 4,
                    trainerId: 3,
                    trainerName: 'Дмитрий Сидоров',
                    program: 'Йога для начинающих',
                    date: '2024-01-24T09:00:00',
                    time: '09:00',
                    status: 'confirmed',
                    notes: 'Утренняя практика'
                },
                {
                    id: 5,
                    trainerId: 3,
                    trainerName: 'Дмитрий Сидоров',
                    program: 'Стретчинг',
                    date: '2024-01-26T09:00:00',
                    time: '09:00',
                    status: 'pending',
                    notes: ''
                },
                {
                    id: 6,
                    trainerId: 3,
                    trainerName: 'Дмитрий Сидоров',
                    program: 'Йога среднего уровня',
                    date: '2024-01-19T10:00:00',
                    time: '10:00',
                    status: 'completed',
                    notes: 'Практика балансовых асан'
                }
            ],
            103: [
                {
                    id: 7,
                    trainerId: 4,
                    trainerName: 'Екатерина Козлова',
                    program: 'Интервальная кардио тренировка',
                    date: '2024-01-26T20:00:00',
                    time: '20:00',
                    status: 'confirmed',
                    notes: 'HIIT тренировка'
                },
                {
                    id: 8,
                    trainerId: 4,
                    trainerName: 'Екатерина Козлова',
                    program: 'Жиросжигающая тренировка',
                    date: '2024-01-23T19:30:00',
                    time: '19:30',
                    status: 'completed',
                    notes: 'Работа над выносливостью'
                }
            ],
            104: [
                {
                    id: 9,
                    trainerId: 6,
                    trainerName: 'Анна Николаева',
                    program: 'Zumba фитнес',
                    date: '2024-01-25T10:00:00',
                    time: '10:00',
                    status: 'confirmed',
                    notes: 'Групповое занятие'
                },
                {
                    id: 10,
                    trainerId: 6,
                    trainerName: 'Анна Николаева',
                    program: 'Пилатес',
                    date: '2024-01-27T11:00:00',
                    time: '11:00',
                    status: 'pending',
                    notes: 'Индивидуальное занятие'
                },
                {
                    id: 11,
                    trainerId: 6,
                    trainerName: 'Анна Николаева',
                    program: 'Аэробика',
                    date: '2024-01-20T10:00:00',
                    time: '10:00',
                    status: 'completed',
                    notes: 'Групповое занятие'
                }
            ],
            105: [
                {
                    id: 12,
                    trainerId: 5,
                    trainerName: 'Сергей Васильев',
                    program: 'Тренировка на массу (грудь)',
                    date: '2024-01-26T19:00:00',
                    time: '19:00',
                    status: 'confirmed',
                    notes: 'Работа над объемом грудных'
                },
                {
                    id: 13,
                    trainerId: 5,
                    trainerName: 'Сергей Васильев',
                    program: 'Тренировка на массу (ноги)',
                    date: '2024-01-24T19:00:00',
                    time: '19:00',
                    status: 'confirmed',
                    notes: 'Приседания, жим ногами'
                },
                {
                    id: 14,
                    trainerId: 5,
                    trainerName: 'Сергей Васильев',
                    program: 'Тренировка на массу (спина)',
                    date: '2024-01-21T18:00:00',
                    time: '18:00',
                    status: 'completed',
                    notes: 'Тяги, подтягивания'
                }
            ]
        };

        Object.keys(appointments).forEach(userId => {
            localStorage.setItem(`fitness_appointments_${userId}`, JSON.stringify(appointments[userId]));
        });
        console.log('Тестовые записи созданы для пользователей:', Object.keys(appointments));
    }

    // Метод для принудительного обновления тестовых данных
    refreshTestData() {
        localStorage.removeItem('test_data_created');
        this.initTestData();
        console.log('Тестовые данные обновлены');
    }
}

// Инициализация тестовых данных при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (!window.testDataManager) {
        window.testDataManager = new TestDataManager();
    }
    
    // Добавляем кнопку обновления данных в админ-панель
    if (window.location.pathname.includes('admin.html')) {
        setTimeout(() => {
            const refreshBtn = document.createElement('button');
            refreshBtn.className = 'btn-secondary';
            refreshBtn.style.marginLeft = '10px';
            refreshBtn.innerHTML = '🔄 Обновить тестовые данные';
            refreshBtn.onclick = () => {
                if (window.testDataManager) {
                    window.testDataManager.refreshTestData();
                    alert('Тестовые данные обновлены! Обновите страницу для применения изменений.');
                }
            };
            
            const actionsDiv = document.querySelector('.form-actions');
            if (actionsDiv) {
                actionsDiv.appendChild(refreshBtn);
            }
        }, 1000);
    }
});