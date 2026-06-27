// ===== WEBHOOK CONFIGURATION =====
const webhookConfig = {
    discord: {
        url: localStorage.getItem('discordWebhook') || '',
        enabled: false
    },
    telegram: {
        token: localStorage.getItem('telegramToken') || '',
        chatId: localStorage.getItem('telegramChatId') || '',
        enabled: false
    }
};

// ===== LOAD SAVED CONFIG =====
document.addEventListener('DOMContentLoaded', () => {
    // Load Discord webhook
    const discordInput = document.getElementById('discordWebhook');
    if (discordInput && webhookConfig.discord.url) {
        discordInput.value = webhookConfig.discord.url;
        updateWebhookStatus('discord', true);
    }
    
    // Load Telegram webhook
    const telegramInput = document.getElementById('telegramWebhook');
    const chatInput = document.getElementById('telegramChat');
    if (telegramInput && webhookConfig.telegram.token) {
        telegramInput.value = webhookConfig.telegram.token;
        updateWebhookStatus('telegram', true);
    }
    if (chatInput && webhookConfig.telegram.chatId) {
        chatInput.value = webhookConfig.telegram.chatId;
    }
});

// ===== DISCORD WEBHOOK SETUP =====
function setupDiscordWebhook() {
    const input = document.getElementById('discordWebhook');
    const url = input.value.trim();
    
    if (!url) {
        showNotification('Пожалуйста, введите URL Discord Webhook', 'error');
        return;
    }
    
    if (!url.startsWith('https://discord.com/api/webhooks/')) {
        showNotification('Неверный формат Discord Webhook URL', 'error');
        return;
    }
    
    // Test the webhook
    testDiscordWebhook(url)
        .then(() => {
            webhookConfig.discord.url = url;
            webhookConfig.discord.enabled = true;
            localStorage.setItem('discordWebhook', url);
            updateWebhookStatus('discord', true);
            showNotification('✅ Discord Webhook успешно подключен!', 'success');
        })
        .catch(error => {
            showNotification('❌ Ошибка подключения Discord Webhook: ' + error.message, 'error');
        });
}

function testDiscordWebhook(url) {
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: '🔔 **Landsite Project**\nТестовое уведомление! Webhook работает корректно.',
            embeds: [{
                title: '✅ Webhook подключен',
                description: 'Вы будете получать уведомления о банах, нарушениях и важных событиях.',
                color: 0xFF6B35,
                footer: {
                    text: 'Landsite Project Rules'
                },
                timestamp: new Date().toISOString()
            }]
        })
    }).then(async res => {
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`HTTP ${res.status}: ${text}`);
        }
        return res;
    });
}

// ===== TELEGRAM WEBHOOK SETUP =====
function setupTelegramWebhook() {
    const tokenInput = document.getElementById('telegramWebhook');
    const chatInput = document.getElementById('telegramChat');
    const token = tokenInput.value.trim();
    const chatId = chatInput.value.trim();
    
    if (!token) {
        showNotification('Пожалуйста, введите токен бота', 'error');
        return;
    }
    
    if (!chatId) {
        showNotification('Пожалуйста, введите ID чата', 'error');
        return;
    }
    
    // Test the webhook
    testTelegramWebhook(token, chatId)
        .then(() => {
            webhookConfig.telegram.token = token;
            webhookConfig.telegram.chatId = chatId;
            webhookConfig.telegram.enabled = true;
            localStorage.setItem('telegramToken', token);
            localStorage.setItem('telegramChatId', chatId);
            updateWebhookStatus('telegram', true);
            showNotification('✅ Telegram Webhook успешно подключен!', 'success');
        })
        .catch(error => {
            showNotification('❌ Ошибка подключения Telegram Webhook: ' + error.message, 'error');
        });
}

function testTelegramWebhook(token, chatId) {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: '🔔 **Landsite Project**\nТестовое уведомление! Webhook работает корректно.',
            parse_mode: 'Markdown'
        })
    }).then(async res => {
        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.description || `HTTP ${res.status}`);
        }
        return res;
    });
}

// ===== UPDATE WEBHOOK STATUS =====
function updateWebhookStatus(type, enabled) {
    const statusElement = document.getElementById(`${type}Status`);
    if (!statusElement) return;
    
    const dot = statusElement.querySelector('.status-dot');
    const text = statusElement.childNodes[2];
    
    if (enabled) {
        dot.className = 'status-dot active';
        text.textContent = ' Подключено';
    } else {
        dot.className = 'status-dot inactive';
        text.textContent = ' Не подключено';
    }
}

// ===== SEND TEST WEBHOOK =====
function sendTestWebhook() {
    const type = document.getElementById('webhookType').value;
    const message = document.getElementById('testMessage').value.trim();
    
    if (!message) {
        showNotification('Пожалуйста, введите сообщение для отправки', 'error');
        return;
    }
    
    const payload = {
        content: `📢 **Тестовое уведомление**\n${message}`,
        embeds: [{
            title: '📬 Тестовое сообщение',
            description: message,
            color: 0xFF6B35,
            footer: {
                text: 'Landsite Project | Тестовая система'
            },
            timestamp: new Date().toISOString()
        }]
    };
    
    let promises = [];
    
    if (type === 'discord' || type === 'both') {
        if (webhookConfig.discord.enabled) {
            promises.push(
                fetch(webhookConfig.discord.url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                }).then(res => {
                    if (!res.ok) throw new Error('Discord: ' + res.status);
                })
            );
        } else {
            showNotification('Discord Webhook не подключен!', 'error');
            return;
        }
    }
    
    if (type === 'telegram' || type === 'both') {
        if (webhookConfig.telegram.enabled) {
            const url = `https://api.telegram.org/bot${webhookConfig.telegram.token}/sendMessage`;
            promises.push(
                fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: webhookConfig.telegram.chatId,
                        text: `📢 *Тестовое уведомление*\n\n${message}`,
                        parse_mode: 'Markdown'
                    })
                }).then(res => {
                    if (!res.ok) throw new Error('Telegram: ' + res.status);
                })
            );
        } else {
            showNotification('Telegram Webhook не подключен!', 'error');
            return;
        }
    }
    
    Promise.all(promises)
        .then(() => {
            showNotification('✅ Тестовое уведомление отправлено!', 'success');
        })
        .catch(error => {
            showNotification('❌ Ошибка отправки: ' + error.message, 'error');
        });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const colors = {
        success: '#2ecc71',
        error: '#e74c3c',
        info: '#3498db',
        warning: '#f39c12'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 16px 24px;
        background: var(--card-bg);
        border-left: 4px solid ${colors[type] || '#FF6B35'};
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        color: var(--light);
        font-weight: 500;
        z-index: 9999;
        max-width: 400px;
        animation: slideIn 0.3s ease;
        border: 1px solid var(--border-color);
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===== ADD ANIMATIONS =====
const styleWebhook = document.createElement('style');
styleWebhook.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleWebhook);

// ===== EXPORT FUNCTIONS =====
window.setupDiscordWebhook = setupDiscordWebhook;
window.setupTelegramWebhook = setupTelegramWebhook;
window.sendTestWebhook = sendTestWebhook;