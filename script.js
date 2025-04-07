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

function initAnnouncements() {
    const announcements = document.querySelectorAll('.announcement');
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const currentPageInput = document.getElementById('currentPage');

    let currentPage = 1;
    const announcementsPerPage = 1;
    const totalPages = Math.ceil(announcements.length / announcementsPerPage);

    function showAnnouncement(page) {
        announcements.forEach((announcement, index) => {
            announcement.style.display = 'none';
            if (index >= (page - 1) * announcementsPerPage && index < page * announcementsPerPage) {
                announcement.style.display = 'block';
            }
        });
        currentPageInput.value = page;
        prevButton.disabled = page === 1;
        nextButton.disabled = page === totalPages;
    }
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

    // 输入框事件：监听输入并跳转到指定页码
    currentPageInput.addEventListener('input', (event) => {
        const newPage = parseInt(event.target.value, 10);
        if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            showAnnouncement(currentPage);
        } else {
            // 如果输入无效，恢复到当前页码
            currentPageInput.value = currentPage;
        }
    });
}

// 初始化公告
initAnnouncements();

//时间
function initTimer() {
    const startDateStr = "2024-09-16T15:34:43";
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
        // 计算时间差
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
        // 格式化数字，确保两位数显示
        const pad = (num) => num.toString().padStart(2, '0');
        const padYear = (num) => num.toString().padStart(4, '0');
        // 更新显示内容
        timerElement.innerHTML = `<span class="time-unit"> ${padYear(years)} 年 ${pad(months)} 月 ${pad(days)} 日 ${pad(hours)} 小时 ${pad(minutes)} 分钟 ${pad(seconds)} 秒 </span>`;
    }
    // 初始化并更新计时器
    updateTimer();
    setInterval(updateTimer, 1000); // 每秒更新一次
}
// 确保在页面加载完成后调用 initTimer 函数
document.addEventListener('DOMContentLoaded', initTimer);

//评价
function initRating() {
    const ratingContainer = document.querySelector('.rating-container');
    const buttonsContainer = document.querySelector('.buttons');
    const thankYouMessage = document.querySelector('.thank-you-message');
    for (let i = 0; i <= 10; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.addEventListener('click', () => {
            buttonsContainer.style.display = 'none';
            thankYouMessage.style.display = 'block';
        });
        buttonsContainer.appendChild(button);
    }
}
// 初始化功能
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
