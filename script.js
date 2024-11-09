const server = 'cd.frp.one';
const port = 25566;

function getServerStatus() {
    fetch(`https://api.mcsrvstat.us/2/${server}:${port}`).then(response => response.json()).then(data => {
        const statusElement = document.getElementById('status');
        const playerCountElement = document.getElementById('player-count');
        const maxPlayersElement = document.getElementById('max-players');
        const latencyElement = document.getElementById('latency');
        const latencyStatusElement = document.getElementById('latency-status');
        if (data.online) {
            statusElement.textContent = '在线';
            statusElement.classList.remove('offline', 'high-load');
            statusElement.classList.add('online');
            playerCountElement.textContent = data.players.online;
            maxPlayersElement.textContent = data.players.max;
            if (data.latency) {
                latencyElement.textContent = data.latency;
                let latencyStatus = '';
                if (data.latency <= 20) {
                    latencyStatus = '正常';
                    latencyStatusElement.classList.remove('latency-warning', 'latency-high', 'latency-critical');
                    latencyStatusElement.classList.add('latency-normal');
                } else if (data.latency > 20 && data.latency <= 50) {
                    latencyStatus = '警告';
                    latencyStatusElement.classList.remove('latency-normal', 'latency-high', 'latency-critical');
                    latencyStatusElement.classList.add('latency-warning');
                } else if (data.latency > 50 && data.latency <= 100) {
                    latencyStatus = '高';
                    latencyStatusElement.classList.remove('latency-normal', 'latency-warning', 'latency-critical');
                    latencyStatusElement.classList.add('latency-high');
                } else {
                    latencyStatus = '严重';
                    latencyStatusElement.classList.remove('latency-normal', 'latency-warning', 'latency-high');
                    latencyStatusElement.classList.add('latency-critical');
                }
                latencyStatusElement.textContent = `(${latencyStatus})`;
            } else {
                latencyElement.textContent = '无法获取';
                latencyStatusElement.textContent = '';
            }
        } else {
            statusElement.textContent = '无法获取';
            statusElement.classList.remove('online', 'high-load');
            statusElement.classList.add('offline');
            latencyElement.textContent = '无法获取';
            latencyStatusElement.textContent = '';
        }
    }).catch(error => {
        const statusElement = document.getElementById('status');
        statusElement.textContent = '无法获取';
        statusElement.classList.remove('online', 'high-load');
        statusElement.classList.add('offline');
        console.error('Error fetching server status:', error);
    });
}
setInterval(getServerStatus, 1000);
getServerStatus();