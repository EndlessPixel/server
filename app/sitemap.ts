
const config = {
  siteUrl: 'https://www.epmc.top',
  lastModified: new Date('2026-05-16'),
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
      url: `https://wiki.epmc.top/`,
      lastModified: config.lastModified,
      priority: 0.6,
    },
    {
      url: `${config.siteUrl}/about/`,
      lastModified: config.lastModified,
      priority: 0.5,
    },
    {
      url: `${config.siteUrl}/login/`,
      lastModified: config.lastModified,
      priority: 0.3,
    },
    {
      url: `${config.siteUrl}/live/`,
      lastModified: config.lastModified,
      priority: 0.2,
    },
    {
      url: `${config.siteUrl}/gallery/`,
      lastModified: config.lastModified,
      priority: 0.2,
    },
  ];
}

export const revalidate = 86400;