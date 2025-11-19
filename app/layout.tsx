import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { BackToTop } from "@/components/back-to-top";
import { Toaster } from "@/components/ui/toaster";
import clsx from "clsx";
import "./globals.css";

// 基础配置（同步你的实际信息）
const DOMAIN = "https://ep.endlesspixel.fun";
const LOGO = "https://ep.endlesspixel.fun/EndlessPixel.png"; // 对应 public/EndlessPixel.png
const FAVICON_ICO = "/icon.ico"; // 对应 public/icon.ico（已包含多尺寸）
const OG_IMAGE = "https://ep.endlesspixel.fun/banner.png"; // 专用OG图
const DISCORD_INVITE = "https://discord.gg/k63hRWt3fF"; // 你的Discord邀请链接
const BRAND_NAME = "EndlessPixel Studio"; // 修正品牌名：Studio 而非 Team

// 社交链接配置
const SOCIAL_LINKS = {
  discord: DISCORD_INVITE,
  github: "https://github.com/EndlessPixel",
  twitter: "https://twitter.com/EndlessPixel",
};

// 视口配置（优化移动端体验）
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  viewportFit: "cover", // 适配刘海屏
};

// SEO元数据配置（无TypeScript错误）
export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  
  // 基础信息（修正品牌名）
  title: { 
    default: "EndlessPixel - 免费纯净的Minecraft Java服务器", 
    template: "%s | EndlessPixel - 免费Minecraft服务器" 
  },
  description:
    "EndlessPixel提供免费、纯净、开放的Minecraft Java版服务器，支持1.8-1.21.10版本，采用Purpur高性能核心，打造优质中文游戏社区体验。",
  keywords: [
    "Minecraft服务器", "免费MC服务器", "Java版服务器", "Purpur核心", 
    "我的世界服务器", "EndlessPixel", "无尽像素", "MC公益服", "1.21服务器"
  ],
  authors: [{ 
    name: BRAND_NAME, 
    url: DOMAIN
  }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  
  // 规范链接（避免重复内容）
  alternates: {
    canonical: DOMAIN,
    languages: {
      "zh-CN": `${DOMAIN}/zh-CN`,
    },
  },
  
  // Open Graph（标准配置，Discord可识别）
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: DOMAIN,
    siteName: "EndlessPixel",
    title: "EndlessPixel - 免费纯净的Minecraft Java服务器",
    description: "EndlessPixel提供免费、纯净、开放的Minecraft Java版服务器，支持1.8-1.21.10，Purpur核心+Discord社区互动！",
    images: [
      { 
        url: OG_IMAGE, 
        width: 1200, 
        height: 630, 
        alt: "EndlessPixel - 免费Minecraft服务器",
        type: "image/png",
        secureUrl: OG_IMAGE,
      },
    ],
  },
  
  // Twitter卡片优化
  twitter: {
    card: "summary_large_image",
    title: "EndlessPixel - 免费纯净的Minecraft Java服务器",
    description: "免费Minecraft Java服务器，支持1.8-1.21.10，Purpur核心，优质中文社区+Discord实时互动。",
    images: [OG_IMAGE],
    site: "@EndlessPixel",
    creator: "@EndlessPixelStudio",
  },
  
  // 图标配置（适配你的public/icon.ico）
  icons: {
    icon: [
      { url: FAVICON_ICO, sizes: "16x16 32x32 48x48 64x64 128x128 256x256", type: "image/x-icon" },
    ],
    apple: [
      { url: "/banner.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: FAVICON_ICO, // 强制快捷方式使用你的icon.ico
    other: {
      rel: "mask-icon",
      url: "/banner.png",
      color: "#0a0a0a",
    },
  },
  
  // PWA配置（使用你已有的manifest.json）
  manifest: "/manifest.json",
  
  // 爬虫优化
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  category: "Games",
  referrer: "origin-when-cross-origin",
};

// 增强型结构化数据（JSON-LD）
const jsonLd = [
  // 组织信息（修正品牌名）
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EndlessPixel",
    url: DOMAIN,
    logo: LOGO,
    sameAs: Object.values(SOCIAL_LINKS),
    legalName: BRAND_NAME,
    foundingDate: "2024-01-01", // 可根据实际修改
    foundingLocation: "China",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "contact@endlesspixel.fun", // 可替换为实际邮箱
      availableLanguage: "Chinese",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "CN",
    },
    copyrightHolder: {
      "@type": "Organization",
      name: BRAND_NAME
    },
    copyrightYear: new Date().getFullYear().toString(),
  },
  
  // 网站信息
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EndlessPixel",
    url: DOMAIN,
    description: "免费、纯净、开放的Minecraft Java服务器，支持Discord社区互动",
    publisher: {
      "@type": "Organization",
      name: BRAND_NAME,
      logo: {
        "@type": "ImageObject",
        url: LOGO,
        width: 512,
        height: 512,
      },
    },
    inLanguage: "zh-CN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${DOMAIN}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    copyrightHolder: {
      "@type": "Organization",
      name: BRAND_NAME
    },
    copyrightYear: new Date().getFullYear().toString(),
  },
  
  // 服务信息
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Minecraft Java服务器服务",
    provider: {
      "@type": "Organization",
      name: BRAND_NAME,
      url: DOMAIN,
    },
    description: "免费Minecraft Java版服务器，支持1.8-1.21.10版本，Purpur高性能核心+Discord社区",
    serviceType: "游戏服务",
    offers: {
      "@type": "Offer",
      name: "免费Minecraft服务器",
      price: "0",
      priceCurrency: "CNY",
      availability: "https://schema.org/InStock",
      offerCategory: "free",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: DOMAIN,
    },
  },
  
  // Discord集成的结构化数据
  {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    name: `加入${BRAND_NAME} Discord社区`,
    description: "获取服务器更新、活动通知和玩家交流",
    url: DISCORD_INVITE,
    author: {
      "@type": "Organization",
      name: BRAND_NAME
    },
    publisher: {
      "@type": "Organization",
      name: "EndlessPixel"
    },
  }
];

// 主布局组件
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      className={clsx(GeistSans.variable, GeistMono.variable)}
      suppressHydrationWarning
      prefix="og: https://ogp.me/ns#" // OG命名空间
    >
      <head>
        {/* 字符编码 */}
        <meta charSet="UTF-8" />
        
        {/* 版权信息（标准meta标签） */}
        <meta name="copyright" content={`© ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.`} />
        
        {/* Edge图标修复：显式引用你的icon.ico */}
        <link rel="icon" href={FAVICON_ICO} type="image/x-icon" sizes="16x16 32x32 48x48 64x64 128x128 256x256" />
        <link rel="shortcut icon" href={FAVICON_ICO} type="image/x-icon" />
        
        {/* 移动端优化 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EndlessPixel" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* 兼容性优化 */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="format-detection" content="telephone=no,email=no" />
        
        {/* Discord预览优化 */}
        <meta property="og:description" content="EndlessPixel - 免费Minecraft服务器，加入Discord社区获取最新资讯和玩家交流" />
        
        {/* 性能优化（预连接关键域名） */}
        <link rel="preconnect" href="https://github.com" />
        <link rel="preconnect" href="https://discord.gg" />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://discord.gg" />
        
        {/* 结构化数据 */}
        {jsonLd.map((ld, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        ))}
        
        {/* Sitemap和Robots */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href={`${DOMAIN}/sitemap.xml`} />
        <link rel="robots" href={`${DOMAIN}/robots.txt`} />
      </head>
      <body className="antialiased min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>
            {children}
            <BackToTop />
          </ErrorBoundary>
          <Toaster />
        </ThemeProvider>
        
        {/* Discord浮窗按钮（使用你的邀请链接） */}
        <a 
          href={DISCORD_INVITE} 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-[#5865F2] text-white rounded-full p-3 shadow-lg hover:bg-[#4752C4] transition-colors z-50"
          aria-label="加入Discord社区"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="12" r="1"></circle>
            <circle cx="15" cy="12" r="1"></circle>
            <path d="M7.5 7.2C8.7 6.44 10.2 6 12 6c1.8 0 3.3.44 4.5 1.2 1.2.76 2.1 1.83 2.7 3.12.6 1.29.9 2.73.9 4.32 0 1.59-.3 3.03-.9 4.32-.6 1.29-1.5 2.36-2.7 3.12-1.2.76-2.7 1.2-4.5 1.2-1.8 0-3.3-.44-4.5-1.2-1.2-.76-2.1-1.83-2.7-3.12-.6-1.29-.9-2.73-.9-4.32 0-1.59.3-3.03.9-4.32.6-1.29 1.5-2.36 2.7-3.12Z"></path>
          </svg>
        </a>
      </body>
    </html>
  );
}