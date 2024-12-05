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
const API_URL = 'https://api.mcsrvstat.us/2/ld.frp.one:25566';
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
