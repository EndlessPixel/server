import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { BackToTop } from "@/components/back-to-top";
import { Toaster } from "@/components/ui/toaster";
import clsx from "clsx";
import "./globals.css";

// 基础配置（明确资源用途，路径精准匹配）
const DOMAIN = "https://ep.endlesspixel.fun";
const LOGO = "https://ep.endlesspixel.fun/EndlessPixel.png"; // Logo（PNG）
const FAVICON_ICO = "/icon.ico"; // 图标（ICO）
const BANNER_IMAGE = "https://ep.endlesspixel.fun/banner.jpg"; // 横幅（JPG）
const DISCORD_INVITE = "https://discord.gg/k63hRWt3fF";
const BRAND_NAME = "EndlessPixel Studio";
const CURRENT_YEAR = new Date().getFullYear().toString();

// 社交链接配置
const SOCIAL_LINKS = {
  discord: DISCORD_INVITE,
  github: "https://github.com/EndlessPixel",
};

// 视口配置（符合搜索引擎移动端要求）
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 5.0,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

// SEO 元数据（资源用途精准匹配）
export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  
  title: { 
    default: "EndlessPixel - 免费纯净Minecraft Java服务器 | 1.8-1.21.10", 
    template: "%s | EndlessPixel - 免费MC服务器" 
  },
  description:
    "EndlessPixel提供免费纯净Minecraft Java服务器，支持1.8-1.21.10版本，采用Purpur高性能核心，打造优质中文MC公益服社区体验。",
  keywords: [
    "Minecraft服务器", "免费MC服务器", "Java版服务器", "Purpur核心", 
    "我的世界公益服", "EndlessPixel", "1.21服务器", "无尽像素"
  ],
  authors: [{ name: BRAND_NAME, url: DOMAIN }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  
  alternates: {
    canonical: DOMAIN,
    languages: { "zh-CN": `${DOMAIN}/zh-CN` },
  },
  
  // Open Graph（横幅图用作预览图，Logo 关联品牌）
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: DOMAIN,
    siteName: "EndlessPixel",
    title: "EndlessPixel - 免费纯净Minecraft Java服务器 | 1.8-1.21.10",
    description: "免费Minecraft Java服务器，支持1.8-1.21.10版本，Purpur核心+Discord社区，无付费无广告！",
    images: [
      { 
        url: BANNER_IMAGE, // 横幅图作为社交预览图（符合视觉需求）
        width: 1200, 
        height: 630, 
        alt: "EndlessPixel 服务器横幅",
        type: "image/jpeg", // 精准匹配 JPG 格式
        secureUrl: BANNER_IMAGE,
      },
    ],
  },
  
  // Twitter 卡片（同 Open Graph，用横幅图提升视觉冲击力）
  twitter: {
    card: "summary_large_image",
    title: "EndlessPixel - 免费纯净Minecraft Java服务器 | 1.8-1.21.10",
    description: "免费MC Java服务器，支持1.8-1.21.10，Purpur核心，无付费无广告，Discord社区实时互动！",
    images: [
      {
        url: BANNER_IMAGE,
        alt: "EndlessPixel Minecraft Server Banner",
        width: 1200,
        height: 630,
      }
    ],
    site: "@EndlessPixel",
    creator: "@EndlessPixelStudio",
  },
  
  // 图标配置（严格区分：ICO 用作图标，Logo 用作苹果图标/mask 图标）
  icons: {
    icon: [
      { url: FAVICON_ICO, sizes: "16x16", type: "image/x-icon" }, // 小尺寸图标
      { url: FAVICON_ICO, sizes: "32x32", type: "image/x-icon" },
      { url: FAVICON_ICO, sizes: "48x48", type: "image/x-icon" },
      { url: FAVICON_ICO, sizes: "64x64", type: "image/x-icon" },
      { url: FAVICON_ICO, sizes: "128x128", type: "image/x-icon" },
      { url: FAVICON_ICO, sizes: "256x256", type: "image/x-icon" }, // 大尺寸图标
    ],
    apple: [
      { 
        url: LOGO, // Logo 用作苹果触摸图标（品牌一致性）
        sizes: "180x180", 
        type: "image/png", 
        rel: "apple-touch-icon" 
      },
    ],
    shortcut: FAVICON_ICO, // 快捷方式图标用 ICO
    other: {
      rel: "mask-icon",
      url: LOGO, // Logo 用作面具图标（保持品牌统一）
      color: "#0a0a0a",
    },
  },
  
  // PWA 配置（关联 Logo 和图标）
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "EndlessPixel",
    statusBarStyle: "black-translucent",
  },
  
  // Robots 配置（优先索引）
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noimageindex: false,
    nosnippet: false,
    notranslate: false,
    noarchive: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  category: "Games/Video Games/Minecraft",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

// 结构化数据（资源用途精准匹配，强化品牌识别）
const jsonLd = [
  // 1. 组织信息（Logo 作为品牌标识，横幅图不作为组织图标）
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${DOMAIN}#organization`,
    name: "EndlessPixel",
    legalName: BRAND_NAME,
    url: DOMAIN,
    logo: {
      "@type": "ImageObject",
      url: LOGO, // 明确用 Logo 作为组织标识
      width: 512,
      height: 512,
      caption: "EndlessPixel 官方 Logo",
      inLanguage: "zh-CN",
      type: "image/png", // 匹配 Logo 格式
    },
    sameAs: Object.values(SOCIAL_LINKS),
    foundingDate: "2024-01-01",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "CN",
      },
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "2267848501@qq.com",
      availableLanguage: "zh-CN",
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    },
    copyrightHolder: { "@id": `${DOMAIN}#organization` },
    copyrightYear: CURRENT_YEAR,
    isicV4: "9329",
  },
  
  // 2. 网站信息（关联 Logo 和横幅图）
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${DOMAIN}#website`,
    name: "EndlessPixel",
    url: DOMAIN,
    description: "免费纯净的Minecraft Java服务器，支持1.8-1.21.10版本，Purpur核心",
    publisher: { "@id": `${DOMAIN}#organization` },
    inLanguage: "zh-CN",
    image: { // 网站关联横幅图（提升视觉权重）
      "@type": "ImageObject",
      url: BANNER_IMAGE,
      width: 1200,
      height: 630,
      caption: "EndlessPixel 服务器横幅",
      type: "image/jpeg",
    },
    dateModified: new Date().toISOString(),
    datePublished: "2024-01-01",
  },
  
  // 3. 服务信息（核心转化）
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${DOMAIN}#service`,
    name: "Minecraft Java服务器服务",
    provider: { "@id": `${DOMAIN}#organization` },
    description: "免费Minecraft Java版服务器，支持1.8-1.21.10版本，无付费无广告",
    serviceType: "游戏服务",
    serviceOutput: {
      "@type": "Thing",
      name: "Minecraft服务器访问权限",
      description: "免费获取纯净MC服务器游玩权限",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "免费服务器服务",
      itemListElement: [
        {
          "@type": "Offer",
          name: "免费Minecraft服务器",
          price: "0.00",
          priceCurrency: "CNY",
          availability: "https://schema.org/InStock",
          offerCategory: "free",
          description: "永久免费，无VIP，无广告，无付费内容",
          validFrom: "2024-01-01",
          validThrough: `${CURRENT_YEAR + 1}-12-31`,
          seller: { "@id": `${DOMAIN}#organization` },
        },
      ],
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: DOMAIN,
      email: "2267848501@qq.com",
    },
  },
  
  // 4. FAQ 结构化数据（提升搜索展示）
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "EndlessPixel服务器支持哪些版本？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "支持Minecraft Java版1.8-1.21.10版本，推荐使用1.21.10版本获得最佳体验。"
        }
      },
      {
        "@type": "Question",
        name: "EndlessPixel服务器是否收费？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "完全免费，无VIP、无广告、无付费内容，永久免费游玩。"
        }
      },
      {
        "@type": "Question",
        name: "如何加入EndlessPixel服务器？",
        acceptedAnswer: {
          "@type": "Answer",
          text: "1. 打开Minecraft Java版（1.8-1.21.10）；2. 添加服务器地址：ep.endlesspixel.fun；3. 加入Discord社区获取最新公告：https://discord.gg/k63hRWt3fF。"
        }
      }
    ]
  }
];

// 主布局组件（资源加载优化，保持品牌一致性）
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      className={clsx(GeistSans.variable, GeistMono.variable)}
      suppressHydrationWarning
      prefix="og: https://ogp.me/ns# fb: https://www.facebook.com/2008/fbml"
    >
      <head>
        <meta name="copyright" content={`© ${CURRENT_YEAR} ${BRAND_NAME}.`} />
        {/* 预连接关键域名 */}
        <link rel="preconnect" href={DOMAIN} crossOrigin="anonymous" />
        <link rel="preconnect" href="https://github.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://discord.gg" crossOrigin="anonymous" />
        {/* DNS 预解析 */}
        <link rel="dns-prefetch" href={DOMAIN} />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://discord.gg" />
        {/* 结构化数据 */}
        {jsonLd.map((ld, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ 
              __html: JSON.stringify(ld, (k, v) => v === "" || v === undefined ? undefined : v)
            }}
          />
        ))}
        {/* Sitemap 链接 */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href={`${DOMAIN}/sitemap.xml`} />
        {/* 禁止转码 */}
        <meta httpEquiv="Cache-Control" content="no-transform" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground">
        {/* noscript 适配（显示核心信息） */}
        <noscript>
          <style>{`
            body { background: #ffffff; color: #0a0a0a; }
            .no-js-warning { padding: 1rem; background: #fff3cd; color: #856404; border: 1px solid #ffeeba; margin: 1rem; text-align: center; border-radius: 8px; }
          `}</style>
          <div className="no-js-warning">
            本站部分功能需要JavaScript支持，请启用JS以获得最佳体验。<br />
            服务器地址：ep.endlesspixel.fun | Discord：<a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">https://discord.gg/k63hRWt3fF</a>
          </div>
        </noscript>
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>
            {children}
            <BackToTop />
          </ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}