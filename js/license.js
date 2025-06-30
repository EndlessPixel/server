// 选择用于显示 LICENSE 文件内容的元素
const licenseTextElement = document.getElementById('license-text');
// 创建 XMLHttpRequest 对象用于获取文件内容
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://www.endlesspixel.fun/LICENSE', true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            // 请求成功，将文件内容显示在元素中
            licenseTextElement.textContent = xhr.responseText;
        } else {
            // 请求失败，显示错误信息
            licenseTextElement.textContent = '加载 LICENSE 文件时出错。';
        }
    }
};
xhr.send();