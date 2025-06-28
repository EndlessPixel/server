// script.js
document.addEventListener('DOMContentLoaded', function() {
    const copyButton = document.getElementById('copy-button');
    const modal = document.getElementById('copy-confirm-modal');
    const confirmButton = document.getElementById('confirm-copy');
    const cancelButton = document.getElementById('cancel-copy');

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
