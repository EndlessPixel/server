
const config = {
  siteUrl: 'https://www.endlesspixel.cn',
  lastModified: new Date('2025-12-31'),
  revalidate: 86400,
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
      url: `${config.siteUrl}/downloads/launcher/`,
      lastModified: config.lastModified,
      priority: 0.8,
    },
    {
      url: `${config.siteUrl}/downloads/modpack/`,
      lastModified: config.lastModified,
      priority: 0.8,
    },
    {
      url: `${config.siteUrl}/downloads/modpack_app/`,
      lastModified: config.lastModified,
      priority: 0.8,
    },
    {
      url: `${config.siteUrl}/downloads/custom_downloads/`,
      lastModified: config.lastModified,
      priority: 0.7,
    },
    {
      url: `${config.siteUrl}/status/`,
      lastModified: config.lastModified,
      priority: 0.6,
    },
    {
      url: `${config.siteUrl}/status/mcserverstatus/`,
      lastModified: config.lastModified,
      priority: 0.6,
    },
    {
      url: `${config.siteUrl}/wiki/`,
      lastModified: config.lastModified,
      priority: 0.6,
    },
    {
      url: `${config.siteUrl}/wiki/full_screen_preview/`,
      lastModified: config.lastModified,
      priority: 0.6,
    },
    {
      url: `${config.siteUrl}/about/`,
      lastModified: config.lastModified,
      priority: 0.5,
    },
    {
      url: `${config.siteUrl}/dev/`,
      lastModified: config.lastModified,
      priority: 0.2,
    },
  ];
}

export const revalidate = 86400;