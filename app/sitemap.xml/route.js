// app/sitemap.xml/route.js
const config = {
  siteUrl: 'https://www.endlesspixel.fun',
  lastModified: new Date('2025-12-09'),
  revalidate: 86400, // 24小时重新生成
};

export default function sitemap() {
  return [
    {
      url: `${config.siteUrl}/`,
      lastModified: config.lastModified,
      priority: 1.0,
    },
    {
      url: `${config.siteUrl}/downloads/`,
      lastModified: config.lastModified,
      priority: 0.8,
    },
    {
      url: `${config.siteUrl}/status/`,
      lastModified: config.lastModified,
      priority: 0.6,
    },
    {
      url: `${config.siteUrl}/wiki/`,
      lastModified: config.lastModified,
      priority: 0.6,
    },
    {
      url: `${config.siteUrl}/about/`,
      lastModified: config.lastModified,
      priority: 0.4,
    },
  ];
}

// 顶层导出缓存配置（Next.js 16.x 兼容）
export const revalidate = config.revalidate;