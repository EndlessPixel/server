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
        container.innerHTML = '';
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
            tabSlider.style.transform = `translateX(${index * 100}%)`;
            if (contentId === 'mods-content') {
                populateList(mods, contentId, 'mod-item');
            } else if (contentId === 'plugins-content') {
                populateList(plugins, contentId, 'plugin-item');
            }
            setTimeout(() => animateItems(contentId), 300);
        });
    });
    fetchServerStatus();
    setInterval(fetchServerStatus, 30000);
}); 
document.addEventListener('keydown', function(e) {
    if (e.key === 'F12') {
        e.preventDefault();
    }
    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
    }
});
document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    })
    // script.js

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelector('.slides');
    const images = document.querySelectorAll('.slides img');
    const dotsContainer = document.querySelector('.dots');
    const totalImages = images.length;
    let currentIndex = 0;
    let interval;

    // 动态生成点
    for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (i === 0) {
            dot.classList.add('active');
        }
        dot.setAttribute('data-index', i);
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');

    // 更新点的状态
    function updateDots(index) {
        dots.forEach(dot => dot.classList.remove('active'));
        dots[index].classList.add('active');
    }

    // 显示当前图片
    function showImage(index) {
        slides.style.transform = `translateX(-${index * 100}%)`;
        updateDots(index);
        currentIndex = index;
    }

    // 自动切换图片
    function startCarousel() {
        interval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % totalImages;
            showImage(nextIndex);
        }, 3000); // 修改这里的时间间隔为3000毫秒（3秒）
    }

    // 停止自动切换
    function stopCarousel() {
        clearInterval(interval);
    }

    // 鼠标悬停停止自动切换
    const carousel = document.querySelector('.carousel');
    carousel.addEventListener('mouseenter', stopCarousel);
    carousel.addEventListener('mouseleave', startCarousel);

    // 点击点切换图片
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            let index = parseInt(dot.getAttribute('data-index'));
            showImage(index);
            stopCarousel();
        });
    });

    // 点击箭头切换图片
    const leftArrow = document.createElement('div');
    leftArrow.classList.add('arrow', 'left');
    leftArrow.innerHTML = '&#10094;';
    carousel.appendChild(leftArrow);

    const rightArrow = document.createElement('div');
    rightArrow.classList.add('arrow', 'right');
    rightArrow.innerHTML = '&#10095;';
    carousel.appendChild(rightArrow);

    leftArrow.addEventListener('click', () => {
        let prevIndex = (currentIndex - 1 + totalImages) % totalImages;
        showImage(prevIndex);
        stopCarousel();
    });

    rightArrow.addEventListener('click', () => {
        let nextIndex = (currentIndex + 1) % totalImages;
        showImage(nextIndex);
        stopCarousel();
    });

    // 初始化
    startCarousel();
});