// admin.js - Функционал админ-панели с полным контролем над пользователями и заявками

class AdminUI {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAdminAuth();
        this.setupEventListeners();
        this.loadData();
        this.injectStyles();
        this.setupRealTimeUpdates();
        this.setupRequestEvents();
        this.loadRequestsStats();
        this.updateRequestsMiniStats(); // Добавляем обновление мини-статистики
    }

    checkAdminAuth() {
        const savedUser = localStorage.getItem('current_user');
        if (!savedUser) {
            window.location.href = 'index.html';
            return;
        }

        this.currentUser = JSON.parse(savedUser);
        if (!adminManager.isAdmin(this.currentUser)) {
            window.location.href = 'index.html';
            return;
        }

        this.updateAdminBalance();
    }

    updateAdminBalance() {
        const balanceElement = document.getElementById('adminBalance');
        if (balanceElement && this.currentUser) {
            balanceElement.textContent = `${(this.currentUser.balance || 0).toLocaleString()} ₽`;
        }
    }

    injectStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            /* Дополнительные стили для улучшенного отображения заявок */
            .request-unread {
                background: rgba(255, 222, 0, 0.05) !important;
                border-left: 3px solid #FFDE00 !important;
            }
            
            .request-details-full {
                background: rgba(255, 255, 255, 0.03);
                border-radius: 8px;
                padding: 1rem;
                margin: 0.5rem 0;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .request-details-full h4 {
                color: #FFDE00;
                margin-bottom: 0.5rem;
                font-size: 1rem;
            }
            
            .user-info-compact {
                background: rgba(33, 150, 243, 0.1);
                padding: 0.5rem;
                border-radius: 6px;
                font-size: 0.85rem;
                margin-top: 0.5rem;
                border-left: 3px solid #2196F3;
            }
            
            /* Улучшенные кнопки действий */
            .action-btn-small {
                min-width: 28px !important;
                height: 28px !important;
                font-size: 0.8rem !important;
                padding: 0.2rem !important;
            }
            
            .quick-actions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }
            
            /* Стили для табов статистики */
            .stats-tabs {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .stat-tab {
                padding: 0.5rem 1rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border);
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .stat-tab.active {
                background: #FFDE00;
                color: #000;
                border-color: #FFDE00;
            }
            
            .stat-tab:hover {
                background: rgba(255, 222, 0, 0.2);
                border-color: #FFDE00;
            }
        `;
        document.head.appendChild(styles);
    }

    setupRealTimeUpdates() {
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.startsWith('fitness_')) {
                setTimeout(() => {
                    this.showRealTimeNotification('Данные обновлены в реальном времени');
                    this.loadData();
                }, 100);
            }
        });
    }

    setupEventListeners() {
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('current_user');
                window.location.href = 'index.html';
            });
        }

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        const visitDateInput = document.getElementById('visitDate');
        if (visitDateInput) {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            visitDateInput.value = now.toISOString().slice(0, 16);
        }

        const createUserForm = document.getElementById('createUserForm');
        if (createUserForm) {
            createUserForm.addEventListener('submit', (e) => this.createUser(e));
        }

        const editUserForm = document.getElementById('editUserForm');
        if (editUserForm) {
            editUserForm.addEventListener('submit', (e) => this.updateUser(e));
        }

        const membershipForm = document.getElementById('membershipForm');
        if (membershipForm) {
            membershipForm.addEventListener('submit', (e) => this.updateMembership(e));
        }

        const addVisitForm = document.getElementById('addVisitForm');
        if (addVisitForm) {
            addVisitForm.addEventListener('submit', (e) => this.addUserVisit(e));
        }

        // Обработка фильтров заявок
        const requestFilters = document.querySelectorAll('[data-request-filter]');
        requestFilters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                const filterType = e.target.getAttribute('data-request-filter');
                this.loadRequestsModal(filterType);
            });
        });

        // Обновляем статистику при загрузке страницы
        setTimeout(() => {
            this.updateRequestsMiniStats();
        }, 500);
    }

    switchTab(tabId) {
        document.querySelectorAll('.admin-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            }
        });

        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });

        const section = document.getElementById(`${tabId}-section`);
        if (section) {
            section.classList.add('active');
        }

        switch (tabId) {
            case 'memberships':
                this.loadMemberships();
                break;
            case 'finances':
                this.loadFinances();
                break;
        }
    }

    loadData() {
        this.loadUsers();
        this.loadStats();
        this.loadRequestsStats();
        this.updateRequestsMiniStats();
    }

    loadUsers() {
        const users = adminManager.getAllUsers();
        const tableBody = document.getElementById('usersTableBody');
        
        if (!tableBody) return;

        tableBody.innerHTML = users.map(user => {
            const membershipStatus = user.membership?.status || 'inactive';
            const membershipType = user.membership?.type || 'none';
            const balance = user.balance || 0;
            const visits = user.statistics?.monthlyVisits || 0;
            const totalVisits = user.statistics?.totalVisits || 0;
            const visitHistoryCount = user.visitHistory ? user.visitHistory.length : 0;

            const activeProgram = user.activeProgram || 'Не выбрано';
            const trainer = user.trainer || 'Не выбран';
            const nextTraining = user.nextTraining || 'Нет';

            const avatarData = window.avatarManager ? window.avatarManager.getAvatar(user.id) : null;
            const avatarHtml = avatarData 
                ? `<div class="user-avatar-small"><img src="${avatarData}" alt="${user.firstName}" onerror="this.style.display='none'; this.parentElement.querySelector('.avatar-initials').style.display='flex';" style="width:100%;height:100%;object-fit:cover;"><div class="avatar-initials" style="display:none;">${user.firstName[0]}${user.lastName[0]}</div></div>`
                : `<div class="user-avatar-small"><div class="avatar-initials">${user.firstName[0]}${user.lastName[0]}</div></div>`;

            let membershipBadge = '';
            if (user.role === 'admin') {
                membershipBadge = '<span class="membership-badge membership-admin">Админ</span>';
            } else if (user.role === 'trainer') {
                membershipBadge = '<span class="membership-badge membership-admin">Тренер</span>';
            } else if (membershipStatus === 'active') {
                membershipBadge = `<span class="membership-badge membership-active">${this.getMembershipTypeText(membershipType)}</span>`;
            } else {
                membershipBadge = '<span class="membership-badge membership-inactive">Нет</span>';
            }

            return `
                <tr>
                    <td>${user.id}</td>
                    <td>
                        ${avatarHtml}
                        ${user.firstName} ${user.lastName}
                        ${user.role === 'trainer' ? '<span class="trainer-badge">Тренер</span>' : ''}
                    </td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${membershipBadge}</td>
                    <td>${balance.toLocaleString()} ₽</td>
                    <td>${visits} (${totalVisits})<br><small style="color: var(--text-muted);">История: ${visitHistoryCount}</small></td>
                    <td>
                        <div class="user-actions">
                            <button class="action-btn full-info-btn" onclick="adminUI.showAllData(${user.id})" title="Полная информация">
                                📊
                            </button>
                            <button class="action-btn edit-btn" onclick="adminUI.editUser(${user.id})" title="Редактировать данные">
                                ✏️
                            </button>
                            <button class="action-btn edit-btn" onclick="adminUI.editMembership(${user.id})" title="Управление абонементом">
                                🎫
                            </button>
                            <button class="action-btn edit-btn" onclick="adminUI.showUserVisits(${user.id})" title="История посещений">
                                🏋️
                            </button>
                            <button class="action-btn edit-btn" onclick="adminUI.showUserPurchases(${user.id})" title="Покупки и заказы">
                                🛒
                            </button>
                            <button class="action-btn edit-btn" onclick="adminUI.showUserReviews(${user.id})" title="Отзывы пользователя">
                                ⭐
                            </button>
                            <button class="action-btn edit-btn" onclick="adminUI.showUserAppointments(${user.id})" title="Записи на тренировки">
                                📅
                            </button>
                            <button class="action-btn edit-btn" onclick="adminUI.uploadAvatarForUser(${user.id})" title="Загрузить аватарку">
                                🖼️
                            </button>
                            ${user.role !== 'admin' && user.role !== 'trainer' ? 
                                `<button class="action-btn delete-btn" onclick="adminUI.deleteUser(${user.id})" title="Удалить пользователя">
                                    🗑️
                                </button>
                                <button class="action-btn delete-btn" onclick="adminUI.removeUserAvatar(${user.id})" title="Удалить аватарку">
                                    🗑️🖼️
                                </button>` : ''
                            }
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadStats() {
        const users = adminManager.getAllUsers();
        
        const totalUsers = users.length;
        const activeUsers = users.filter(u => 
            u.role !== 'admin' && u.role !== 'trainer' && 
            u.membership?.status === 'active'
        ).length;
        
        const totalVisits = users.reduce((sum, user) => 
            sum + (user.statistics?.totalVisits || 0), 0
        );
        
        const totalIncome = activeUsers * 5000;

        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('activeUsers').textContent = activeUsers;
        document.getElementById('totalVisits').textContent = totalVisits;
        document.getElementById('totalIncome').textContent = `${totalIncome.toLocaleString()} ₽`;
    }

    loadMemberships() {
        const users = adminManager.getAllUsers().filter(u => u.role !== 'admin');
        const content = document.getElementById('membershipsContent');
        
        if (!content) return;

        content.innerHTML = `
            <table class="users-table">
                <thead>
                    <tr>
                        <th>Пользователь</th>
                        <th>Тип абонемента</th>
                        <th>Статус</th>
                        <th>Срок действия</th>
                        <th>Посещений</th>
                        <th>Осталось</th>
                        <th>Тренер</th>
                        <th>Программа</th>
                        <th>История посещений</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => {
                        const membership = user.membership || {};
                        const visits = membership.visitsPerMonth || 0;
                        const used = membership.visitsUsed || 0;
                        const remaining = visits - used;
                        const visitHistoryCount = user.visitHistory ? user.visitHistory.length : 0;
                        
                        let statusClass = '';
                        if (membership.status === 'active') {
                            statusClass = 'membership-active';
                        } else if (membership.status === 'frozen') {
                            statusClass = 'membership-admin';
                        } else {
                            statusClass = 'membership-inactive';
                        }
                        
                        const endDate = membership.endDate ? 
                            new Date(membership.endDate).toLocaleDateString('ru-RU') : 
                            '—';
                        
                        return `
                            <tr>
                                <td>${user.firstName} ${user.lastName} ${user.role === 'trainer' ? '<span class="trainer-badge">Тренер</span>' : ''}</td>
                                <td>${this.getMembershipTypeText(membership.type)}</td>
                                <td>
                                    <span class="membership-badge ${statusClass}">
                                        ${this.getMembershipStatusText(membership.status)}
                                    </span>
                                </td>
                                <td>${endDate}</td>
                                <td>${used}/${visits}</td>
                                <td>${remaining}</td>
                                <td>${user.trainer || 'Не выбран'}</td>
                                <td>${user.activeProgram || 'Не выбрано'}</td>
                                <td>${visitHistoryCount}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    loadFinances() {
        const content = document.getElementById('financesContent');
        if (!content) return;

        const finances = {
            monthly: 250000,
            quarterly: 750000,
            annual: 3000000,
            expected: 4000000
        };

        content.innerHTML = `
            <div class="admin-form">
                <h3 class="text-accent mb-3">Финансовая статистика</h3>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Доход за месяц</label>
                        <div class="form-input" style="background: rgba(255, 222, 0, 0.1);">
                            <strong>${finances.monthly.toLocaleString()} ₽</strong>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Доход за квартал</label>
                        <div class="form-input" style="background: rgba(255, 222, 0, 0.1);">
                            <strong>${finances.quarterly.toLocaleString()} ₽</strong>
                        </div>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Доход за год</label>
                        <div class="form-input" style="background: rgba(255, 222, 0, 0.1);">
                            <strong>${finances.annual.toLocaleString()} ₽</strong>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Прогноз до конца года</label>
                        <div class="form-input" style="background: rgba(255, 222, 0, 0.1);">
                            <strong>${finances.expected.toLocaleString()} ₽</strong>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Экспорт данных</label>
                    <div class="form-actions">
                        <button class="btn-secondary" onclick="adminUI.exportReport('monthly')">
                            📥 Отчет за месяц
                        </button>
                        <button class="btn-secondary" onclick="adminUI.exportReport('annual')">
                            📥 Годовой отчет
                        </button>
                        <button class="btn-secondary" onclick="adminUI.exportReport('finance')">
                            📥 Финансовый отчет
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // ========== СИСТЕМА ЗАЯВОК ==========

    updateRequestsMiniStats() {
        const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
        const pending = requests.filter(r => r.status === 'pending').length;
        const approved = requests.filter(r => r.status === 'approved').length;
        const rejected = requests.filter(r => r.status === 'rejected').length;
        
        const miniPending = document.getElementById('miniPendingRequests');
        const miniApproved = document.getElementById('miniApprovedRequests');
        const miniRejected = document.getElementById('miniRejectedRequests');
        
        if (miniPending) miniPending.textContent = pending;
        if (miniApproved) miniApproved.textContent = approved;
        if (miniRejected) miniRejected.textContent = rejected;
        
        // Обновляем счетчики во вкладках
        const pendingTab = document.getElementById('pendingTabCount');
        const approvedTab = document.getElementById('approvedTabCount');
        const rejectedTab = document.getElementById('rejectedTabCount');
        
        if (pendingTab) pendingTab.textContent = pending;
        if (approvedTab) approvedTab.textContent = approved;
        if (rejectedTab) rejectedTab.textContent = rejected;
    }

    loadRequestsStats() {
        const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
        
        const totalRequests = requests.length;
        const pendingRequests = requests.filter(r => r.status === 'pending').length;
        const approvedRequests = requests.filter(r => r.status === 'approved').length;
        const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
        const trashRequests = requests.filter(r => r.status === 'trash').length;
        
        // Обновляем статистику на главной
        const totalRequestsElement = document.getElementById('totalRequests');
        if (totalRequestsElement) {
            totalRequestsElement.textContent = pendingRequests;
        }
        
        // Обновляем счетчики в модальном окне
        const totalCount = document.getElementById('totalRequestsCount');
        const approvedCount = document.getElementById('approvedRequestsCount');
        const rejectedCount = document.getElementById('rejectedRequestsCount');
        
        if (totalCount) totalCount.textContent = pendingRequests;
        if (approvedCount) approvedCount.textContent = approvedRequests;
        if (rejectedCount) rejectedCount.textContent = rejectedRequests;
        
        this.updateRequestsMiniStats();
    }

    showRequestsModal(initialFilter = 'pending') {
        this.loadRequestsModal(initialFilter);
        document.getElementById('requestsModal').classList.add('active');
    }

    loadRequestsModal(filter = 'pending') {
        const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
        const tableBody = document.getElementById('requestsTableBody');
        
        if (!tableBody) return;
        
        // Сортируем заявки: новые сверху
        requests.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let filteredRequests = [];
        let title = '';
        
        switch(filter) {
            case 'pending':
                filteredRequests = requests.filter(r => r.status === 'pending');
                title = '📬 Новые заявки (требуют обработки)';
                break;
            case 'approved':
                filteredRequests = requests.filter(r => r.status === 'approved');
                title = '✅ Принятые заявки (архив)';
                break;
            case 'rejected':
                filteredRequests = requests.filter(r => r.status === 'rejected');
                title = '❌ Отклоненные заявки (архив)';
                break;
            default:
                filteredRequests = requests.filter(r => r.status !== 'trash');
                title = '📋 Все заявки';
        }
        
        // Обновляем заголовок модального окна
        const modalHeader = document.getElementById('requestsModalTitle');
        if (modalHeader) {
            modalHeader.textContent = title;
        }
        
        tableBody.innerHTML = filteredRequests.map(request => {
            const date = new Date(request.date).toLocaleString('ru-RU');
            const isUnread = !request.isRead;
            
            // Определяем статус
            let statusBadge = '';
            switch(request.status) {
                case 'pending':
                    statusBadge = '<span class="membership-badge membership-inactive">Новая</span>';
                    break;
                case 'approved':
                    statusBadge = '<span class="membership-badge membership-active">Принята</span>';
                    break;
                case 'rejected':
                    statusBadge = '<span class="membership-badge membership-admin">Отклонена</span>';
                    break;
            }
            
            // Полная информация для отображения в таблице
            const messagePreview = request.message ? 
                (request.message.length > 50 ? request.message.substring(0, 50) + '...' : request.message) : 
                '—';
            
            return `
                <tr class="${isUnread ? 'request-unread' : ''}">
                    <td>
                        <div style="font-weight: 600; color: ${isUnread ? '#FFDE00' : 'var(--text-primary)'}">
                            ${isUnread ? '📬 ' : ''}${request.id}
                        </div>
                    </td>
                    <td>
                        <div>${date}</div>
                        <small style="color: var(--text-muted); font-size: 0.8rem;">
                            ${request.processedDate ? `Обработано: ${new Date(request.processedDate).toLocaleDateString('ru-RU')}` : 'Ожидает обработки'}
                        </small>
                    </td>
                    <td>
                        <strong>${request.name}</strong><br>
                        <small>${request.phone}</small><br>
                        <small style="color: #2196F3;">${request.email || ''}</small>
                    </td>
                    <td>
                        <div style="max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${this.getProgramName(request.program)}
                        </div>
                    </td>
                    <td>
                        <div style="max-width: 200px; max-height: 60px; overflow: hidden; text-overflow: ellipsis;">
                            ${messagePreview}
                        </div>
                    </td>
                    <td>
                        ${statusBadge}
                        ${request.processedBy ? `<br><small style="color: var(--text-muted);">${request.processedBy}</small>` : ''}
                    </td>
                    <td>
                        <div class="user-actions">
                            <button class="action-btn info-btn action-btn-small" onclick="adminUI.showRequestDetailsFull(${request.id})" title="Полная информация">
                                📄
                            </button>
                            
                            ${request.status === 'pending' ? `
                                <button class="action-btn edit-btn action-btn-small" onclick="adminUI.approveRequestToArchive(${request.id})" title="Принять в архив">
                                    ✅
                                </button>
                                <button class="action-btn delete-btn action-btn-small" onclick="adminUI.rejectRequestToArchive(${request.id})" title="Отклонить в архив">
                                    ❌
                                </button>
                            ` : ''}
                            
                            ${request.status === 'approved' ? `
                                <button class="action-btn edit-btn action-btn-small" onclick="adminUI.moveRequestToRejected(${request.id})" title="Переместить в отклоненные">
                                    🔄
                                </button>
                                <button class="action-btn delete-btn action-btn-small" onclick="adminUI.deleteRequestPermanently(${request.id})" title="Удалить навсегда">
                                    🗑️
                                </button>
                            ` : ''}
                            
                            ${request.status === 'rejected' ? `
                                <button class="action-btn edit-btn action-btn-small" onclick="adminUI.moveRequestToApproved(${request.id})" title="Переместить в принятые">
                                    🔄
                                </button>
                                <button class="action-btn delete-btn action-btn-small" onclick="adminUI.deleteRequestPermanently(${request.id})" title="Удалить навсегда">
                                    🗑️
                                </button>
                            ` : ''}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        // Обновляем статистику
        this.updateRequestsStats();
        this.updateRequestsMiniStats();
    }

    setupRequestEvents() {
        // Слушаем новые заявки из других вкладок
        window.addEventListener('newContactRequest', (event) => {
            this.showRealTimeNotification('📬 Поступила новая заявка!');
            this.updateRequestsMiniStats();
            this.loadRequestsStats();
            
            // Если модальное окно заявок открыто, обновляем его
            if (document.getElementById('requestsModal')?.classList.contains('active')) {
                this.loadRequestsModal('pending');
            }
        });
        
        // Обновляем при изменении в localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'fitness_requests') {
                setTimeout(() => {
                    this.updateRequestsMiniStats();
                    this.loadRequestsStats();
                }, 100);
            }
        });
    }

    getProgramName(programKey) {
        const programs = {
            'strength': 'Силовой тренинг',
            'functional': 'Функциональный тренинг',
            'cardio': 'Кардио тренировки',
            'yoga': 'Йога и стретчинг',
            'personal': 'Персональные тренировки',
            'group': 'Групповые занятия'
        };
        return programs[programKey] || programKey;
    }

    approveRequestToArchive(requestId) {
        const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
        const requestIndex = requests.findIndex(r => r.id === requestId);
        
        if (requestIndex !== -1) {
            requests[requestIndex].status = 'approved';
            requests[requestIndex].isRead = true;
            requests[requestIndex].processedBy = this.currentUser ? `${this.currentUser.firstName} ${this.currentUser.lastName}` : 'Администратор';
            requests[requestIndex].processedDate = new Date().toISOString();
            requests[requestIndex].archiveDate = new Date().toISOString();
            
            localStorage.setItem('fitness_requests', JSON.stringify(requests));
            
            this.showNotification('✅ Заявка принята и перемещена в архив');
            this.loadRequestsModal('pending');
            this.updateRequestsMiniStats();
        }
    }

    rejectRequestToArchive(requestId) {
        const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
        const requestIndex = requests.findIndex(r => r.id === requestId);
        
        if (requestIndex !== -1) {
            requests[requestIndex].status = 'rejected';
            requests[requestIndex].isRead = true;
            requests[requestIndex].processedBy = this.currentUser ? `${this.currentUser.firstName} ${this.currentUser.lastName}` : 'Администратор';
            requests[requestIndex].processedDate = new Date().toISOString();
            requests[requestIndex].archiveDate = new Date().toISOString();
            
            localStorage.setItem('fitness_requests', JSON.stringify(requests));
            
            this.showNotification('❌ Заявка отклонена и перемещена в архив');
            this.loadRequestsModal('pending');
            this.updateRequestsMiniStats();
        }
    }

    moveRequestToApproved(requestId) {
        const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
        const requestIndex = requests.findIndex(r => r.id === requestId);
        
        if (requestIndex !== -1) {
            requests[requestIndex].status = 'approved';
            requests[requestIndex].processedDate = new Date().toISOString();
            
            localStorage.setItem('fitness_requests', JSON.stringify(requests));
            
            this.showNotification('✅ Заявка перемещена в принятые');
            this.loadRequestsModal('rejected');
            this.updateRequestsMiniStats();
        }
    }

    moveRequestToRejected(requestId) {
        const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
        const requestIndex = requests.findIndex(r => r.id === requestId);
        
        if (requestIndex !== -1) {
            requests[requestIndex].status = 'rejected';
            requests[requestIndex].processedDate = new Date().toISOString();
            
            localStorage.setItem('fitness_requests', JSON.stringify(requests));
            
            this.showNotification('❌ Заявка перемещена в отклоненные');
            this.loadRequestsModal('approved');
            this.updateRequestsMiniStats();
        }
    }

    deleteRequestPermanently(requestId) {
        if (confirm('Удалить заявку навсегда? Это действие нельзя отменить.')) {
            const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
            const filteredRequests = requests.filter(r => r.id !== requestId);
            
            localStorage.setItem('fitness_requests', JSON.stringify(filteredRequests));
            
            this.showNotification('Заявка удалена навсегда');
            this.loadRequestsModal();
            this.updateRequestsMiniStats();
        }
    }

    showRequestDetailsFull(requestId) {
        const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
        const request = requests.find(r => r.id === requestId);
        
        if (!request) return;
        
        // Помечаем как прочитанную
        const requestIndex = requests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1 && !requests[requestIndex].isRead) {
            requests[requestIndex].isRead = true;
            localStorage.setItem('fitness_requests', JSON.stringify(requests));
            this.updateRequestsMiniStats();
        }
        
        const modal = this.createIntegratedModal('Полная информация о заявке', `
            <h2 class="text-accent mb-3">Заявка #${request.id}</h2>
            
            <div class="info-section">
                <h4 class="text-accent">📞 Контактная информация</h4>
                <div class="info-grid">
                    <div class="info-item"><strong>Имя клиента:</strong> <span style="font-size: 1.1rem;">${request.name}</span></div>
                    <div class="info-item"><strong>Телефон:</strong> <span style="font-size: 1.1rem; color: #4CAF50;">${request.phone}</span></div>
                    <div class="info-item"><strong>Email:</strong> <span style="font-size: 1.1rem; color: #2196F3;">${request.email || '—'}</span></div>
                    <div class="info-item"><strong>Дата заявки:</strong> <span>${new Date(request.date).toLocaleString('ru-RU')}</span></div>
                </div>
            </div>
            
            <div class="info-section">
                <h4 class="text-accent">🏋️ Детали программы</h4>
                <div class="info-grid">
                    <div class="info-item"><strong>Интересующая программа:</strong> <span style="color: #FFDE00; font-weight: 600;">${request.programName || this.getProgramName(request.program)}</span></div>
                </div>
            </div>
            
            ${request.message ? `
            <div class="info-section">
                <h4 class="text-accent">💬 Сообщение клиента</h4>
                <div class="contact-message-full" style="background: rgba(33, 150, 243, 0.1); border-left-color: #2196F3;">
                    ${request.message}
                </div>
            </div>
            ` : ''}
            
            ${request.userInfo ? `
            <div class="info-section">
                <h4 class="text-accent">👤 Данные пользователя (если авторизован)</h4>
                <div class="user-info-compact">
                    ${request.userInfo.replace(/ \| /g, '<br>')}
                </div>
            </div>
            ` : ''}
            
            <div class="info-section">
                <h4 class="text-accent">📋 Статус заявки</h4>
                <div class="info-grid">
                    <div class="info-item"><strong>Текущий статус:</strong> 
                        <span class="membership-badge ${
                            request.status === 'pending' ? 'membership-inactive' :
                            request.status === 'approved' ? 'membership-active' :
                            'membership-admin'
                        }">
                            ${
                                request.status === 'pending' ? 'Новая (ожидает)' :
                                request.status === 'approved' ? '✅ Принята' :
                                '❌ Отклонена'
                            }
                        </span>
                    </div>
                    
                    ${request.processedDate ? `
                    <div class="info-item"><strong>Обработана:</strong> <span>${new Date(request.processedDate).toLocaleString('ru-RU')}</span></div>
                    <div class="info-item"><strong>Обработал:</strong> <span>${request.processedBy || 'Администратор'}</span></div>
                    ` : ''}
                </div>
            </div>
            
            ${request.notes ? `
            <div class="info-section">
                <h4 class="text-accent">📝 Заметки администратора</h4>
                <div style="background: rgba(255, 222, 0, 0.1); padding: 1rem; border-radius: 8px; border: 1px solid rgba(255, 222, 0, 0.3);">
                    ${request.notes}
                </div>
            </div>
            ` : ''}
            
            <div class="info-section">
                <h4 class="text-accent">⚡ Быстрые действия</h4>
                <div class="data-actions-bar">
                    ${request.status === 'pending' ? `
                        <button class="btn-primary" onclick="adminUI.approveRequestToArchive(${request.id}); this.closest('.integrated-data-modal').remove();" style="background: #4CAF50; border-color: #4CAF50;">
                            ✅ Принять заявку
                        </button>
                        <button class="btn-secondary" onclick="adminUI.rejectRequestToArchive(${request.id}); this.closest('.integrated-data-modal').remove();" style="background: rgba(244, 67, 54, 0.2); color: #F44336; border-color: #F44336;">
                            ❌ Отклонить заявку
                        </button>
                    ` : ''}
                    
                    ${request.status === 'approved' ? `
                        <button class="btn-secondary" onclick="adminUI.moveRequestToRejected(${request.id}); this.closest('.integrated-data-modal').remove();" style="background: rgba(255, 193, 7, 0.2); color: #FFC107; border-color: #FFC107;">
                            🔄 Переместить в отклоненные
                        </button>
                    ` : ''}
                    
                    ${request.status === 'rejected' ? `
                        <button class="btn-secondary" onclick="adminUI.moveRequestToApproved(${request.id}); this.closest('.integrated-data-modal').remove();" style="background: rgba(76, 175, 80, 0.2); color: #4CAF50; border-color: #4CAF50;">
                            🔄 Переместить в принятые
                        </button>
                    ` : ''}
                    
                    <button class="btn-secondary" onclick="this.closest('.integrated-data-modal').remove()">
                        Закрыть
                    </button>
                </div>
            </div>
            
            <div class="info-section">
                <h4 class="text-accent">📝 Добавить заметку</h4>
                <div class="form-group">
                    <textarea class="form-input" id="requestNotesFull" rows="3" placeholder="Добавьте заметки по этой заявке...">${request.notes || ''}</textarea>
                    <button class="btn-secondary" style="margin-top: 0.5rem;" onclick="adminUI.saveRequestNotes(${request.id}, 'requestNotesFull')">
                        💾 Сохранить заметки
                    </button>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
    }

    saveRequestNotes(requestId, textareaId = 'requestNotes') {
        const notesElement = document.getElementById(textareaId);
        if (!notesElement) return;
        
        const notes = notesElement.value || '';
        const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
        const requestIndex = requests.findIndex(r => r.id === requestId);
        
        if (requestIndex !== -1) {
            requests[requestIndex].notes = notes;
            localStorage.setItem('fitness_requests', JSON.stringify(requests));
            this.showNotification('📝 Заметки сохранены');
        }
    }

    // Обновленный метод для обновления статистики в модальном окне
    updateRequestsStats() {
        const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
        
        const pendingRequests = requests.filter(r => r.status === 'pending').length;
        const approvedRequests = requests.filter(r => r.status === 'approved').length;
        const rejectedRequests = requests.filter(r => r.status === 'rejected').length;
        
        // Обновляем счетчики в модальном окне
        const elements = {
            'totalRequestsCount': pendingRequests,
            'approvedRequestsCount': approvedRequests,
            'rejectedRequestsCount': rejectedRequests
        };
        
        Object.entries(elements).forEach(([id, count]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = count;
            }
        });
    }

    markAllAsRead() {
        const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
        let updated = false;
        
        requests.forEach(request => {
            if (!request.isRead && request.status !== 'trash') {
                request.isRead = true;
                updated = true;
            }
        });
        
        if (updated) {
            localStorage.setItem('fitness_requests', JSON.stringify(requests));
            this.showNotification('Все заявки помечены как прочитанные');
            this.loadRequestsModal();
            this.updateRequestsMiniStats();
        } else {
            this.showNotification('Нет непрочитанных заявок');
        }
    }

    emptyRequestsTrash() {
        if (confirm('Очистить корзину? Все заявки в корзине будут удалены навсегда.')) {
            const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
            const filteredRequests = requests.filter(r => r.status !== 'trash');
            
            localStorage.setItem('fitness_requests', JSON.stringify(filteredRequests));
            
            this.showNotification('Корзина очищена');
            this.loadRequestsModal();
            this.updateRequestsMiniStats();
        }
    }

    exportRequests() {
        const requests = JSON.parse(localStorage.getItem('fitness_requests')) || [];
        
        let csvContent = 'ID,Дата,Имя,Телефон,Email,Программа,Сообщение,Статус,Обработано,Обработал\n';
        
        requests.forEach(request => {
            const status = request.status === 'pending' ? 'Новая' :
                         request.status === 'approved' ? 'Одобрена' :
                         request.status === 'rejected' ? 'Отклонена' : 'В корзине';
            
            csvContent += `${request.id},${new Date(request.date).toLocaleString('ru-RU')},"${request.name}","${request.phone}","${request.email}","${request.programName || this.getProgramName(request.program)}","${request.message || ''}","${status}","${request.processedDate ? new Date(request.processedDate).toLocaleDateString('ru-RU') : ''}","${request.processedBy || ''}"\n`;
        });
        
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `requests_export_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        
        this.showNotification('Заявки экспортированы в CSV');
    }

    // ========== ОСТАЛЬНЫЕ МЕТОДЫ ==========

    getMembershipTypeText(type) {
        const types = {
            'none': 'Нет',
            'monthly': 'Месячный',
            'quarterly': 'Квартальный',
            'annual': 'Годовой',
            'unlimited': 'Безлимитный',
            'admin': 'Администратор',
            'trainer': 'Тренер'
        };
        return types[type] || type;
    }

    getMembershipStatusText(status) {
        const statuses = {
            'active': 'Активен',
            'inactive': 'Неактивен',
            'frozen': 'Заморожен'
        };
        return statuses[status] || status;
    }

    showAllData(userId) {
        const user = adminManager.getUserById(userId);
        if (!user) return;

        const modal = this.createIntegratedModal('Полная информация о пользователе', `
            <h2 class="text-accent mb-3">Полная информация: ${user.firstName} ${user.lastName}</h2>
            <div class="user-full-info">
                <div class="info-section">
                    <h4 class="text-accent">Личные данные</h4>
                    <div class="info-grid">
                        <div class="info-item"><strong>ID:</strong> <span>${user.id}</span></div>
                        <div class="info-item"><strong>ФИО:</strong> <span>${user.firstName} ${user.lastName}</span></div>
                        <div class="info-item"><strong>Email:</strong> <span>${user.email}</span></div>
                        <div class="info-item"><strong>Телефон:</strong> <span>${user.phone}</span></div>
                        <div class="info-item"><strong>Роль:</strong> <span>${user.role}</span></div>
                        <div class="info-item"><strong>Дата регистрации:</strong> <span>${new Date(user.registrationDate).toLocaleString('ru-RU')}</span></div>
                    </div>
                </div>
                
                <div class="info-section">
                    <h4 class="text-accent">Финансы</h4>
                    <div class="info-grid">
                        <div class="info-item"><strong>Баланс:</strong> <span>${user.balance.toLocaleString()} ₽</span></div>
                        <div class="info-item"><strong>Статус:</strong> <span>${user.isActive ? 'Активен' : 'Заблокирован'}</span></div>
                    </div>
                </div>
                
                ${user.membership ? `
                <div class="info-section">
                    <h4 class="text-accent">Абонемент</h4>
                    <div class="info-grid">
                        <div class="info-item"><strong>Тип:</strong> <span>${this.getMembershipTypeText(user.membership.type)}</span></div>
                        <div class="info-item"><strong>Статус:</strong> <span>${this.getMembershipStatusText(user.membership.status)}</span></div>
                        <div class="info-item"><strong>Начало:</strong> <span>${user.membership.startDate ? new Date(user.membership.startDate).toLocaleDateString('ru-RU') : '-'}</span></div>
                        <div class="info-item"><strong>Окончание:</strong> <span>${user.membership.endDate ? new Date(user.membership.endDate).toLocaleDateString('ru-RU') : '-'}</span></div>
                        <div class="info-item"><strong>Посещений/месяц:</strong> <span>${user.membership.visitsPerMonth}</span></div>
                        <div class="info-item"><strong>Использовано:</strong> <span>${user.membership.visitsUsed}</span></div>
                        <div class="info-item"><strong>Осталось:</strong> <span>${user.membership.visitsPerMonth - user.membership.visitsUsed}</span></div>
                    </div>
                </div>
                ` : ''}
                
                <div class="info-section">
                    <h4 class="text-accent">Тренировки</h4>
                    <div class="info-grid">
                        <div class="info-item"><strong>Активная программа:</strong> <span>${user.activeProgram || 'Не выбрано'}</span></div>
                        <div class="info-item"><strong>Тренер:</strong> <span>${user.trainer || 'Не выбран'}</span></div>
                        <div class="info-item"><strong>Следующая тренировка:</strong> <span>${user.nextTraining || 'Не запланировано'}</span></div>
                    </div>
                </div>
                
                ${user.statistics ? `
                <div class="info-section">
                    <h4 class="text-accent">Статистика</h4>
                    <div class="info-grid">
                        <div class="info-item"><strong>Всего посещений:</strong> <span>${user.statistics.totalVisits || 0}</span></div>
                        <div class="info-item"><strong>Посещений в месяце:</strong> <span>${user.statistics.monthlyVisits || 0}</span></div>
                        <div class="info-item"><strong>Последнее посещение:</strong> <span>${user.statistics.lastVisit ? new Date(user.statistics.lastVisit).toLocaleString('ru-RU') : 'Нет'}</span></div>
                    </div>
                </div>
                ` : ''}
            </div>
            
            <div class="data-actions-bar">
                <button class="btn-primary" onclick="adminUI.showEditUserModal(${userId})">Редактировать</button>
                <button class="btn-secondary" onclick="adminUI.exportUserData(${userId})">📥 Экспорт данных</button>
                <button class="btn-secondary" onclick="adminUI.forceSyncToProfile(${userId}, 'all')">
                    🔄 Полная синхронизация
                </button>
            </div>
        `);

        document.body.appendChild(modal);
    }

    showEditUserModal(userId) {
        const user = adminManager.getUserById(userId);
        if (!user) return;

        document.getElementById('editUserId').value = userId;
        document.getElementById('editFirstName').value = user.firstName;
        document.getElementById('editLastName').value = user.lastName;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPhone').value = user.phone;
        document.getElementById('editBalance').value = user.balance || 0;

        document.getElementById('editActiveProgram').value = user.activeProgram || '';
        document.getElementById('editTrainer').value = user.trainer || '';
        document.getElementById('editNextTraining').value = user.nextTraining || '';

        document.getElementById('editUserModal').classList.add('active');
    }

    editUser(userId) {
        this.showEditUserModal(userId);
    }

    editMembership(userId) {
        this.showMembershipModal(userId);
    }

    deleteUser(userId) {
        if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
            if (adminManager.deleteUser(userId)) {
                localStorage.removeItem(`fitness_avatar_${userId}`);
                localStorage.removeItem(`fitness_purchases_${userId}`);
                localStorage.removeItem(`fitness_reviews_${userId}`);
                localStorage.removeItem(`fitness_appointments_${userId}`);
                
                this.showNotification('Пользователь удален');
                this.loadData();
            }
        }
    }

    async uploadAvatarForUser(userId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (window.avatarManager) {
                try {
                    const compressedAvatar = await window.avatarManager.compressImage(file);
                    window.avatarManager.saveAvatar(userId, compressedAvatar);
                    this.showNotification('Аватарка пользователя обновлена');
                    this.loadUsers();
                    
                    // Синхронизируем с профилем
                    this.forceSyncToProfile(userId, 'avatar');
                } catch (error) {
                    console.error('Ошибка при загрузке аватарки:', error);
                    this.showNotification('Ошибка при обработке изображения', true);
                }
            }
        };
        
        input.click();
    }

    removeUserAvatar(userId) {
        if (confirm('Удалить аватарку пользователя?')) {
            localStorage.removeItem(`fitness_avatar_${userId}`);
            if (window.avatarManager) {
                window.avatarManager.removeAvatarByUserId(userId);
            }
            this.showNotification('Аватарка пользователя удалена');
            this.loadUsers();
            this.forceSyncToProfile(userId, 'avatar');
        }
    }

    createUser(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            activeProgram: '',
            trainer: '',
            nextTraining: ''
        };

        if (adminManager.createUser(userData)) {
            this.showNotification('Пользователь создан');
            this.closeModal('createUserModal');
            this.loadData();
        }
    }

    updateUser(event) {
        event.preventDefault();
        const userId = parseInt(document.getElementById('editUserId').value);
        
        const updates = {
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            balance: parseInt(document.getElementById('editBalance').value) || 0,
            activeProgram: document.getElementById('editActiveProgram').value || '',
            trainer: document.getElementById('editTrainer').value || '',
            nextTraining: document.getElementById('editNextTraining').value || ''
        };

        if (adminManager.updateUser(userId, updates)) {
            this.showNotification('Данные пользователя обновлены');
            this.closeModal('editUserModal');
            this.loadData();
            this.forceSyncToProfile(userId, 'profile');
            
            if (window.authManager && window.authManager.currentUser && window.authManager.currentUser.id === userId) {
                window.authManager.updateProfilePage();
            }
        }
    }

    updateMembership(event) {
        event.preventDefault();
        
        let userId = parseInt(document.getElementById('membershipUserId').value);
        if (!userId || isNaN(userId)) {
            userId = parseInt(document.getElementById('membershipUserSelect').value);
        }
        
        if (!userId || isNaN(userId)) {
            this.showNotification('Выберите пользователя', true);
            return;
        }
        
        const membershipData = {
            type: document.getElementById('membershipType').value,
            status: document.getElementById('membershipStatus').value,
            endDate: document.getElementById('membershipEndDate').value || null,
            visitsPerMonth: parseInt(document.getElementById('membershipVisits').value) || 0,
            visitsUsed: parseInt(document.getElementById('membershipVisitsUsed').value) || 0
        };

        if (adminManager.updateMembership(userId, membershipData)) {
            this.showNotification('Абонемент обновлен');
            this.closeModal('membershipModal');
            this.loadData();
            this.forceSyncToProfile(userId, 'membership');
            
            if (window.authManager && window.authManager.currentUser && window.authManager.currentUser.id === userId) {
                window.authManager.updateProfilePage();
            }
        }
    }

    addUserVisit(event) {
        event.preventDefault();
        const userId = parseInt(document.getElementById('visitUserId').value);
        const visitDate = document.getElementById('visitDate').value;
        const visitType = document.getElementById('visitType').value;
        
        const visitData = {
            date: visitDate,
            type: visitType,
            notes: 'Добавлено администратором'
        };
        
        if (window.adminManager.addVisitWithHistory(userId, visitData)) {
            this.showNotification('Посещение добавлено');
            this.closeModal('addVisitModal');
            this.loadData();
            this.forceSyncToProfile(userId, 'visits');
            
            if (window.authManager && window.authManager.currentUser && window.authManager.currentUser.id === userId) {
                window.authManager.updateProfilePage();
            }
        }
    }

    addVisitForUser(userId) {
        const modal = this.createIntegratedModal('Добавить посещение', `
            <h2 class="text-accent mb-3">Добавить посещение</h2>
            <form id="addVisitFormUser">
                <div class="form-group">
                    <label class="form-label">Дата посещения *</label>
                    <input type="datetime-local" class="form-input" id="visitDateUser" value="${new Date().toISOString().slice(0, 16)}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Тип тренировки *</label>
                    <select class="form-input" id="visitTypeUser" required>
                        <option value="Силовая">Силовая</option>
                        <option value="Кардио">Кардио</option>
                        <option value="Групповая">Групповая</option>
                        <option value="Персональная">Персональная</option>
                        <option value="Йога и стретчинг">Йога и стретчинг</option>
                        <option value="Функциональный тренинг">Функциональный тренинг</option>
                        <option value="Другое">Другое</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Заметки</label>
                    <textarea class="form-input" id="visitNotesUser" placeholder="Дополнительная информация..."></textarea>
                </div>
                <div class="data-actions-bar">
                    <button type="button" class="btn-secondary" onclick="this.closest('.integrated-data-modal').remove()">Отмена</button>
                    <button type="submit" class="btn-primary">Добавить посещение</button>
                </div>
            </form>
        `);
        
        const form = modal.querySelector('#addVisitFormUser');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const visitData = {
                date: document.getElementById('visitDateUser').value,
                type: document.getElementById('visitTypeUser').value,
                notes: document.getElementById('visitNotesUser').value
            };
            
            if (window.adminManager.addVisitWithHistory(userId, visitData)) {
                this.showNotification('Посещение добавлено');
                modal.remove();
                this.loadData();
                this.forceSyncToProfile(userId, 'visits');
            }
        });
        
        document.body.appendChild(modal);
    }

    clearUserVisits(userId) {
        if (confirm('Вы уверены, что хотите очистить историю посещений?')) {
            if (adminManager.clearVisitHistory(userId)) {
                this.showNotification('История посещений очищена');
                this.loadData();
                this.forceSyncToProfile(userId, 'visits');
            }
        }
    }

    addPurchaseForUser(userId) {
        const modal = this.createIntegratedModal('Добавить покупку', `
            <h2 class="text-accent mb-3">Добавить покупку</h2>
            <form id="addPurchaseForm">
                <div class="form-group">
                    <label class="form-label">Название товара *</label>
                    <input type="text" class="form-input" id="productName" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Количество *</label>
                        <input type="number" class="form-input" id="productQuantity" value="1" min="1" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Цена за единицу (₽) *</label>
                        <input type="number" class="form-input" id="productPrice" min="0" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Статус *</label>
                    <select class="form-input" id="purchaseStatus" required>
                        <option value="completed">Завершено</option>
                        <option value="pending">В обработке</option>
                        <option value="cancelled">Отменено</option>
                    </select>
                </div>
                <div class="data-actions-bar">
                    <button type="button" class="btn-secondary" onclick="this.closest('.integrated-data-modal').remove()">Отмена</button>
                    <button type="submit" class="btn-primary">Добавить покупку</button>
                </div>
            </form>
        `);
        
        const form = modal.querySelector('#addPurchaseForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const quantity = parseInt(document.getElementById('productQuantity').value);
            const price = parseInt(document.getElementById('productPrice').value);
            
            const purchase = {
                id: Date.now(),
                productName: document.getElementById('productName').value,
                quantity: quantity,
                price: price,
                total: quantity * price,
                date: new Date().toISOString(),
                status: document.getElementById('purchaseStatus').value
            };
            
            const purchases = JSON.parse(localStorage.getItem(`fitness_purchases_${userId}`)) || [];
            purchases.push(purchase);
            localStorage.setItem(`fitness_purchases_${userId}`, JSON.stringify(purchases));
            
            // Обновляем баланс
            this.updateUserBalanceFromPurchases(userId, purchases);
            
            this.showNotification('Покупка добавлена');
            modal.remove();
            this.loadData();
            this.forceSyncToShop(userId);
        });
        
        document.body.appendChild(modal);
    }

    exportPurchases(userId) {
        const user = adminManager.getUserById(userId);
        if (!user) return;
        
        const purchases = JSON.parse(localStorage.getItem(`fitness_purchases_${userId}`)) || [];
        let content = 'Дата,Товар,Количество,Цена,Сумма,Статус\n';
        
        purchases.forEach(purchase => {
            const date = new Date(purchase.date || new Date()).toLocaleDateString('ru-RU');
            const status = purchase.status === 'completed' ? 'Завершено' : 
                          purchase.status === 'pending' ? 'В обработке' : 'Отменено';
            
            content += `${date},"${purchase.productName}",${purchase.quantity},${purchase.price},${purchase.total},${status}\n`;
        });
        
        const filename = `purchases_${user.firstName}_${user.lastName}_${new Date().toISOString().slice(0, 10)}.csv`;
        const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        
        this.showNotification(`Отчет покупок скачан: ${filename}`);
    }

    addReviewForUser(userId) {
        const modal = this.createIntegratedModal('Добавить отзыв', `
            <h2 class="text-accent mb-3">Добавить отзыв</h2>
            <form id="addReviewForm">
                <div class="form-group">
                    <label class="form-label">Название товара *</label>
                    <input type="text" class="form-input" id="reviewProductName" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Оценка (1-5) *</label>
                    <select class="form-input" id="reviewRating" required>
                        <option value="5">5 ⭐ - Отлично</option>
                        <option value="4">4 ⭐ - Хорошо</option>
                        <option value="3">3 ⭐ - Удовлетворительно</option>
                        <option value="2">2 ⭐ - Плохо</option>
                        <option value="1">1 ⭐ - Очень плохо</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Текст отзыва</label>
                    <textarea class="form-input" id="reviewText" rows="4" placeholder="Текст отзыва..."></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Статус публикации</label>
                    <select class="form-input" id="reviewPublished">
                        <option value="true">Опубликован</option>
                        <option value="false">Не опубликован</option>
                    </select>
                </div>
                <div class="data-actions-bar">
                    <button type="button" class="btn-secondary" onclick="this.closest('.integrated-data-modal').remove()">Отмена</button>
                    <button type="submit" class="btn-primary">Добавить отзыв</button>
                </div>
            </form>
        `);
        
        const form = modal.querySelector('#addReviewForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const review = {
                id: Date.now(),
                productName: document.getElementById('reviewProductName').value,
                rating: parseInt(document.getElementById('reviewRating').value),
                text: document.getElementById('reviewText').value,
                date: new Date().toISOString(),
                published: document.getElementById('reviewPublished').value === 'true'
            };
            
            const reviews = JSON.parse(localStorage.getItem(`fitness_reviews_${userId}`)) || [];
            reviews.push(review);
            localStorage.setItem(`fitness_reviews_${userId}`, JSON.stringify(reviews));
            
            this.showNotification('Отзыв добавлен');
            modal.remove();
            this.loadData();
            this.forceSyncReviewsToSite(userId);
        });
        
        document.body.appendChild(modal);
    }

    exportReviews(userId) {
        const user = adminManager.getUserById(userId);
        if (!user) return;
        
        const reviews = JSON.parse(localStorage.getItem(`fitness_reviews_${userId}`)) || [];
        let content = 'Дата,Товар,Оценка,Текст отзыва,Статус\n';
        
        reviews.forEach(review => {
            const date = new Date(review.date || new Date()).toLocaleDateString('ru-RU');
            const status = review.published ? 'Опубликован' : 'Не опубликован';
            
            content += `${date},"${review.productName}",${review.rating},"${review.text}",${status}\n`;
        });
        
        const filename = `reviews_${user.firstName}_${user.lastName}_${new Date().toISOString().slice(0, 10)}.csv`;
        const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        
        this.showNotification(`Отчет отзывов скачан: ${filename}`);
    }

    addAppointmentForUser(userId) {
        const users = adminManager.getAllUsers();
        const trainers = users.filter(u => u.role === 'trainer');
        
        const modal = this.createIntegratedModal('Добавить запись на тренировку', `
            <h2 class="text-accent mb-3">Добавить запись</h2>
            <form id="addAppointmentForm">
                <div class="form-group">
                    <label class="form-label">Тренер *</label>
                    <select class="form-input" id="appointmentTrainer" required>
                        <option value="">Выберите тренера</option>
                        ${trainers.map(trainer => 
                            `<option value="${trainer.id}">${trainer.firstName} ${trainer.lastName}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Программа</label>
                    <input type="text" class="form-input" id="appointmentProgram" placeholder="Название программы">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Дата *</label>
                        <input type="date" class="form-input" id="appointmentDate" value="${new Date().toISOString().slice(0, 10)}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Время *</label>
                        <input type="time" class="form-input" id="appointmentTime" value="19:00" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Статус *</label>
                    <select class="form-input" id="appointmentStatus" required>
                        <option value="pending">Ожидает подтверждения</option>
                        <option value="confirmed">Подтверждена</option>
                        <option value="cancelled">Отменена</option>
                    </select>
                </div>
                <div class="data-actions-bar">
                    <button type="button" class="btn-secondary" onclick="this.closest('.integrated-data-modal').remove()">Отмена</button>
                    <button type="submit" class="btn-primary">Добавить запись</button>
                </div>
            </form>
        `);
        
        const form = modal.querySelector('#addAppointmentForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const trainerId = parseInt(document.getElementById('appointmentTrainer').value);
            const trainer = users.find(u => u.id === trainerId);
            
            const appointment = {
                id: Date.now(),
                trainerId: trainerId,
                trainerName: trainer ? `${trainer.firstName} ${trainer.lastName}` : 'Неизвестно',
                program: document.getElementById('appointmentProgram').value,
                date: `${document.getElementById('appointmentDate').value}T${document.getElementById('appointmentTime').value}`,
                time: document.getElementById('appointmentTime').value,
                status: document.getElementById('appointmentStatus').value
            };
            
            const appointments = JSON.parse(localStorage.getItem(`fitness_appointments_${userId}`)) || [];
            appointments.push(appointment);
            localStorage.setItem(`fitness_appointments_${userId}`, JSON.stringify(appointments));
            
            this.showNotification('Запись добавлена');
            modal.remove();
            this.loadData();
            this.forceSyncAppointments(userId);
        });
        
        document.body.appendChild(modal);
    }

    exportAppointments(userId) {
        const user = adminManager.getUserById(userId);
        if (!user) return;
        
        const appointments = JSON.parse(localStorage.getItem(`fitness_appointments_${userId}`)) || [];
        let content = 'Дата и время,Тренер,Программа,Статус\n';
        
        appointments.forEach(appointment => {
            const date = new Date(appointment.date).toLocaleString('ru-RU');
            const status = appointment.status === 'confirmed' ? 'Подтверждена' : 
                          appointment.status === 'pending' ? 'Ожидает подтверждения' : 'Отменена';
            
            content += `${date},"${appointment.trainerName}","${appointment.program}",${status}\n`;
        });
        
        const filename = `appointments_${user.firstName}_${user.lastName}_${new Date().toISOString().slice(0, 10)}.csv`;
        const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        
        this.showNotification(`Отчет записей скачан: ${filename}`);
    }

    exportUserData(userId) {
        const user = adminManager.getUserById(userId);
        if (!user) return;
        
        let content = '=== ПОЛНАЯ ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ ===\n\n';
        
        content += `ID: ${user.id}\n`;
        content += `ФИО: ${user.firstName} ${user.lastName}\n`;
        content += `Email: ${user.email}\n`;
        content += `Телефон: ${user.phone}\n`;
        content += `Роль: ${user.role}\n`;
        content += `Дата регистрации: ${new Date(user.registrationDate).toLocaleString('ru-RU')}\n\n`;
        
        content += `Баланс: ${user.balance.toLocaleString()} ₽\n`;
        content += `Статус: ${user.isActive ? 'Активен' : 'Заблокирован'}\n\n`;
        
        if (user.membership) {
            content += `=== АБОНЕМЕНТ ===\n`;
            content += `Тип: ${this.getMembershipTypeText(user.membership.type)}\n`;
            content += `Статус: ${this.getMembershipStatusText(user.membership.status)}\n`;
            content += `Начало: ${user.membership.startDate ? new Date(user.membership.startDate).toLocaleDateString('ru-RU') : '-'}\n`;
            content += `Окончание: ${user.membership.endDate ? new Date(user.membership.endDate).toLocaleDateString('ru-RU') : '-'}\n`;
            content += `Посещений/месяц: ${user.membership.visitsPerMonth}\n`;
            content += `Использовано: ${user.membership.visitsUsed}\n`;
            content += `Осталось: ${user.membership.visitsPerMonth - user.membership.visitsUsed}\n\n`;
        }
        
        content += `=== ТРЕНИРОВКИ ===\n`;
        content += `Активная программа: ${user.activeProgram || 'Не выбрано'}\n`;
        content += `Тренер: ${user.trainer || 'Не выбран'}\n`;
        content += `Следующая тренировка: ${user.nextTraining || 'Не запланировано'}\n\n`;
        
        if (user.statistics) {
            content += `=== СТАТИСТИКА ===\n`;
            content += `Всего посещений: ${user.statistics.totalVisits || 0}\n`;
            content += `Посещений в месяце: ${user.statistics.monthlyVisits || 0}\n`;
            content += `Последнее посещение: ${user.statistics.lastVisit ? new Date(user.statistics.lastVisit).toLocaleString('ru-RU') : 'Нет'}\n`;
        }
        
        const filename = `user_${user.firstName}_${user.lastName}_${new Date().toISOString().slice(0, 10)}.txt`;
        const blob = new Blob(['\uFEFF' + content], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        
        this.showNotification(`Данные пользователя скачаны: ${filename}`);
    }

    editVisit(userId, visitId) {
        const user = adminManager.getUserById(userId);
        if (!user) return;
        
        const visit = user.visitHistory?.find(v => v.id === visitId);
        if (!visit) return;
        
        const modal = this.createIntegratedModal('Редактировать посещение', `
            <h2 class="text-accent mb-3">Редактировать посещение</h2>
            <form id="editVisitForm">
                <div class="form-group">
                    <label class="form-label">Дата посещения *</label>
                    <input type="datetime-local" class="form-input" id="editVisitDate" value="${visit.date.slice(0, 16)}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Тип тренировки *</label>
                    <select class="form-input" id="editVisitType" required>
                        <option value="Силовая" ${visit.type === 'Силовая' ? 'selected' : ''}>Силовая</option>
                        <option value="Кардио" ${visit.type === 'Кардио' ? 'selected' : ''}>Кардио</option>
                        <option value="Групповая" ${visit.type === 'Групповая' ? 'selected' : ''}>Групповая</option>
                        <option value="Персональная" ${visit.type === 'Персональная' ? 'selected' : ''}>Персональная</option>
                        <option value="Йога и стретчинг" ${visit.type === 'Йога и стретчинг' ? 'selected' : ''}>Йога и стретчинг</option>
                        <option value="Функциональный тренинг" ${visit.type === 'Функциональный тренинг' ? 'selected' : ''}>Функциональный тренинг</option>
                        <option value="Другое" ${!['Силовая', 'Кардио', 'Групповая', 'Персональная', 'Йога и стретчинг', 'Функциональный тренинг'].includes(visit.type) ? 'selected' : ''}>Другое</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Заметки</label>
                    <textarea class="form-input" id="editVisitNotes" rows="3">${visit.notes || ''}</textarea>
                </div>
                <div class="data-actions-bar">
                    <button type="button" class="btn-secondary" onclick="this.closest('.integrated-data-modal').remove()">Отмена</button>
                    <button type="submit" class="btn-primary">Сохранить изменения</button>
                </div>
            </form>
        `);
        
        const form = modal.querySelector('#editVisitForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const updatedVisit = {
                ...visit,
                date: document.getElementById('editVisitDate').value,
                type: document.getElementById('editVisitType').value,
                notes: document.getElementById('editVisitNotes').value
            };
            
            const updatedHistory = user.visitHistory.map(v => 
                v.id === visitId ? updatedVisit : v
            );
            
            adminManager.updateUser(userId, { visitHistory: updatedHistory });
            this.showNotification('Посещение обновлено');
            modal.remove();
            this.loadData();
            this.forceSyncToProfile(userId, 'visits');
        });
        
        document.body.appendChild(modal);
    }

    deleteVisit(userId, visitId) {
        if (confirm('Удалить это посещение?')) {
            const user = adminManager.getUserById(userId);
            if (!user) return;
            
            const updatedHistory = user.visitHistory.filter(v => v.id !== visitId);
            adminManager.updateUser(userId, { 
                visitHistory: updatedHistory,
                statistics: {
                    ...user.statistics,
                    totalVisits: (user.statistics?.totalVisits || 1) - 1,
                    monthlyVisits: (user.statistics?.monthlyVisits || 1) - 1
                },
                membership: {
                    ...user.membership,
                    visitsUsed: (user.membership?.visitsUsed || 1) - 1
                }
            });
            
            this.showNotification('Посещение удалено');
            this.loadData();
            this.forceSyncToProfile(userId, 'visits');
        }
    }

    // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

    createIntegratedModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'integrated-data-modal';
        modal.innerHTML = `
            <div class="integrated-data-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2 class="text-accent">${title}</h2>
                    <button class="close-modal" onclick="this.closest('.integrated-data-modal').remove()" style="background: none; border: none; color: var(--text-primary); font-size: 1.5rem; cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s ease;">
                        &times;
                    </button>
                </div>
                ${content}
            </div>
        `;
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        return modal;
    }

    forceSyncToProfile(userId, dataType = 'all') {
        const syncIndicator = document.getElementById('syncStatusVisits');
        if (syncIndicator) {
            syncIndicator.textContent = 'Синхронизация...';
            syncIndicator.className = 'sync-indicator syncing';
        }
        
        setTimeout(() => {
            const user = adminManager.getUserById(userId);
            if (!user) {
                if (syncIndicator) {
                    syncIndicator.textContent = 'Ошибка: пользователь не найден';
                    syncIndicator.className = 'sync-indicator error';
                }
                return;
            }
            
            // Сохраняем обновленные данные для синхронизации
            localStorage.setItem(`sync_profile_${userId}`, JSON.stringify({
                userId,
                dataType,
                userData: user,
                timestamp: new Date().toISOString(),
                action: 'sync_profile'
            }));
            
            // Создаем событие для обновления профиля
            const event = new CustomEvent('profileDataSynced', {
                detail: {
                    userId,
                    userData: user,
                    dataType,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(event);
            
            if (syncIndicator) {
                syncIndicator.textContent = 'Синхронизировано ✓';
                syncIndicator.className = 'sync-indicator synced';
            }
            
            this.showNotification('Данные синхронизированы с профилем пользователя');
        }, 1000);
    }

    forceSyncToShop(userId) {
        const syncIndicator = document.getElementById('syncStatusPurchases');
        if (syncIndicator) {
            syncIndicator.textContent = 'Синхронизация...';
            syncIndicator.className = 'sync-indicator syncing';
        }
        
        setTimeout(() => {
            const purchases = JSON.parse(localStorage.getItem(`fitness_purchases_${userId}`)) || [];
            
            // Обновляем историю заказов
            localStorage.setItem(`shop_sync_${userId}`, JSON.stringify({
                userId,
                purchases,
                timestamp: new Date().toISOString(),
                action: 'sync_shop'
            }));
            
            // Создаем событие для обновления магазина
            const event = new CustomEvent('shopDataSynced', {
                detail: {
                    userId,
                    purchases,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(event);
            
            if (syncIndicator) {
                syncIndicator.textContent = 'Синхронизировано ✓';
                syncIndicator.className = 'sync-indicator synced';
            }
            
            this.showNotification('Данные синхронизированы с магазином');
        }, 1000);
    }

    forceSyncReviewsToSite(userId) {
        const syncIndicator = document.getElementById('syncStatusReviews');
        if (syncIndicator) {
            syncIndicator.textContent = 'Публикация...';
            syncIndicator.className = 'sync-indicator syncing';
        }
        
        setTimeout(() => {
            const reviews = JSON.parse(localStorage.getItem(`fitness_reviews_${userId}`)) || [];
            const user = adminManager.getUserById(userId);
            
            // Собираем все опубликованные отзывы
            const publishedReviews = reviews.filter(r => r.published);
            
            // Сохраняем для отображения на сайте
            localStorage.setItem(`site_reviews_sync`, JSON.stringify({
                reviews: publishedReviews.map(r => ({
                    ...r,
                    userName: user ? `${user.firstName} ${user.lastName}` : 'Аноним',
                    userAvatar: window.avatarManager ? window.avatarManager.getAvatar(userId) : null
                })),
                timestamp: new Date().toISOString()
            }));
            
            // Создаем событие для обновления отзывов на сайте
            const event = new CustomEvent('reviewsSynced', {
                detail: {
                    userId,
                    reviews: publishedReviews,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(event);
            
            if (syncIndicator) {
                syncIndicator.textContent = 'Опубликовано ✓';
                syncIndicator.className = 'sync-indicator synced';
            }
            
            this.showNotification('Отзывы опубликованы на сайте');
        }, 1000);
    }

    forceSyncAppointments(userId) {
        const syncIndicator = document.getElementById('syncStatusAppointments');
        if (syncIndicator) {
            syncIndicator.textContent = 'Синхронизация...';
            syncIndicator.className = 'sync-indicator syncing';
        }
        
        setTimeout(() => {
            const appointments = JSON.parse(localStorage.getItem(`fitness_appointments_${userId}`)) || [];
            const user = adminManager.getUserById(userId);
            
            // Сохраняем для календаря
            localStorage.setItem(`calendar_sync_${userId}`, JSON.stringify({
                userId,
                appointments,
                userName: user ? `${user.firstName} ${user.lastName}` : 'Пользователь',
                timestamp: new Date().toISOString()
            }));
            
            // Создаем событие для обновления календаря
            const event = new CustomEvent('appointmentsSynced', {
                detail: {
                    userId,
                    appointments,
                    timestamp: new Date().toISOString()
                }
            });
            window.dispatchEvent(event);
            
            if (syncIndicator) {
                syncIndicator.textContent = 'Синхронизировано ✓';
                syncIndicator.className = 'sync-indicator synced';
            }
            
            this.showNotification('Записи синхронизированы с календарем');
        }, 1000);
    }

    updateUserBalanceFromPurchases(userId, purchases) {
        const user = adminManager.getUserById(userId);
        if (!user) return;

        const totalSpent = purchases
            .filter(p => p.status === 'completed')
            .reduce((sum, p) => sum + (p.total || 0), 0);
        
        const initialBalance = 5000;
        const newBalance = Math.max(0, initialBalance - totalSpent);
        
        adminManager.updateUser(userId, { balance: newBalance });
    }

    switchAppointmentTab(button, tab) {
        const buttons = button.parentElement.querySelectorAll('.appointment-tab');
        buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const upcomingList = document.getElementById('upcomingAppointments');
        const pastList = document.getElementById('pastAppointments');
        
        if (upcomingList && pastList) {
            upcomingList.classList.add('hidden');
            pastList.classList.add('hidden');
            
            if (tab === 'upcoming') {
                upcomingList.classList.remove('hidden');
            } else {
                pastList.classList.remove('hidden');
            }
        }
    }

    showRealTimeNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'real-time-update';
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>🔄</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
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

    saveSettings() {
        const settings = {
            clubName: document.getElementById('clubName').value,
            clubPhone: document.getElementById('clubPhone').value,
            monthlyPrice: parseInt(document.getElementById('monthlyPrice').value),
            monthlyVisitsLimit: parseInt(document.getElementById('monthlyVisitsLimit').value)
        };

        localStorage.setItem('club_settings', JSON.stringify(settings));
        this.showNotification('Настройки сохранены');
    }

    exportReport(type) {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10);
        
        let content = '';
        let filename = '';
        
        switch(type) {
            case 'monthly':
                content = `Ежемесячный отчет от ${dateStr}\n`;
                content += `Пользователей: ${document.getElementById('totalUsers').textContent}\n`;
                content += `Активных: ${document.getElementById('activeUsers').textContent}\n`;
                content += `Посещений: ${document.getElementById('totalVisits').textContent}\n`;
                content += `Доход: ${document.getElementById('totalIncome').textContent}\n`;
                filename = `monthly_report_${dateStr}.txt`;
                break;
                
            case 'annual':
                content = `Годовой отчет от ${dateStr}\n`;
                content += 'Статистика за год\n';
                filename = `annual_report_${dateStr}.txt`;
                break;
                
            case 'finance':
                content = `Финансовый отчет от ${dateStr}\n`;
                content += 'Финансовая статистика\n';
                filename = `finance_report_${dateStr}.txt`;
                break;
        }
        
        const blob = new Blob(['\uFEFF' + content], { type: 'text/plain;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        
        this.showNotification(`Отчет скачан: ${filename}`);
    }

    showCreateUserModal() {
        document.getElementById('createUserModal').classList.add('active');
        document.getElementById('createUserForm').reset();
    }

    showCreateMembershipModal() {
        this.showMembershipModal();
    }

    showMembershipModal(userId = null) {
        const users = adminManager.getAllUsers().filter(u => u.role !== 'admin' && u.role !== 'trainer');
        const userSelect = document.getElementById('membershipUserSelect');
        const userSelectGroup = document.getElementById('userSelectGroup');
        
        if (userId) {
            const user = adminManager.getUserById(userId);
            if (!user) return;

            const membership = user.membership || {};
            document.getElementById('membershipUserId').value = userId;
            
            if (userSelectGroup) userSelectGroup.style.display = 'none';
            
            document.getElementById('membershipType').value = membership.type || 'none';
            document.getElementById('membershipStatus').value = membership.status || 'inactive';
            
            if (membership.endDate) {
                document.getElementById('membershipEndDate').value = 
                    membership.endDate.split('T')[0];
            } else {
                document.getElementById('membershipEndDate').value = this.getNextMonthDate();
            }

            document.getElementById('membershipVisits').value = membership.visitsPerMonth || 12;
            document.getElementById('membershipVisitsUsed').value = membership.visitsUsed || 0;
        } else {
            if (userSelect && userSelectGroup) {
                userSelectGroup.style.display = 'block';
                userSelect.innerHTML = users.map(user => 
                    `<option value="${user.id}">${user.firstName} ${user.lastName} (${user.email})</option>`
                ).join('');
                
                document.getElementById('membershipType').value = 'monthly';
                document.getElementById('membershipStatus').value = 'active';
                document.getElementById('membershipVisits').value = 12;
                document.getElementById('membershipVisitsUsed').value = 0;
                document.getElementById('membershipEndDate').value = this.getNextMonthDate();
                document.getElementById('membershipUserId').value = '';
            }
        }
        
        document.getElementById('membershipModal').classList.add('active');
    }

    getNextMonthDate() {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split('T')[0];
    }

    showAddVisitModal() {
        const users = adminManager.getAllUsers().filter(u => u.role !== 'admin' && u.role !== 'trainer');
        const select = document.getElementById('visitUserId');
        
        if (select) {
            select.innerHTML = users.map(user => 
                `<option value="${user.id}">${user.firstName} ${user.lastName} (${user.email})</option>`
            ).join('');
        }
        
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 16);
        document.getElementById('visitDate').value = formattedDate;
        
        document.getElementById('addVisitModal').classList.add('active');
    }

    showReportsModal() {
        const users = adminManager.getAllUsers();
        
        this.createReportsModal();
        
        const totalUsers = users.length;
        const activeUsers = users.filter(u => 
            u.role !== 'admin' && u.role !== 'trainer' && 
            u.membership?.status === 'active'
        ).length;
        
        const totalVisits = users.reduce((sum, user) => 
            sum + (user.statistics?.totalVisits || 0), 0
        );
        
        const monthlyVisits = users.reduce((sum, user) => 
            sum + (user.statistics?.monthlyVisits || 0), 0
        );
        
        const totalIncome = activeUsers * 5000;
        
        const programCounts = {};
        const trainerCounts = {};
        const visitTypeCounts = {};
        
        users.forEach(user => {
            if (user.activeProgram) {
                programCounts[user.activeProgram] = (programCounts[user.activeProgram] || 0) + 1;
            }
            if (user.trainer) {
                trainerCounts[user.trainer] = (trainerCounts[user.trainer] || 0) + 1;
            }
            if (user.visitHistory) {
                user.visitHistory.forEach(visit => {
                    const type = visit.type || 'Другое';
                    visitTypeCounts[type] = (visitTypeCounts[type] || 0) + 1;
                });
            }
        });
        
        const popularProgram = Object.keys(programCounts).length > 0 
            ? Object.entries(programCounts).sort((a, b) => b[1] - a[1])[0]
            : ['Нет данных', 0];
        
        const popularTrainer = Object.keys(trainerCounts).length > 0 
            ? Object.entries(trainerCounts).sort((a, b) => b[1] - a[1])[0]
            : ['Нет данных', 0];
        
        const popularVisitType = Object.keys(visitTypeCounts).length > 0 
            ? Object.entries(visitTypeCounts).sort((a, b) => b[1] - a[1])[0]
            : ['Нет данных', 0];
        
        const dayOfWeekCounts = { 'Пн': 0, 'Вт': 0, 'Ср': 0, 'Чт': 0, 'Пт': 0, 'Сб': 0, 'Вс': 0 };
        
        users.forEach(user => {
            if (user.visitHistory) {
                user.visitHistory.forEach(visit => {
                    const date = new Date(visit.date);
                    const dayOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][date.getDay()];
                    dayOfWeekCounts[dayOfWeek]++;
                });
            }
        });
        
        const mostPopularDay = Object.entries(dayOfWeekCounts).sort((a, b) => b[1] - a[1])[0];
        
        const reportsModal = document.createElement('div');
        reportsModal.className = 'integrated-data-modal';
        reportsModal.innerHTML = `
            <div class="integrated-data-content">
                <h2 class="text-accent mb-3">📊 Статистика клуба</h2>
                
                <div class="info-section">
                    <h4 class="text-accent">Основная статистика</h4>
                    <div class="info-grid">
                        <div class="info-item"><strong>Всего пользователей:</strong> <span>${totalUsers}</span></div>
                        <div class="info-item"><strong>Активных абонементов:</strong> <span>${activeUsers}</span></div>
                        <div class="info-item"><strong>Всего посещений:</strong> <span>${totalVisits}</span></div>
                        <div class="info-item"><strong>Посещений в этом месяце:</strong> <span>${monthlyVisits}</span></div>
                        <div class="info-item"><strong>Ожидаемый доход:</strong> <span>${totalIncome.toLocaleString()} ₽</span></div>
                    </div>
                </div>
                
                <div class="info-section">
                    <h4 class="text-accent">Популярность</h4>
                    <div class="info-grid">
                        <div class="info-item"><strong>Самая популярная программа:</strong> <span>${popularProgram[0]} (${popularProgram[1]} чел.)</span></div>
                        <div class="info-item"><strong>Самый популярный тренер:</strong> <span>${popularTrainer[0]} (${popularTrainer[1]} чел.)</span></div>
                        <div class="info-item"><strong>Самый популярный тип тренировки:</strong> <span>${popularVisitType[0]} (${popularVisitType[1]} раз)</span></div>
                        <div class="info-item"><strong>Самый популярный день недели:</strong> <span>${mostPopularDay[0]} (${mostPopularDay[1]} посещений)</span></div>
                    </div>
                </div>
                
                <div class="info-section">
                    <h4 class="text-accent">Распределение по дням недели</h4>
                    <div class="info-grid">
                        ${Object.entries(dayOfWeekCounts).map(([day, count]) => `
                            <div class="info-item">
                                <strong>${day}:</strong> <span>${count}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="data-actions-bar">
                    <button class="btn-secondary" onclick="adminUI.exportReport('monthly')">📥 Экспорт отчета</button>
                    <button class="btn-secondary" onclick="this.closest('.integrated-data-modal').remove()">Закрыть</button>
                </div>
            </div>
        `;
        
        reportsModal.addEventListener('click', (e) => {
            if (e.target === reportsModal) {
                reportsModal.remove();
            }
        });
        
        document.body.appendChild(reportsModal);
    }

    createReportsModal() {
        // Этот метод уже реализован в showReportsModal
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// Инициализация админ-панели при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin.html')) {
        window.adminUI = new AdminUI();
        
        // Добавляем глобальные методы для синхронизации
        window.syncUserData = function(userId) {
            if (window.syncEvents && window.syncEvents.syncUserData) {
                window.syncEvents.syncUserData(userId);
            }
        };
        
        // Инициализируем интеграцию с магазином
        setTimeout(() => {
            if (window.shopManager) {
                console.log('Магазин подключен к админке');
            }
            
            // Синхронизируем все данные пользователей
            const users = window.adminManager?.getAllUsers() || [];
            users.forEach(user => {
                if (user.id !== 0) {
                    window.syncUserData(user.id);
                }
            });
        }, 2000);
    }
});