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
    // 将 JSON 字符串解析为对象
    const data = JSON.parse(json);

    // 脱敏函数
    const maskIp = (ip) => ip.replace(/\d/g, '*');
    const maskDomain = (domain) => domain.replace(/[^.]/g, '*');
    const maskPort = (port) => port.toString().replace(/\d/g, '*');
    const maskError = (error) => error.replace(/./g, '*');

    // 脱敏 IP 地址
    if (data.ip) {
        data.ip = maskIp(data.ip);
    }

    // 脱敏端口号
    if (data.port) {
        data.port = maskPort(data.port);
    }

    // 脱敏 DNS 中的 IP 地址和域名
    if (data.dns && data.dns.a) {
        data.dns.a.forEach((record) => {
            if (record.address) {
                record.address = maskIp(record.address);
            }
            if (record.name) {
                record.name = maskDomain(record.name);
            }
            if (record.cname) {
                record.cname = maskDomain(record.cname);
            }
        });
    }

    // 脱敏错误信息
    if (data.error) {
        for (const key in data.error) {
            if (data.error[key]) {
                data.error[key] = maskError(data.error[key]);
            }
        }
    }

    // 将对象转换回 JSON 字符串
    return JSON.stringify(data, null, 2);
}

// 初始化并设置自动刷新
const throttledFetchStatus = throttle(fetchServerStatus, 2000);
throttledFetchStatus();
setInterval(throttledFetchStatus, 30000);

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