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
    const primaryColor = document.querySelector('.primary-color').value;
    const secondaryColor = document.querySelector('.secondary-color').value;
    const accentColor = document.querySelector('.accent-color').value;
    const backgroundColor = document.querySelector('.background-color').value;
    const highlightColor = document.querySelector('.highlight-color').value;
    const blackDepth = document.querySelector('.black-depth').value;
    const whiteDepth = document.querySelector('.white-depth').value;
    const grayDepth = document.querySelector('.gray-depth').value;

    setCSSVariables({
        '--primary-color': primaryColor,
        '--secondary-color': secondaryColor,
        '--accent-color': accentColor,
        '--background-color': backgroundColor,
        '--highlight-color': highlightColor,
        '--black-color': `rgba(0, 0, 0, ${blackDepth / 100})`,
        '--white-color': `rgba(255, 255, 255, ${whiteDepth / 100})`,
        '--gray-color': `rgba(128, 128, 128, ${grayDepth / 100})`
    });

    saveThemeSettings({
        'primary-color': primaryColor,
        'secondary-color': secondaryColor,
        'accent-color': accentColor,
        'background-color': backgroundColor,
        'highlight-color': highlightColor,
        'black-depth': blackDepth,
        'white-depth': whiteDepth,
        'gray-depth': grayDepth
    });
}

// 重置主题设置
function resetThemeSettings() {
    const defaultSettings = {
        'primary-color': '#A8D5BA',
        'secondary-color': '#FFC0CB',
        'accent-color': '#FFFFE0',
        'background-color': '#87CEEB',
        'highlight-color': '#E6E6FA',
        'black-depth': 100,
        'white-depth': 100,
        'gray-depth': 50
    };

    setCSSVariables({
        '--primary-color': defaultSettings['primary-color'],
        '--secondary-color': defaultSettings['secondary-color'],
        '--accent-color': defaultSettings['accent-color'],
        '--background-color': defaultSettings['background-color'],
        '--highlight-color': defaultSettings['highlight-color'],
        '--black-color': `rgba(0, 0, 0, 1)`,
        '--white-color': `rgba(255, 255, 255, 1)`,
        '--gray-color': `rgba(128, 128, 128, 0.5)`
    });

    document.querySelector('.primary-color').value = defaultSettings['primary-color'];
    document.querySelector('.secondary-color').value = defaultSettings['secondary-color'];
    document.querySelector('.accent-color').value = defaultSettings['accent-color'];
    document.querySelector('.background-color').value = defaultSettings['background-color'];
    document.querySelector('.highlight-color').value = defaultSettings['highlight-color'];
    document.querySelector('.black-depth').value = defaultSettings['black-depth'];
    document.querySelector('.white-depth').value = defaultSettings['white-depth'];
    document.querySelector('.gray-depth').value = defaultSettings['gray-depth'];

    clearSavedThemeSettings();
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
    const defaultSettings = {
        'primary-color': '#A8D5BA',
        'secondary-color': '#FFC0CB',
        'accent-color': '#FFFFE0',
        'background-color': '#87CEEB',
        'highlight-color': '#E6E6FA',
        'black-depth': 100,
        'white-depth': 100,
        'gray-depth': 50
    };

    let defaultValue, cssVar;
    switch(colorType) {
        case 'primary':
            defaultValue = defaultSettings['primary-color'];
            cssVar = '--primary-color';
            break;
        case 'secondary':
            defaultValue = defaultSettings['secondary-color'];
            cssVar = '--secondary-color';
            break;
        case 'accent':
            defaultValue = defaultSettings['accent-color'];
            cssVar = '--accent-color';
            break;
        case 'background':
            defaultValue = defaultSettings['background-color'];
            cssVar = '--background-color';
            break;
        case 'highlight':
            defaultValue = defaultSettings['highlight-color'];
            cssVar = '--highlight-color';
            break;
        case 'black':
            defaultValue = defaultSettings['black-depth'];
            cssVar = '--black-color';
            break;
        case 'white':
            defaultValue = defaultSettings['white-depth'];
            cssVar = '--white-color';
            break;
        case 'gray':
            defaultValue = defaultSettings['gray-depth'];
            cssVar = '--gray-color';
            break;
    }

    const input = document.querySelector(`.${colorType}-color` || `.${colorType}-depth`);
    input.value = defaultValue;

    if (colorType === 'black' || colorType === 'white' || colorType === 'gray') {
        const rgbaValue = colorType === 'black' ? `rgba(0, 0, 0, 1)` :
                          colorType === 'white' ? `rgba(255, 255, 255, 1)` :
                          `rgba(128, 128, 128, 0.5)`;
        document.documentElement.style.setProperty(cssVar, rgbaValue);
    } else {
        document.documentElement.style.setProperty(cssVar, defaultValue);
    }

    localStorage.removeItem(`${colorType}-color` || `${colorType}-depth`);
}

// 设置CSS变量
function setCSSVariables(variables) {
    Object.keys(variables).forEach(key => {
        document.documentElement.style.setProperty(key, variables[key]);
    });
}

// 保存主题设置到本地存储
function saveThemeSettings(settings) {
    Object.keys(settings).forEach(key => {
        localStorage.setItem(key, settings[key]);
    });
}

// 清除保存的主题设置
function clearSavedThemeSettings() {
    localStorage.removeItem('primary-color');
    localStorage.removeItem('secondary-color');
    localStorage.removeItem('accent-color');
    localStorage.removeItem('background-color');
    localStorage.removeItem('highlight-color');
    localStorage.removeItem('black-depth');
    localStorage.removeItem('white-depth');
    localStorage.removeItem('gray-depth');
}

// 加载保存的主题设置
function loadSavedThemeSettings() {
    const defaultSettings = {
        'primary-color': '#A8D5BA',
        'secondary-color': '#FFC0CB',
        'accent-color': '#FFFFE0',
        'background-color': '#87CEEB',
        'highlight-color': '#E6E6FA',
        'black-depth': 100,
        'white-depth': 100,
        'gray-depth': 50
    };

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

    document.querySelector('.primary-color').value = settings['primary-color'];
    document.querySelector('.secondary-color').value = settings['secondary-color'];
    document.querySelector('.accent-color').value = settings['accent-color'];
    document.querySelector('.background-color').value = settings['background-color'];
    document.querySelector('.highlight-color').value = settings['highlight-color'];
    document.querySelector('.black-depth').value = settings['black-depth'];
    document.querySelector('.white-depth').value = settings['white-depth'];
    document.querySelector('.gray-depth').value = settings['gray-depth'];
}