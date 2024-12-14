// script.js

// 动态背景颜色变化
function updateBackgroundOnScroll() {
    const scrollPosition = window.scrollY;
    const body = document.body;
    const gradientStart = `rgba(31, 28, 44, ${scrollPosition / 500})`;
    const gradientEnd = `rgba(146, 141, 171, ${scrollPosition / 500})`;
    body.style.background = `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`;
}

// 导航菜单动画
function animateNavLinks() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => link.style.transform = 'translateY(-2px)');
        link.addEventListener('mouseleave', () => link.style.transform = 'translateY(0)');
    });
}

// 动画效果
function initAnimation() {
    const textElement = document.querySelector('.text');
    const overlay = document.querySelector('.overlay');
    const content = document.querySelector('.content');

    textElement.style.opacity = 1;
    textElement.style.transform = 'translateY(0)';
    setTimeout(() => {
        const text = textElement.innerText;
        textElement.innerHTML = '';
        text.split('').forEach((char, index) => {
            const charElement = document.createElement('span');
            charElement.innerText = char;
            charElement.style.transition = `transform 0.5s ease-in-out ${index * 0.1}s`;
            charElement.style.transform = 'translateY(-100%)';
            textElement.appendChild(charElement);
        });
    }, 1000);

    setTimeout(() => {
        overlay.style.transform = 'translateY(-100%)';
    }, 1600);

    setTimeout(() => {
        overlay.style.display = 'none';
        content.style.display = 'block';
        document.body.style.overflow = 'auto';
    }, 2600);
}

// 初始化功能
function initFeatures() {
    feather.replace();
    initAnnouncements();
    initServerStatus();
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    }
}

// 公告功能
function initAnnouncements() {
    const toggleButton = document.getElementById('toggleAnnouncements');
    const hiddenAnnouncements = document.querySelector('.hidden-announcements');

    toggleButton.addEventListener('click', () => {
        hiddenAnnouncements.style.display = hiddenAnnouncements.style.display === 'none' ? 'block' : 'none';
        toggleButton.textContent = hiddenAnnouncements.style.display === 'block' ? '收起公告' : '更多公告';
    });
}

// 服务器状态功能
function initServerStatus() {
    const statusElement = document.getElementById('serverStatus');
    const playerCountElement = document.getElementById('playerCount');
    const refreshButton = document.getElementById('refreshStatus');
    const API_URL = 'https://api.mcsrvstat.us/3/ld.frp.one:25566';

    const fetchStatus = throttle(async () => {
        try {
            const response = await fetch(API_URL, { cache: 'no-store' });
            const data = await response.json();
            statusElement.textContent = data.online ? '在线' : '离线';
            statusElement.style.color = data.online ? '#2ecc71' : '#e74c3c';
            playerCountElement.textContent = `${data.online ? data.players.online : 0}/${data.players.max}`;
        } catch (error) {
            console.error('Error fetching server status:', error);
            statusElement.textContent = '无法获取';
            statusElement.style.color = '#e74c3c';
            playerCountElement.textContent = '无法获取';
        }
    }, 2000);

    refreshButton.addEventListener('click', fetchStatus);
    fetchStatus();
}

// 计时器功能
function initTimer() {
    const startDateStr = "2024-09-16T15:34:00";
    const startDate = new Date(startDateStr);
    const timerElement = document.getElementById('timer');

    function updateTimer() {
        const now = new Date();
        let diffInMs = now - startDate;
        if (diffInMs < 0) {
            timerElement.textContent = "计算错误: 你的时间有问题!";
            return;
        }
        let years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));
        diffInMs -= years * (1000 * 60 * 60 * 24 * 365.25);
        let months = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
        diffInMs -= months * (1000 * 60 * 60 * 24 * 30.44);
        let days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        diffInMs -= days * (1000 * 60 * 60 * 24);
        let hours = Math.floor(diffInMs / (1000 * 60 * 60));
        diffInMs -= hours * (1000 * 60 * 60);
        let minutes = Math.floor(diffInMs / (1000 * 60));
        diffInMs -= minutes * (1000 * 60);
        let seconds = Math.floor(diffInMs / 1000);
        const pad = (num) => num.toString().padStart(2, '0');
        timerElement.innerHTML = `
            <span class="time-unit">${years} 年</span>
            <span class="time-unit">${months} 月</span>
            <span class="time-unit">${days} 日</span>
            <span class="time-unit">${pad(hours)} 小时</span>
            <span class="time-unit">${pad(minutes)} 分钟</span>
            <span class="time-unit">${pad(seconds)} 秒</span>
        `;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// 抽屉动画
function toggleDrawer(drawerId) {
    var drawer = document.getElementById(drawerId);
    if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
    } else {
        drawer.classList.add('open');
    }
}

// DOMContentLoaded 事件监听器
document.addEventListener('DOMContentLoaded', () => {
    updateBackgroundOnScroll(); // 绑定滚动事件
    window.addEventListener('scroll', updateBackgroundOnScroll);
    animateNavLinks();
    initAnimation();
    initFeatures();
    initTimer();
});