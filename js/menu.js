// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function () {
    let relativePath = '';
    const locationProtocol = window.location.protocol;
    const pathname = window.location.pathname;

    if (locationProtocol === 'file:') {
        // 本地环境处理
        const projectRootIndex = pathname.indexOf('/EP/');
        const relativePathPart = projectRootIndex !== -1 ? pathname.slice(projectRootIndex + 4) : '';
        const pathParts = relativePathPart.split('/').filter(part => part);
        // 减去文件名
        let level = pathParts.length - 1; 
        // 确保 level 非负
        level = Math.max(0, level); 
        relativePath = '../'.repeat(level);
    } else if (locationProtocol === 'https:') {
        // 服务器环境处理
        const pathParts = pathname.split('/').filter(part => part);
        // 减去文件名
        let level = pathParts.length - 1; 
        // 确保 level 非负
        level = Math.max(0, level); 
        // 服务器环境使用相对根路径
        relativePath = level > 0 ? '../'.repeat(level) : './';
    }

    // 创建导航菜单元素
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.innerHTML = `
        <span class="close-button">❌</span>
        <hr>
        <ul>
            <h1>导航</h1>
            <hr>
            <li>
                <a href="${relativePath}index.html">首页(home)</a>
            </li>
            <hr>
            <li>
                <a href="${relativePath}state.html">状态(status)</a>  
            </li>
            <hr>
            <li>
                <a href="${relativePath}resources/resources_index.html">资源(resources)</a>
            </li>
            <hr>
            <li>
                <a href="${relativePath}wiki/wiki_index.html">维基(wiki)</a>
            </li>
            <hr>
            <li>
                <a href="${relativePath}about.html">关于(about)</a>
            </li>
            <hr>
            <h1>相关链接</h1>
            <hr>
            <li class="nav-item">
                <a rel="noopener noreferrer" class="nav-link" href="https://github.com/EndlessPixel" target="_blank">Github</a>
            </li>
            <hr>
            <li class="nav-item">
                <a rel="noopener noreferrer" class="nav-link" href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=EmTbLSL3XG_bU20-aDi4o4k_8rgBMdhs&authKey=xnbJ26rO4MI2bAemGcUt3Wj8I0Dw0nY%2Bq5Bx1HHxK1j5MS%2Bh%2FKDCQy6kOVMBl4%2FD&noverify=0&group_code=870594910" target="_blank">QQ</a>
            </li>
            <hr>
            <li class="nav-item">
                <a rel="noopener noreferrer" class="nav-link" href="https://space.bilibili.com/3546799478409405?spm_id_from=333.1007.0.0" target="_blank">bilibili</a>
            </li>
            <hr>
            <li class="nav-item">
                <a rel="noopener noreferrer" class="nav-link" href="https://kuaishou.cn/profile/3xth2cp4jf5ha6c" target="_blank">快手</a>
            </li>
            <hr>
        </ul>
    `;

    // 创建设置面板元素
    const settingsPanel = document.createElement('aside');
    settingsPanel.className = 'settings-panel';
    settingsPanel.innerHTML = `
        <span class="close-button">❌</span>
        <form class="theme-form">
            <h2>主题设置</h2>
            <br>
            <label>主色：</label>
            <input type="color" class="primary-color">
            <button type="button" class="reset-color" data-color="primary">重置</button>
            <br>
            <label>次要颜色：</label>
            <input type="color" class="secondary-color">
            <button type="button" class="reset-color" data-color="secondary">重置</button>
            <br>
            <label>强调色：</label>
            <input type="color" class="accent-color">
            <button type="button" class="reset-color" data-color="accent">重置</button>
            <br>
            <label>背景色：</label>
            <input type="color" class="background-color">
            <button type="button" class="reset-color" data-color="background">重置</button>
            <br>
            <label>高亮色：</label>
            <input type="color" class="highlight-color">
            <button type="button" class="reset-color" data-color="highlight">重置</button>
            <br>
            <label>黑色深度（用于文本或其他需要黑色的地方）：</label>
            <input type="range" class="color-slider black-depth" min="0" max="100" value="100">
            <button type="button" class="reset-color" data-color="black">重置</button>
            <br>
            <label>白色深度（用于文本或其他需要白色的地方）：</label>
            <input type="range" class="color-slider white-depth" min="0" max="100" value="100">
            <button type="button" class="reset-color" data-color="white">重置</button>
            <br>
            <label>灰色深度（用于边框或其他需要灰色的地方）：</label>
            <input type="range" class="color-slider gray-depth" min="0" max="100" value="50">
            <button type="button" class="reset-color" data-color="gray">重置</button>
            <br>
            <button type="submit">应用设置</button>
            <button type="button" class="reset-button">全部重置</button>
        </form>
    `;

    // 获取占位 div 并插入元素
    const navPlaceholder = document.getElementById('nav-placeholder');
    const settingsPlaceholder = document.getElementById('settings-placeholder');
    if (navPlaceholder) {
        navPlaceholder.appendChild(nav);
    }
    if (settingsPlaceholder) {
        settingsPlaceholder.appendChild(settingsPanel);
    }
});

