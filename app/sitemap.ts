import { MetadataRoute } from "next";

const config = {
  siteUrl: "https://www.endlesspixel.cn",
  lastModified: new Date(),
  revalidate: 86400,
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${config.siteUrl}/`,
      lastModified: config.lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${config.siteUrl}/downloads/`,
      lastModified: config.lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${config.siteUrl}/downloads/launcher/`,
      lastModified: config.lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${config.siteUrl}/downloads/modpack/`,
      lastModified: config.lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${config.siteUrl}/downloads/modpack_app/`,
      lastModified: config.lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${config.siteUrl}/downloads/custom_downloads/`,
      lastModified: config.lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${config.siteUrl}/status/`,
      lastModified: config.lastModified,
      changeFrequency: "hourly",
      priority: 0.7,
    },
    {
      url: `${config.siteUrl}/status/mcserverstatus/`,
      lastModified: config.lastModified,
      changeFrequency: "hourly",
      priority: 0.7,
    },
    {
      url: `${config.siteUrl}/about/`,
      lastModified: config.lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${config.siteUrl}/gallery/`,
      lastModified: config.lastModified,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${config.siteUrl}/live/`,
      lastModified: config.lastModified,
      changeFrequency: "hourly",
      priority: 0.5,
    },
    // 外部链接
    {
      url: "https://wiki.epmc.top/",
      lastModified: config.lastModified,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];
}

export const revalidate = 86400;
