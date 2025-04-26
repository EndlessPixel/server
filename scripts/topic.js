const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// 优先使用存储主题，其次跟随系统
if (localStorage.getItem('theme')) {
    setTheme(localStorage.getItem('theme'));  // 使用存储值
} else {
    setTheme(prefersDark ? 'dark' : 'light');  // 默认跟随系统
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    // 深色模式提示
    if (newTheme === 'dark') {
        const notice = document.createElement('div');
        notice.className = 'theme-alert';  // 使用已存在的样式
        notice.innerHTML = '⚠️ 网页基于浅色模式开发，深色模式可能存在显示问题，若非必需建议切换回浅色模式';
        document.body.appendChild(notice);
        
        setTimeout(() => {
            notice.remove();
        }, 3000);
    }
});