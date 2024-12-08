document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    initAnnouncements();
    initServerStatus();
});
const TOGGLE_ANNOUNCEMENTS_ID = 'toggleAnnouncements';
const HIDDEN_ANNOUNCEMENTS_CLASS = 'hidden-announcements';
function initAnnouncements() {
    const toggleButton = document.getElementById(TOGGLE_ANNOUNCEMENTS_ID);
    const hiddenAnnouncements = document.querySelector(`.${HIDDEN_ANNOUNCEMENTS_CLASS}`);

    toggleButton.addEventListener('click', () => {
        hiddenAnnouncements.style.display = hiddenAnnouncements.style.display === 'none' ? 'block' : 'none';
        toggleButton.textContent = hiddenAnnouncements.style.display === 'block' ? '收起公告' : '更多公告';
    });
}
const SERVER_STATUS_ID = 'serverStatus';
const PLAYER_COUNT_ID = 'playerCount';
const REFRESH_BUTTON_ID = 'refreshStatus';
const API_URL = 'https://api.mcsrvstat.us/3/ld.frp.one:25566';
function initServerStatus() {
    const statusElement = document.getElementById(SERVER_STATUS_ID);
    const playerCountElement = document.getElementById(PLAYER_COUNT_ID);
    const refreshButton = document.getElementById(REFRESH_BUTTON_ID);
    const fetchStatus = throttle(async () => {
        try {
            const response = await fetch(API_URL, { cache: 'no-store' });
            const data = await response.json();
            statusElement.textContent = data.online ? '在线' : '离线';
            statusElement.style.color = data.online ? '#2ecc71' : '#e74c3c';
            playerCountElement.textContent = `${data.online ? data.players.online : 0}/${data.players.max + 2}`;
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
function toggleDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    drawer.style.display = drawer.style.display === 'block' ? 'none' : 'block';
}
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
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px';
    } else {
        sidebar.style.left = '0px';
    }
}
document.addEventListener('click', function (event) {
    const target = event.target;
    if (target.classList.contains('sidebar-toggle') || target.closest('.sidebar-toggle')) {
        return;
    }
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.style.left !== '-250px') {
        toggleSidebar();
    }
});
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
    let years = 0;
    let months = 0;
    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));
    diffInMs -= years * (1000 * 60 * 60 * 24 * 365.25);
    months = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
    diffInMs -= months * (1000 * 60 * 60 * 24 * 30.44);
    days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    diffInMs -= days * (1000 * 60 * 60 * 24);
    hours = Math.floor(diffInMs / (1000 * 60 * 60));
    diffInMs -= hours * (1000 * 60 * 60);
    minutes = Math.floor(diffInMs / (1000 * 60));
    diffInMs -= minutes * (1000 * 60);
    seconds = Math.floor(diffInMs / 1000);
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
document.getElementById('darkModeBtn').addEventListener('click', function () {
    document.querySelector('link[rel="stylesheet"]').href = 'styles-dark.css';
});
document.getElementById('lightModeBtn').addEventListener('click', function () {
    document.querySelector('link[rel="stylesheet"]').href = 'styles-linght.css';
});
function openPopup() {
    document.getElementById('customPopup').classList.add('show');
    document.body.classList.add('popup-open');
}
function closePopup() {
    document.getElementById('customPopup').classList.remove('show');
    document.body.classList.remove('popup-open');
}
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.close-btn').addEventListener('click', function (event) {
        event.preventDefault();
        closePopup();
    });
});