// 页面加载完成后执行
window.onload = function () {
    // 创建模态框
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade', 'show');
    modal.style.display = 'block'; // 显示模态框
    modal.style.paddingRight = '0'; // 防止滚动条出现
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">提示</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="text-center">
                        <i class="fa-solid fa-triangle-exclamation text-warning" style="font-size: 2rem;"></i>
                        <br>
                        此页面正在开发中，暂时无法使用
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                </div>
            </div>
        </div>
    `;

    // 将模态框添加到页面中
    document.body.appendChild(modal);

    // 初始化 Bootstrap 的模态框
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
};