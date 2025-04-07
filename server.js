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
const refreshStatusbar = document.getElementById('refreshStatusbar');
const pingElement = document.getElementById('ping'); // 新增这行

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

// 获取页面元素（在文件顶部添加ping元素）


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

        // 显示刷新状态条
        refreshStatusbar.style.display = 'block';
        refreshStatusbar.style.width = '0%';

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

        // 新增Ping值显示（放在状态更新之后）
        pingElement.textContent = data.online ? `${data.ping} ms` : '离线';

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

        // 更新玩家列表
        updatePlayerList(data.players?.list || []);

        // 隐藏刷新状态条
        refreshStatusbar.style.width = '100%';
        setTimeout(() => {
            refreshStatusbar.style.display = 'none';
        }, 500);

    } catch (error) {
        console.error('Error fetching server status:', error);
        statusElement.textContent = '无法获取';
        statusElement.style.color = '#e74c3c';
        playerCountElement.textContent = '错误';
        motdElement.textContent = '错误';
        apiVersionElement.textContent = '错误';

        // 隐藏刷新状态条
        refreshStatusbar.style.width = '100%';
        setTimeout(() => {
            refreshStatusbar.style.display = 'none';
        }, 500);
        pingElement.textContent = '错误';  // 新增错误状态
    }
}

// 更新玩家列表
function updatePlayerList(players) {
    const playerTableBody = document.querySelector('#playerTable tbody');
    playerTableBody.innerHTML = ''; // 清空现有内容

    players.forEach(player => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const uuidCell = document.createElement('td');

        nameCell.textContent = player.name || '未知';
        uuidCell.textContent = player.uuid || '未知';

        row.appendChild(nameCell);
        row.appendChild(uuidCell);
        playerTableBody.appendChild(row);
    });
}

