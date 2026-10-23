/**
 * 品牌资源与口径的单一来源。
 *
 * 图标路径、品牌名只在这里定义一次，页面 / 组件 / metadata 统一引用，
 * 避免同一个路径在多处硬编码（历史上 `"/favicon.ico"` 曾在 6 个文件里各写一遍）。
 *
 * 换图标 = 只改这一个文件 + 替换 public/ 下的对应图片，不用满地找字符串。
 */

export const BRAND_NAME = "EndlessPixel";
export const BRAND_STUDIO_NAME = "EndlessPixel Studio";
export const BRAND_DOMAIN = "https://www.endlesspixel.cn";

/** 图标资源路径（均在 public/ 下） */
export const BRAND_ASSETS = {
  /** 站内横向字标 LOGO（导航栏等） */
  logo: "/EndlessPixel.png",
  /** 多尺寸 ico：页脚方块图标 + 各页面 metadata.icon */
  faviconIco: "/favicon.ico",
  /** 256x256 PNG：layout 的 icons.icon */
  iconPng: "/icon.png",
  /** 180x180 苹果触摸图标：layout 的 icons.apple */
  appleTouchIcon: "/apple-touch-icon.png",
  /** OG / Twitter 分享横幅 */
  banner: "/banner.jpg",
  /** 服务器图标兜底图 */
  defaultServerIcon: "/default-server-icon.png",
} as const;
