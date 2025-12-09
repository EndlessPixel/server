import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { BackToTop } from "@/components/back-to-top";
import { Toaster } from "@/components/ui/toaster";
import clsx from "clsx";
import "./globals.css";

// 基础配置（保留你的核心信息，仅优化命名规范）
const DOMAIN = "https://ep.endlesspixel.fun";
const LOGO = "https://ep.endlesspixel.fun/EndlessPixel.png";
const FAVICON_ICO = "/icon.ico";
const OG_IMAGE = "https://ep.endlesspixel.fun/banner.jpg";
const DISCORD_INVITE = "https://discord.gg/k63hRWt3fF";
const BRAND_NAME = "EndlessPixel Studio";
const CURRENT_YEAR = new Date().getFullYear().toString();

// 社交链接配置（结构化，便于JSON-LD复用）
const SOCIAL_LINKS = {
  discord: DISCORD_INVITE,
  github: "https://github.com/EndlessPixel",
};

// 🔥 视口配置极限优化（核心指标+SEO友好）
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  viewportFit: "cover",
  // 新增：强制移动端渲染为移动端视图（避免适配错误）
  interactiveWidget: "resizes-content",
};

// 🔥 SEO元数据极限优化（覆盖全维度，无冗余）
export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  
  // 核心标题（更紧凑，含核心关键词）
  title: { 
    default: "EndlessPixel - 免费纯净Minecraft Java服务器 | 1.8-1.21.10", 
    template: "%s | EndlessPixel - 免费MC服务器" 
  },
  // 描述（字数控制在150内，核心关键词前置+转化导向）
  description:
    "EndlessPixel提供免费纯净Minecraft Java服务器，支持1.8-1.21.10版本，采用Purpur高性能核心，打造优质中文MC公益服社区体验。",
  // 关键词（去重+核心词优先，控制在10个内）
  keywords: [
    "Minecraft服务器", "免费MC服务器", "Java版服务器", "Purpur核心", 
    "我的世界公益服", "EndlessPixel", "1.21服务器", "无尽像素"
  ],
  authors: [{ name: BRAND_NAME, url: DOMAIN }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  
  // 规范链接（强化唯一性，避免SEO降权）
  alternates: {
    canonical: DOMAIN,
    languages: {
      "zh-CN": `${DOMAIN}/zh-CN`,
      // 若有其他语言版本补充，无则保留zh-CN
    },
    // 新增：AMP适配（无AMP则注释，避免报错）
    // amp: `${DOMAIN}/amp`,
  },
  
  // 🔥 Open Graph 极限优化（Discord/微信/FB全兼容）
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: DOMAIN,
    siteName: "EndlessPixel",
    title: "EndlessPixel - 免费纯净Minecraft Java服务器 | 1.8-1.21.10",
    description: "免费Minecraft Java服务器，支持1.8-1.21.10版本，Purpur核心+Discord社区，无付费无广告！",
    images: [
      { 
        url: OG_IMAGE, 
        width: 1200, 
        height: 630, 
        alt: "EndlessPixel - 免费纯净Minecraft Java服务器",
        type: "image/png",
        secureUrl: OG_IMAGE,
        // 新增：图片权限（允许爬虫索引）
        // license: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
      },
    ],
    // 新增：Discord预览专属优化
    // titleTag: "EndlessPixel - 免费MC服务器",
  },
  
  // 🔥 Twitter/X 卡片极限优化（大卡片+高优先级）
    twitter: {
      card: "summary_large_image",
      title: "EndlessPixel - 免费纯净Minecraft Java服务器 | 1.8-1.21.10",
      description: "免费MC Java服务器，支持1.8-1.21.10，Purpur核心，无付费无广告，Discord社区实时互动！",
      images: [
        {
          url: OG_IMAGE,
          alt: "EndlessPixel Minecraft Server",
          width: 1200,
          height: 630,
        }
      ],
      site: "@EndlessPixel",
      creator: "@EndlessPixelStudio",
      // 新增：Twitter标签优化
    },
  
  // 🔥 图标配置极限优化（全平台兼容）
  icons: {
    icon: [
      { url: FAVICON_ICO, sizes: "16x16", type: "image/x-icon" },
      { url: FAVICON_ICO, sizes: "32x32", type: "image/x-icon" },
      { url: FAVICON_ICO, sizes: "48x48", type: "image/x-icon" },
      { url: FAVICON_ICO, sizes: "64x64", type: "image/x-icon" },
      { url: FAVICON_ICO, sizes: "128x128", type: "image/x-icon" },
      { url: FAVICON_ICO, sizes: "256x256", type: "image/x-icon" },
      // 新增：SVG图标（若有/public/icon.svg则启用，无则注释）
      // { url: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/banner.png", sizes: "180x180", type: "image/png", rel: "apple-touch-icon" },
      // 新增：不同尺寸苹果图标（若有则补充，无则保留180x180）
      // { url: "/apple-touch-icon-120x120.png", sizes: "120x120", type: "image/png" },
    ],
    shortcut: FAVICON_ICO,
    other: {
      rel: "mask-icon",
      url: "/banner.png",
      color: "#0a0a0a",
      // 新增：Windows磁贴图标（若有则补充）
      // "msapplication-TileImage": "/banner.png",
      // "msapplication-TileColor": "#0a0a0a",
    },
  },
  
  // PWA配置（保留现有，强化SEO）
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "EndlessPixel",
    statusBarStyle: "black-translucent",
  },
  
  // 🔥 爬虫优化极限版（精准控制）
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noimageindex: false,
    nosnippet: false,
    notranslate: false,
    noarchive: false,
    // maxSnippet: -1,
    // maxImagePreview: "large",
    // maxVideoPreview: -1,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
      // 新增：Google特定指令
      noarchive: false,
      nosnippet: false,
    },
    // 新增：其他爬虫适配
    // baiduBot: { // 百度爬虫
    //   index: true,
    //   follow: true,
    //   noimageindex: false,
    // },
    // bingBot: { // 必应爬虫
    //   index: true,
    //   follow: true,
    //   noimageindex: false,
    // },
  },
  
  // 🔥 新增核心SEO字段（无新增引用）
  category: "Games/Video Games/Minecraft", // 更精准的分类
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  // 新增：内容类型（强化编码）
  // contentType: "text/html; charset=utf-8",
  // 新增：过期控制（避免缓存）
  // expires: new Date(Date.now() + 86400000).toUTCString(), // 24小时过期
  // 新增：缓存控制（平衡性能与SEO）
  // cacheControl: "public, max-age=86400, s-maxage=86400",
};

// 🔥 结构化数据极限优化（Schema.org全维度覆盖）
const jsonLd = [
  // 1. 组织信息（强化品牌权威性）
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${DOMAIN}#organization`, // 唯一标识
    name: "EndlessPixel",
    legalName: BRAND_NAME,
    url: DOMAIN,
    logo: {
      "@type": "ImageObject",
      url: LOGO,
      width: 512,
      height: 512,
      caption: "EndlessPixel Logo",
      inLanguage: "zh-CN",
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
    isicV4: "9329", // 娱乐服务行业代码
    taxID: "", // 若无则注释，有则补充
  },
  
  // 2. 网站信息（强化核心业务）
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${DOMAIN}#website`,
    name: "EndlessPixel",
    url: DOMAIN,
    description: "免费纯净的Minecraft Java服务器，支持1.8-1.21.10版本，Purpur核心",
    publisher: { "@id": `${DOMAIN}#organization` },
    inLanguage: "zh-CN",
    // 新增：搜索功能（若有站内搜索则启用）
    potentialAction: {
      "@type": "SearchAction",
      target: `${DOMAIN}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
      queryType: "text",
    },
    copyrightHolder: { "@id": `${DOMAIN}#organization` },
    copyrightYear: CURRENT_YEAR,
    // 新增：更新频率（提升爬虫优先级）
    dateModified: new Date().toISOString(),
    datePublished: "2024-01-01",
  },
  
  // 3. 服务信息（强化转化）
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${DOMAIN}#service`,
    name: "Minecraft Java服务器服务",
    provider: { "@id": `${DOMAIN}#organization` },
    description: "免费Minecraft Java版服务器，支持1.8-1.21.10版本，无付费无广告",
    serviceType: "游戏服务",
    // 新增：服务特征（突出优势）
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
          // 新增：优惠描述
          description: "永久免费，无VIP，无广告，无付费内容",
          validFrom: "2024-01-01",
          validThrough: `${CURRENT_YEAR + 1}-12-31`, // 有效期
          seller: { "@id": `${DOMAIN}#organization` },
        },
      ],
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: DOMAIN,
      servicePhone: "", // 若无则注释
      email: "2267848501@qq.com",
    },
    // 新增：用户评分（若有则补充）
    // aggregateRating: {
    //   "@type": "AggregateRating",
    //   ratingValue: "4.9",
    //   reviewCount: "100+",
    // },
  },
  
  // 4. Discord社区（强化社交信号）
  {
    "@context": "https://schema.org",
    "@type": "SocialMediaPosting",
    "@id": `${DOMAIN}#discord`,
    name: `加入${BRAND_NAME} Discord社区`,
    description: "获取服务器更新、活动通知、玩家交流和技术支持",
    url: DISCORD_INVITE,
    author: { "@id": `${DOMAIN}#organization` },
    publisher: { "@id": `${DOMAIN}#organization` },
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString(),
    inLanguage: "zh-CN",
    // 新增：互动数据（若有则补充）
    // commentCount: "500+",
    // shareCount: "100+",
  },
  
  // 🔥 新增：面包屑导航（提升内链权重）
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首页",
        item: DOMAIN,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Minecraft服务器",
        item: `${DOMAIN}/server`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "免费MC服务器",
        item: `${DOMAIN}/free-server`,
      },
    ],
  },
  
  // 🔥 新增：FAQ结构化数据
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
      }
    ]
  }
];

// 主布局组件（极限优化性能+SEO）
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      className={clsx(GeistSans.variable, GeistMono.variable)}
      suppressHydrationWarning
      prefix="og: https://ogp.me/ns# fb: https://www.facebook.com/2008/fbml" // 补充FB命名空间
    >
      <head>
        {/* 核心编码（不可省略） */}
        <meta charSet="UTF-8" />
        
        {/* 版权信息（精简） */}
        <meta name="copyright" content={`© ${CURRENT_YEAR} ${BRAND_NAME}.`} />
        
        {/* 图标（强化跨浏览器兼容） */}
        <link rel="icon" href={FAVICON_ICO} type="image/x-icon" />
        <link rel="shortcut icon" href={FAVICON_ICO} type="image/x-icon" />
        {/* 新增：Edge/IE兼容 */}
        <meta name="msapplication-config" content="/browserconfig.xml" /> {/* 若有则补充，无则注释 */}
        
        {/* 移动端极致优化 */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EndlessPixel" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" /> {/* 冗余但保险 */}
        
        {/* 兼容性优化 */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="format-detection" content="telephone=no,email=no,address=no" />
        
        {/* 性能优化（预加载核心资源） */}
        <link rel="preconnect" href={DOMAIN} crossOrigin="anonymous" />
        <link rel="preconnect" href="https://github.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://discord.gg" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={DOMAIN} />
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://discord.gg" />
        {/* 新增：预加载OG图（提升社交预览速度） */}
        <link rel="preload" href={OG_IMAGE} as="image" type="image/png" crossOrigin="anonymous" />
        
        {/* 结构化数据（压缩输出） */}
        {jsonLd.map((ld, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ 
              __html: JSON.stringify(ld, (k, v) => v === "" ? undefined : v) // 过滤空值
            }}
          />
        ))}
        
        {/* Sitemap和Robots（强化爬虫发现） */}
        <link rel="sitemap" type="application/xml" title="Sitemap" href={`${DOMAIN}/sitemap.xml`} />
        <link rel="robots" href={`${DOMAIN}/robots.txt`} />
        
        {/* 🔥 新增：禁止转码（避免搜索引擎篡改页面） */}
        <meta httpEquiv="Cache-Control" content="no-transform" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground">
        {/* 🔥 新增：noscript（适配无JS环境，提升SEO） */}
        <noscript>
          <style>{`
            body { background: #ffffff; color: #0a0a0a; }
            .no-js-warning { padding: 1rem; background: #fff3cd; color: #856404; border: 1px solid #ffeeba; margin: 1rem; }
          `}</style>
          <div className="no-js-warning">
            本站部分功能需要JavaScript支持，请启用JS以获得最佳体验。
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