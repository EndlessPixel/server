// script.js

// 动态背景颜色变化
function updateBackgroundOnScroll() {
    const scrollPosition = window.scrollY;
    const body = document.body;
    // 限制透明度在 0 到 1 之间
    const alpha = Math.min(1, Math.max(0, scrollPosition / 500));
    const gradientStart = `rgba(31, 28, 44, ${alpha})`;
    const gradientEnd = `rgba(146, 141, 171, ${alpha})`;
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

    if (!textElement || !overlay || !content) {
        console.error('Missing elements for animation');
        return;
    }

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
    if (typeof feather === 'undefined') {
        console.error('Feather icons library is not loaded');
        return;
    }
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
    const announcements = document.querySelectorAll('.announcement');
    const hiddenAnnouncements = document.querySelector('.hidden-announcements');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');

    let currentPage = 1;
    const announcementsPerPage = 1; // 每页显示一条公告
    const totalPages = Math.ceil(announcements.length / announcementsPerPage);

    function showAnnouncement(page) {
        // 隐藏所有公告
        announcements.forEach((announcement, index) => {
            announcement.style.display = 'none';
            if (index >= (page - 1) * announcementsPerPage && index < page * announcementsPerPage) {
                announcement.style.display = 'block';
            }
        });

        // 更新页码
        currentPageSpan.textContent = page;

        // 更新按钮状态
        prevButton.disabled = page === 1;
        nextButton.disabled = page === totalPages;
    }

    // 初始化显示第一页
    showAnnouncement(currentPage);

    // 上一页按钮事件
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showAnnouncement(currentPage);
        }
    });

    // 下一页按钮事件
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            showAnnouncement(currentPage);
        }
    });
}

// 初始化公告
initAnnouncements();

// 服务器状态功能
function initServerStatus() {
    const statusElement = document.getElementById('serverStatus');
    const playerCountElement = document.getElementById('playerCount');
    const refreshButton = document.getElementById('refreshStatus');
    const API_URL = 'https://api.mcsrvstat.us/3/gz.endlesspixel.fun:21212';

    if (!statusElement || !playerCountElement || !refreshButton) {
        console.error('Missing elements for server status');
        return;
    }

    // 复用之前定义的节流函数
    const fetchStatus = throttle(async () => {
        try {
            // 显示加载状态
            statusElement.textContent = '查询中...';
            statusElement.style.color = '#f39c12';
            playerCountElement.textContent = '...';

            const response = await fetch(API_URL, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // 处理 JSON 解析错误
            const data = await response.json();

            statusElement.textContent = data.online ? '在线' : '离线';
            statusElement.style.color = data.online ? '#2ecc71' : '#e74c3c';

            // 处理玩家数据可能缺失的情况
            const onlinePlayers = data.online ? (data.players?.online || 0) : 0;
            const maxPlayers = data.online ? (data.players?.max || 0) : 0;
            playerCountElement.textContent = `${onlinePlayers}/${maxPlayers}`;
        } catch (error) {
            console.error('Error fetching server status:', error);
            statusElement.textContent = '无法获取';
            statusElement.style.color = '#e74c3c';
            playerCountElement.textContent = '错误';
        }
    }, 2000);

    // 初始请求
    fetchStatus();

    // 设置刷新按钮
    refreshButton.addEventListener('click', (e) => {
        e.preventDefault();
        fetchStatus();
    });

    // 可选：每 30 秒自动刷新
    setInterval(fetchStatus, 30000);
}

// 计时器功能
function initTimer() {
    const startDateStr = "2024-09-16T15:34:00";
    const startDate = new Date(startDateStr);
    const timerElement = document.getElementById('timer');

    if (!timerElement) {
        console.error('Missing timer element');
        return;
    }

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
        timerElement.innerHTML = `<span class="time-unit"> ${years} 年 ${months} 月 ${days} 日 ${pad(hours)} 小时 ${pad(minutes)} 分钟 ${pad(seconds)} 秒 </span>`;
    }

    updateTimer();
    setInterval(updateTimer, 100);
}

// 抽屉动画
function toggleDrawer(drawerId) {
    var drawer = document.getElementById(drawerId);
    if (!drawer) {
        console.error(`Drawer with id ${drawerId} not found`);
        return;
    }
    if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
    } else {
        drawer.classList.add('open');
    }
}

//评价
function initRating() {
    const ratingContainer = document.querySelector('.rating-container');
    const buttonsContainer = document.querySelector('.buttons');
    const thankYouMessage = document.querySelector('.thank-you-message');

    // 动态生成按钮
    for (let i = 0; i <= 10; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            // 隐藏所有按钮
            buttonsContainer.style.display = 'none';
            // 显示感谢信息
            thankYouMessage.style.display = 'block';
        });
        buttonsContainer.appendChild(button);
    }
}

// 初始化评分功能
initRating();

// DOMContentLoaded 事件监听器
document.addEventListener('DOMContentLoaded', () => {
    updateBackgroundOnScroll(); // 绑定滚动事件
    window.addEventListener('scroll', updateBackgroundOnScroll);
    animateNavLinks();
    initAnimation();
    initFeatures();
    initTimer();
});
