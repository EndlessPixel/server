// script.js
document.addEventListener('DOMContentLoaded', function() {
    const statusCircle = document.getElementById('status-circle');
    const playerCount = document.getElementById('player-count');
    const copyButton = document.getElementById('copy-button');
    const modal = document.getElementById('copy-confirm-modal');
    const confirmButton = document.getElementById('confirm-copy');
    const cancelButton = document.getElementById('cancel-copy');

    const apiUrl = 'https://api.mcsrvstat.us/3/nmg.frp.one:14090';

    async function fetchServerStatus() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Failed to fetch server status');
            }
            const data = await response.json();
            if (data.online) {
                statusCircle.style.backgroundColor = 'green';
                playerCount.textContent = `在线人数: ${data.players.online}/${data.players.max}`;
            } else {
                statusCircle.style.backgroundColor = 'red';
                playerCount.textContent = '服务器离线';
            }
        } catch (error) {
            console.error('Error fetching server status:', error);
            statusCircle.style.backgroundColor = 'red';
            playerCount.textContent = '服务器离线';
        }
    }

    copyButton.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    confirmButton.addEventListener('click', function() {
        const ip = 'nmg.frp.one:14090';
        navigator.clipboard.writeText(ip).then(() => {
            copyButton.textContent = '复制成功';
            setTimeout(() => {
                copyButton.textContent = 'nmg.frp.one:14090';
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy IP address:', err);
        });
        modal.style.display = 'none';
    });

    cancelButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // 点击模态框外部区域关闭模态框
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    fetchServerStatus();
});