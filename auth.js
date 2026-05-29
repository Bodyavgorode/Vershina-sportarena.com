// auth.js - Функционал авторизации и регистрации с поддержкой аватарок и тестовыми пользователями

class AdminManager {
    constructor() {
        this.adminPassword = 'Admin';
        this.adminEmail = 'Admin@gmail.com';
        this.initAdmin();
    }

    initAdmin() {
        const users = JSON.parse(localStorage.getItem('fitness_users')) || [];
        const adminExists = users.some(user => user.email === this.adminEmail);
        
        if (!adminExists) {
            const adminUser = {
                id: 0,
                firstName: 'Администратор',
                lastName: 'Системы',
                phone: '+7 (999) 999-99-99',
                email: this.adminEmail,
                password: this.adminPassword,
                registrationDate: new Date().toISOString(),
                balance: 999999,
                role: 'admin',
                isActive: true,
                membership: {
                    type: 'admin',
                    status: 'active',
                    startDate: new Date().toISOString(),
                    endDate: '2099-12-31',
                    visitsPerMonth: 999,
                    visitsUsed: 0
                },
                statistics: {
                    totalVisits: 0,
                    lastVisit: null,
                    monthlyVisits: 0
                },
                visitHistory: [],
                activeProgram: 'Административный доступ',
                trainer: 'Система',
                nextTraining: 'Постоянно'
            };
            
            users.push(adminUser);
            console.log('Администратор создан: Admin@gmail.com / Admin');
        }

        // Добавляем тренеров
        const trainers = [
            {
                id: 1,
                firstName: 'Алексей',
                lastName: 'Петров',
                phone: '+7 (900) 111-11-11',
                email: 'alexey@example.com',
                password: 'alexey123',
                registrationDate: '2024-01-01T10:00:00',
                balance: 50000,
                role: 'trainer',
                isActive: true,
                specialization: 'strength',
                bio: 'Основатель клуба "Вершина"',
                membership: {
                    type: 'trainer',
                    status: 'active',
                    startDate: '2024-01-01',
                    endDate: '2099-12-31',
                    visitsPerMonth: 999,
                    visitsUsed: 0
                },
                statistics: {
                    totalVisits: 0,
                    lastVisit: null,
                    monthlyVisits: 0
                },
                visitHistory: [],
                activeProgram: 'Тренерская программа',
                trainer: 'Система',
                nextTraining: 'Постоянно',
                trainerId: 1,
                programId: null
            },
            {
                id: 2,
                firstName: 'Мария',
                lastName: 'Иванова',
                phone: '+7 (900) 222-22-22',
                email: 'maria@example.com',
                password: 'maria123',
                registrationDate: '2024-01-01T10:00:00',
                balance: 45000,
                role: 'trainer',
                isActive: true,
                specialization: 'functional',
                bio: 'Тренер по функциональному тренингу',
                membership: {
                    type: 'trainer',
                    status: 'active',
                    startDate: '2024-01-01',
                    endDate: '2099-12-31',
                    visitsPerMonth: 999,
                    visitsUsed: 0
                },
                statistics: {
                    totalVisits: 0,
                    lastVisit: null,
                    monthlyVisits: 0
                },
                visitHistory: [],
                activeProgram: 'Функциональный тренинг',
                trainer: 'Система',
                nextTraining: 'Постоянно',
                trainerId: 2,
                programId: null
            },
            {
                id: 3,
                firstName: 'Дмитрий',
                lastName: 'Сидоров',
                phone: '+7 (900) 333-33-33',
                email: 'dmitry@example.com',
                password: 'dmitry123',
                registrationDate: '2024-01-01T10:00:00',
                balance: 40000,
                role: 'trainer',
                isActive: true,
                specialization: 'yoga',
                bio: 'Эксперт по йоге и стретчингу',
                membership: {
                    type: 'trainer',
                    status: 'active',
                    startDate: '2024-01-01',
                    endDate: '2099-12-31',
                    visitsPerMonth: 999,
                    visitsUsed: 0
                },
                statistics: {
                    totalVisits: 0,
                    lastVisit: null,
                    monthlyVisits: 0
                },
                visitHistory: [],
                activeProgram: 'Йога',
                trainer: 'Система',
                nextTraining: 'Постоянно',
                trainerId: 3,
                programId: null
            },
            {
                id: 4,
                firstName: 'Екатерина',
                lastName: 'Козлова',
                phone: '+7 (900) 444-44-44',
                email: 'ekaterina@example.com',
                password: 'ekaterina123',
                registrationDate: '2024-01-01T10:00:00',
                balance: 48000,
                role: 'trainer',
                isActive: true,
                specialization: 'cardio',
                bio: 'Специалист по кардио тренировкам',
                membership: {
                    type: 'trainer',
                    status: 'active',
                    startDate: '2024-01-01',
                    endDate: '2099-12-31',
                    visitsPerMonth: 999,
                    visitsUsed: 0
                },
                statistics: {
                    totalVisits: 0,
                    lastVisit: null,
                    monthlyVisits: 0
                },
                visitHistory: [],
                activeProgram: 'Кардио',
                trainer: 'Система',
                nextTraining: 'Постоянно',
                trainerId: 4,
                programId: null
            },
            {
                id: 5,
                firstName: 'Сергей',
                lastName: 'Васильев',
                phone: '+7 (900) 555-55-55',
                email: 'sergey@example.com',
                password: 'sergey123',
                registrationDate: '2024-01-01T10:00:00',
                balance: 47000,
                role: 'trainer',
                isActive: true,
                specialization: 'strength',
                bio: 'Тренер по бодибилдингу',
                membership: {
                    type: 'trainer',
                    status: 'active',
                    startDate: '2024-01-01',
                    endDate: '2099-12-31',
                    visitsPerMonth: 999,
                    visitsUsed: 0
                },
                statistics: {
                    totalVisits: 0,
                    lastVisit: null,
                    monthlyVisits: 0
                },
                visitHistory: [],
                activeProgram: 'Бодибилдинг',
                trainer: 'Система',
                nextTraining: 'Постоянно',
                trainerId: 5,
                programId: null
            },
            {
                id: 6,
                firstName: 'Анна',
                lastName: 'Николаева',
                phone: '+7 (900) 666-66-66',
                email: 'anna@example.com',
                password: 'anna123',
                registrationDate: '2024-01-01T10:00:00',
                balance: 42000,
                role: 'trainer',
                isActive: true,
                specialization: 'functional',
                bio: 'Инструктор групповых программ',
                membership: {
                    type: 'trainer',
                    status: 'active',
                    startDate: '2024-01-01',
                    endDate: '2099-12-31',
                    visitsPerMonth: 999,
                    visitsUsed: 0
                },
                statistics: {
                    totalVisits: 0,
                    lastVisit: null,
                    monthlyVisits: 0
                },
                visitHistory: [],
                activeProgram: 'Групповые занятия',
                trainer: 'Система',
                nextTraining: 'Постоянно',
                trainerId: 6,
                programId: null
            }
        ];

        // Добавляем покупателей (клиентов)
        const customers = [
            {
                id: 101,
                firstName: 'Иван',
                lastName: 'Смирнов',
                phone: '+7 (911) 111-11-11',
                email: 'ivan@example.com',
                password: 'ivan123',
                registrationDate: '2024-01-15T10:30:00',
                balance: 15000,
                role: 'user',
                isActive: true,
                membership: {
                    type: 'monthly',
                    status: 'active',
                    startDate: '2024-01-15',
                    endDate: '2024-02-15',
                    visitsPerMonth: 12,
                    visitsUsed: 8
                },
                statistics: {
                    totalVisits: 25,
                    lastVisit: '2024-01-20T18:30:00',
                    monthlyVisits: 8
                },
                visitHistory: [
                    {
                        id: 1,
                        date: '2024-01-20T18:30:00',
                        type: 'Силовая тренировка',
                        notes: 'Работа над грудными мышцами'
                    },
                    {
                        id: 2,
                        date: '2024-01-18T19:00:00',
                        type: 'Кардио',
                        notes: 'Беговая дорожка 45 мин'
                    }
                ],
                activeProgram: 'Набор мышечной массы',
                trainer: 'Алексей Петров',
                nextTraining: '2024-01-22 19:00',
                trainerId: 1,
                programId: 1
            },
            {
                id: 102,
                firstName: 'Ольга',
                lastName: 'Волкова',
                phone: '+7 (922) 222-22-22',
                email: 'olga@example.com',
                password: 'olga123',
                registrationDate: '2024-01-10T14:20:00',
                balance: 8000,
                role: 'user',
                isActive: true,
                membership: {
                    type: 'monthly',
                    status: 'active',
                    startDate: '2024-01-10',
                    endDate: '2024-02-10',
                    visitsPerMonth: 12,
                    visitsUsed: 6
                },
                statistics: {
                    totalVisits: 18,
                    lastVisit: '2024-01-19T17:00:00',
                    monthlyVisits: 6
                },
                visitHistory: [
                    {
                        id: 3,
                        date: '2024-01-19T17:00:00',
                        type: 'Йога',
                        notes: 'Утренняя практика'
                    },
                    {
                        id: 4,
                        date: '2024-01-17T18:30:00',
                        type: 'Стретчинг',
                        notes: 'Растяжка всего тела'
                    }
                ],
                activeProgram: 'Йога для начинающих',
                trainer: 'Дмитрий Сидоров',
                nextTraining: '2024-01-23 09:00',
                trainerId: 3,
                programId: 3
            },
            {
                id: 103,
                firstName: 'Алексей',
                lastName: 'Комаров',
                phone: '+7 (933) 333-33-33',
                email: 'alex.komarov@example.com',
                password: 'alex123',
                registrationDate: '2024-01-05T11:45:00',
                balance: 12000,
                role: 'user',
                isActive: true,
                membership: {
                    type: 'quarterly',
                    status: 'active',
                    startDate: '2024-01-05',
                    endDate: '2024-04-05',
                    visitsPerMonth: 16,
                    visitsUsed: 12
                },
                statistics: {
                    totalVisits: 42,
                    lastVisit: '2024-01-21T20:00:00',
                    monthlyVisits: 12
                },
                visitHistory: [
                    {
                        id: 5,
                        date: '2024-01-21T20:00:00',
                        type: 'Функциональный тренинг',
                        notes: 'TRX тренировка'
                    },
                    {
                        id: 6,
                        date: '2024-01-20T19:30:00',
                        type: 'Кардио',
                        notes: 'Велотренажер'
                    }
                ],
                activeProgram: 'Похудение',
                trainer: 'Екатерина Козлова',
                nextTraining: '2024-01-24 20:00',
                trainerId: 4,
                programId: 4
            },
            {
                id: 104,
                firstName: 'Елена',
                lastName: 'Новикова',
                phone: '+7 (944) 444-44-44',
                email: 'elena@example.com',
                password: 'elena123',
                registrationDate: '2024-01-12T16:10:00',
                balance: 3000,
                role: 'user',
                isActive: true,
                membership: {
                    type: 'monthly',
                    status: 'active',
                    startDate: '2024-01-12',
                    endDate: '2024-02-12',
                    visitsPerMonth: 12,
                    visitsUsed: 10
                },
                statistics: {
                    totalVisits: 32,
                    lastVisit: '2024-01-22T10:00:00',
                    monthlyVisits: 10
                },
                visitHistory: [
                    {
                        id: 7,
                        date: '2024-01-22T10:00:00',
                        type: 'Групповая тренировка',
                        notes: 'Zumba'
                    },
                    {
                        id: 8,
                        date: '2024-01-20T11:00:00',
                        type: 'Пилатес',
                        notes: 'Проработка кора'
                    }
                ],
                activeProgram: 'Групповые занятия',
                trainer: 'Анна Николаева',
                nextTraining: '2024-01-25 10:00',
                trainerId: 6,
                programId: 6
            },
            {
                id: 105,
                firstName: 'Дмитрий',
                lastName: 'Морозов',
                phone: '+7 (955) 555-55-55',
                email: 'dmitry.m@example.com',
                password: 'dmitry123',
                registrationDate: '2024-01-08T12:30:00',
                balance: 25000,
                role: 'user',
                isActive: true,
                membership: {
                    type: 'annual',
                    status: 'active',
                    startDate: '2024-01-08',
                    endDate: '2025-01-08',
                    visitsPerMonth: 20,
                    visitsUsed: 15
                },
                statistics: {
                    totalVisits: 65,
                    lastVisit: '2024-01-23T19:30:00',
                    monthlyVisits: 15
                },
                visitHistory: [
                    {
                        id: 9,
                        date: '2024-01-23T19:30:00',
                        type: 'Бодибилдинг',
                        notes: 'Тренировка ног'
                    },
                    {
                        id: 10,
                        date: '2024-01-21T18:00:00',
                        type: 'Силовая тренировка',
                        notes: 'Жим лежа'
                    }
                ],
                activeProgram: 'Бодибилдинг',
                trainer: 'Сергей Васильев',
                nextTraining: '2024-01-26 19:00',
                trainerId: 5,
                programId: 5
            }
        ];

        // Добавляем всех пользователей
        const allUsers = [...users, ...trainers, ...customers];
        
        // Удаляем дубликаты по email
        const uniqueUsers = [];
        const seenEmails = new Set();
        
        allUsers.forEach(user => {
            if (!seenEmails.has(user.email)) {
                seenEmails.add(user.email);
                uniqueUsers.push(user);
            }
        });
        
        localStorage.setItem('fitness_users', JSON.stringify(uniqueUsers));
        console.log('Все пользователи загружены:', uniqueUsers.length, 'аккаунтов');
    }

    isAdmin(user) {
        return user && user.role === 'admin';
    }

    getAllUsers() {
        return JSON.parse(localStorage.getItem('fitness_users')) || [];
    }

    getUserById(userId) {
        const users = this.getAllUsers();
        return users.find(user => user.id === userId);
    }

    updateUser(userId, updates) {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            localStorage.setItem('fitness_users', JSON.stringify(users));
            
            const currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');
            if (currentUser && currentUser.id === userId) {
                localStorage.setItem('current_user', JSON.stringify(users[userIndex]));
            }
            
            return true;
        }
        return false;
    }

    deleteUser(userId) {
        const users = this.getAllUsers();
        const filteredUsers = users.filter(user => user.id !== userId);
        localStorage.setItem('fitness_users', JSON.stringify(filteredUsers));
        return true;
    }

    createUser(userData) {
        const users = this.getAllUsers();
        const newUser = {
            id: Date.now(),
            ...userData,
            registrationDate: new Date().toISOString(),
            balance: 5000,
            role: 'user',
            isActive: true,
            membership: {
                type: 'none',
                status: 'inactive',
                startDate: null,
                endDate: null,
                visitsPerMonth: 0,
                visitsUsed: 0
            },
            statistics: {
                totalVisits: 0,
                lastVisit: null,
                monthlyVisits: 0
            },
            visitHistory: [],
            activeProgram: null,
            trainer: null,
            nextTraining: null,
            trainerId: null,
            programId: null
        };
        
        users.push(newUser);
        localStorage.setItem('fitness_users', JSON.stringify(users));
        return newUser;
    }

    updateMembership(userId, membershipData) {
        const user = this.getUserById(userId);
        if (!user) return false;

        const updates = {
            membership: {
                ...user.membership,
                ...membershipData
            }
        };

        return this.updateUser(userId, updates);
    }

    addVisitWithHistory(userId, visitData = {}) {
        const user = this.getUserById(userId);
        if (!user) return false;

        const visitRecord = {
            id: Date.now(),
            date: visitData.date || new Date().toISOString(),
            type: visitData.type || 'Тренировка',
            notes: visitData.notes || ''
        };

        if (!user.visitHistory) {
            user.visitHistory = [];
        }

        user.visitHistory.unshift(visitRecord);

        const updates = {
            statistics: {
                totalVisits: (user.statistics?.totalVisits || 0) + 1,
                lastVisit: new Date().toISOString(),
                monthlyVisits: (user.statistics?.monthlyVisits || 0) + 1
            },
            membership: {
                ...user.membership,
                visitsUsed: (user.membership?.visitsUsed || 0) + 1
            },
            visitHistory: user.visitHistory
        };

        return this.updateUser(userId, updates);
    }

    getVisitHistory(userId) {
        const user = this.getUserById(userId);
        return user?.visitHistory || [];
    }

    clearVisitHistory(userId) {
        return this.updateUser(userId, { visitHistory: [] });
    }

    resetMonthlyVisits(userId) {
        const user = this.getUserById(userId);
        if (!user) return false;

        const updates = {
            statistics: {
                ...user.statistics,
                monthlyVisits: 0
            },
            membership: {
                ...user.membership,
                visitsUsed: 0
            }
        };

        return this.updateUser(userId, updates);
    }

    updateBalance(userId, amount) {
        const user = this.getUserById(userId);
        if (!user) return false;

        const newBalance = (user.balance || 0) + amount;
        return this.updateUser(userId, { balance: newBalance });
    }
}

window.adminManager = new AdminManager();

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('fitness_users')) || [];
        this.init();
    }

    init() {
        this.checkAuthState();
        this.setupEventListeners();
        this.setupLoginButton();
    }

    setupEventListeners() {
        const registerLink = document.querySelector('.register-link');
        const loginLink = document.querySelector('.login-link');
        
        if (registerLink) {
            registerLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showRegisterForm();
            });
        }

        if (loginLink) {
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        }

        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }

        const closeAuth = document.getElementById('closeAuth');
        const authModal = document.getElementById('authModal');

        if (closeAuth && authModal) {
            closeAuth.addEventListener('click', () => {
                authModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        if (authModal) {
            authModal.addEventListener('click', (e) => {
                if (e.target === authModal) {
                    authModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    setupLoginButton() {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.onclick = null;
            loginBtn.addEventListener('click', (e) => this.handleLoginButtonClick(e));
        }
    }

    handleLoginButtonClick(e) {
        e.preventDefault();
        
        if (this.currentUser) {
            if (adminManager.isAdmin(this.currentUser)) {
                this.showAdminMenu();
            } else {
                window.location.href = 'profile.html';
            }
        } else {
            const authModal = document.getElementById('authModal');
            if (authModal) {
                authModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                this.showLoginForm();
            }
        }
    }

    showAdminMenu() {
        const menu = document.createElement('div');
        menu.className = 'admin-menu';
        menu.innerHTML = `
            <div class="admin-menu-content">
                <h3 class="text-accent">Панель администратора</h3>
                <button class="admin-menu-btn" onclick="window.open('admin.html', '_blank')">
                    📊 Админ-панель
                </button>
                <button class="admin-menu-btn" onclick="window.location.href='profile.html'">
                    👤 Мой профиль
                </button>
                <button class="admin-menu-btn" onclick="authManager.logout()">
                    🔓 Выйти
                </button>
            </div>
        `;
        
        menu.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            min-width: 200px;
        `;
        
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && e.target.id !== 'loginBtn') {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
        
        const oldMenu = document.querySelector('.admin-menu');
        if (oldMenu) oldMenu.remove();
        
        document.body.appendChild(menu);
    }

    showRegisterForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const authTitle = document.querySelector('.auth-title');
        const authSubtitle = document.querySelector('.auth-subtitle');
        
        if (loginForm && registerForm && authTitle && authSubtitle) {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            authTitle.textContent = 'Регистрация';
            authSubtitle.textContent = 'Создайте аккаунт в Вершине';
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const authTitle = document.querySelector('.auth-title');
        const authSubtitle = document.querySelector('.auth-subtitle');
        
        if (loginForm && registerForm && authTitle && authSubtitle) {
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            authTitle.textContent = 'Вход в аккаунт';
            authSubtitle.textContent = 'Войдите в свой профиль Вершины';
        }
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.login(user);
            this.showNotification('Вход выполнен успешно!');
        } else {
            this.showNotification('Неверный email или пароль', true);
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = {
            id: Date.now(),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            password: formData.get('password'),
            registrationDate: new Date().toISOString(),
            balance: 5000,
            role: 'user',
            isActive: true,
            membership: {
                type: 'none',
                status: 'inactive',
                startDate: null,
                endDate: null,
                visitsPerMonth: 0,
                visitsUsed: 0
            },
            statistics: {
                totalVisits: 0,
                lastVisit: null,
                monthlyVisits: 0
            },
            visitHistory: [],
            activeProgram: null,
            trainer: null,
            nextTraining: null,
            trainerId: null,
            programId: null
        };

        if (this.users.find(u => u.email === userData.email)) {
            this.showNotification('Пользователь с таким email уже существует', true);
            return;
        }

        this.users.push(userData);
        localStorage.setItem('fitness_users', JSON.stringify(this.users));
        
        this.login(userData);
        this.showNotification('Регистрация прошла успешно!');
    }

    login(user) {
        this.currentUser = user;
        localStorage.setItem('current_user', JSON.stringify(user));
        this.updateUI();
        this.closeAuthModal();
        this.setupLoginButton();
        
        // Синхронизация данных при входе
        this.syncUserDataWithShop();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('current_user');
        this.updateUI();
        this.setupLoginButton();
        this.showNotification('Вы вышли из аккаунта');
        
        if (window.location.pathname.includes('profile.html')) {
            window.location.href = 'index.html';
        }
    }

    checkAuthState() {
        const savedUser = localStorage.getItem('current_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
    }

    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        const headerBalance = document.getElementById('headerBalance');
        
        if (this.currentUser) {
            const avatarData = window.avatarManager ? window.avatarManager.getAvatar(this.currentUser.id) : null;
            
            if (loginBtn) {
                let avatarHtml = '';
                if (avatarData) {
                    avatarHtml = `<div class="header-avatar" id="headerAvatar"><img src="${avatarData}" alt="Аватар"></div>`;
                } else {
                    const initials = this.getUserInitials();
                    avatarHtml = `<div class="header-avatar" id="headerAvatar"><div class="avatar-initials">${initials}</div></div>`;
                }
                
                loginBtn.innerHTML = `
                    <div class="user-profile">
                        ${avatarHtml}
                        <span class="user-name">${this.currentUser.firstName}</span>
                    </div>
                `;
                
                const userProfile = loginBtn.querySelector('.user-profile');
                if (userProfile) {
                    userProfile.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.handleLoginButtonClick(e);
                    });
                }
            }
            
            if (headerBalance && this.currentUser) {
                const balanceAmount = this.currentUser.balance || 0;
                headerBalance.querySelector('.balance-amount').textContent = `${balanceAmount.toLocaleString()} ₽`;
            }
            
            this.updateProfilePage();
        } else {
            if (loginBtn) {
                loginBtn.innerHTML = 'Войти';
                loginBtn.style.display = 'block';
            }
            
            if (headerBalance) {
                headerBalance.querySelector('.balance-amount').textContent = '0 ₽';
            }
        }
        
        if (window.avatarManager) {
            window.avatarManager.loadAvatarForCurrentUser();
        }
    }

    updateProfilePage() {
        if (!window.location.pathname.includes('profile.html')) return;
        
        const profileElements = {
            'profileName': `${this.currentUser.firstName} ${this.currentUser.lastName}`,
            'profileFirstName': this.currentUser.firstName,
            'profileLastName': this.currentUser.lastName,
            'profileEmail': this.currentUser.email,
            'profilePhone': this.currentUser.phone,
            'profileJoinDate': new Date(this.currentUser.registrationDate).toLocaleDateString('ru-RU'),
            'profileBalance': `${(this.currentUser.balance || 0).toLocaleString()} ₽`,
            'profileTotalVisits': this.currentUser.statistics?.totalVisits || 0
        };

        Object.keys(profileElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = profileElements[id];
            }
        });

        const profileActiveProgram = document.getElementById('profileActiveProgram');
        if (profileActiveProgram) {
            profileActiveProgram.textContent = this.currentUser.activeProgram || 'Не выбрано';
        }

        const profileTrainer = document.getElementById('profileTrainer');
        if (profileTrainer) {
            profileTrainer.textContent = this.currentUser.trainer || 'Не выбран';
        }

        const profileNextTraining = document.getElementById('profileNextTraining');
        if (profileNextTraining) {
            profileNextTraining.textContent = this.currentUser.nextTraining || 'Нет запланированных';
        }

        const profileVisitsThisMonth = document.getElementById('profileVisitsThisMonth');
        if (profileVisitsThisMonth) {
            profileVisitsThisMonth.textContent = this.currentUser.statistics?.monthlyVisits || 0;
        }

        const profileMembershipStatus = document.getElementById('profileMembershipStatus');
        if (profileMembershipStatus) {
            let statusText = 'Неактивен';
            let statusColor = '#F44336';
            if (this.currentUser.membership?.status === 'active') {
                statusText = 'Активен';
                statusColor = '#FFDE00';
            } else if (this.currentUser.membership?.status === 'frozen') {
                statusText = 'Заморожен';
                statusColor = '#2196F3';
            }
            profileMembershipStatus.textContent = statusText;
            profileMembershipStatus.style.color = statusColor;
        }

        const profileMembershipType = document.getElementById('profileMembershipType');
        if (profileMembershipType) {
            const membershipType = this.currentUser.membership?.type || 'none';
            const typeText = {
                'none': 'Нет',
                'monthly': 'Месячный',
                'quarterly': 'Квартальный',
                'annual': 'Годовой',
                'unlimited': 'Безлимитный',
                'admin': 'Администратор',
                'trainer': 'Тренер'
            };
            profileMembershipType.textContent = typeText[membershipType] || membershipType;
        }

        const profileMembershipEndDate = document.getElementById('profileMembershipEndDate');
        if (profileMembershipEndDate && this.currentUser.membership?.endDate) {
            const date = new Date(this.currentUser.membership.endDate);
            profileMembershipEndDate.textContent = date.toLocaleDateString('ru-RU');
        } else if (profileMembershipEndDate) {
            profileMembershipEndDate.textContent = '—';
        }

        this.updateVisitHistory();
        this.updateProfileStatistics();
    }

    updateVisitHistory() {
        if (!window.location.pathname.includes('profile.html')) return;
        if (!this.currentUser) return;
        
        const profileVisitHistory = document.getElementById('profileVisitHistory');
        const visitCount = document.getElementById('visitCount');
        
        if (profileVisitHistory && visitCount) {
            const visits = this.currentUser.visitHistory || [];
            visitCount.textContent = visits.length;
            
            if (visits.length > 0) {
                let html = '';
                visits.forEach((visit, index) => {
                    const date = new Date(visit.date);
                    const formattedDate = date.toLocaleDateString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    let icon = '🏋️';
                    const type = visit.type || 'Тренировка';
                    if (type.includes('Кардио') || type.includes('кардио')) icon = '❤️';
                    if (type.includes('Йога') || type.includes('йога') || type.includes('Стретчинг')) icon = '🧘';
                    if (type.includes('Групповая') || type.includes('групповая')) icon = '👥';
                    if (type.includes('Персональная') || type.includes('персональная')) icon = '⭐';
                    if (type.includes('Функциональный') || type.includes('функциональный')) icon = '🏃‍♂️';
                    
                    html += `
                        <div class="visit-item">
                            <div class="visit-date">${formattedDate}</div>
                            <div class="visit-type">${icon} ${type}</div>
                            <div class="visit-notes" title="${visit.notes || ''}">${visit.notes || ''}</div>
                        </div>
                    `;
                });
                profileVisitHistory.innerHTML = html;
            } else {
                profileVisitHistory.innerHTML = '<div class="no-visits">Нет посещений</div>';
            }
        }
    }

    updateProfileStatistics() {
        if (!this.currentUser) return;
        
        const profileLastVisit = document.getElementById('profileLastVisit');
        if (profileLastVisit) {
            const lastVisit = this.currentUser.statistics?.lastVisit;
            if (lastVisit) {
                const date = new Date(lastVisit);
                profileLastVisit.textContent = date.toLocaleDateString('ru-RU');
            } else {
                profileLastVisit.textContent = '—';
            }
        }
        
        const profileAvgMonthly = document.getElementById('profileAvgMonthly');
        if (profileAvgMonthly) {
            const registrationDate = new Date(this.currentUser.registrationDate);
            const monthsDiff = (new Date() - registrationDate) / (1000 * 60 * 60 * 24 * 30.44);
            const totalVisits = this.currentUser.statistics?.totalVisits || 0;
            const avgMonthly = monthsDiff > 1 ? (totalVisits / monthsDiff).toFixed(1) : totalVisits;
            profileAvgMonthly.textContent = `${avgMonthly}`;
        }
        
        const profileRemainingVisits = document.getElementById('profileRemainingVisits');
        if (profileRemainingVisits) {
            const membership = this.currentUser.membership || {};
            const total = membership.visitsPerMonth || 0;
            const used = membership.visitsUsed || 0;
            const remaining = total - used;
            profileRemainingVisits.textContent = remaining > 0 ? remaining : 0;
        }
        
        const profileFavoriteType = document.getElementById('profileFavoriteType');
        if (profileFavoriteType && this.currentUser.visitHistory && this.currentUser.visitHistory.length > 0) {
            const typeCounts = {};
            this.currentUser.visitHistory.forEach(visit => {
                const type = visit.type || 'Другое';
                typeCounts[type] = (typeCounts[type] || 0) + 1;
            });
            
            let favoriteType = '—';
            let maxCount = 0;
            Object.entries(typeCounts).forEach(([type, count]) => {
                if (count > maxCount) {
                    maxCount = count;
                    favoriteType = type;
                }
            });
            
            profileFavoriteType.textContent = favoriteType;
        }
    }

    getUserInitials() {
        if (!this.currentUser) return '';
        return `${this.currentUser.firstName[0]}${this.currentUser.lastName[0]}`.toUpperCase();
    }

    closeAuthModal() {
        const authModal = document.getElementById('authModal');
        if (authModal) {
            authModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    showNotification(message, isError = false) {
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${isError ? 'error' : ''}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // СИНХРОНИЗАЦИЯ ДАННЫХ С МАГАЗИНОМ
    syncUserDataWithShop() {
        if (!this.currentUser) return;
        
        // Синхронизация заказов пользователя
        this.syncUserOrders();
        
        // Синхронизация отзывов пользователя
        this.syncUserReviews();
        
        // Обновление истории заказов в магазине
        if (window.shopManager) {
            shopManager.setupOrderHistoryButton();
        }
    }

    syncUserOrders() {
        if (!this.currentUser) return;
        
        const userId = this.currentUser.id;
        const userEmail = this.currentUser.email;
        
        // Получаем все заказы из магазина
        const shopOrders = JSON.parse(localStorage.getItem('fitness_orders')) || [];
        
        // Находим заказы пользователя по email (так как в заказах может не быть userId)
        const userOrders = shopOrders.filter(order => 
            order.userEmail === userEmail || order.userId === userId
        );
        
        // Сохраняем заказы пользователя в отдельное хранилище для админки
        localStorage.setItem(`fitness_purchases_${userId}`, JSON.stringify(
            userOrders.map(order => ({
                id: order.id,
                date: order.date,
                items: order.items,
                subtotal: order.subtotal,
                shipping: order.shipping,
                total: order.total,
                status: order.status || 'completed',
                deliveryMethod: order.deliveryMethod,
                deliveryAddress: order.deliveryAddress
            }))
        ));
        
        console.log('Заказы пользователя синхронизированы:', userOrders.length);
    }

    syncUserReviews() {
        if (!this.currentUser) return;
        
        const userId = this.currentUser.id;
        
        // Получаем все товары из магазина
        const shopProducts = JSON.parse(localStorage.getItem('fitness_products')) || window.shopManager?.products;
        if (!shopProducts) return;
        
        // Собираем все отзывы пользователя
        const userReviews = [];
        
        for (const productId in shopProducts) {
            const product = shopProducts[productId];
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
        
        // Сохраняем отзывы пользователя в отдельное хранилище для админки
        localStorage.setItem(`fitness_reviews_${userId}`, JSON.stringify(userReviews));
        
        console.log('Отзывы пользователя синхронизированы:', userReviews.length);
    }

    // ОБНОВЛЕНИЕ ДАННЫХ ПРИ ИЗМЕНЕНИЯХ
    updateUserOrderHistory() {
        if (!this.currentUser) return;
        
        const userId = this.currentUser.id;
        const userOrders = JSON.parse(localStorage.getItem('fitness_orders')) || [];
        
        // Фильтруем заказы пользователя
        const filteredOrders = userOrders.filter(order => 
            order.userId === userId || 
            (order.userEmail && order.userEmail === this.currentUser.email)
        );
        
        // Обновляем отображение в профиле, если есть элемент для истории заказов
        const orderHistoryElement = document.getElementById('profileOrderHistory');
        if (orderHistoryElement) {
            if (filteredOrders.length === 0) {
                orderHistoryElement.innerHTML = '<div class="no-orders">Нет заказов</div>';
            } else {
                let html = '';
                filteredOrders.forEach(order => {
                    const orderDate = new Date(order.date).toLocaleDateString('ru-RU');
                    const orderTotal = order.total ? order.total.toLocaleString() : '0';
                    
                    html += `
                        <div class="order-history-item">
                            <div class="order-history-header">
                                <span class="order-history-number">Заказ ${order.id}</span>
                                <span class="order-history-date">${orderDate}</span>
                            </div>
                            <div class="order-history-details">
                                <div class="order-history-total">Сумма: ${orderTotal} ₽</div>
                                <div class="order-history-status">Статус: ${order.status || 'Завершен'}</div>
                            </div>
                        </div>
                    `;
                });
                orderHistoryElement.innerHTML = html;
            }
        }
    }
}

class AvatarManager {
    constructor() {
        this.maxFileSize = 5 * 1024 * 1024;
        this.allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        this.maxWidth = 2000;
        this.maxHeight = 2000;
        this.minWidth = 100;
        this.minHeight = 100;
        this.avatarQuality = 0.8;
        this.avatarSize = 400;
        this.avatarPrefix = 'fitness_avatar_';
        this.avatars = {};
    }

    init() {
        this.setupEventListeners();
        this.loadAllAvatars();
        this.loadAvatarForCurrentUser();
    }

    loadAllAvatars() {
        const avatars = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.avatarPrefix)) {
                const userId = key.replace(this.avatarPrefix, '');
                avatars[userId] = localStorage.getItem(key);
            }
        }
        this.avatars = avatars;
        return avatars;
    }

    setupEventListeners() {
        const avatarUpload = document.getElementById('avatarUpload');
        const avatarPreview = document.getElementById('avatarPreview');
        
        if (avatarUpload) {
            avatarUpload.addEventListener('change', (e) => this.handleAvatarUpload(e));
        }
        
        if (avatarPreview) {
            avatarPreview.addEventListener('click', () => {
                const input = document.getElementById('avatarUpload');
                if (input) input.click();
            });
        }
    }

    handleAvatarUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const validation = this.validateImage(file);
        if (!validation.valid) {
            this.showNotification(validation.message, true);
            event.target.value = '';
            return;
        }

        this.showUploadProgress(true);
        
        this.compressImage(file)
            .then(compressedData => {
                if (window.authManager && window.authManager.currentUser) {
                    const userId = window.authManager.currentUser.id;
                    this.saveAvatar(userId, compressedData);
                    this.displayAvatar(compressedData);
                    this.showNotification('Аватарка успешно обновлена!');
                }
                event.target.value = '';
            })
            .catch(error => {
                console.error('Ошибка сжатия:', error);
                this.showNotification(error.message || 'Ошибка при обработке изображения', true);
            })
            .finally(() => {
                this.showUploadProgress(false);
            });
    }

    validateImage(file) {
        if (!this.allowedTypes.includes(file.type)) {
            return {
                valid: false,
                message: 'Допустимые форматы: JPEG, PNG, GIF, WebP'
            };
        }

        if (file.size > this.maxFileSize) {
            return {
                valid: false,
                message: `Максимальный размер: ${Math.round(this.maxFileSize / 1024 / 1024)}MB`
            };
        }

        return { valid: true, message: 'OK' };
    }

    compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const img = new Image();
                
                img.onload = () => {
                    if (img.width < this.minWidth || img.height < this.minHeight) {
                        reject(new Error(`Минимальный размер: ${this.minWidth}x${this.minHeight}px`));
                        return;
                    }
                    
                    if (img.width > this.maxWidth || img.height > this.maxHeight) {
                        reject(new Error(`Максимальный размер: ${this.maxWidth}x${this.maxHeight}px`));
                        return;
                    }

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    let width = img.width;
                    let height = img.height;
                    
                    const maxSize = this.avatarSize;
                    if (width > height) {
                        if (width > maxSize) {
                            height *= maxSize / width;
                            width = maxSize;
                        }
                    } else {
                        if (height > maxSize) {
                            width *= maxSize / height;
                            height = maxSize;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    ctx.imageSmoothingEnabled = true;
                    ctx.imageSmoothingQuality = 'high';
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const dataUrl = canvas.toDataURL('image/jpeg', this.avatarQuality);
                    
                    const sizeInMB = (dataUrl.length * 3/4) / (1024 * 1024);
                    if (sizeInMB > 0.5) {
                        resolve(canvas.toDataURL('image/jpeg', 0.6));
                    } else {
                        resolve(dataUrl);
                    }
                };
                
                img.onerror = () => reject(new Error('Ошибка загрузки изображения'));
                img.src = e.target.result;
            };
            
            reader.onerror = () => reject(new Error('Ошибка чтения файла'));
            reader.readAsDataURL(file);
        });
    }

    saveAvatar(userId, avatarData) {
        if (!userId) return false;
        
        try {
            const key = `${this.avatarPrefix}${userId}`;
            localStorage.setItem(key, avatarData);
            
            if (!this.avatars) this.avatars = {};
            this.avatars[userId] = avatarData;
            
            if (window.adminManager) {
                const user = window.adminManager.getUserById(userId);
                if (user) {
                    user.hasAvatar = true;
                    user.avatarUpdated = new Date().toISOString();
                    window.adminManager.updateUser(userId, { 
                        hasAvatar: true,
                        avatarUpdated: user.avatarUpdated 
                    });
                }
            }
            
            return true;
        } catch (error) {
            console.error('Ошибка сохранения:', error);
            
            if (error.name === 'QuotaExceededError') {
                this.cleanupOldAvatars();
                try {
                    const key = `${this.avatarPrefix}${userId}`;
                    localStorage.setItem(key, avatarData);
                    return true;
                } catch (e) {
                    this.showNotification('Недостаточно места для сохранения аватарки', true);
                    return false;
                }
            }
            
            return false;
        }
    }

    cleanupOldAvatars() {
        const avatarKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.avatarPrefix)) {
                avatarKeys.push(key);
            }
        }
        
        if (avatarKeys.length > 20) {
            const keysToRemove = avatarKeys.slice(0, avatarKeys.length - 20);
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
                const userId = key.replace(this.avatarPrefix, '');
                delete this.avatars[userId];
            });
        }
    }

    loadAvatar(userId) {
        if (!userId) return null;
        
        if (this.avatars && this.avatars[userId]) {
            return this.avatars[userId];
        }
        
        const key = `${this.avatarPrefix}${userId}`;
        const avatarData = localStorage.getItem(key);
        
        if (avatarData) {
            if (!this.avatars) this.avatars = {};
            this.avatars[userId] = avatarData;
        }
        
        return avatarData;
    }

    getAvatar(userId) {
        return this.loadAvatar(userId);
    }

    loadAvatarForCurrentUser() {
        if (!window.authManager || !window.authManager.currentUser) return;
        
        const userId = window.authManager.currentUser.id;
        const avatarData = this.loadAvatar(userId);
        
        if (avatarData) {
            this.displayAvatar(avatarData);
        } else {
            this.displayInitials();
        }
        
        this.updateHeaderAvatar(userId, avatarData);
    }

    displayAvatar(avatarData) {
        const avatarImage = document.getElementById('avatarImage');
        const avatarInitials = document.getElementById('avatarInitials');
        const avatarControls = document.getElementById('avatarControls');
        
        if (avatarImage && avatarInitials) {
            const img = new Image();
            img.onload = () => {
                avatarImage.src = img.src;
                avatarImage.style.display = 'block';
                avatarInitials.style.display = 'none';
            };
            img.src = avatarData + (avatarData.includes('?') ? '&' : '?') + 't=' + Date.now();
            
            if (avatarControls) {
                avatarControls.style.display = 'flex';
            }
        }
    }

    displayInitials() {
        const avatarImage = document.getElementById('avatarImage');
        const avatarInitials = document.getElementById('avatarInitials');
        const avatarControls = document.getElementById('avatarControls');
        
        if (avatarImage && avatarInitials) {
            avatarImage.style.display = 'none';
            avatarInitials.style.display = 'block';
            
            if (window.authManager && window.authManager.currentUser) {
                avatarInitials.textContent = window.authManager.getUserInitials();
            }
            
            if (avatarControls) {
                avatarControls.style.display = 'none';
            }
        }
    }

    updateHeaderAvatar(userId, avatarData) {
        const headerAvatar = document.getElementById('headerAvatar');
        if (!headerAvatar) return;

        if (avatarData) {
            this.createSmallAvatar(avatarData, 32, 32)
                .then(smallData => {
                    headerAvatar.innerHTML = `<img src="${smallData}" alt="Аватар" style="width:100%;height:100%;object-fit:cover;">`;
                })
                .catch(() => {
                    headerAvatar.innerHTML = `<img src="${avatarData}" alt="Аватар" style="width:100%;height:100%;object-fit:cover;">`;
                });
        } else {
            if (window.authManager && window.authManager.currentUser) {
                const initials = window.authManager.getUserInitials();
                headerAvatar.innerHTML = `<div class="avatar-initials">${initials}</div>`;
            }
        }
    }

    createSmallAvatar(originalDataUrl, width, height) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                canvas.width = width;
                canvas.height = height;
                
                ctx.beginPath();
                ctx.arc(width/2, height/2, width/2, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                
                ctx.drawImage(img, 0, 0, width, height);
                
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            
            img.onerror = reject;
            img.src = originalDataUrl;
        });
    }

    removeAvatar() {
        if (!window.authManager || !window.authManager.currentUser) return;
        
        if (confirm('Вы уверены, что хотите удалить аватарку?')) {
            const userId = window.authManager.currentUser.id;
            const key = `${this.avatarPrefix}${userId}`;
            
            localStorage.removeItem(key);
            if (this.avatars) {
                delete this.avatars[userId];
            }
            
            if (window.adminManager) {
                window.adminManager.updateUser(userId, { 
                    hasAvatar: false,
                    avatarUpdated: null 
                });
            }
            
            this.displayInitials();
            this.updateHeaderAvatar(userId, null);
            this.showNotification('Аватарка удалена');
        }
    }

    removeAvatarByUserId(userId) {
        const key = `${this.avatarPrefix}${userId}`;
        localStorage.removeItem(key);
        
        if (this.avatars) {
            delete this.avatars[userId];
        }
        
        if (window.adminManager) {
            window.adminManager.updateUser(userId, { 
                hasAvatar: false,
                avatarUpdated: null 
            });
        }
    }

    showUploadProgress(show) {
        const progressBar = document.getElementById('avatarProgress');
        const progress = document.getElementById('avatarProgressBar');
        
        if (progressBar && progress) {
            if (show) {
                progressBar.style.display = 'block';
                progress.style.width = '0%';
                
                let width = 0;
                const interval = setInterval(() => {
                    if (width >= 100) {
                        clearInterval(interval);
                    } else {
                        width += 10;
                        progress.style.width = width + '%';
                    }
                }, 100);
            } else {
                progress.style.width = '100%';
                setTimeout(() => {
                    progress.style.width = '0%';
                    setTimeout(() => {
                        progressBar.style.display = 'none';
                    }, 300);
                }, 500);
            }
        }
    }

    showNotification(message, isError = false) {
        if (window.authManager && window.authManager.showNotification) {
            window.authManager.showNotification(message, isError);
        } else {
            alert(message);
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (!window.authManager) {
        window.authManager = new AuthManager();
    }
    
    if (!window.avatarManager) {
        window.avatarManager = new AvatarManager();
        window.avatarManager.init();
    }
    
    // Слушаем изменения в localStorage для синхронизации данных
    window.addEventListener('storage', function(event) {
        if (event.key && event.key.startsWith('fitness_avatar_')) {
            if (window.authManager && window.authManager.currentUser) {
                const userId = window.authManager.currentUser.id;
                const changedUserId = event.key.replace('fitness_avatar_', '');
                
                if (userId == changedUserId) {
                    setTimeout(() => {
                        window.avatarManager.loadAvatarForCurrentUser();
                    }, 100);
                }
            }
        }
        
        // Синхронизация при изменении заказов
        if (event.key === 'fitness_orders') {
            if (window.authManager && window.authManager.currentUser) {
                setTimeout(() => {
                    window.authManager.syncUserOrders();
                    window.authManager.updateUserOrderHistory();
                }, 100);
            }
        }
        
        // Синхронизация при изменении отзывов
        if (event.key === 'fitness_products') {
            if (window.authManager && window.authManager.currentUser) {
                setTimeout(() => {
                    window.authManager.syncUserReviews();
                }, 100);
            }
        }
    });
    
    // Синхронизация при возвращении на страницу
    window.addEventListener('focus', () => {
        if (window.avatarManager && window.authManager && window.authManager.currentUser) {
            setTimeout(() => {
                window.avatarManager.loadAvatarForCurrentUser();
                window.authManager.syncUserDataWithShop();
            }, 100);
        }
    });
});

// ДОПОЛНИТЕЛЬНЫЙ КОД ДЛЯ ИНТЕГРАЦИИ С МАГАЗИНОМ И АДМИНКОЙ
document.addEventListener('DOMContentLoaded', function() {
    // Создаем глобальные события для синхронизации данных
    window.syncEvents = {
        // Событие для синхронизации пользовательских данных
        syncUserData: function(userId) {
            if (!userId) return;
            
            // Синхронизация заказов
            const orders = JSON.parse(localStorage.getItem('fitness_orders')) || [];
            const userOrders = orders.filter(order => order.userId === userId);
            localStorage.setItem(`fitness_purchases_${userId}`, JSON.stringify(userOrders));
            
            // Синхронизация отзывов
            const products = JSON.parse(localStorage.getItem('fitness_products')) || {};
            const userReviews = [];
            
            for (const productId in products) {
                const product = products[productId];
                if (product.reviews && Array.isArray(product.reviews)) {
                    product.reviews.forEach(review => {
                        if (review.userId === userId) {
                            userReviews.push({
                                productId: productId,
                                productName: product.name,
                                ...review
                            });
                        }
                    });
                }
            }
            
            localStorage.setItem(`fitness_reviews_${userId}`, JSON.stringify(userReviews));
            
            // Отправляем событие о синхронизации
            const event = new CustomEvent('userDataSynced', {
                detail: {
                    userId: userId,
                    orders: userOrders,
                    reviews: userReviews,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(event);
            
            console.log('Данные пользователя синхронизированы:', userId);
        },
        
        // Событие для обновления отображения в реальном времени
        updateRealtimeData: function(dataType) {
            const event = new CustomEvent('realtimeUpdate', {
                detail: {
                    dataType: dataType,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(event);
        },
        
        // Событие для экспорта данных пользователя
        exportUserData: function(userId) {
            const user = window.adminManager?.getUserById(userId);
            if (!user) return;
            
            const orders = JSON.parse(localStorage.getItem(`fitness_purchases_${userId}`)) || [];
            const reviews = JSON.parse(localStorage.getItem(`fitness_reviews_${userId}`)) || [];
            const appointments = JSON.parse(localStorage.getItem(`fitness_appointments_${userId}`)) || [];
            
            const data = {
                user: user,
                orders: orders,
                reviews: reviews,
                appointments: appointments,
                exportDate: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `user_data_${user.firstName}_${user.lastName}_${new Date().toISOString().slice(0, 10)}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        }
    };
    
    // Инициализируем синхронизацию при загрузке страницы профиля
    if (window.location.pathname.includes('profile.html')) {
        setTimeout(() => {
            if (window.authManager && window.authManager.currentUser) {
                window.authManager.syncUserDataWithShop();
                window.authManager.updateUserOrderHistory();
            }
        }, 500);
    }
    
    // Инициализируем синхронизацию при загрузке админки
    if (window.location.pathname.includes('admin.html')) {
        setTimeout(() => {
            // Синхронизируем данные всех пользователей
            const users = window.adminManager?.getAllUsers() || [];
            users.forEach(user => {
                if (user.id !== 0) { // Не синхронизируем админа
                    window.syncEvents.syncUserData(user.id);
                }
            });
        }, 1000);
    }
});

// СИНХРОНИЗАЦИЯ МЕЖДУ МАГАЗИНОМ И ПРОФИЛЕМ
window.addEventListener('shopOrderCompleted', function(e) {
    const orderData = e.detail;
    
    // Обновляем баланс пользователя
    if (window.authManager && window.authManager.currentUser && orderData.total) {
        const userId = window.authManager.currentUser.id;
        const user = window.adminManager?.getUserById(userId);
        
        if (user) {
            const newBalance = Math.max(0, (user.balance || 0) - orderData.total);
            window.adminManager.updateUser(userId, { balance: newBalance });
            
            // Обновляем отображение баланса
            const headerBalance = document.getElementById('headerBalance');
            if (headerBalance) {
                headerBalance.querySelector('.balance-amount').textContent = `${newBalance.toLocaleString()} ₽`;
            }
            
            // Обновляем профиль, если он открыт
            if (window.location.pathname.includes('profile.html')) {
                const profileBalance = document.getElementById('profileBalance');
                if (profileBalance) {
                    profileBalance.textContent = `${newBalance.toLocaleString()} ₽`;
                }
            }
        }
    }
    
    // Синхронизируем данные
    if (window.authManager && window.authManager.currentUser) {
        setTimeout(() => {
            window.authManager.syncUserOrders();
        }, 500);
    }
});

// ОБРАБОТЧИК ДЛЯ АДМИНКИ
if (window.adminUI) {
    // Расширяем функционал админки для работы с магазином
    const originalLoadUsers = window.adminUI.loadUsers;
    window.adminUI.loadUsers = function() {
        originalLoadUsers.call(this);
        
        // Добавляем обработчики для синхронизации с магазином
        document.querySelectorAll('.user-actions .sync-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-user-id'));
                if (userId) {
                    window.syncEvents.syncUserData(userId);
                    window.syncEvents.updateRealtimeData('user');
                }
            });
        });
    };
}