import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { BackToTop } from "@/components/back-to-top";
import { Toaster } from "@/components/ui/toaster";
import clsx from "clsx";
import "./globals.css";

// ===== 基础配置 (精简且准确) =====
const BRAND_NAME = "EndlessPixel Studio";
const CURRENT_YEAR = new Date().getFullYear().toString();

// ✅ 修复1: 使用正确的新域名
const DOMAIN = "https://www.endlesspixel.fun";
const LOGO = `${DOMAIN}/EndlessPixel.png`;
const FAVICON_ICO = "/icon.ico";
const BANNER_IMAGE = `${DOMAIN}/banner.jpg`;
const DISCORD_INVITE = "https://discord.gg/k63hRWt3fF";

// ✅ 修复2: 简化社交链接
const SOCIAL_LINKS = {
  discord: DISCORD_INVITE,
  github: "https://github.com/EndlessPixel",
};

// ===== 视口配置 (优化移动端) =====
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
};

// ===== SEO 元数据 (精准且一致) =====
export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: "EndlessPixel - 免费纯净Minecraft Java服务器 | 1.8-1.21.10",
    template: "%s | EndlessPixel - 免费MC服务器",
  },
  description: "EndlessPixel提供免费纯净Minecraft Java服务器，支持1.8-1.21.10版本，采用Purpur高性能核心，打造优质中文MC公益服社区体验。",
  keywords: [
    "Minecraft服务器",
    "免费MC服务器",
    "Java版服务器",
    "Purpur核心",
    "我的世界公益服",
    "EndlessPixel",
    "1.21服务器",
    "无尽像素",
  ],
  authors: [{ name: BRAND_NAME }],
  creator: BRAND_NAME,
  publisher: BRAND_NAME,
  alternates: {
    canonical: DOMAIN,
  },

  // ✅ 修复3: Open Graph 使用正确域名
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: DOMAIN,
    siteName: "EndlessPixel",
    title: "EndlessPixel - 免费纯净Minecraft Java服务器 | 1.8-1.21.10",
    description: "免费Minecraft Java服务器，支持1.8-1.21.10版本，Purpur核心+Discord社区，无付费无广告！",
    images: [
      {
        url: BANNER_IMAGE,
        width: 1200,
        height: 630,
        alt: "EndlessPixel 服务器横幅",
      },
    ],
  },

  // ✅ 修复4: Twitter 卡片使用正确域名
  twitter: {
    card: "summary_large_image",
    title: "EndlessPixel - 免费纯净Minecraft Java服务器 | 1.8-1.21.10",
    description: "免费MC Java服务器，支持1.8-1.21.10，Purpur核心，无付费无广告，Discord社区实时互动！",
    images: [BANNER_IMAGE],
    creator: "@EndlessPixelStudio",
  },

  // ✅ 修复5: 简化图标配置
  icons: {
    icon: FAVICON_ICO,
    apple: [
      {
        url: LOGO,
        sizes: "180x180",
        rel: "apple-touch-icon",
      },
    ],
    other: {
      rel: "mask-icon",
      url: LOGO,
      color: "#0a0a0a",
    },
  },

  // ✅ 修复6: 合理的 robots 配置
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// ✅ 修复7: 精简且准确的结构化数据
const jsonLd = [
  // 简化的组织信息
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EndlessPixel",
    url: DOMAIN,
    logo: LOGO,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "客服",
      url: `${DOMAIN}/contact`,
    },
  },

  // 简化的网站信息
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EndlessPixel",
    url: DOMAIN,
    potentialAction: {
      "@type": "SearchAction",
      target: `${DOMAIN}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
];

// ===== 主布局组件 (优化性能) =====
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-CN"
      className={clsx(GeistSans.variable, GeistMono.variable)}
      suppressHydrationWarning
    >
      <head>
        {/* ✅ 修复8: 添加规范URL */}
        <link rel="canonical" href={DOMAIN} />

        {/* ✅ 修复9: 关键预连接 (只保留最重要的) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href={DISCORD_INVITE} crossOrigin="anonymous" />

        {/* DNS 预解析优化 */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* 安全头 */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="
    default-src 'self';
    img-src 'self' data: https:;
    script-src 'self' 'unsafe-inline' https://discord.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://discord.com https://*.vercel.app https://api.github.com https://avatars.githubusercontent.com https://api.mcsrvstat.us;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  "
        />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />

        {/* ✅ 修复10: 精简结构化数据 */}
        {jsonLd.map((ld, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(ld)
            }}
          />
        ))}

        {/* 保留必要的验证 */}
        <meta name="msvalidate.01" content="898B5BEB29FDA2453EA187F18BA9F16F" />
        <meta name="copyright" content={`© ${CURRENT_YEAR} ${BRAND_NAME}`} />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <noscript>
          <style>{`
            body { background: #ffffff; color: #0a0a0a; }
            .no-js-warning { 
              padding: 1rem; 
              background: #fff3cd; 
              color: #856404; 
              border: 1px solid #ffeeba; 
              margin: 1rem; 
              text-align: center; 
              border-radius: 8px; 
            }
          `}</style>
          <div className="no-js-warning">
            本站部分功能需要JavaScript支持，请启用JS以获得最佳体验。<br />
            Some features of this site require JavaScript. Please enable JS for the best experience.
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