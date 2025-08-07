const footerHTML = `
<footer class="text-align-center text-color-gray text-size-small text-line-height-medium">
  <p>&copy; 2024-2025 EndlessPixel Team, All rights reserved.</p>
  <p>本站并非 Minecraft 官方网站，与 Mojang 和微软亦无从属关系。</p>
  <p>本服务器已同意<a href="https://account.mojang.com/documents/minecraft_eula" target="_blank">《Minecraft 最终用户许可协议》（EULA）</a>。</p>
</footer>
`;
document.getElementById('footer-placeholder')?.insertAdjacentHTML('beforeend', footerHTML);