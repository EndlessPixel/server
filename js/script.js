document.addEventListener('DOMContentLoaded', function() {
    const themeButton = document.querySelector('.theme-button');
    const hamburgerButton = document.querySelector('.hamburger-button');
    const navbar = document.querySelector('.navbar');
    const settingsPanel = document.querySelector('.settings-panel');
    const closeNavbar = document.querySelector('.navbar .close-button');
    const closeSettings = document.querySelector('.settings-panel .close-button');
    const themeForm = document.querySelector('.theme-form');
    const resetButton = document.querySelector('.reset-button');

    // 切换导航栏
    hamburgerButton.addEventListener('click', function() {
        toggleActiveClass(navbar, settingsPanel);
    });

    // 切换设置面板
    themeButton.addEventListener('click', function() {
        toggleActiveClass(settingsPanel, navbar);
    });

    // 关闭导航栏
    closeNavbar.addEventListener('click', function() {
        navbar.classList.remove('active');
    });

    // 关闭设置面板
    closeSettings.addEventListener('click', function() {
        settingsPanel.classList.remove('active');
    });

    // 应用主题设置
    themeForm.addEventListener('submit', function(event) {
        event.preventDefault();
        applyThemeSettings();
        settingsPanel.classList.remove('active');
    });

    // 重置主题设置
    resetButton.addEventListener('click', function() {
        resetThemeSettings();
        settingsPanel.classList.remove('active');
    });

    // 颜色预览功能
    const colorInputs = document.querySelectorAll('.primary-color, .secondary-color, .accent-color, .background-color, .highlight-color');
    const depthInputs = document.querySelectorAll('.black-depth, .white-depth, .gray-depth');

    colorInputs.forEach(input => {
        input.addEventListener('input', function() {
            updateColorPreview(this);
        });
    });

    depthInputs.forEach(input => {
        input.addEventListener('input', function() {
            updateDepthPreview(this);
        });
    });

    // 单独重置功能
    const resetColorButtons = document.querySelectorAll('.reset-color');
    resetColorButtons.forEach(button => {
        button.addEventListener('click', function() {
            resetSingleColor(this.dataset.color);
        });
    });

    // 加载保存的主题设置
    window.onload = loadSavedThemeSettings;

    // 点击非菜单部分关闭菜单
    document.addEventListener('click', function(event) {
        const isClickInsideNavbar = navbar.contains(event.target) || hamburgerButton.contains(event.target);
        const isClickInsideSettings = settingsPanel.contains(event.target) || themeButton.contains(event.target);

        if (!isClickInsideNavbar && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
        }

        if (!isClickInsideSettings && settingsPanel.classList.contains('active')) {
            settingsPanel.classList.remove('active');
        }
    });
});

// 切换活动类
function toggleActiveClass(currentElement, otherElement) {
    if (currentElement.classList.contains('active')) {
        currentElement.classList.remove('active');
    } else {
        currentElement.classList.add('active');
        if (otherElement.classList.contains('active')) {
            otherElement.classList.remove('active');
        }
    }
}

// 应用主题设置
function applyThemeSettings() {
    const settings = getThemeSettingsFromInputs();
    setCSSVariables(settings);
    saveThemeSettings(settings);
}

// 重置主题设置
function resetThemeSettings() {
    const defaultSettings = getThemeDefaultSettings();
    setCSSVariables({
        '--primary-color': defaultSettings['primary-color'],
        '--secondary-color': defaultSettings['secondary-color'],
        '--accent-color': defaultSettings['accent-color'],
        '--background-color': defaultSettings['background-color'],
        '--highlight-color': defaultSettings['highlight-color'],
        '--black-color': `rgba(0, 0, 0, ${defaultSettings['black-depth'] / 100})`,
        '--white-color': `rgba(255, 255, 255, ${defaultSettings['white-depth'] / 100})`,
        '--gray-color': `rgba(128, 128, 128, ${defaultSettings['gray-depth'] / 100})`
    });
    setThemeInputsValues(defaultSettings);
    clearSavedThemeSettings();
    // 移除多余的调用
    applyThemeSettings(); 
}

// 更新颜色预览
function updateColorPreview(input) {
    const previewClass = `${input.classList[0]}-preview`;
    const preview = document.querySelector(`.${previewClass}`);
    preview.style.backgroundColor = input.value;
}

// 更新深度预览
function updateDepthPreview(input) {
    const colorName = input.classList[1].split('-')[0];
    const preview = document.querySelector(`.${colorName}-preview`);
    let rgbaColor;
    if (colorName === 'black') {
        rgbaColor = `rgba(0, 0, 0, ${input.value / 100})`;
    } else if (colorName === 'white') {
        rgbaColor = `rgba(255, 255, 255, ${input.value / 100})`;
    } else if (colorName === 'gray') {
        rgbaColor = `rgba(128, 128, 128, ${input.value / 100})`;
    }
    preview.style.backgroundColor = rgbaColor;
}

// 重置单个颜色
function resetSingleColor(colorType) {
    const defaultSettings = getThemeDefaultSettings();
    const defaultValue = defaultSettings[colorType + '-color'] || defaultSettings[colorType + '-depth'];
    const input = document.querySelector(`.${colorType}-color`) || document.querySelector(`.${colorType}-depth`);
    input.value = defaultValue;

    if (colorType === 'black' || colorType === 'white' || colorType === 'gray') {
        const rgbaValue = getRGBAValue(colorType, defaultValue);
        document.documentElement.style.setProperty(`--${colorType}-color`, rgbaValue);
    } else {
        document.documentElement.style.setProperty(`--${colorType}-color`, defaultValue);
    }

    localStorage.removeItem(colorType + '-color');
    localStorage.removeItem(colorType + '-depth');
    applyThemeSettings();
    updateColorPreview(input);
}

// 获取主题设置的默认值
function getThemeDefaultSettings() {
    return {
        'primary-color': '#58A84A', // 绿色
        'secondary-color': '#C8C8C8', // 浅灰色
        'accent-color': '#FFD700', // 金色
        'background-color': '#282828', // 深灰色
        'highlight-color': '#A8D8FF', // 浅蓝色
        'black-depth': 80, 
        'white-depth': 85,
        'gray-depth': 75
    };
}

// 获取主题设置的输入值
function getThemeSettingsFromInputs() {
    return {
        // 移除 -- 前缀
        'primary-color': document.querySelector('.primary-color').value,
        'secondary-color': document.querySelector('.secondary-color').value,
        'accent-color': document.querySelector('.accent-color').value,
        'background-color': document.querySelector('.background-color').value,
        'highlight-color': document.querySelector('.highlight-color').value,
        'black-depth': document.querySelector('.black-depth').value,
        'white-depth': document.querySelector('.white-depth').value,
        'gray-depth': document.querySelector('.gray-depth').value
    };
}

// 设置CSS变量
function setCSSVariables(variables) {
    Object.keys(variables).forEach(key => {
        document.documentElement.style.setProperty(key, variables[key]);
    });
}

// 设置主题输入框的值
function setThemeInputsValues(settings) {
    document.querySelector('.primary-color').value = settings['primary-color'];
    document.querySelector('.secondary-color').value = settings['secondary-color'];
    document.querySelector('.accent-color').value = settings['accent-color'];
    document.querySelector('.background-color').value = settings['background-color'];
    document.querySelector('.highlight-color').value = settings['highlight-color'];
    document.querySelector('.black-depth').value = settings['black-depth'];
    document.querySelector('.white-depth').value = settings['white-depth'];
    document.querySelector('.gray-depth').value = settings['gray-depth'];
}

// 获取rgba值
function getRGBAValue(colorType, value) {
    if (colorType === 'black') {
        return `rgba(0, 0, 0, ${value / 100})`;
    } else if (colorType === 'white') {
        return `rgba(255, 255, 255, ${value / 100})`;
    } else if (colorType === 'gray') {
        return `rgba(128, 128, 128, ${value / 100})`;
    }
}

// 保存主题设置到本地存储
function saveThemeSettings(settings) {
    Object.keys(settings).forEach(key => {
        localStorage.setItem(key, settings[key]);
    });
}

// 清除保存的主题设置
function clearSavedThemeSettings() {
    ['primary-color', 'secondary-color', 'accent-color', 'background-color', 'highlight-color', 'black-depth', 'white-depth', 'gray-depth'].forEach(key => {
        localStorage.removeItem(key);
    });
}

// 加载保存的主题设置
function loadSavedThemeSettings() {
    const defaultSettings = getThemeDefaultSettings();
    const settings = {
        'primary-color': localStorage.getItem('primary-color') || defaultSettings['primary-color'],
        'secondary-color': localStorage.getItem('secondary-color') || defaultSettings['secondary-color'],
        'accent-color': localStorage.getItem('accent-color') || defaultSettings['accent-color'],
        'background-color': localStorage.getItem('background-color') || defaultSettings['background-color'],
        'highlight-color': localStorage.getItem('highlight-color') || defaultSettings['highlight-color'],
        'black-depth': localStorage.getItem('black-depth') || defaultSettings['black-depth'],
        'white-depth': localStorage.getItem('white-depth') || defaultSettings['white-depth'],
        'gray-depth': localStorage.getItem('gray-depth') || defaultSettings['gray-depth']
    };

    setCSSVariables({
        '--primary-color': settings['primary-color'],
        '--secondary-color': settings['secondary-color'],
        '--accent-color': settings['accent-color'],
        '--background-color': settings['background-color'],
        '--highlight-color': settings['highlight-color'],
        '--black-color': `rgba(0, 0, 0, ${settings['black-depth'] / 100})`,
        '--white-color': `rgba(255, 255, 255, ${settings['white-depth'] / 100})`,
        '--gray-color': `rgba(128, 128, 128, ${settings['gray-depth'] / 100})`
    });

    setThemeInputsValues(settings);
}