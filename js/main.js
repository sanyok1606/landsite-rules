// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

// Scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
let isDark = true;

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    const root = document.documentElement;
    
    if (isDark) {
        root.style.setProperty('--dark', '#0a0a0f');
        root.style.setProperty('--darker', '#050508');
        root.style.setProperty('--light', '#f5f6fa');
        root.style.setProperty('--card-bg', '#15151e');
        root.style.setProperty('--border-color', '#2a2a3a');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        root.style.setProperty('--dark', '#f5f6fa');
        root.style.setProperty('--darker', '#ffffff');
        root.style.setProperty('--light', '#2d3436');
        root.style.setProperty('--card-bg', '#e8ecf1');
        root.style.setProperty('--border-color', '#d1d5db');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
});

// ===== ONLINE PLAYERS COUNTER =====
function updateOnlinePlayers() {
    const counter = document.getElementById('onlinePlayers');
    // Simulate online players count
    const count = Math.floor(Math.random() * 20) + 30;
    counter.textContent = count;
}

// Update every 30 seconds
updateOnlinePlayers();
setInterval(updateOnlinePlayers, 30000);

// ===== ANIMATION ON SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.rule-card, .faction-card, .webhook-card, .section-header').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== ADD CSS FOR ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);

// ===== CONSOLE WELCOME =====
console.log('%c🏛️ Landsite Project', 'font-size: 24px; font-weight: bold; color: #FF6B35;');
console.log('%cПравила сервера v2.3.1', 'font-size: 14px; color: #a0a0b0;');
console.log('%cСоблюдайте правила, играйте честно!', 'font-size: 14px; color: #00ff88;');

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Escape to close mobile menu
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});
// ===== 3D TILT EFFECT FOR CARDS =====
document.querySelectorAll('.rule-card, .faction-card, .webhook-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ===== COUNTER ANIMATION (для статистики) =====
function animateCounter(element, target, duration = 2000) {
    const start = parseInt(element.textContent) || 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (target - start) * eased);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}

// Анимация для статистики при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        if (!isNaN(target) && target > 0) {
            stat.textContent = '0';
            setTimeout(() => animateCounter(stat, target, 1500), 500);
        }
    });
});
