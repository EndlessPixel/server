// script.js

// 动态背景颜色变化
window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY;
    const body = document.body;

    // 根据滚动位置调整背景渐变
    const gradientStart = `rgba(31, 28, 44, ${scrollPosition / 500})`;
    const gradientEnd = `rgba(146, 141, 171, ${scrollPosition / 500})`;
    body.style.background = `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`;
});

// 导航菜单动画
const navLinks = document.querySelectorAll('.nav-menu a');

navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateY(-2px)';
    });
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateY(0)';
    });
});

// 当DOM加载完毕后执行动画
document.addEventListener('DOMContentLoaded', function () {
    const textElement = document.querySelector('.text');
    const overlay = document.querySelector('.overlay');
    const content = document.querySelector('.content');

    // 文字渐显并向上移动
    textElement.style.opacity = 1;
    textElement.style.transform = 'translateY(0)';

    // 动画完成后抬起每个字
    setTimeout(() => {
        const text = textElement.innerText;
        textElement.innerHTML = ''; // 清空原有文字
        text.split('').forEach((char, index) => {
            const charElement = document.createElement('span');
            charElement.innerText = char;
            charElement.style.transition = `transform 0.5s ease-in-out ${index * 0.1}s`; // 设置每个字的动画延迟和平滑过渡
            charElement.style.transform = 'translateY(-100%)'; // 向上抬起
            textElement.appendChild(charElement);
        });
    }, 1000); // 等待渐显动画完成

    // 动画完全结束后，隐藏覆盖层并允许滚动
    setTimeout(() => {
        overlay.style.transform = 'translateY(-100%)'; // 将覆盖层向上移动
    }, 1600); // 等待抬起动画完成

    // 等待覆盖层动画完成后，显示内容并允许滚动
    setTimeout(() => {
        overlay.style.display = 'none';
        content.style.display = 'block'; // 显示页面内容
        document.body.style.overflow = 'auto'; // 允许滚动
    }, 2600); // 等待覆盖层动画完成
});
// DOMContentLoaded 事件监听器，确保 DOM 元素加载完毕后再执行脚本
document.addEventListener('DOMContentLoaded', () => {
    feather.replace(); // 替换图标库（假设使用了 feather.js）
    initAnnouncements(); // 初始化公告功能
    initServerStatus(); // 初始化服务器状态功能
});

/**
 * 公告功能相关
 */
const TOGGLE_ANNOUNCEMENTS_ID = 'toggleAnnouncements'; // 切换公告按钮的 ID
const HIDDEN_ANNOUNCEMENTS_CLASS = 'hidden-announcements'; // 隐藏公告部分的 CSS 类名

function initAnnouncements() {
    const toggleButton = document.getElementById(TOGGLE_ANNOUNCEMENTS_ID); // 获取切换公告按钮元素
    const hiddenAnnouncements = document.querySelector(`.${HIDDEN_ANNOUNCEMENTS_CLASS}`); // 获取隐藏公告部分元素

    // 添加点击事件监听器，用于切换公告的显示与隐藏
    toggleButton.addEventListener('click', () => {
        // 切换公告部分的显示状态
        hiddenAnnouncements.style.display = hiddenAnnouncements.style.display === 'none' ? 'block' : 'none';
        // 根据显示状态更新按钮文本
        toggleButton.textContent = hiddenAnnouncements.style.display === 'block' ? '收起公告' : '更多公告';
    });
}

/**
 * 服务器状态功能相关
 */
const SERVER_STATUS_ID = 'serverStatus'; // 服务器状态显示元素的 ID
const PLAYER_COUNT_ID = 'playerCount'; // 玩家数量显示元素的 ID
const REFRESH_BUTTON_ID = 'refreshStatus'; // 刷新状态按钮的 ID
const API_URL = 'https://api.mcsrvstat.us/3/ld.frp.one:25566'; // 服务器状态 API 的 URL

function initServerStatus() {
    const statusElement = document.getElementById(SERVER_STATUS_ID); // 获取服务器状态显示元素
    const playerCountElement = document.getElementById(PLAYER_COUNT_ID); // 获取玩家数量显示元素
    const refreshButton = document.getElementById(REFRESH_BUTTON_ID); // 获取刷新状态按钮元素

    // 使用节流函数限制 fetchStatus 函数的调用频率
    const fetchStatus = throttle(async () => {
        try {
            const response = await fetch(API_URL, { cache: 'no-store' }); // 发起请求，不使用缓存
            const data = await response.json(); // 解析 JSON 数据

            // 更新服务器状态和颜色
            statusElement.textContent = data.online ? '在线' : '离线';
            statusElement.style.color = data.online ? '#2ecc71' : '#e74c3c';

            // 更新玩家数量
            playerCountElement.textContent = `${data.online ? data.players.online : 0}/${data.players.max}`;
        } catch (error) {
            console.error('Error fetching server status:', error); // 错误日志
            statusElement.textContent = '无法获取';
            statusElement.style.color = '#e74c3c';
            playerCountElement.textContent = '无法获取';
        }
    }, 2000); // 节流限制为每 2000ms 调用一次

    // 添加点击事件监听器，刷新服务器状态
    refreshButton.addEventListener('click', fetchStatus);
    fetchStatus(); // 页面加载时首次调用
}

// 节流函数，限制函数调用频率
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

/**
 * 计时器功能相关
 */
const startDateStr = "2024-09-16T15:34:00"; // 计时器开始时间字符串
const startDate = new Date(startDateStr); // 转换为 Date 对象
const timerElement = document.getElementById('timer'); // 获取计时器显示元素

// 更新计时器显示
function updateTimer() {
    const now = new Date(); // 当前时间
    let diffInMs = now - startDate; // 时间差（毫秒）

    // 如果时间差为负数，显示错误信息
    if (diffInMs < 0) {
        timerElement.textContent = "计算错误: 你的时间有问题!";
        return;
    }

    // 计算时间差各部分
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

    // 更新计时器显示内容
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

// 初始化计时器
updateTimer();
setInterval(updateTimer, 1000);