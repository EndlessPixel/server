// 获取所有按钮
const hashButtons = document.querySelectorAll('.hash-btn');

// 为每个按钮添加点击事件监听器
hashButtons.forEach(button => {
    button.addEventListener('click', function() {
        // 获取按钮上的哈希值
        const md5 = this.getAttribute('data-md5');
        const sha1 = this.getAttribute('data-sha1');
        const sha256 = this.getAttribute('data-sha256');
        const sha512 = this.getAttribute('data-sha512');

        // 创建模态框内容
        const modalContent = `
            <div class="modal fade" id="hashModal" tabindex="-1" aria-labelledby="hashModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="hashModalLabel">哈希值信息</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="card">
                                <div class="card-body">
                                    <p class="card-text"><strong>MD5:</strong> ${md5}</p>
                                    <p class="card-text"><strong>SHA-1:</strong> ${sha1}</p>
                                    <p class="card-text"><strong>SHA-256:</strong> ${sha256}</p>
                                    <p class="card-text"><strong>SHA-512:</strong> ${sha512}</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 将模态框添加到页面
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalContent;
        document.body.appendChild(modalContainer);

        // 初始化并显示模态框
        const modalElement = document.getElementById('hashModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        // 模态框隐藏后移除它
        modalElement.addEventListener('hidden.bs.modal', () => {
            modalElement.remove();
        });
    });
});