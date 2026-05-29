// auto-init.js - Автоматическая инициализация всех модулей ВКонтакте
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auto-init started');
    
    // ИСПРАВЛЕННЫЙ ТОКЕН С ПРАВАМИ ГРУППЫ
    const correctToken = 'vk1.a.BFQ7g_MGGMkk6bTfUt8OAEFLMEKbtvGo63U_U4LHR-ClMnuHg6d5yC8BKw6kcyuPcsG3gRPwWTqHAXPeamA-C37ik2jbZgAQjRTM3AM1JLzgOAj7dcg-OUo8zH8u3C1z6YBTCncIdPkX-X_1CHowyCxSbRlyYOJumxfKx2Qu-FBhM7mNQj5VZK2EXugfvJeJu4MG9sEToO07jeMKqznmcg';
    const groupId = '233748818';
    const userId = '352432261';
    
    // Обновляем VK_ADMIN если он существует
    if (typeof VK_ADMIN !== 'undefined') {
        VK_ADMIN.accessToken = correctToken;
        VK_ADMIN.groupId = groupId;
        VK_ADMIN.userId = userId;
        console.log('VK_ADMIN updated with correct credentials');
    }
    
    // Обновляем VK_NEWS если он существует
    if (typeof VK_NEWS !== 'undefined') {
        VK_NEWS.accessToken = correctToken;
        VK_NEWS.groupId = groupId;
        console.log('VK_NEWS updated with correct credentials');
    }
    
    // Обновляем токен в input поле если он существует
    const tokenInput = document.getElementById('vkToken');
    if (tokenInput) {
        tokenInput.value = correctToken;
        console.log('Token input updated');
    }
    
    // Автоматический вход администратора для тестирования
    if (window.location.pathname.includes('vk-admin.html') || 
        window.location.pathname.includes('admin.html')) {
        localStorage.setItem('admin_logged_in', 'true');
        
        // Устанавливаем пользователя администратора
        const adminUser = {
            id: 999,
            firstName: 'Администратор',
            lastName: 'Вершины',
            email: 'admin@gmail.com',
            phone: '+7 (999) 999-99-99',
            registrationDate: new Date().toISOString(),
            isAdmin: true,
            membership: {
                type: 'admin',
                status: 'active'
            }
        };
        
        localStorage.setItem('current_user', JSON.stringify(adminUser));
    }
    
    // Показываем информацию о подключении
    console.log('Using VK credentials:', {
        token: correctToken.substring(0, 20) + '...',
        groupId: groupId,
        userId: userId
    });
    
    // Тест подключения к ВК
    if (typeof VK_ADMIN !== 'undefined') {
        setTimeout(() => {
            VK_ADMIN.testVKConnection();
        }, 1000);
    }
});