//时间
function initTimer() {
    const startDateStr = "2024-09-16T15:34:43";
    const startDate = new Date(startDateStr);
    const timerElement = document.getElementById('timer');
    if (!timerElement) {
        console.error('Missing timer element');
        return;
    }
    function updateTimer() {
        const now = new Date();
        let diffInMs = now - startDate;
        if (diffInMs < 0) {
            timerElement.textContent = "计算错误: 你的时间有问题!";
            return;
        }
        // 计算时间差
        let years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));
        diffInMs -= years * (1000 * 60 * 60 * 24 * 365.25);
        let months = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.44));
        diffInMs -= months * (1000 * 60 * 60 * 24 * 30.44);
        let days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        diffInMs -= days * (1000 * 60 * 60 * 24);
        let hours = Math.floor(diffInMs / (1000 * 60 * 60));
        diffInMs -= hours * (1000 * 60 * 60);
        let minutes = Math.floor(diffInMs / (1000 * 60));
        diffInMs -= minutes * (1000 * 60);
        let seconds = Math.floor(diffInMs / 1000);
        // 格式化数字，确保两位数显示
        const pad = (num) => num.toString().padStart(2, '0');
        const padYear = (num) => num.toString().padStart(4, '0');
        // 更新显示内容
        timerElement.innerHTML = `<span class="time-unit"> ${padYear(years)} 年 ${pad(months)} 月 ${pad(days)} 日 ${pad(hours)} 小时 ${pad(minutes)} 分钟 ${pad(seconds)} 秒 </span>`;
    }
    // 初始化并更新计时器
    updateTimer();
    setInterval(updateTimer, 1000); // 每秒更新一次
}
// 确保在页面加载完成后调用 initTimer 函数
document.addEventListener('DOMContentLoaded', initTimer);