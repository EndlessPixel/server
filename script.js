document.addEventListener('DOMContentLoaded', () => {
    feather.replace();
    initAnnouncements();
    initServerStatus();
});

function initAnnouncements() {
    const toggleButton = document.getElementById('toggleAnnouncements');
    const hiddenAnnouncements = document.querySelector('.hidden-announcements');

    toggleButton.addEventListener('click', () => {
        if (hiddenAnnouncements.style.display === 'none' || hiddenAnnouncements.style.display === '') {
            hiddenAnnouncements.style.display = 'block';
            toggleButton.textContent = '收起公告';
        } else {
            hiddenAnnouncements.style.display = 'none';
            toggleButton.textContent = '更多公告';
        }
    });
}

function initServerStatus() {
    const statusElement = document.getElementById('serverStatus');
    const playerCountElement = document.getElementById('playerCount');
    const refreshButton = document.getElementById('refreshStatus');

    const fetchStatus = async() => {
        try {
            const response = await fetch('https://api.mcsrvstat.us/2/ld.frp.one:25566');
            const data = await response.json();

            if (data.online) {
                statusElement.textContent = '在线';
                statusElement.style.color = '#2ecc71';
                playerCountElement.textContent = `${data.players.online}/${data.players.max}`;
            } else {
                statusElement.textContent = '离线';
                statusElement.style.color = '#e74c3c';
                playerCountElement.textContent = '0/0';
            }
        } catch (error) {
            console.error('Error fetching server status:', error);
            statusElement.textContent = '无法获取';
            statusElement.style.color = '#e74c3c';
            playerCountElement.textContent = '无法获取';
        }
    };

    refreshButton.addEventListener('click', fetchStatus);
    fetchStatus();
}

function toggleDrawer(drawerId) {
    var drawer = document.getElementById(drawerId);
    if (drawer.style.display === 'block') {
        drawer.style.display = 'none';
    } else {
        drawer.style.display = 'block';
    }
}