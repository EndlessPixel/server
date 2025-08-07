// 固定 API
const API_URL = 'https://api.mcsrvstat.us/3/epmc.top';

// 获取页面元素
const throttledFetchStatus = throttle(fetchServerStatus, 800);
const statusElement = document.getElementById('serverStatus');
const playerCountElement = document.getElementById('playerCount');
const refreshButton = document.getElementById('refreshStatus');
const motdElement = document.getElementById('serverMotd');
const apiVersionElement = document.getElementById('apiVersion');
const pingElement = document.getElementById('ping');

// 节流函数
function throttle(func, limit) {
    let lastFunc, lastRan;
    return function (...args) {
        const context = this;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
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
        statusElement.textContent = '查询中...';
        statusElement.style.color = '#f39c12';
        playerCountElement.textContent = '...';
        motdElement.textContent = '查询中...';
        apiVersionElement.textContent = '查询中...';

        const response = await fetch(API_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        statusElement.textContent = data.online ? '在线' : '离线';
        statusElement.style.color = data.online ? '#2ecc71' : '#e74c3c';
        pingElement.textContent = data.online ? `${data.ping} ms` : '离线';

        const online = data.players?.online || 0;
        const max = data.players?.max || 0;
        playerCountElement.textContent = `${online}/${max}`;

        motdElement.innerHTML = data.motd?.html?.join('<br>') || '未获取到 motd 信息';
        apiVersionElement.textContent = data.debug?.apiversion || '未知';

        updatePlayerList(data.players?.list || []);
    } catch (err) {
        console.error(err);
        statusElement.textContent = '无法获取';
        statusElement.style.color = '#e74c3c';
        playerCountElement.textContent = '错误';
        motdElement.textContent = '错误';
        apiVersionElement.textContent = '错误';
        pingElement.textContent = '错误';
    }
}

// 更新玩家列表
function updatePlayerList(players) {
    const tbody = document.querySelector('#playerTable tbody');
    tbody.innerHTML = '';
    players.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${p.name || '未知'}</td><td>${p.uuid || '未知'}</td>`;
        tbody.appendChild(tr);
    });
}

// 仅保留刷新按钮
refreshButton.addEventListener('click', throttledFetchStatus);
fetchServerStatus(); // 首次加载

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