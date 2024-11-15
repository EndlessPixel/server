document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initAnnouncementDrawer();
    initServerStatus();
    initTabs();
    initModsAndPlugins();
});
// 轮播图功能
const initCarousel = () => {
    const slides = document.querySelector('.slides');
    const images = slides.querySelectorAll('img');
    const dotsContainer = document.querySelector('.dots');
    const totalImages = images.length;
    let currentIndex = 0;
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
    setInterval(() => {
        showImage((currentIndex + 1) % totalImages);
    }, 5000);
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
    setInterval(fetchStatus, 60000);
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
    const plugins = [
        "ClickHarvest", "LagFixer", "MiniMOTD", "SimpleTpa", "sit", "SkinsRestorer", "Dynmap", "WelcomePlugin", "WorldEdit", "WorldGuard", "PlumBot"
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
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        customMenu.style.top = `${e.clientY}px`;
        customMenu.style.left = `${e.clientX}px`;
        customMenu.style.display = 'block';
        customMenu.style.opacity = 1;
        customMenu.style.transform = 'translateY(0)';
    });
    document.addEventListener('click', function(e) {
        customMenu.style.display = 'none';
        customMenu.style.opacity = 0;
        customMenu.style.transform = 'translateY(-10px)';
    });
});
