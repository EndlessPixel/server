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

// 获取页面元素
const statusElement = document.getElementById('serverStatus');
const playerCountElement = document.getElementById('playerCount');
const refreshButton = document.getElementById('refreshStatus');
const motdElement = document.getElementById('serverMotd');
const apiVersionElement = document.getElementById('apiVersion');
const nodeSelect = document.getElementById('nodeSelect');
const container = document.getElementById('jsonContainer');
const loading = document.getElementById('loading');
const error = document.getElementById('error');

// 定义不同节点的 API 地址
const nodeApiUrls = {
    gz: 'https://api.mcsrvstat.us/3/gz.endlesspixel.fun:21212',
    hn: 'https://api.mcsrvstat.us/3/hn.endlesspixel.fun:25568',
    hb: 'https://api.mcsrvstat.us/3/hb.endlesspixel.fun:25568'
};

// 定义不同节点的 FRP 地址
const nodeFrpUrls = {
    gz: 'https://api.mcsrvstat.us/3/vip.gz.frp.one:21212',
    hn: 'https://api.mcsrvstat.us/3/ld.frp.one:25568',
    hb: 'https://api.mcsrvstat.us/3/hb.frp.one:25568'
};

// 获取当前选择的连接方式对应的 API 地址
function getCurrentApiUrl() {
    const selectedNode = nodeSelect.value;
    const connectionOption = getSelectedConnectionOption();
    if (connectionOption === 'domain') {
        return nodeApiUrls[selectedNode];
    } else if (connectionOption === 'frp') {
        return nodeFrpUrls[selectedNode];
    }
}

// 获取单选框的值
function getSelectedConnectionOption() {
    const radios = document.getElementsByName('connectionOption');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return 'domain'; // 默认值
}

// 节流函数，限制函数的执行频率
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function () {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

// 获取服务器状态
async function fetchServerStatus() {
    try {
        const API_URL = getCurrentApiUrl();

        // 显示加载状态
        statusElement.textContent = '查询中...';
        statusElement.style.color = '#f39c12';
        playerCountElement.textContent = '...';
        motdElement.textContent = '查询中...';
        apiVersionElement.textContent = '查询中...';

        // 发起请求获取服务器状态
        const response = await fetch(API_URL, { cache: 'no-store' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 解析响应数据
        const data = await response.json();

        // 更新服务器状态
        statusElement.textContent = data.online ? '在线' : '离线';
        statusElement.style.color = data.online ? '#2ecc71' : '#e74c3c';

        // 更新玩家数量
        const onlinePlayers = data.online ? (data.players?.online || 0) : 0;
        const maxPlayers = data.online ? (data.players?.max || 0) : 0;
        playerCountElement.textContent = `${onlinePlayers}/${maxPlayers}`;

        // 更新 MOTD 信息
        if (data.motd && data.motd.html) {
            motdElement.innerHTML = data.motd.html.join('<br>');
        } else {
            motdElement.textContent = '未获取到 motd 信息';
        }

        // 更新 API 版本信息
        apiVersionElement.textContent = data.debug?.apiversion || '未获取到 API 版本信息';

    } catch (error) {
        console.error('Error fetching server status:', error);
        statusElement.textContent = '无法获取';
        statusElement.style.color = '#e74c3c';
        playerCountElement.textContent = '错误';
        motdElement.textContent = '错误';
        apiVersionElement.textContent = '错误';
    }
}

// 获取 JSON 数据并渲染
async function fetchAndDisplayJSON() {
    try {
        const apiUrl = getCurrentApiUrl();

        // 显示加载中...
        loading.style.display = 'block';
        container.style.display = 'none';
        error.textContent = '';

        // 发起 API 请求
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const data = await response.json();
        const maskedData = JSON.parse(maskSensitiveData(JSON.stringify(data))); // 对数据进行打码处理
        const formattedJSON = renderJSON(maskedData); // 渲染打码后的 JSON 数据

        // 渲染 JSON 数据
        container.innerHTML = formattedJSON;
        container.style.display = 'block';
        loading.style.display = 'none';

    } catch (err) {
        // 显示错误消息
        console.error('Fetch error:', err);
        loading.style.display = 'none';
        container.style.display = 'none';
        error.textContent = '加载失败，请稍后再试。';
    }
}

// 渲染 JSON 数据
function renderJSON(obj, indent = 0) {
    let html = '';
    const space = ''.repeat(indent);

    if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
            html += '[\n';
            obj.forEach((item, index) => {
                html += `${space}  ${renderJSON(item, indent + 1)}${index < obj.length - 1 ? ',' : ''}\n`;
            });
            html += `${space}]`;
        } else {
            html += '{\n';
            const keys = Object.keys(obj);
            keys.forEach((key, index) => {
                html += `${space}  <span class="json-key">"${key}"</span>: ${renderJSON(obj[key], indent + 1)}${index < keys.length - 1 ? ',' : ''}\n`;
            });
            html += `${space}}`;
        }
    } else if (typeof obj === 'string') {
        html += `<span class="json-string">"${obj}"</span>`;
    } else if (typeof obj === 'number') {
        html += `<span class="json-number">${obj}</span>`;
    } else if (typeof obj === 'boolean') {
        html += `<span class="json-boolean">${obj}</span>`;
    } else if (obj === null) {
        html += `<span class="json-null">null</span>`;
    } else {
        html += obj;
    }

    return html;
}

// 打码敏感数据
function maskSensitiveData(json) {
    const regex = /"ip":"([^"]+)"/g;
    return json.replace(regex, (_, ip) => {
        const maskedIp = ip.replace(/\d/g, '*');
        return `"ip":"${maskedIp}"`;
    }).replace(/"name":"([^"]+)"/g, (_, name) => {
        const maskedName = name.replace(/./g, '*');
        return `"name":"${maskedName}"`;
    });
}

// 初始化并设置自动刷新
const throttledFetchStatus = throttle(fetchServerStatus, 2000);
throttledFetchStatus();
setInterval(throttledFetchStatus, 30000);

// 设置刷新按钮事件
refreshButton.addEventListener('click', (e) => {
    e.preventDefault();
    throttledFetchStatus();
    fetchAndDisplayJSON();
});

// 设置下拉框事件
nodeSelect.addEventListener('change', () => {
    throttledFetchStatus();
    fetchAndDisplayJSON();
});

// 添加单选框的事件监听
document.querySelectorAll('input[name="connectionOption"]').forEach(radio => {
    radio.addEventListener('change', () => {
        throttledFetchStatus();
        fetchAndDisplayJSON();
    });
});

// 切换服务器窗口的显示状态
function toggleServerWindow() {
    // 检查是否存在服务器窗口
    const serverWindow = document.getElementById('serverWindow');
    if (!serverWindow) {
        console.error('Missing server window element');
        return;
    }
    // 切换服务器窗口的显示状态
    serverWindow.classList.toggle('server-window');
    // 如果窗口显示，更新 JSON 数据
    if (!serverWindow.classList.contains('server-window')) {
        fetchAndDisplayJSON();
    }
}

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
