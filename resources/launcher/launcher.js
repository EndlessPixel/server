document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('fcl-download-links');
    const baseUrl = 'https://github.com/FCL-Team/FoldCraftLauncher/releases/download/';
    const latestVersion = '1.2.4.4';
    const lowestVersion = '1.1.5.0';

    // 定义支持的架构
    const architectures = ['all', 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'];

    // 动态生成版本号列表
    const versions = generateVersionList(latestVersion, lowestVersion);

    // 获取 HTML 元素
    const selectVersion = document.getElementById('version-select');
    const selectArchitecture = document.getElementById('architecture-select');
    const downloadButton = document.getElementById('download-button');
    const downloadLink = document.getElementById('download-link');

    // 填充版本选择下拉菜单
    versions.forEach(version => {
        const option = document.createElement('option');
        option.value = version;
        option.textContent = version;
        selectVersion.appendChild(option);
    });

    // 填充架构选择下拉菜单
    architectures.forEach(arch => {
        const option = document.createElement('option');
        option.value = arch;
        option.textContent = arch;
        selectArchitecture.appendChild(option);
    });

    // 点击下载按钮事件
    downloadButton.onclick = function() {
        const version = selectVersion.value;
        const arch = selectArchitecture.value;
        const downloadUrl = `${baseUrl}${version}/FCL-release-${version}-${arch}.apk`;
        downloadLink.href = downloadUrl;
        downloadLink.click(); // 触发点击事件
    };
});

// 动态生成版本号列表，从最新版本一直递减到指定的最低版本
function generateVersionList(latestVersion, lowestVersion) {
    const versions = [];

    // 将版本号转换为整数
    const latestInt = versionToInt(latestVersion);
    const lowestInt = versionToInt(lowestVersion);

    // 生成中间的所有整数
    for (let i = latestInt; i >= lowestInt; i--) {
        // 将整数转换回版本号格式
        const version = intToVersion(i);
        versions.push(version);
    }

    return versions;
}

// 将版本号转换为整数
function versionToInt(version) {
    const parts = version.split('.').map(Number);
    return parts[0] * 1000 + parts[1] * 100 + parts[2] * 10 + parts[3];
}

// 将整数转换回版本号格式
function intToVersion(num) {
    const major = Math.floor(num / 1000);
    const minor = Math.floor((num % 1000) / 100);
    const patch = Math.floor((num % 100) / 10);
    const build = num % 10;
    return `${major}.${minor}.${patch}.${build}`;
}

