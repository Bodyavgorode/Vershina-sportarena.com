// shop.js - Функционал магазина и корзины с модальными окнами товаров

class ShopManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('fitness_cart')) || [];
        this.orders = JSON.parse(localStorage.getItem('fitness_orders')) || [];
        this.currentProductId = null;
        this.products = {
            'whey-protein': { 
                name: 'Whey Protein', 
                brand: 'Optimum Nutrition', 
                price: 3490, 
                category: 'protein',
                oldPrice: 4200,
                description: '100% изолят сывороточного протеина премиум-класса. Идеален для быстрого восстановления и роста мышечной массы после тренировок. Низкое содержание жиров и углеводов, высокий процент белка (24г на порцию). Подходит для набора мышечной массы и похудения.',
                reviews: [
                    {
                        userId: 2,
                        userName: 'Александр Петров',
                        rating: 5,
                        text: 'Отличный протеин! Растворяется без комочков, приятный вкус. За месяц приема +2кг сухой массы. Рекомендую!',
                        date: '2024-01-15'
                    },
                    {
                        userId: 3,
                        userName: 'Мария Сидорова',
                        rating: 4,
                        text: 'Хорошее качество за свои деньги. Вкус ванили натуральный, не приторный. Единственное - иногда образовываются комочки, нужно хорошо взбалтывать.',
                        date: '2024-01-10'
                    },
                    {
                        userId: 4,
                        userName: 'Дмитрий Козлов',
                        rating: 5,
                        text: 'Пользуюсь уже полгода. Лучшее соотношение цена/качество на рынке. Результаты заметны уже через месяц регулярного приема.',
                        date: '2024-01-05'
                    }
                ]
            },
            'protein-bar': { 
                name: 'Protein Bar', 
                brand: 'Quest Nutrition', 
                price: 180, 
                category: 'bars',
                description: 'Высокобелковый батончик с низким содержанием углеводов и сахара. Идеальный перекус для поддержания диеты. 20г белка, всего 4г чистых углеводов на батончик. Доступен в трех вкусах: шоколадный брауни, ванильный миндаль, клубничный чизкейк.',
                reviews: [
                    {
                        userId: 5,
                        userName: 'Екатерина Волкова',
                        rating: 5,
                        text: 'Лучшие белковые батончики! Вкус как у настоящего десерта, но без чувства вины. Беру всегда с собой на работу.',
                        date: '2024-01-12'
                    },
                    {
                        userId: 6,
                        userName: 'Игорь Николаев',
                        rating: 4,
                        text: 'Удобно брать с собой в зал. Насыщает надолго. Шоколадный брауни - самый вкусный!',
                        date: '2024-01-08'
                    }
                ]
            },
            'bcaa-complex': { 
                name: 'BCAA Complex', 
                brand: 'MyProtein', 
                price: 2150, 
                category: 'amino',
                description: 'Комплекс аминокислот BCAA 2:1:1 для повышения выносливости и ускорения восстановления. Защищает мышцы от катаболизма во время тренировок. Без искусственных красителей и подсластителей. Со вкусом арбуза, лимонада и зеленого яблока.',
                reviews: [
                    {
                        userId: 7,
                        userName: 'Сергей Иванов',
                        rating: 5,
                        text: 'Отлично помогают восстановиться после тяжелых тренировок. Чувствую меньше крепатуры. Вкус арбуза очень приятный.',
                        date: '2024-01-14'
                    },
                    {
                        userId: 8,
                        userName: 'Анна Кузнецова',
                        rating: 4,
                        text: 'Пью во время тренировки. Действительно добавляет энергии. Вкус немного химический, но терпимо.',
                        date: '2024-01-06'
                    }
                ]
            },
            'shaker-pro': { 
                name: 'Шейкер Pro', 
                brand: 'BlenderBottle', 
                price: 890, 
                category: 'accessories',
                oldPrice: 1200,
                description: 'Профессиональный шейкер с системой смешивания BlenderBall. Не протекает, легко моется, удобен в использовании. Объем 700 мл. Материал - прочный пищевой пластик. Идеален для приготовления протеиновых коктейлей, гейнеров и BCAA.',
                reviews: [
                    {
                        userId: 9,
                        userName: 'Павел Смирнов',
                        rating: 5,
                        text: 'Лучший шейкер из всех что пробовал! Не течет, хорошо взбивает, удобно носить с собой.',
                        date: '2024-01-13'
                    },
                    {
                        userId: 10,
                        userName: 'Ольга Попova',
                        rating: 4,
                        text: 'Качественный, не пахнет пластиком. Шарик действительно хорошо размешивает протеин. Рекомендую.',
                        date: '2024-01-09'
                    }
                ]
            },
            'vitamin-d3': { 
                name: 'Vitamin D3', 
                brand: 'NOW Foods', 
                price: 1250, 
                category: 'vitamins',
                oldPrice: 1800,
                description: 'Высокодозированный витамин D3 (5000 МЕ) для поддержки иммунитета, костной системы и общего тонуса. Особенно важен в осенне-зимний период. В каждой капсуле - оптимальная дозировка для взрослого человека. Поддерживает здоровье костей, зубов и иммунной системы.',
                reviews: [
                    {
                        userId: 11,
                        userName: 'Николай Федоров',
                        rating: 5,
                        text: 'Принимаю всю зиму. Заметил, что стал меньше болеть. Качество на высоте, как всегда у NOW Foods.',
                        date: '2024-01-11'
                    }
                ]
            },
            'casein-protein': { 
                name: 'Casein Protein', 
                brand: 'Gold Standard', 
                price: 4200, 
                category: 'protein',
                description: 'Медленный протеин для длительного насыщения мышц аминокислотами. Идеален для приема перед сном. Обеспечивает мышцы питанием в течение 7-8 часов. Помогает сохранить мышечную массу во время сна и при длительных перерывах между приемами пищи.',
                reviews: [
                    {
                        userId: 12,
                        userName: 'Артем Васильев',
                        rating: 5,
                        text: 'Пью перед сном. Утром просыпаюсь без чувства голода. Мышцы действительно не "горят" ночью.',
                        date: '2024-01-07'
                    },
                    {
                        userId: 13,
                        userName: 'Виктория Новикова',
                        rating: 4,
                        text: 'Хороший казеин, но густеет очень быстро. Нужно выпивать сразу после приготовления.',
                        date: '2024-01-04'
                    }
                ]
            },
            'l-glutamine': { 
                name: 'L-Glutamine', 
                brand: 'BSN', 
                price: 1800, 
                category: 'amino',
                description: 'Чистая L-глютаминовая кислота для восстановления и укрепления иммунитета. Ускоряет заживление микротравм мышц после тренировок. Поддерживает здоровье ЖКТ и иммунной системы. Особенно важен при интенсивных тренировках.',
                reviews: [
                    {
                        userId: 14,
                        userName: 'Константин Морозов',
                        rating: 5,
                        text: 'Отлично помогает восстанавливаться. После тяжелых тренировок почти нет крепатуры.',
                        date: '2024-01-03'
                    }
                ]
            },
            'energy-bar': { 
                name: 'Energy Bar', 
                brand: 'Grenade', 
                price: 220, 
                category: 'bars',
                description: 'Энергетический батончик с высоким содержанием белка и клетчатки. Идеален для перекуса перед тренировкой или в течение дня. 23г белка, 1г сахара. Вкусы: белый шоколад, карамель, арахисовая паста.',
                reviews: [
                    {
                        userId: 15,
                        userName: 'Татьяна Орлова',
                        rating: 5,
                        text: 'Вкуснейший батончик! Спасает когда хочется сладкого на диете. Арахисовая паста - просто бомба!',
                        date: '2024-01-02'
                    },
                    {
                        userId: 16,
                        userName: 'Роман Захаров',
                        rating: 4,
                        text: 'Хороший энергетический заряд перед тренировкой. Не тяжелый для желудка.',
                        date: '2024-01-01'
                    }
                ]
            }
        };
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.updateCartCount();
        this.loadCartItems();
        this.setupCheckoutForm();
        this.setupOrderHistoryButton();
        this.setupProductCards();
        this.setupProductModal();
        this.setupAdminIntegration();
        this.setupTestData(); // Добавляем тестовые заказы для демонстрации
    }

    setupTestData() {
        // Создаем тестовые заказы, если их нет
        if (this.orders.length === 0) {
            const testOrders = [
                {
                    id: 'VS-000001',
                    userId: 101,
                    userName: 'Иван Смирнов',
                    userPhone: '+7 (999) 111-22-33',
                    userEmail: 'ivan@example.com',
                    date: '2024-01-15T14:30:00',
                    items: [
                        { id: 'whey-protein', name: 'Whey Protein', brand: 'Optimum Nutrition', price: 3490, quantity: 1 },
                        { id: 'protein-bar', name: 'Protein Bar', brand: 'Quest Nutrition', price: 180, quantity: 3 }
                    ],
                    subtotal: 4030,
                    shipping: 300,
                    total: 4330,
                    deliveryMethod: 'delivery',
                    deliveryAddress: 'г. Москва, ул. Тверская, д. 10, кв. 25',
                    comment: 'Пожалуйста, позвоните за час до доставки',
                    status: 'completed'
                },
                {
                    id: 'VS-000002',
                    userId: 102,
                    userName: 'Ольга Волкова',
                    userPhone: '+7 (999) 222-33-44',
                    userEmail: 'olga@example.com',
                    date: '2024-01-18T16:45:00',
                    items: [
                        { id: 'shaker-pro', name: 'Шейкер Pro', brand: 'BlenderBottle', price: 890, quantity: 1 },
                        { id: 'vitamin-d3', name: 'Vitamin D3', brand: 'NOW Foods', price: 1250, quantity: 2 }
                    ],
                    subtotal: 3390,
                    shipping: 0,
                    total: 3390,
                    deliveryMethod: 'pickup',
                    deliveryAddress: 'Самовывоз из клуба',
                    comment: '',
                    status: 'completed'
                },
                {
                    id: 'VS-000003',
                    userId: 103,
                    userName: 'Алексей Комаров',
                    userPhone: '+7 (999) 333-44-55',
                    userEmail: 'alexey@example.com',
                    date: '2024-01-22T10:15:00',
                    items: [
                        { id: 'bcaa-complex', name: 'BCAA Complex', brand: 'MyProtein', price: 2150, quantity: 1 },
                        { id: 'l-glutamine', name: 'L-Glutamine', brand: 'BSN', price: 1800, quantity: 1 },
                        { id: 'energy-bar', name: 'Energy Bar', brand: 'Grenade', price: 220, quantity: 5 }
                    ],
                    subtotal: 5250,
                    shipping: 300,
                    total: 5550,
                    deliveryMethod: 'delivery',
                    deliveryAddress: 'г. Москва, Ленинский проспект, д. 45, кв. 12',
                    comment: 'Оставьте у двери',
                    status: 'shipped'
                }
            ];
            
            this.orders = testOrders;
            localStorage.setItem('fitness_orders', JSON.stringify(testOrders));
            console.log('Созданы тестовые заказы');
        }
    }

    // Метод для отображения истории заказов на отдельной странице
    displayOrderHistory(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Проверяем авторизацию пользователя
        if (!window.authManager || !authManager.currentUser) {
            container.innerHTML = `
                <div class="no-orders" style="text-align: center; padding: 3rem;">
                    <h3>Войдите в аккаунт</h3>
                    <p>Для просмотра истории заказов необходимо авторизоваться</p>
                    <button class="btn-primary" id="loginFromHistory" style="margin-top: 1rem;">
                        Войти в аккаунт
                    </button>
                </div>
            `;
            
            const loginBtn = container.querySelector('#loginFromHistory');
            if (loginBtn) {
                loginBtn.addEventListener('click', () => {
                    const authModal = document.getElementById('authModal');
                    if (authModal) {
                        authModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                });
            }
            return;
        }

        const userId = authManager.currentUser.id;
        
        // Показываем загрузку
        container.innerHTML = `
            <div class="loading-orders" style="text-align: center; padding: 3rem;">
                <div class="loading-spinner"></div>
                <p>Загрузка истории заказов...</p>
            </div>
        `;
        
        // Загружаем историю покупок пользователя
        setTimeout(() => {
            const userPurchases = JSON.parse(localStorage.getItem(`fitness_purchases_${userId}`)) || [];
            
            if (userPurchases.length === 0) {
                container.innerHTML = `
                    <div class="no-orders" style="text-align: center; padding: 3rem;">
                        <h3>Заказов пока нет</h3>
                        <p>Вы еще не сделали ни одного заказа</p>
                        <a href="shop.html" class="btn-primary" style="margin-top: 1rem;">
                            Перейти в магазин
                        </a>
                    </div>
                `;
                return;
            }

            // Группируем покупки по заказам
            const ordersMap = {};
            userPurchases.forEach(purchase => {
                const orderId = purchase.orderId || `ORD-${purchase.date.split('T')[0]}`;
                
                if (!ordersMap[orderId]) {
                    ordersMap[orderId] = {
                        id: orderId,
                        date: purchase.date,
                        items: [],
                        total: 0,
                        status: purchase.status
                    };
                }
                
                ordersMap[orderId].items.push(purchase);
                ordersMap[orderId].total += purchase.total;
            });

            // Преобразуем в массив и сортируем по дате
            const userOrders = Object.values(ordersMap).sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            );

            let html = '';
            userOrders.forEach(order => {
                const orderDate = new Date(order.date);
                const formattedDate = orderDate.toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                const statusClass = `status-${order.status || 'completed'}`;
                const statusText = {
                    'pending': 'В обработке',
                    'processing': 'В процессе',
                    'shipped': 'Отправлен',
                    'delivered': 'Доставлен',
                    'cancelled': 'Отменен',
                    'completed': 'Завершен'
                }[order.status] || 'Завершен';
                
                html += `
                    <div class="order-history-card" data-order-id="${order.id}">
                        <div class="order-history-header">
                            <div>
                                <h3 class="text-accent">Заказ #${order.id}</h3>
                                <div class="order-history-date">${formattedDate}</div>
                            </div>
                            <span class="order-status-badge ${statusClass}">${statusText}</span>
                        </div>
                        
                        <div class="order-history-details">
                            <div class="order-detail-item">
                                <span>Сумма заказа:</span>
                                <span class="order-total-amount">${order.total.toLocaleString()} ₽</span>
                            </div>
                            <div class="order-detail-item">
                                <span>Товаров:</span>
                                <span>${order.items.length}</span>
                            </div>
                        </div>
                        
                        <div class="order-history-items">
                            <h4>Состав заказа:</h4>
                            ${order.items.map(item => `
                                <div class="order-item-row">
                                    <div class="order-item-info">
                                        <span class="order-item-emoji">${this.getProductEmoji(item.productId)}</span>
                                        <span>${item.productName}</span>
                                    </div>
                                    <div class="order-item-quantity">${item.quantity} × ${item.price.toLocaleString()} ₽</div>
                                    <div class="order-item-total">${item.total.toLocaleString()} ₽</div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="order-history-footer">
                            <div class="order-reorder-btn">
                                <button class="btn-secondary reorder-btn" data-order-id="${order.id}">
                                    Повторить заказ
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
            
            // Добавляем обработчики для кнопок "Повторить заказ"
            container.querySelectorAll('.reorder-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const orderId = e.target.getAttribute('data-order-id');
                    this.reorderFromHistory(orderId, userId);
                });
            });
        }, 500);
    }

    // Новый метод для повторения заказа из истории
    reorderFromHistory(orderId, userId) {
        const userPurchases = JSON.parse(localStorage.getItem(`fitness_purchases_${userId}`)) || [];
        const orderItems = userPurchases.filter(purchase => purchase.orderId === orderId);
        
        if (orderItems.length === 0) {
            this.showNotification('Не удалось найти заказ для повторения', true);
            return;
        }
        
        // Очищаем корзину
        this.cart = [];
        
        // Добавляем все товары из заказа в корзину
        orderItems.forEach(item => {
            this.addToCart(item.productId, item.quantity);
        });
        
        this.showNotification('Товары из заказа добавлены в корзину!');
        
        // Перенаправляем в корзину
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1500);
    }

    setupAdminIntegration() {
        // Создаем глобальные методы для работы админки с магазином
        window.shopAdmin = {
            // Получить все заказы пользователя
            getUserOrders: (userId) => {
                return this.orders.filter(order => order.userId === userId);
            },
            
            // Получить все отзывы пользователя
            getUserReviews: (userId) => {
                const userReviews = [];
                for (const productId in this.products) {
                    const product = this.products[productId];
                    if (product.reviews && Array.isArray(product.reviews)) {
                        product.reviews.forEach(review => {
                            if (review.userId === userId) {
                                userReviews.push({
                                    productId: productId,
                                    productName: product.name,
                                    productBrand: product.brand,
                                    ...review
                                });
                            }
                        });
                    }
                }
                return userReviews;
            },
            
            // Добавить заказ из админки
            addOrderFromAdmin: (orderData) => {
                const order = {
                    id: 'ADM-' + Date.now().toString().slice(-6),
                    ...orderData,
                    date: new Date().toISOString(),
                    status: 'completed',
                    adminCreated: true
                };
                
                this.orders.push(order);
                localStorage.setItem('fitness_orders', JSON.stringify(this.orders));
                
                // Отправляем событие
                const event = new CustomEvent('adminOrderCreated', {
                    detail: order
                });
                window.dispatchEvent(event);
                
                return order;
            },
            
            // Обновить статус заказа
            updateOrderStatus: (orderId, newStatus) => {
                const orderIndex = this.orders.findIndex(order => order.id === orderId);
                if (orderIndex !== -1) {
                    this.orders[orderIndex].status = newStatus;
                    localStorage.setItem('fitness_orders', JSON.stringify(this.orders));
                    
                    // Отправляем событие
                    const event = new CustomEvent('orderStatusUpdated', {
                        detail: {
                            orderId: orderId,
                            status: newStatus
                        }
                    });
                    window.dispatchEvent(event);
                    
                    return true;
                }
                return false;
            },
            
            // Добавить отзыв из админки
            addReviewFromAdmin: (userId, productId, reviewData) => {
                const product = this.products[productId];
                if (!product) return false;
                
                if (!product.reviews) {
                    product.reviews = [];
                }
                
                const review = {
                    userId: userId,
                    userName: reviewData.userName || 'Администратор',
                    rating: reviewData.rating || 5,
                    text: reviewData.text || '',
                    date: new Date().toISOString().split('T')[0],
                    adminCreated: true
                };
                
                product.reviews.unshift(review);
                this.saveProducts();
                
                // Отправляем событие
                const event = new CustomEvent('adminReviewCreated', {
                    detail: {
                        productId: productId,
                        review: review
                    }
                });
                window.dispatchEvent(event);
                
                return true;
            },
            
            // Получить статистику магазина
            getShopStats: () => {
                const totalOrders = this.orders.length;
                const totalRevenue = this.orders.reduce((sum, order) => sum + (order.total || 0), 0);
                const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
                
                const productStats = {};
                for (const productId in this.products) {
                    const product = this.products[productId];
                    const productOrders = this.orders.filter(order => 
                        order.items && order.items.some(item => item.id === productId)
                    );
                    
                    productStats[productId] = {
                        name: product.name,
                        orders: productOrders.length,
                        revenue: productOrders.reduce((sum, order) => {
                            const item = order.items.find(i => i.id === productId);
                            return sum + (item ? item.price * item.quantity : 0);
                        }, 0)
                    };
                }
                
                return {
                    totalOrders,
                    totalRevenue,
                    averageOrderValue,
                    productStats
                };
            }
        };
    }

    setupEventListeners() {
        // Фильтрация товаров
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('shop-category-btn')) {
                document.querySelectorAll('.shop-category-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const category = e.target.getAttribute('data-category');
                this.filterProducts(category);
            }
        });

        // Оформление заказа
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.prepareCheckoutForm();
                this.openCheckoutModal();
            });
        }

        // Закрытие модального окна оформления
        const closeCheckout = document.getElementById('closeCheckout');
        if (closeCheckout) {
            closeCheckout.addEventListener('click', () => {
                this.closeCheckoutModal();
            });
        }

        // Обработка формы оформления
        const checkoutForm = document.getElementById('checkoutForm');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processOrder();
            });
        }

        // Продолжить покупки после успешного заказа
        const continueShopping = document.getElementById('continueShopping');
        if (continueShopping) {
            continueShopping.addEventListener('click', () => {
                this.closeSuccessModal();
                window.location.href = 'shop.html';
            });
        }

        // Изменение способа доставки
        const deliveryOptions = document.querySelectorAll('input[name="delivery"]');
        deliveryOptions.forEach(option => {
            option.addEventListener('change', () => {
                this.updateOrderSummary();
                this.updateDeliveryAddressField();
            });
        });

        // Закрытие по клику на фон
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) {
            checkoutModal.addEventListener('click', (e) => {
                if (e.target === checkoutModal) {
                    this.closeCheckoutModal();
                }
            });
        }

        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.addEventListener('click', (e) => {
                if (e.target === successModal) {
                    this.closeSuccessModal();
                }
            });
        }

        // История заказов
        const orderHistoryBtn = document.getElementById('orderHistoryBtn');
        if (orderHistoryBtn) {
            orderHistoryBtn.addEventListener('click', () => {
                this.openOrderHistoryModal();
            });
        }

        const closeHistoryModal = document.getElementById('closeHistoryModal');
        if (closeHistoryModal) {
            closeHistoryModal.addEventListener('click', () => {
                this.closeOrderHistoryModal();
            });
        }

        const orderHistoryModal = document.getElementById('orderHistoryModal');
        if (orderHistoryModal) {
            orderHistoryModal.addEventListener('click', (e) => {
                if (e.target === orderHistoryModal) {
                    this.closeOrderHistoryModal();
                }
            });
        }

        // Закрытие по ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProductModal();
            }
        });
    }

    setupProductCards() {
        // Делаем карточки товаров кликабельными с использованием делегирования событий
        document.addEventListener('click', (e) => {
            // Проверяем, кликнули ли на карточку товара (но не на кнопку "В корзину")
            const card = e.target.closest('.product-card');
            if (card && !e.target.closest('.add-to-cart')) {
                const productId = card.querySelector('.add-to-cart')?.getAttribute('data-product');
                if (productId) {
                    this.openProductModal(productId);
                }
            }
            
            // Обработка кнопок "В корзину"
            if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
                e.stopPropagation();
                const btn = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
                const productId = btn.getAttribute('data-product');
                if (productId) {
                    this.addToCart(productId);
                }
            }
        });
    }

    setupProductModal() {
        const productModal = document.getElementById('productModal');
        const closeModal = document.getElementById('closeProductModal');
        
        if (closeModal && productModal) {
            closeModal.addEventListener('click', () => {
                this.closeProductModal();
            });
        }

        if (productModal) {
            productModal.addEventListener('click', (e) => {
                if (e.target === productModal) {
                    this.closeProductModal();
                }
            });
        }

        // Обработка добавления в корзину из модального окна
        const addToCartBtn = document.getElementById('addToCartFromModal');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                if (this.currentProductId) {
                    this.addToCart(this.currentProductId);
                    this.showNotification('Товар добавлен в корзину!');
                }
            });
        }

        // Обработка рейтинга звездами
        const ratingStars = document.getElementById('ratingStars');
        if (ratingStars) {
            ratingStars.addEventListener('click', (e) => {
                if (e.target.tagName === 'SPAN') {
                    const rating = parseInt(e.target.getAttribute('data-rating'));
                    this.setRating(rating);
                }
            });
        }

        // Обработка формы отзыва
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitReview();
            });
        }
    }

    setupCheckoutForm() {
        // Автоматическое заполнение формы при открытии
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.prepareCheckoutForm();
            });
        }
    }

    setupOrderHistoryButton() {
        // Показываем кнопку истории только для авторизованных пользователей
        const orderHistoryBtn = document.getElementById('orderHistoryBtn');
        if (orderHistoryBtn) {
            if (window.authManager && authManager.currentUser) {
                orderHistoryBtn.style.display = 'flex';
                
                // Загружаем количество заказов пользователя
                const userId = authManager.currentUser.id;
                const userPurchases = JSON.parse(localStorage.getItem(`fitness_purchases_${userId}`)) || [];
                const orderCount = userPurchases.length;
                
                // Добавляем бейдж с количеством заказов
                let badge = orderHistoryBtn.querySelector('.order-count-badge');
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'order-count-badge';
                    orderHistoryBtn.appendChild(badge);
                }
                badge.textContent = orderCount;
                badge.style.display = orderCount > 0 ? 'flex' : 'none';
            } else {
                orderHistoryBtn.style.display = 'none';
            }
        }
    }

    updateDeliveryAddressField() {
        const deliveryAddress = document.getElementById('deliveryAddress');
        const deliveryMethod = document.querySelector('input[name="delivery"]:checked');
        
        if (!deliveryAddress) return;
        
        if (deliveryMethod && deliveryMethod.value === 'pickup') {
            // Самовывоз
            deliveryAddress.value = 'Самовывоз из клуба';
            deliveryAddress.readOnly = true;
            deliveryAddress.required = false;
            
            // Стилизация для недоступного поля
            deliveryAddress.style.background = 'rgba(255, 255, 255, 0.05)';
            deliveryAddress.style.cursor = 'not-allowed';
            deliveryAddress.style.color = 'var(--text-muted)';
            
            // Скрываем подсказку
            const addressHint = deliveryAddress.parentElement.querySelector('small');
            if (addressHint) addressHint.style.display = 'none';
        } else {
            // Доставка
            if (deliveryAddress.value === 'Самовывоз из клуба') {
                deliveryAddress.value = '';
            }
            deliveryAddress.readOnly = false;
            deliveryAddress.required = true;
            
            // Сбрасываем стили
            deliveryAddress.style.background = 'rgba(255, 255, 255, 0.1)';
            deliveryAddress.style.cursor = 'text';
            deliveryAddress.style.color = 'var(--text-primary)';
            
            // Показываем подсказку
            const addressHint = deliveryAddress.parentElement.querySelector('small');
            if (addressHint) addressHint.style.display = 'block';
        }
    }

    prepareCheckoutForm() {
        const checkoutName = document.getElementById('checkoutName');
        const checkoutPhone = document.getElementById('checkoutPhone');
        const checkoutEmail = document.getElementById('checkoutEmail');
        
        if (window.authManager && authManager.currentUser) {
            // Если пользователь авторизован, заполняем автоматически
            const user = authManager.currentUser;
            checkoutName.value = `${user.firstName} ${user.lastName}`;
            checkoutPhone.value = user.phone;
            checkoutEmail.value = user.email;
            
            // Делаем поля только для чтения
            checkoutName.readOnly = true;
            checkoutPhone.readOnly = true;
            checkoutEmail.readOnly = true;
            
            // Добавляем подсказки
            checkoutName.title = "Заполнено автоматически из профиля";
            checkoutPhone.title = "Заполнено автоматически из профиля";
            checkoutEmail.title = "Заполнено автоматически из профиля";
        } else {
            // Если не авторизован, очищаем поля
            checkoutName.value = '';
            checkoutPhone.value = '';
            checkoutEmail.value = '';
            
            // Разрешаем редактирование
            checkoutName.readOnly = false;
            checkoutPhone.readOnly = false;
            checkoutEmail.readOnly = false;
            
            // Убираем подсказки
            checkoutName.title = "";
            checkoutPhone.title = "";
            checkoutEmail.title = "";
        }
        
        // Обновляем поле адреса доставки в зависимости от выбранного способа
        this.updateDeliveryAddressField();
    }

    openProductModal(productId) {
        this.currentProductId = productId;
        const product = this.products[productId];
        if (!product) return;

        const modal = document.getElementById('productModal');
        if (!modal) return;

        // Заполняем информацию о товаре
        document.getElementById('productModalName').textContent = product.name;
        document.getElementById('productModalBrand').textContent = product.brand;
        document.getElementById('productModalPrice').textContent = product.price.toLocaleString() + ' ₽';
        
        const oldPrice = document.getElementById('productModalOldPrice');
        if (product.oldPrice) {
            oldPrice.textContent = product.oldPrice.toLocaleString() + ' ₽';
            oldPrice.style.display = 'inline';
        } else {
            oldPrice.style.display = 'none';
        }
        
        document.getElementById('productModalDescription').textContent = product.description || 'Описание отсутствует';
        
        // Устанавливаем изображение
        const modalImage = document.getElementById('productModalImage');
        modalImage.innerHTML = this.getProductEmoji(productId, true);
        
        // Настраиваем кнопку добавления в корзину
        const addToCartBtn = document.getElementById('addToCartFromModal');
        if (addToCartBtn) {
            addToCartBtn.setAttribute('data-product', productId);
            // Устанавливаем начальный текст кнопки
            addToCartBtn.textContent = 'Добавить в корзину';
        }
        
        // Загружаем отзывы
        this.loadProductReviews(product);
        
        // Проверяем может ли пользователь оставить отзыв
        this.checkReviewPermissions(productId);
        
        // Устанавливаем рейтинг по умолчанию
        this.setRating(5);
        
        // Сбрасываем форму отзыва
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.reset();
        }
        
        // Открываем модальное окно
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeProductModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            this.currentProductId = null;
        }
    }

    loadProductReviews(product) {
        const reviewsContainer = document.getElementById('productModalReviews');
        if (!reviewsContainer) return;

        const reviews = product.reviews || [];
        
        // Рассчитываем средний рейтинг
        const avgRating = reviews.length > 0 
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
            : 0;
        
        // Обновляем рейтинг в шапке
        const ratingElement = document.getElementById('productModalRating');
        if (ratingElement) {
            ratingElement.innerHTML = `
                ${this.getStarsHTML(avgRating)} 
                <span class="rating-value">${avgRating.toFixed(1)}</span> 
                (${reviews.length} ${this.getReviewWord(reviews.length)})
            `;
        }

        // Отображаем список отзывов
        if (reviews.length > 0) {
            reviewsContainer.innerHTML = reviews.map(review => `
                <div class="review-item" data-review-id="${review.userId}-${review.date}">
                    <div class="review-header">
                        <div class="review-user">
                            <div class="review-user-avatar">
                                ${this.getUserInitials(review.userName)}
                            </div>
                            <div class="review-user-info">
                                <h4>${review.userName}</h4>
                                <div class="review-date">${review.date}</div>
                            </div>
                        </div>
                        <div class="review-rating">
                            ${this.getStarsHTML(review.rating)}
                            ${review.adminCreated ? '<span class="admin-badge" title="Добавлено администратором">👑</span>' : ''}
                        </div>
                    </div>
                    <div class="review-text">${review.text}</div>
                </div>
            `).join('');
        } else {
            reviewsContainer.innerHTML = '<div class="no-reviews">Пока нет отзывов. Будьте первым!</div>';
        }
    }

    checkReviewPermissions(productId) {
        const addReviewSection = document.getElementById('addReviewSection');
        const reviewNotice = document.getElementById('reviewNotice');
        
        if (!addReviewSection || !reviewNotice) return;
        
        if (!window.authManager || !window.authManager.currentUser) {
            // Пользователь не авторизован
            addReviewSection.style.display = 'none';
            reviewNotice.style.display = 'block';
            reviewNotice.innerHTML = '<p>Чтобы оставить отзыв, необходимо <a href="#" id="loginToReview">войти в аккаунт</a> и приобрести данный товар.</p>';
            
            // Добавляем обработчик для ссылки входа
            const loginLink = reviewNotice.querySelector('#loginToReview');
            if (loginLink) {
                loginLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeProductModal();
                    
                    if (window.authManager) {
                        const authModal = document.getElementById('authModal');
                        if (authModal) {
                            authModal.classList.add('active');
                            document.body.style.overflow = 'hidden';
                        }
                    }
                });
            }
            return;
        }

        const userId = window.authManager.currentUser.id;
        const userPurchases = JSON.parse(localStorage.getItem(`fitness_purchases_${userId}`)) || [];
        const hasPurchased = userPurchases.some(purchase => purchase.productId === productId);

        if (hasPurchased) {
            // Пользователь покупал товар
            const product = this.products[productId];
            const hasReview = product.reviews?.some(review => review.userId === userId);
            
            if (hasReview) {
                addReviewSection.style.display = 'none';
                reviewNotice.innerHTML = '<p>Вы уже оставили отзыв на этот товар. Спасибо!</p>';
                reviewNotice.style.display = 'block';
            } else {
                addReviewSection.style.display = 'block';
                reviewNotice.style.display = 'none';
            }
        } else {
            // Пользователь не покупал товар
            addReviewSection.style.display = 'none';
            reviewNotice.innerHTML = '<p>Чтобы оставить отзыв, необходимо приобрести данный товар.</p>';
            reviewNotice.style.display = 'block';
        }
    }

    setRating(rating) {
        const ratingInput = document.getElementById('reviewRating');
        if (!ratingInput) return;
        
        ratingInput.value = rating;
        
        const stars = document.querySelectorAll('#ratingStars span');
        if (!stars) return;
        
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
                star.style.color = '#FFDE00';
            } else {
                star.classList.remove('active');
                star.style.color = '#666';
            }
        });
    }

    submitReview() {
        if (!this.currentProductId || !window.authManager || !window.authManager.currentUser) {
            this.showNotification('Ошибка: вы не авторизованы', true);
            return;
        }

        const rating = parseInt(document.getElementById('reviewRating').value);
        const text = document.getElementById('reviewText').value.trim();
        const userId = window.authManager.currentUser.id;
        const userName = `${window.authManager.currentUser.firstName} ${window.authManager.currentUser.lastName}`;

        if (!text) {
            this.showNotification('Пожалуйста, напишите текст отзыва', true);
            return;
        }

        // Создаем новый отзыв
        const newReview = {
            userId,
            userName,
            rating,
            text,
            date: new Date().toISOString().split('T')[0]
        };

        // Добавляем отзыв к товару
        if (!this.products[this.currentProductId].reviews) {
            this.products[this.currentProductId].reviews = [];
        }
        
        this.products[this.currentProductId].reviews.unshift(newReview);
        
        // Сохраняем товары в localStorage
        this.saveProducts();
        
        // Обновляем отображение отзывов
        this.loadProductReviews(this.products[this.currentProductId]);
        
        // Сбрасываем форму
        document.getElementById('reviewForm').reset();
        this.setRating(5);
        
        // Прячем форму
        document.getElementById('addReviewSection').style.display = 'none';
        document.getElementById('reviewNotice').innerHTML = '<p>Спасибо за ваш отзыв! Он будет опубликован после модерации.</p>';
        document.getElementById('reviewNotice').style.display = 'block';
        
        this.showNotification('Отзыв успешно добавлен!');
        
        // Синхронизируем данные с админкой
        if (window.syncEvents) {
            window.syncEvents.syncUserData(userId);
        }
    }

    saveProducts() {
        localStorage.setItem('fitness_products', JSON.stringify(this.products));
        
        // Отправляем событие об обновлении продуктов
        const event = new CustomEvent('productsUpdated', {
            detail: { timestamp: new Date().toISOString() }
        });
        window.dispatchEvent(event);
    }

    loadProducts() {
        const savedProducts = localStorage.getItem('fitness_products');
        if (savedProducts) {
            const parsed = JSON.parse(savedProducts);
            // Обновляем только те продукты, которые есть в сохраненных данных
            Object.keys(parsed).forEach(key => {
                if (this.products[key]) {
                    this.products[key] = parsed[key];
                }
            });
        }
    }

    addToCart(productId, quantity = 1) {
        const product = this.products[productId];
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                brand: product.brand,
                price: product.price,
                quantity: quantity
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.showNotification(`${product.name} добавлен в корзину!`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.loadCartItems();
        this.showNotification('Товар удален из корзины');
    }

    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCounts = document.querySelectorAll('.cart-count');
        
        cartCounts.forEach(count => {
            count.textContent = totalItems;
        });
    }

    saveCart() {
        localStorage.setItem('fitness_cart', JSON.stringify(this.cart));
    }

    loadCartItems() {
        const container = document.getElementById('cartItems');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart-message">
                    <p>Ваша корзина пуста</p>
                    <a href="shop.html" class="btn-primary">Перейти в магазин</a>
                </div>
            `;
            return;
        }

        let html = '';
        let subtotal = 0;

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            html += `
                <div class="cart-item" data-product="${item.id}">
                    <div class="cart-item-image">
                        ${this.getProductEmoji(item.id)}
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-brand">${item.brand}</div>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" data-product="${item.id}">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn plus" data-product="${item.id}">+</button>
                        </div>
                        <div class="cart-item-price">${itemTotal.toLocaleString()} ₽</div>
                        <button class="remove-item" data-product="${item.id}">🗑️</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        this.updateOrderSummary(subtotal);

        // Добавляем обработчики для кнопок в корзине
        container.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product');
                this.updateQuantity(productId, -1);
            });
        });

        container.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product');
                this.updateQuantity(productId, 1);
            });
        });

        container.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product');
                this.removeFromCart(productId);
            });
        });

        // Активируем кнопку оформления заказа
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
        }
    }

    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;

        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.saveCart();
            this.updateCartCount();
            this.loadCartItems();
        }
    }

    updateOrderSummary(subtotal = null) {
        if (subtotal === null) {
            subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        const deliveryMethod = document.querySelector('input[name="delivery"]:checked');
        const shipping = deliveryMethod?.value === 'pickup' ? 0 : 300;
        const total = subtotal + shipping;

        const subtotalEl = document.getElementById('subtotal');
        const shippingEl = document.getElementById('shipping');
        const totalEl = document.getElementById('total');

        if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString() + ' ₽';
        if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Бесплатно' : shipping.toLocaleString() + ' ₽';
        if (totalEl) totalEl.textContent = total.toLocaleString() + ' ₽';

        // Обновляем отзыв заказа в модальном окне
        this.updateOrderReview(subtotal, shipping, total);
    }

    updateOrderReview(subtotal, shipping, total) {
        const orderReview = document.getElementById('orderReview');
        if (!orderReview) return;

        let html = `
            <div class="order-item">
                <span>Товары:</span>
                <span>${subtotal.toLocaleString()} ₽</span>
            </div>
            <div class="order-item">
                <span>Доставка:</span>
                <span>${shipping === 0 ? 'Бесплатно' : shipping.toLocaleString() + ' ₽'}</span>
            </div>
            <div class="order-item" style="border-top: 2px solid var(--border); padding-top: 10px; font-weight: bold;">
                <span>Итого:</span>
                <span>${total.toLocaleString()} ₽</span>
            </div>
        `;

        orderReview.innerHTML = html;
    }

    openCheckoutModal() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeCheckoutModal() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    processOrder() {
        // Собираем данные формы
        const name = document.getElementById('checkoutName').value;
        const phone = document.getElementById('checkoutPhone').value;
        const email = document.getElementById('checkoutEmail').value;
        const address = document.getElementById('deliveryAddress').value;
        const comment = document.getElementById('orderComment').value;
        const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;

        // Проверяем, что корзина не пуста
        if (this.cart.length === 0) {
            this.showNotification('Корзина пуста', true);
            return;
        }

        // ПРОВЕРКА БАЛАНСА - НОВЫЙ КОД
        const orderTotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 
                          (deliveryMethod === 'pickup' ? 0 : 300);
        
        if (window.authManager && window.authManager.currentUser) {
            const userBalance = window.authManager.currentUser.balance || 0;
            
            if (userBalance < orderTotal) {
                this.showNotification('❌ Недостаточный баланс для оплаты товара', true);
                
                // Открываем модальное окно пополнения баланса
                setTimeout(() => {
                    const balanceModal = document.getElementById('balanceModal');
                    if (balanceModal) {
                        this.closeCheckoutModal();
                        balanceModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                }, 500);
                
                return;
            }
        }

        // Создаем заказ
        const order = {
            id: 'VS-' + Date.now().toString().slice(-6),
            userId: window.authManager?.currentUser?.id || null,
            userName: name,
            userPhone: phone,
            userEmail: email,
            date: new Date().toISOString(),
            items: this.cart.map(item => ({
                id: item.id,
                name: item.name,
                brand: item.brand,
                price: item.price,
                quantity: item.quantity
            })),
            subtotal: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            shipping: deliveryMethod === 'pickup' ? 0 : 300,
            total: orderTotal,
            deliveryMethod: deliveryMethod,
            deliveryAddress: address,
            comment: comment,
            status: 'completed'
        };

        // ОБНОВЛЕНИЕ БАЛАНСА ПОЛЬЗОВАТЕЛЯ - НОВЫЙ КОД
        if (window.authManager && window.authManager.currentUser) {
            const userId = window.authManager.currentUser.id;
            const user = window.adminManager?.getUserById(userId);
            
            if (user) {
                // Вычитаем сумму заказа из баланса
                const newBalance = Math.max(0, (user.balance || 0) - orderTotal);
                window.adminManager.updateUser(userId, { balance: newBalance });
                
                // Обновляем текущего пользователя
                window.authManager.currentUser.balance = newBalance;
                localStorage.setItem('current_user', JSON.stringify(window.authManager.currentUser));
                
                // Обновляем UI баланса
                window.authManager.updateUI();
                
                // Сохраняем транзакцию
                const transaction = {
                    id: 'TR-' + Date.now().toString().slice(-8),
                    userId: userId,
                    amount: -orderTotal,
                    type: 'purchase',
                    description: `Покупка товаров на сумму ${orderTotal.toLocaleString()} ₽`,
                    date: new Date().toISOString(),
                    status: 'completed'
                };
                
                const transactions = JSON.parse(localStorage.getItem('fitness_transactions')) || [];
                transactions.unshift(transaction);
                localStorage.setItem('fitness_transactions', JSON.stringify(transactions));
            }
        }

        // Добавляем заказ в историю
        this.orders.push(order);
        localStorage.setItem('fitness_orders', JSON.stringify(this.orders));

        // Сохраняем покупку в отдельный список для пользователя - НОВЫЙ КОД
        if (window.authManager && window.authManager.currentUser) {
            const userId = window.authManager.currentUser.id;
            const userPurchases = JSON.parse(localStorage.getItem(`fitness_purchases_${userId}`)) || [];
            
            // Преобразуем заказ в формат покупки для истории
            order.items.forEach(item => {
                userPurchases.push({
                    id: Date.now() + Math.random(),
                    productId: item.id,
                    productName: `${item.name} (${item.brand})`,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.price * item.quantity,
                    date: new Date().toISOString(),
                    status: 'completed',
                    orderId: order.id
                });
            });
            
            localStorage.setItem(`fitness_purchases_${userId}`, JSON.stringify(userPurchases));
        }

        // Очищаем корзину
        this.cart = [];
        this.saveCart();
        this.updateCartCount();

        // Закрываем модальное окно оформления
        this.closeCheckoutModal();

        // Показываем модальное окно успеха
        this.showSuccessModal(order);
        
        // Отправляем событие о завершении заказа
        const orderEvent = new CustomEvent('shopOrderCompleted', {
            detail: order
        });
        window.dispatchEvent(orderEvent);
        
        // Синхронизируем данные с админкой
        if (window.authManager && window.authManager.currentUser) {
            if (window.syncEvents) {
                window.syncEvents.syncUserData(window.authManager.currentUser.id);
            }
        }
    }

    showSuccessModal(order) {
        const successModal = document.getElementById('successModal');
        const orderNumber = document.getElementById('orderNumber');
        const successMessage = document.getElementById('successMessage');
        
        if (successModal && orderNumber) {
            orderNumber.textContent = order.id;
            
            let message = '';
            if (window.authManager && window.authManager.currentUser) {
                const userBalance = window.authManager.currentUser.balance || 0;
                message = `Заказ успешно оформлен!<br>С вашего баланса списано ${order.total.toLocaleString()} ₽<br>Текущий баланс: ${userBalance.toLocaleString()} ₽`;
            } else {
                message = order.deliveryMethod === 'pickup' 
                    ? 'Вы успешно оформили заказ. Забрать товар можно в нашем клубе в течение 3 дней.' 
                    : 'Вы успешно оформили заказ. Ожидайте доставки в течение 2-3 дней.';
            }
            
            if (successMessage) {
                successMessage.innerHTML = message;
            }
            
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeSuccessModal() {
        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    openOrderHistoryModal() {
        const modal = document.getElementById('orderHistoryModal');
        if (modal) {
            this.loadOrderHistory();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeOrderHistoryModal() {
        const modal = document.getElementById('orderHistoryModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    loadOrderHistory() {
        const container = document.getElementById('ordersHistoryContent');
        if (!container) return;

        const userPurchases = JSON.parse(localStorage.getItem(`fitness_purchases_${window.authManager?.currentUser?.id}`)) || [];

        if (userPurchases.length === 0) {
            container.innerHTML = '<div class="no-orders">У вас пока нет заказов</div>';
            return;
        }

        let html = '';
        userPurchases.forEach(purchase => {
            const purchaseDate = new Date(purchase.date).toLocaleDateString('ru-RU');
            const statusClass = `status-${purchase.status || 'completed'}`;
            const statusText = {
                'pending': 'В обработке',
                'processing': 'В процессе',
                'shipped': 'Отправлен',
                'delivered': 'Доставлен',
                'cancelled': 'Отменен',
                'completed': 'Завершен'
            }[purchase.status] || 'Завершен';
            
            html += `
                <div class="order-item-history" data-order-id="${purchase.id}">
                    <div class="order-header">
                        <div>
                            <span class="order-number">Покупка #${purchase.id}</span>
                            <span class="order-status ${statusClass}">${statusText}</span>
                        </div>
                        <div class="order-date">${purchaseDate}</div>
                    </div>
                    <div class="order-details">
                        <div>
                            <strong>Товар:</strong> ${purchase.productName}
                        </div>
                        <div>
                            <strong>Количество:</strong> ${purchase.quantity}
                        </div>
                        <div>
                            <strong>Цена:</strong> ${purchase.price.toLocaleString()} ₽
                        </div>
                    </div>
                    <div class="order-total">
                        Итого: ${purchase.total.toLocaleString()} ₽
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }

    filterProducts(category) {
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
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
    }

    showNotification(message, isError = false) {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification ${isError ? 'error' : ''}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${isError ? '❌' : '✅'}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${isError ? '#f44336' : '#4CAF50'};
            color: white;
            border-radius: 10px;
            z-index: 99999;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            border-left: 4px solid ${isError ? '#d32f2f' : '#388E3C'};
            max-width: 400px;
        `;
        
        // Стили для контента
        const content = notification.querySelector('.notification-content');
        if (content) {
            content.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
            `;
        }
        
        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Автоматическое скрытие через 4 секунды
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    // Вспомогательные методы
    getProductEmoji(productId, large = false) {
        const emojis = {
            'whey-protein': '🥛',
            'protein-bar': '🍫',
            'bcaa-complex': '💊',
            'shaker-pro': '🧴',
            'vitamin-d3': '💊',
            'casein-protein': '🥛',
            'l-glutamine': '💊',
            'energy-bar': '🍫'
        };
        
        const emoji = emojis[productId] || '📦';
        return large ? `<div style="font-size: 6rem;">${emoji}</div>` : emoji;
    }

    getStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '⭐'.repeat(fullStars);
        if (hasHalfStar) stars += '⭐';
        stars += '☆'.repeat(emptyStars);
        
        return stars;
    }

    getReviewWord(count) {
        if (count % 10 === 1 && count % 100 !== 11) return 'отзыв';
        if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) return 'отзыва';
        return 'отзывов';
    }

    getUserInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
}

// Инициализация магазина при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, находимся ли мы на страницах магазина
    if (window.location.pathname.includes('shop.html') || 
        window.location.pathname.includes('cart.html') ||
        window.location.pathname.includes('order-history.html')) {
        
        // Создаем экземпляр ShopManager и сохраняем в глобальной области
        window.shopManager = new ShopManager();
        
        // Если мы на странице истории заказов, загружаем историю
        if (window.location.pathname.includes('order-history.html')) {
            setTimeout(() => {
                if (window.shopManager) {
                    shopManager.displayOrderHistory('ordersHistoryList');
                }
            }, 500);
        }
    }
});