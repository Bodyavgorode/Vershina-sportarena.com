// vk-news.js - Модуль для отображения РЕАЛЬНЫХ новостей из ВКонтакте
const VK_NEWS = {
    accessToken: 'vk1.a.TCs7g_MGGMkk6bTfUt8OAEFLMEKbtvGo63U_U4LHR-ClMnuHg6d5yC8BKw6kcyuPcsG3gRPwWTqHAXPeamA-C37ik2jbZgAQjRTM3AM1JLzgOAj7dcg-OUo8zH8u3C1z6YBTCncIdPkX-X_1CHowyCxSbRlyYOJumxfKx2Qu-FBhM7mNQj5VZK2EXugfvJeJu4MG9sEToO07jeMKqznmcg',
    apiVersion: '5.199',
    groupId: '233748818',
    posts: [],
    isLoading: false,

    // Инициализация
    init() {
        console.log('VK_NEWS init started');
        this.loadVKPosts();
    },

    // Загрузка постов из ВК с JSONP
    async loadVKPosts() {
        const container = document.getElementById('vkPostsContainer');
        const loadingSpinner = document.getElementById('loadingSpinner');
        
        if (!container || this.isLoading) return;
        
        this.isLoading = true;
        
        if (loadingSpinner) {
            loadingSpinner.style.display = 'block';
        }
        
        try {
            const callbackName = 'vkNewsCallback' + Date.now();
            
            return new Promise((resolve, reject) => {
                window[callbackName] = function(response) {
                    console.log('VK News Response:', response);
                    
                    if (response.error) {
                        VK_NEWS.showError('Ошибка загрузки новостей: ' + response.error.error_msg);
                        reject(new Error(response.error.error_msg));
                    } else {
                        VK_NEWS.posts = response.response.items || [];
                        VK_NEWS.renderPosts();
                        resolve(VK_NEWS.posts);
                    }
                    
                    delete window[callbackName];
                    if (script.parentNode) {
                        document.body.removeChild(script);
                    }
                    VK_NEWS.isLoading = false;
                    if (loadingSpinner) {
                        loadingSpinner.style.display = 'none';
                    }
                };
                
                const script = document.createElement('script');
                const params = new URLSearchParams({
                    owner_id: `-${VK_NEWS.groupId}`,
                    count: 20,
                    access_token: VK_NEWS.accessToken,
                    v: VK_NEWS.apiVersion
                });
                
                script.src = `https://api.vk.com/method/wall.get?${params.toString()}&callback=${callbackName}`;
                document.body.appendChild(script);
                
                setTimeout(() => {
                    if (window[callbackName]) {
                        delete window[callbackName];
                        if (script.parentNode) {
                            document.body.removeChild(script);
                        }
                        VK_NEWS.showError('Таймаут загрузки новостей');
                        VK_NEWS.isLoading = false;
                        if (loadingSpinner) {
                            loadingSpinner.style.display = 'none';
                        }
                        reject(new Error('Таймаут'));
                    }
                }, 10000);
            });
            
        } catch (error) {
            console.error('Error loading VK posts:', error);
            this.isLoading = false;
            if (loadingSpinner) {
                loadingSpinner.style.display = 'none';
            }
            this.loadLocalPosts();
        }
    },

    // Загрузка локальных новостей
    loadLocalPosts() {
        const container = document.getElementById('vkPostsContainer');
        if (!container) return;
        
        const localNews = JSON.parse(localStorage.getItem('vershina_news') || '[]');
        
        if (localNews.length === 0) {
            container.innerHTML = `
                <div class="no-news">
                    <i class="fas fa-newspaper"></i>
                    <h3>Новостей пока нет</h3>
                    <p>Будьте первым, кто опубликует новость!</p>
                </div>
            `;
            return;
        }
        
        this.renderLocalPosts(localNews);
    },

    // Отрисовка постов из ВК
    renderPosts() {
        const container = document.getElementById('vkPostsContainer');
        if (!container || this.posts.length === 0) {
            container.innerHTML = `
                <div class="no-news">
                    <i class="fas fa-newspaper"></i>
                    <h3>Нет новостей в группе</h3>
                    <p>Подождите, пока администратор добавит новости</p>
                </div>
            `;
            return;
        }
        
        const isAdmin = localStorage.getItem('admin_logged_in') === 'true';
        
        let html = '';
        
        this.posts.forEach(post => {
            if (post.is_deleted || post.deleted || !post.text) return;
            
            const date = new Date(post.date * 1000);
            const formattedDate = this.formatDate(date);
            
            let attachmentsHtml = '';
            if (post.attachments) {
                attachmentsHtml = this.renderAttachments(post.attachments);
            }
            
            const likes = post.likes?.count || 0;
            const comments = post.comments?.count || 0;
            const reposts = post.reposts?.count || 0;
            
            const adminActions = isAdmin ? `
                <a href="vk-admin.html?edit=${post.id}" class="action-btn edit-btn">
                    <i class="fas fa-edit"></i> Редактировать
                </a>
                <button class="action-btn delete-btn" onclick="VK_NEWS.deletePost(${post.id})">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            ` : '';
            
            html += `
                <div class="vk-post" data-post-id="${post.id}">
                    <div class="post-header">
                        <div class="post-date">
                            <i class="far fa-clock"></i>
                            ${formattedDate}
                            ${isAdmin ? '<span class="admin-badge"><i class="fas fa-crown"></i> Админ</span>' : ''}
                        </div>
                        <div class="post-likes">
                            <span class="likes-count">❤️ ${likes}</span>
                            <span class="comments-count">💬 ${comments}</span>
                            <span class="reposts-count">↪️ ${reposts}</span>
                        </div>
                    </div>
                    
                    <div class="post-content">
                        ${this.formatText(post.text)}
                    </div>
                    
                    ${attachmentsHtml}
                    
                    <div class="post-actions">
                        <a href="https://vk.com/wall-${this.groupId}_${post.id}" 
                           target="_blank" 
                           class="action-btn">
                            <i class="fab fa-vk"></i> Открыть в ВК
                        </a>
                        ${adminActions}
                        <button class="action-btn" onclick="VK_NEWS.sharePost(${post.id})">
                            <i class="fas fa-share-alt"></i> Поделиться
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    },

    // Отрисовка локальных постов
    renderLocalPosts(posts) {
        const container = document.getElementById('vkPostsContainer');
        if (!container) return;
        
        const isAdmin = localStorage.getItem('admin_logged_in') === 'true';
        
        let html = '';
        
        posts.forEach(post => {
            const date = new Date(post.date);
            const formattedDate = this.formatDate(date);
            
            const adminActions = isAdmin ? `
                <a href="vk-admin.html?edit=local_${post.id}" class="action-btn edit-btn">
                    <i class="fas fa-edit"></i> Редактировать
                </a>
                <button class="action-btn delete-btn" onclick="VK_NEWS.deleteLocalPost(${post.id})">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            ` : '';
            
            let imagesHtml = '';
            if (post.images && post.images.length > 0) {
                imagesHtml = `
                    <div class="post-attachments">
                        <div class="attachment-grid">
                            ${post.images.slice(0, 3).map(img => `
                                <div class="attachment-item">
                                    <img src="${img}" alt="Изображение новости">
                                </div>
                            `).join('')}
                            ${post.images.length > 3 ? `
                                <div class="attachment-item more-attachments">
                                    +${post.images.length - 3} фото
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
            
            html += `
                <div class="vk-post" data-post-id="${post.id}">
                    <div class="post-header">
                        <div class="post-date">
                            <i class="far fa-clock"></i>
                            ${formattedDate}
                            ${post.publishedToVK ? 
                                '<span class="vk-badge"><i class="fab fa-vk"></i> ВКонтакте</span>' : 
                                '<span class="site-badge"><i class="fas fa-globe"></i> Сайт</span>'
                            }
                            ${isAdmin ? '<span class="admin-badge"><i class="fas fa-crown"></i> Админ</span>' : ''}
                        </div>
                    </div>
                    
                    <div class="post-content">
                        ${this.formatText(post.text)}
                    </div>
                    
                    ${imagesHtml}
                    
                    <div class="post-actions">
                        ${adminActions}
                        <button class="action-btn" onclick="VK_NEWS.shareLocalPost(${post.id})">
                            <i class="fas fa-share-alt"></i> Поделиться
                        </button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    },

    // Обработка вложений
    renderAttachments(attachments) {
        let html = '';
        let images = [];
        let videos = [];
        
        attachments.forEach(att => {
            switch(att.type) {
                case 'photo':
                    const photo = att.photo;
                    const largestSize = photo.sizes.reduce((max, size) => 
                        size.width > max.width ? size : max
                    );
                    images.push(largestSize.url);
                    break;
                    
                case 'video':
                    const video = att.video;
                    videos.push({
                        title: video.title || 'Видео',
                        duration: video.duration || 0
                    });
                    break;
                    
                case 'link':
                    const link = att.link;
                    images.push(link.photo?.sizes?.[0]?.url);
                    break;
            }
        });
        
        if (images.length > 0) {
            html += '<div class="post-attachments">';
            html += '<div class="attachment-grid">';
            images.slice(0, 4).forEach(img => {
                html += `
                    <div class="attachment-item">
                        <img src="${img}" alt="Изображение из ВК" loading="lazy">
                    </div>
                `;
            });
            if (images.length > 4) {
                html += `<div class="attachment-item more-attachments">+${images.length - 4} фото</div>`;
            }
            html += '</div></div>';
        }
        
        if (videos.length > 0) {
            html += '<div class="video-attachments">';
            videos.forEach(video => {
                const minutes = Math.floor(video.duration / 60);
                const seconds = video.duration % 60;
                html += `
                    <div class="video-item">
                        <div class="video-icon">🎬</div>
                        <div class="video-info">
                            <div class="video-title">${this.escapeHtml(video.title)}</div>
                            <div class="video-duration">${minutes}:${seconds.toString().padStart(2, '0')}</div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        return html;
    },

    // Форматирование текста
    formatText(text) {
        if (!text) return '';
        
        let formatted = this.escapeHtml(text).replace(/\n/g, '<br>');
        formatted = formatted.replace(/#([а-яА-Яa-zA-Z0-9_]+)/g, '<span class="hashtag">#$1</span>');
        
        const urlRegex = /(https?:\/\/[^\s<]+)/g;
        formatted = formatted.replace(urlRegex, url => 
            `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #4A76A8; text-decoration: underline;">${url}</a>`
        );
        
        return formatted;
    },

    // Поделиться постом из ВК
    sharePost(postId) {
        const url = `https://vk.com/wall-${this.groupId}_${postId}`;
        const text = 'Посмотрите эту новость от Вершина!';
        
        if (navigator.share) {
            navigator.share({
                title: 'Новость от Вершина',
                text: text,
                url: url
            });
        } else {
            window.open(`https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank');
        }
    },

    // Поделиться локальным постом
    shareLocalPost(postId) {
        const localNews = JSON.parse(localStorage.getItem('vershina_news') || '[]');
        const post = localNews.find(p => p.id === parseInt(postId));
        
        if (!post) return;
        
        const text = post.text.length > 100 ? post.text.substring(0, 100) + '...' : post.text;
        
        if (navigator.share) {
            navigator.share({
                title: 'Новость от Вершина',
                text: text,
                url: window.location.href
            });
        } else {
            alert('Скопируйте ссылку на эту страницу, чтобы поделиться новостью');
        }
    },

    // Удаление поста из ВК
    async deletePost(postId) {
        if (!confirm('Вы уверены, что хотите удалить этот пост из ВКонтакте?\n\nПримечание: Для удаления поста из ВК требуется токен с правами wall.')) {
            return;
        }
        
        try {
            const isAdmin = localStorage.getItem('admin_logged_in') === 'true';
            if (!isAdmin) {
                this.showNotification('Только администратор может удалять посты', 'error');
                return;
            }
            
            this.showNotification('Функция удаления из ВК требует дополнительных прав доступа', 'info');
            this.showNotification('Пост удален из отображения (локально)', 'warning');
            
            const postElement = document.querySelector(`[data-post-id="${postId}"]`);
            if (postElement) {
                postElement.remove();
            }
            
        } catch (error) {
            console.error('Error deleting post:', error);
            this.showNotification('Ошибка удаления поста: ' + error.message, 'error');
        }
    },

    // Удаление локального поста
    deleteLocalPost(postId) {
        if (!confirm('Вы уверены, что хотите удалить этот пост?')) {
            return;
        }
        
        const isAdmin = localStorage.getItem('admin_logged_in') === 'true';
        if (!isAdmin) {
            this.showNotification('Только администратор может удалять посты', 'error');
            return;
        }
        
        try {
            const localNews = JSON.parse(localStorage.getItem('vershina_news') || '[]');
            const updatedNews = localNews.filter(post => post.id !== parseInt(postId));
            localStorage.setItem('vershina_news', JSON.stringify(updatedNews));
            
            this.showNotification('Пост успешно удален', 'success');
            this.loadLocalPosts();
            
        } catch (error) {
            console.error('Error deleting local post:', error);
            this.showNotification('Ошибка удаления поста', 'error');
        }
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

    // Показ ошибок
    showError(message) {
        const container = document.getElementById('vkPostsContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>${message}</h3>
                <p>Попробуйте обновить страницу или вернуться позже</p>
                <button class="btn-primary" onclick="VK_NEWS.loadVKPosts()" style="margin-top: 15px;">
                    <i class="fas fa-sync-alt"></i> Обновить
                </button>
            </div>
        `;
    },

    // Уведомления
    showNotification(message, type = 'info') {
        const oldNotifications = document.querySelectorAll('.notification');
        oldNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Экранирование HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};