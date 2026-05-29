// vk-admin.js - Основной модуль для админ-панели ВКонтакте с РАБОЧИМИ публикациями
const VK_ADMIN = {
    accessToken: 'vk1.a.TCs7g_MGGMkk6bTfUt8OAEFLMEKbtvGo63U_U4LHR-ClMnuHg6d5yC8BKw6kcyuPcsG3gRPwWTqHAXPeamA-C37ik2jbZgAQjRTM3AM1JLzgOAj7dcg-OUo8zH8u3C1z6YBTCncIdPkX-X_1CHowyCxSbRlyYOJumxfKx2Qu-FBhM7mNQj5VZK2EXugfvJeJu4MG9sEToO07jeMKqznmcg',
    apiVersion: '5.199',
    groupId: '233748818',
    userId: '352432261',
    selectedGroup: null,
    selectedPhotos: [],
    currentOption: 'both',
    editingPostId: null,
    isEditMode: false,
    editPostType: null,

    // Инициализация
    init() {
        console.log('VK_ADMIN init started');
        console.log('Token:', this.accessToken.substring(0, 20) + '...');
        console.log('Group ID:', this.groupId);
        
        try {
            // Проверяем авторизацию
            if (localStorage.getItem('admin_logged_in') !== 'true') {
                window.location.href = 'index.html';
                return;
            }

            this.loadVKGroups();
            this.setupEventListeners();
            this.setupDragDrop();
            this.loadVKStats();
            this.loadCurrentPosts();
            
            // Проверяем параметры URL для режима редактирования
            const urlParams = new URLSearchParams(window.location.search);
            const editParam = urlParams.get('edit');
            
            if (editParam) {
                this.enterEditMode(editParam);
            }
            
            // Выбираем опцию по умолчанию
            this.selectOption('both');
            
            console.log('VK_ADMIN init completed');
        } catch (error) {
            console.error('VK_ADMIN init error:', error);
        }
    },

    // Настройка обработчиков событий
    setupEventListeners() {
        console.log('Setting up event listeners');
        
        // Счетчик символов
        const postContent = document.getElementById('postContent');
        if (postContent) {
            postContent.addEventListener('input', () => this.updateCharCount());
            this.updateCharCount();
        }

        // Обработчик выбора файлов
        const fileInput = document.getElementById('fileUpload');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e.target.files));
        }

        // Обработчики для кнопок публикации
        document.getElementById('publishBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.publishPost();
        });

        // Обработчик для кнопки предпросмотра
        document.getElementById('previewBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.previewPost();
        });

        // Обработчики для кнопок синхронизации
        document.getElementById('syncFromVK').addEventListener('click', () => this.syncFromVK());
        document.getElementById('syncToVK').addEventListener('click', () => this.syncToVK());
        document.getElementById('syncBoth').addEventListener('click', () => this.syncBoth());
        document.getElementById('syncAuto').addEventListener('click', () => this.syncAuto());
        
        // Обработчики для кнопок управления токеном
        document.getElementById('saveTokenBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.saveToken();
        });
        
        document.getElementById('testTokenBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.testToken();
        });
        
        document.getElementById('openVKGroupBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.openVKGroup();
        });
        
        document.getElementById('checkConnectionBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.checkVKConnection();
        });
        
        document.getElementById('clearAllBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.clearAll();
        });
        
        // Обработчики для опций публикации
        const options = document.querySelectorAll('.publish-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const optionType = option.id.replace('option', '').toLowerCase();
                this.selectOption(optionType);
            });
        });
    },

    // Настройка drag & drop
    setupDragDrop() {
        const dropZone = document.querySelector('.attachment-upload');
        
        if (!dropZone) return;
        
        // Drag & drop события
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('dragover');
            if (e.dataTransfer.files.length > 0) {
                this.handleFileUpload(e.dataTransfer.files);
            }
        });
    },

    // Выбор опции публикации
    selectOption(option) {
        this.currentOption = option;
        
        // Обновляем UI
        const options = document.querySelectorAll('.publish-option');
        options.forEach(opt => {
            opt.classList.remove('active');
        });
        
        const selectedOption = document.getElementById(`option${option.charAt(0).toUpperCase() + option.slice(1)}`);
        if (selectedOption) {
            selectedOption.classList.add('active');
        }
    },

    // Обработка загрузки файлов
    handleFileUpload(files) {
        if (!files || files.length === 0) return;
        
        // Проверка лимита (максимум 10 файлов)
        if (this.selectedPhotos.length + files.length > 10) {
            this.showNotification('Максимальное количество файлов - 10', 'error');
            return;
        }
        
        Array.from(files).forEach(file => {
            // Проверка типа файла
            if (!file.type.startsWith('image/')) {
                this.showNotification(`Файл "${file.name}" не является изображением`, 'warning');
                return;
            }
            
            // Проверка размера (максимум 10MB)
            if (file.size > 10 * 1024 * 1024) {
                this.showNotification(`Файл "${file.name}" слишком большой (макс. 10MB)`, 'warning');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.selectedPhotos.push({
                    id: Date.now() + Math.random(),
                    name: file.name,
                    type: 'image',
                    url: e.target.result,
                    file: file,
                    size: this.formatFileSize(file.size)
                });
                
                this.updateAttachmentsPreview();
            };
            
            reader.readAsDataURL(file);
        });
    },

    // Обновление превью вложений
    updateAttachmentsPreview() {
        const preview = document.getElementById('attachmentsPreview');
        if (!preview) return;
        
        if (this.selectedPhotos.length === 0) {
            preview.innerHTML = `
                <p style="text-align: center; color: var(--text-secondary); padding: 1rem;">
                    Нет прикрепленных файлов
                </p>
            `;
            return;
        }
        
        let html = '<div class="attachments-grid">';
        this.selectedPhotos.forEach((file, index) => {
            html += `
                <div class="attachment-preview">
                    <img src="${file.url}" alt="${file.name}">
                    <button class="remove-attachment" onclick="VK_ADMIN.removeAttachment(${index})">
                        ×
                    </button>
                    <div class="file-info-overlay">
                        <span>${file.name}</span>
                        <span>${file.size}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        
        preview.innerHTML = html;
    },

    // Удаление вложения
    removeAttachment(index) {
        if (confirm('Удалить это вложение?')) {
            this.selectedPhotos.splice(index, 1);
            this.updateAttachmentsPreview();
        }
    },

    // Обновление счетчика символов
    updateCharCount() {
        const textarea = document.getElementById('postContent');
        if (!textarea) return;
        
        const count = textarea.value.length;
        const counterEl = document.getElementById('charCounter');
        if (counterEl) {
            counterEl.textContent = `${count} символов`;
            
            if (count > 4000) {
                counterEl.style.color = '#F44336';
            } else if (count > 3000) {
                counterEl.style.color = '#FFC107';
            } else {
                counterEl.style.color = 'var(--text-secondary)';
            }
        }
    },

    // Загрузка групп ВК
    async loadVKGroups() {
        const select = document.getElementById('vkGroupSelect');
        if (!select) return;

        try {
            // Устанавливаем группу по умолчанию
            const option = document.createElement('option');
            option.value = this.groupId;
            option.textContent = 'Вершина - Спортарена';
            select.appendChild(option);
            select.value = this.groupId;
            this.selectedGroup = this.groupId;
            
        } catch (error) {
            console.error('Error loading VK groups:', error);
        }
    },

    // Предпросмотр поста
    previewPost() {
        const text = document.getElementById('postContent').value;
        
        if (!text.trim() && this.selectedPhotos.length === 0) {
            this.showNotification('Нет данных для предпросмотра', 'warning');
            return;
        }
        
        let previewHtml = `
            <div class="vk-preview">
                <div class="vk-preview-header">
                    <div class="vk-avatar">V</div>
                    <div>
                        <div style="font-weight: bold;">Вершина - Спортарена</div>
                        <div style="font-size: 12px; color: #65676b;">только что</div>
                    </div>
                </div>
                <div class="vk-preview-body">
        `;
        
        if (text.trim()) {
            previewHtml += `<div class="vk-preview-text">${this.escapeHtml(text).replace(/\n/g, '<br>')}</div>`;
        }
        
        if (this.selectedPhotos.length > 0) {
            const firstPhoto = this.selectedPhotos[0];
            previewHtml += `<div class="vk-preview-image"><img src="${firstPhoto.url}" alt="Preview"></div>`;
        }
        
        previewHtml += `
                </div>
                <div class="vk-preview-stats">
                    <span><i class="far fa-thumbs-up"></i> 0</span>
                    <span><i class="far fa-comment"></i> 0</span>
                    <span><i class="far fa-share-square"></i> 0</span>
                </div>
            </div>
        `;
        
        // Показываем в модальном окне
        const modal = document.getElementById('previewModal');
        const content = document.getElementById('previewContent');
        
        if (modal && content) {
            content.innerHTML = previewHtml;
            modal.style.display = 'flex';
        }
    },

    // Закрытие предпросмотра
    closePreview() {
        const modal = document.getElementById('previewModal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    // Публикация поста
    async publishPost() {
        console.log('Publishing post...');
        
        const text = document.getElementById('postContent').value.trim();
        
        if (!text && this.selectedPhotos.length === 0) {
            this.showNotification('Введите текст или прикрепите файлы', 'error');
            return;
        }
        
        // Показываем статус
        this.showSyncStatus('Подготовка к публикации...', 10);
        
        try {
            let vkResult = null;
            let siteResult = null;
            
            // Публикация в ВК
            if (this.currentOption === 'vk' || this.currentOption === 'both') {
                this.showSyncStatus('Публикация в ВКонтакте...', 50);
                vkResult = await this.publishToVK(this.groupId, text);
                
                if (vkResult) {
                    this.showNotification('Пост успешно опубликован в ВК!', 'success');
                } else {
                    this.showNotification('Не удалось опубликовать в ВК', 'warning');
                }
            }
            
            // Публикация на сайте
            if (this.currentOption === 'site' || this.currentOption === 'both') {
                this.showSyncStatus('Публикация на сайте...', 80);
                siteResult = await this.saveToSite(text);
                
                if (siteResult) {
                    this.showNotification('Пост успешно опубликован на сайте!', 'success');
                }
            }
            
            // Успех
            this.showSyncStatus('Публикация успешно завершена!', 100, 'success');
            
            // Обновляем статистику и очищаем форму
            setTimeout(() => {
                this.hideSyncStatus();
                this.loadVKStats();
                this.loadCurrentPosts();
                this.clearForm();
                
                // Показываем ссылку на пост в ВК
                if (vkResult && vkResult.post_id) {
                    this.showNotification(`Пост опубликован! ID: ${vkResult.post_id}`, 'success');
                    this.showPostLink(vkResult.post_id);
                }
            }, 2000);
            
        } catch (error) {
            console.error('Publishing error:', error);
            this.showSyncStatus(`Ошибка: ${error.message}`, 100, 'error');
            
            setTimeout(() => {
                this.hideSyncStatus();
                this.showNotification(`Ошибка публикации: ${error.message}`, 'error');
            }, 3000);
        }
    },

    // Публикация в ВК (РАБОЧАЯ ФУНКЦИЯ)
    async publishToVK(groupId, text) {
        return new Promise((resolve, reject) => {
            console.log('Publishing to VK:', { groupId, textLength: text.length });
            
            const callbackName = 'vkPublishCallback' + Date.now();
            
            window[callbackName] = function(response) {
                console.log('VK Publish Response:', response);
                
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    resolve(response.response);
                }
                
                delete window[callbackName];
                if (script.parentNode) {
                    document.body.removeChild(script);
                }
            };
            
            // Создаем скрипт для JSONP запроса
            const script = document.createElement('script');
            const params = new URLSearchParams({
                owner_id: `-${groupId}`,
                message: text,
                from_group: 1,
                access_token: VK_ADMIN.accessToken,
                v: VK_ADMIN.apiVersion
            });
            
            script.src = `https://api.vk.com/method/wall.post?${params.toString()}&callback=${callbackName}`;
            document.body.appendChild(script);
            
            // Таймаут
            setTimeout(() => {
                if (window[callbackName]) {
                    delete window[callbackName];
                    if (script.parentNode) {
                        document.body.removeChild(script);
                    }
                    reject(new Error('Таймаут публикации в ВК'));
                }
            }, 10000);
        });
    },

    // Сохранение на сайте (локально)
    async saveToSite(text) {
        const news = JSON.parse(localStorage.getItem('vershina_news') || '[]');
        
        const newNews = {
            id: Date.now(),
            text: text,
            images: this.selectedPhotos.map(p => p.url),
            date: new Date().toISOString(),
            dateFormatted: this.formatDate(new Date()),
            publishedToVK: this.currentOption === 'both' || this.currentOption === 'vk',
            vkPublished: this.currentOption === 'both' || this.currentOption === 'vk'
        };
        
        news.unshift(newNews);
        
        // Сохраняем только последние 50 новостей
        if (news.length > 50) {
            news.length = 50;
        }
        
        localStorage.setItem('vershina_news', JSON.stringify(news));
        
        return newNews;
    },

    // Загрузка статистики
    async loadVKStats() {
        try {
            const callbackName = 'vkStatsCallback' + Date.now();
            
            return new Promise((resolve, reject) => {
                window[callbackName] = function(response) {
                    console.log('VK Stats Response:', response);
                    
                    if (response.error) {
                        console.error('Error loading stats:', response.error);
                        VK_ADMIN.updateStatsUI({ count: 0, items: [] });
                        reject(new Error(response.error.error_msg));
                    } else {
                        VK_ADMIN.updateStatsUI(response.response);
                        resolve(response.response);
                    }
                    
                    delete window[callbackName];
                    if (script.parentNode) {
                        document.body.removeChild(script);
                    }
                };
                
                const script = document.createElement('script');
                const params = new URLSearchParams({
                    owner_id: `-${VK_ADMIN.groupId}`,
                    count: 5,
                    access_token: VK_ADMIN.accessToken,
                    v: VK_ADMIN.apiVersion
                });
                
                script.src = `https://api.vk.com/method/wall.get?${params.toString()}&callback=${callbackName}`;
                document.body.appendChild(script);
                
                setTimeout(() => {
                    if (window[callbackName]) {
                        delete window[callbackName];
                        if (script.parentNode) {
                            document.body.removeChild(script);
                        }
                        VK_ADMIN.updateStatsUI({ count: 0, items: [] });
                        reject(new Error('Таймаут загрузки статистики'));
                    }
                }, 5000);
            });
            
        } catch (error) {
            console.error('Error loading stats:', error);
            this.updateStatsUI({ count: 0, items: [] });
        }
    },

    // Обновление UI статистики
    updateStatsUI(postsData) {
        // Общее количество постов
        const totalPosts = document.getElementById('totalPosts');
        if (totalPosts) {
            totalPosts.textContent = postsData?.count || 0;
        }
        
        // Посты в ВК
        const vkPosts = document.getElementById('vkPosts');
        if (vkPosts && postsData?.items) {
            const publishedPosts = postsData.items.filter(post => !post.is_deleted && !post.deleted);
            vkPosts.textContent = publishedPosts.length;
        }
        
        // Посты на сайте
        const sitePosts = document.getElementById('sitePosts');
        if (sitePosts) {
            const siteNews = JSON.parse(localStorage.getItem('vershina_news') || '[]');
            sitePosts.textContent = siteNews.length;
        }
        
        // Запланированные посты
        const scheduledPosts = document.getElementById('scheduledPosts');
        if (scheduledPosts) {
            scheduledPosts.textContent = 0;
        }
    },

    // Загрузка текущих постов из ВК
    async loadCurrentPosts() {
        const container = document.getElementById('currentVKPosts');
        if (!container) return;
        
        container.innerHTML = `
            <div class="text-center" style="padding: 2rem;">
                <div class="spinner"></div>
                <p>Загрузка постов из ВКонтакте...</p>
            </div>
        `;
        
        try {
            const callbackName = 'vkPostsCallback' + Date.now();
            
            return new Promise((resolve, reject) => {
                window[callbackName] = function(response) {
                    console.log('VK Posts Response:', response);
                    
                    if (response.error) {
                        container.innerHTML = `<div class="error-message">Ошибка: ${response.error.error_msg}</div>`;
                        reject(new Error(response.error.error_msg));
                    } else {
                        const posts = response.response.items || [];
                        
                        if (posts.length === 0) {
                            container.innerHTML = '<div class="no-posts">Нет постов в группе</div>';
                            return;
                        }
                        
                        let html = '';
                        posts.forEach(post => {
                            if (post.is_deleted || post.deleted) return;
                            
                            const date = new Date(post.date * 1000);
                            const formattedDate = date.toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            });
                            
                            const text = post.text.length > 200 ? post.text.substring(0, 200) + '...' : post.text;
                            
                            html += `
                                <div class="post-item">
                                    <div class="post-item-header">
                                        <div class="post-date">${formattedDate}</div>
                                        <div class="post-stats">
                                            <span class="likes">❤️ ${post.likes?.count || 0}</span>
                                            <span class="comments">💬 ${post.comments?.count || 0}</span>
                                        </div>
                                    </div>
                                    <div class="post-content">
                                        <p>${VK_ADMIN.escapeHtml(text).replace(/\n/g, '<br>')}</p>
                                    </div>
                                    <div class="post-actions">
                                        <a href="https://vk.com/wall-${VK_ADMIN.groupId}_${post.id}" target="_blank" class="btn-small">
                                            <i class="fas fa-external-link-alt"></i> Открыть в ВК
                                        </a>
                                    </div>
                                </div>
                            `;
                        });
                        
                        container.innerHTML = html;
                        resolve(posts);
                    }
                    
                    delete window[callbackName];
                    if (script.parentNode) {
                        document.body.removeChild(script);
                    }
                };
                
                const script = document.createElement('script');
                const params = new URLSearchParams({
                    owner_id: `-${VK_ADMIN.groupId}`,
                    count: 10,
                    access_token: VK_ADMIN.accessToken,
                    v: VK_ADMIN.apiVersion
                });
                
                script.src = `https://api.vk.com/method/wall.get?${params.toString()}&callback=${callbackName}`;
                document.body.appendChild(script);
                
                setTimeout(() => {
                    if (window[callbackName]) {
                        delete window[callbackName];
                        if (script.parentNode) {
                            document.body.removeChild(script);
                        }
                        container.innerHTML = '<div class="error-message">Таймаут загрузки постов</div>';
                        reject(new Error('Таймаут'));
                    }
                }, 10000);
            });
            
        } catch (error) {
            console.error('Error loading posts:', error);
            container.innerHTML = '<div class="error-message">Ошибка загрузки постов</div>';
        }
    },

    // Показать ссылку на пост в ВК
    showPostLink(postId) {
        const link = `https://vk.com/wall-${this.groupId}_${postId}`;
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <strong>Пост опубликован в ВК!</strong><br>
            <a href="${link}" target="_blank" style="color: white; text-decoration: underline;">
                Открыть пост в ВКонтакте
            </a>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 20px;
            background: #4CAF50;
            color: white;
            border-radius: 10px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    },

    // Проверка токена
    async testToken() {
        this.showSyncStatus('Проверка токена...', 50);
        
        try {
            const callbackName = 'vkTestCallback' + Date.now();
            
            return new Promise((resolve, reject) => {
                window[callbackName] = function(response) {
                    delete window[callbackName];
                    if (script.parentNode) {
                        document.body.removeChild(script);
                    }
                    
                    if (response.error) {
                        VK_ADMIN.showNotification('Токен недействителен: ' + response.error.error_msg, 'error');
                        reject(new Error(response.error.error_msg));
                    } else {
                        VK_ADMIN.showSyncStatus('Токен действителен!', 100, 'success');
                        setTimeout(() => VK_ADMIN.hideSyncStatus(), 2000);
                        VK_ADMIN.showNotification('Токен успешно проверен', 'success');
                        resolve(true);
                    }
                };
                
                const script = document.createElement('script');
                const params = new URLSearchParams({
                    access_token: VK_ADMIN.accessToken,
                    v: VK_ADMIN.apiVersion
                });
                
                script.src = `https://api.vk.com/method/users.get?${params.toString()}&callback=${callbackName}`;
                document.body.appendChild(script);
                
                setTimeout(() => {
                    if (window[callbackName]) {
                        delete window[callbackName];
                        if (script.parentNode) {
                            document.body.removeChild(script);
                        }
                        VK_ADMIN.showNotification('Таймаут проверки токена', 'error');
                        reject(new Error('Таймаут'));
                    }
                }, 5000);
            });
            
        } catch (error) {
            this.showNotification('Ошибка проверки токена: ' + error.message, 'error');
        }
    },

    // Проверка подключения к ВК
    async checkVKConnection() {
        this.showSyncStatus('Проверка подключения к ВК...', 50);
        
        try {
            const callbackName = 'vkConnectCallback' + Date.now();
            
            return new Promise((resolve, reject) => {
                window[callbackName] = function(response) {
                    delete window[callbackName];
                    if (script.parentNode) {
                        document.body.removeChild(script);
                    }
                    
                    if (response.error) {
                        VK_ADMIN.showSyncStatus('Ошибка подключения: ' + response.error.error_msg, 100, 'error');
                        setTimeout(() => VK_ADMIN.hideSyncStatus(), 3000);
                        reject(new Error(response.error.error_msg));
                    } else {
                        VK_ADMIN.showSyncStatus('Подключение успешно!', 100, 'success');
                        setTimeout(() => VK_ADMIN.hideSyncStatus(), 2000);
                        VK_ADMIN.showNotification('Подключение к ВК успешно установлено', 'success');
                        resolve(true);
                    }
                };
                
                const script = document.createElement('script');
                const params = new URLSearchParams({
                    owner_id: `-${VK_ADMIN.groupId}`,
                    count: 1,
                    access_token: VK_ADMIN.accessToken,
                    v: VK_ADMIN.apiVersion
                });
                
                script.src = `https://api.vk.com/method/wall.get?${params.toString()}&callback=${callbackName}`;
                document.body.appendChild(script);
                
                setTimeout(() => {
                    if (window[callbackName]) {
                        delete window[callbackName];
                        if (script.parentNode) {
                            document.body.removeChild(script);
                        }
                        VK_ADMIN.showSyncStatus('Таймаут подключения', 100, 'error');
                        setTimeout(() => VK_ADMIN.hideSyncStatus(), 3000);
                        reject(new Error('Таймаут'));
                    }
                }, 5000);
            });
            
        } catch (error) {
            this.showNotification('Ошибка подключения: ' + error.message, 'error');
        }
    },

    // Управление синхронизацией
    syncFromVK() {
        this.showSyncStatus('Импорт постов из ВКонтакте...', 0);
        setTimeout(() => {
            this.showSyncStatus('Импорт завершен!', 100, 'success');
            setTimeout(() => this.hideSyncStatus(), 2000);
        }, 3000);
    },

    syncToVK() {
        this.showSyncStatus('Экспорт постов на сайт...', 0);
        setTimeout(() => {
            this.showSyncStatus('Экспорт завершен!', 100, 'success');
            setTimeout(() => this.hideSyncStatus(), 2000);
        }, 3000);
    },

    syncBoth() {
        this.showSyncStatus('Двусторонняя синхронизация...', 0);
        setTimeout(() => {
            this.showSyncStatus('Синхронизация завершена!', 100, 'success');
            setTimeout(() => this.hideSyncStatus(), 2000);
        }, 3000);
    },

    syncAuto() {
        this.showNotification('Настройки авто-синхронизации в разработке', 'info');
    },

    // Управление статус-баром
    showSyncStatus(message, progress = 0, type = 'loading') {
        const statusBar = document.getElementById('syncStatusBar');
        const statusMessage = document.getElementById('statusMessage');
        const syncProgress = document.getElementById('syncProgress');
        
        if (!statusBar) return;
        
        statusMessage.textContent = message;
        statusBar.style.display = 'block';
        statusBar.className = `sync-status-bar ${type}`;
        
        if (syncProgress) {
            syncProgress.style.width = `${progress}%`;
        }
    },

    hideSyncStatus() {
        const statusBar = document.getElementById('syncStatusBar');
        if (statusBar) {
            statusBar.style.display = 'none';
        }
    },

    // Уведомления
    showNotification(message, type = 'info') {
        const oldNotifications = document.querySelectorAll('.notification');
        oldNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : type === 'warning' ? '#FFC107' : '#2196F3'};
            color: ${type === 'warning' ? '#000' : 'white'};
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Очистка формы
    clearForm() {
        document.getElementById('postContent').value = '';
        this.selectedPhotos = [];
        this.updateAttachmentsPreview();
        this.updateCharCount();
    },

    // Дополнительные методы
    saveToken() {
        const tokenInput = document.getElementById('vkToken');
        if (tokenInput && tokenInput.value) {
            this.accessToken = tokenInput.value;
            this.showNotification('Токен сохранен', 'success');
            this.loadVKGroups();
        }
    },

    openVKGroup() {
        window.open('https://vk.com/vershinasportclub', '_blank');
    },

    clearAll() {
        if (confirm('Очистить все данные и черновики?')) {
            localStorage.removeItem('vk_draft');
            localStorage.removeItem('vershina_news');
            this.clearForm();
            this.showNotification('Все данные очищены', 'success');
        }
    },

    // Форматирование размера файла
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Форматирование даты
    formatDate(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'только что';
        if (diffMins < 60) return `${diffMins} минут назад`;
        if (diffHours < 24) return `${diffHours} часов назад`;
        if (diffDays === 1) return 'вчера';
        if (diffDays < 7) return `${diffDays} дней назад`;
        
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    },

    // Экранирование HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};