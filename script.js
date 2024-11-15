document.addEventListener('DOMContentLoaded', () => {
    // 初始化轮播图功能
    initCarousel();
    // 初始化公告抽屉功能
    initAnnouncementDrawer();
    // 初始化服务器状态功能
    initServerStatus();
    // 初始化标签页功能
    initTabs();
    // 初始化Mods和Plugins列表
    initModsAndPlugins();
});

// 轮播图功能
const initCarousel = () => {
    const slides = document.querySelector('.slides');
    const images = slides.querySelectorAll('img');
    const dotsContainer = document.querySelector('.dots');
    const totalImages = images.length;
    let currentIndex = 0;

    // 创建轮播点
    for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('data-index', i);
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.dot');

    const showImage = (index) => {
        slides.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentIndex = index;
    };

    // 自动播放
    setInterval(() => {
        showImage((currentIndex + 1) % totalImages);
    }, 5000);

    // 轮播点点击事件
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showImage(index);
        });
    });
};

// 公告抽屉功能
const initAnnouncementDrawer = () => {
    const toggleButton = document.getElementById('announcementToggle');
    const drawer = document.getElementById('announcementDrawer');

    toggleButton.addEventListener('click', () => {
        const isVisible = drawer.style.display === 'block';
        drawer.style.display = isVisible ? 'none' : 'block';
        toggleButton.textContent = isVisible ? '更多公告' : '关闭公告';
    });
};

// 服务器状态功能
const initServerStatus = () => {
    const statusElement = document.getElementById('server-status');
    const playerCountElement = document.getElementById('player-count');
    const refreshButton = document.getElementById('refresh-status');

    const fetchStatus = async() => {
        try {
            const response = await fetch('https://api.mcsrvstat.us/2/cd.frp.one');
            const data = await response.json();

            if (data.online) {
                statusElement.textContent = '在线';
                statusElement.className = 'green';
                playerCountElement.textContent = `${data.players.online}/${data.players.max}`;
            } else {
                statusElement.textContent = '离线';
                statusElement.className = 'red';
                playerCountElement.textContent = '0/0';
            }
        } catch (error) {
            console.error('Error fetching server status:', error);
            statusElement.textContent = '无法获取';
            statusElement.className = 'red';
            playerCountElement.textContent = '无法获取';
        }
    };

    refreshButton.addEventListener('click', fetchStatus);
    fetchStatus();
    setInterval(fetchStatus, 60000); // 每分钟刷新一次
};

// 标签页功能
const initTabs = () => {
    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`${target}-content`).classList.add('active');
        });
    });
};

// Mods和Plugins列表
const initModsAndPlugins = () => {
    const mods = [
        "antixray-forge", "anvilrestoration", "BetterBurning-Forge", "BetterThanMending", "blossom", "collective", "cristellib", "dimensionviewer", "infinitetrading", "ships", "SkyVillages", "Towns-and-Towers", "villagespawnpoint", "YungsApi", "YungsBetterDesertTemples", "YungsBetterDungeons", "YungsBetterEndIsland", "YungsBetterJungleTemples", "YungsBetterMineshafts", "YungsBetterNetherFortresses", "YungsBetterOceanMonuments", "YungsBetterStrongholds", "YungsBetterWitchHuts"
    ];
                <h3>1. 服务器核心版本升级：</h3>
                <p> - [1]服务器核心版本已从900升级至902</p>
                <h3>2.新增插件：</h3>
                <p> - [1]</p>
                <p>2024/11/16</p>
    const plugins = [
        "ClickHarvest", "LagFixer", "MiniMOTD", "SimpleTpa", "sit", "SkinsRestorer", "Dynmap", "WelcomePlugin", "WorldEdit", "WorldGuard"
    ];
    const modsContent = document.getElementById('mods-content');
    const pluginsContent = document.getElementById('plugins-content');

    mods.forEach(mod => {
        const div = document.createElement('div');
        div.textContent = mod;
        div.className = 'mod-item';
        modsContent.appendChild(div);
    });

    plugins.forEach(plugin => {
        const div = document.createElement('div');
        div.textContent = plugin;
        div.className = 'plugin-item';
        pluginsContent.appendChild(div);
    });
};

//右键菜单
document.addEventListener('DOMContentLoaded', function() {
    const customMenu = document.getElementById('customMenu');

    // 监听全局的 contextmenu 事件
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault(); // 阻止默认的右键菜单

        // 设置自定义菜单的位置
        customMenu.style.top = `${e.clientY}px`;
        customMenu.style.left = `${e.clientX}px`;
        customMenu.style.display = 'block';

        // 添加弹出动画
        customMenu.style.opacity = 1;
        customMenu.style.transform = 'translateY(0)';
    });

    // 监听点击页面其他区域以关闭菜单
    document.addEventListener('click', function(e) {
        customMenu.style.display = 'none';
        customMenu.style.opacity = 0;
        customMenu.style.transform = 'translateY(-10px)';
    });
});
