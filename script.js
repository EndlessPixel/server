 
document.addEventListener('DOMContentLoaded', function() {
    const serverStatus = document.getElementById('server-status');
    const playerCount = document.getElementById('player-count');
    const refreshButton = document.getElementById('refresh-status');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabsContainer = document.querySelector('.tabs');

    const mods = [
        "AdLods", "antixray-forge", "anvilrestoration", "BetterBurning-Forge",
        "BetterThanMending", "blossom", "collective", "cristellib",
        "dimensionviewer", "ForgeEndertech", "infinitetrading", "ships",
        "SkyVillages", "Towns-and-Towers", "villagespawnpoint", "YungsApi",
        "YungsBetterDesertTemples", "YungsBetterDungeons", "YungsBetterEndIsland",
        "YungsBetterJungleTemples", "YungsBetterMineshafts", "YungsBetterNetherFortresses",
        "YungsBetterOceanMonuments", "YungsBetterStrongholds", "YungsBetterWitchHuts"
    ];

    const plugins = [
        "ClickHarvest", "LagFixer", "minimotd",
        "SimpleTpa", "sit", "SkinsRestorer"
    ];

    function fetchServerStatus() {
        serverStatus.textContent = '加载中...';
        playerCount.textContent = '...';

        fetch('https://api.mcsrvstat.us/2/cd.frp.one:25566')
            .then(response => response.json())
            .then(data => {
                if (data.online) {
                    serverStatus.textContent = '在线';
                    serverStatus.className = 'green';
                    playerCount.textContent = `${data.players.online}/${data.players.max}`;
                } else {
                    serverStatus.textContent = '离线';
                    serverStatus.className = 'red';
                    playerCount.textContent = '0/0';
                }
            })
            .catch(error => {
                console.error('Error fetching server status:', error);
                serverStatus.textContent = '无法获取';
                serverStatus.className = 'red';
                playerCount.textContent = '无法获取';
            });
    }

    function populateList(items, containerId, itemClass) {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; // Clear existing content
        items.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = itemClass;
            div.innerHTML = `<i class="fas fa-cube"></i> ${item}`;
            div.style.transitionDelay = `${index * 50}ms`;
            container.appendChild(div);
        });
    }

    function animateItems(containerId) {
        const items = document.querySelectorAll(`#${containerId} > div`);
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    refreshButton.addEventListener('click', fetchServerStatus);

    // Create and append tab slider
    const tabSlider = document.createElement('div');
    tabSlider.className = 'tab-slider';
    tabsContainer.appendChild(tabSlider);

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            tab.classList.add('active');
            const contentId = tab.dataset.tab + '-content';
            const content = document.getElementById(contentId);
            content.classList.add('active');

            // Animate tab slider
            tabSlider.style.transform = `translateX(${index * 100}%)`;

            // Populate and animate the content items
            if (contentId === 'mods-content') {
                populateList(mods, contentId, 'mod-item');
            } else if (contentId === 'plugins-content') {
                populateList(plugins, contentId, 'plugin-item');
            }
            setTimeout(() => animateItems(contentId), 300);
        });
    });

    fetchServerStatus();
    setInterval(fetchServerStatus, 30000); // 每30秒更新一次
}); 