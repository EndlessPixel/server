import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import clsx from "clsx";
import "./globals.css";
import FloatActions from "@/components/float-actions";

// 常量统一管理
const BRAND_NAME = "EndlessPixel Studio";
const CURRENT_YEAR = new Date().getFullYear().toString();
const DOMAIN = "https://www.epmc.top";
const LOGO = `${DOMAIN}/EndlessPixel.png`;
const FAVICON_ICO = "/favicon.ico";
const BANNER_IMAGE = `${DOMAIN}/banner.jpg`;

// 官方社交矩阵
const SOCIAL_LINKS = {
  bilibili: "https://space.bilibili.com/3546799478409405",
  kuaishou: "https://www.kuaishou.com/profile/3xth2cp4jf5ha6c",
  github: "https://github.com/EndlessPixel",
  gitee: "https://gitee.com/system_mini",
  codeberg: "https://codeberg.org/system_mini",
  discord: "https://discord.gg/k63hRWt3fF",
  facebook: "https://www.facebook.com/system_mini/",
  twitch: "https://www.twitch.tv/system_mini",
  youtube: "https://www.youtube.com/channel/UCMhwQrCnysEi0z0PTB655Eg",
};

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

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: "EndlessPixel - 免费纯净Minecraft Java服务器 | 1.7.2-1.21.11",
    template: "%s | EndlessPixel - 免费MC服务器",
  },
  description:
    "EndlessPixel提供免费纯净Minecraft Java服务器，支持1.7.2-1.21.11版本，采用Purpur高性能核心，打造优质中文MC公益服社区体验，无付费无广告。",
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

  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: DOMAIN,
    siteName: "EndlessPixel",
    title: "EndlessPixel - 免费纯净Minecraft Java服务器 | 1.7.2-1.21.11",
    description: "免费Minecraft Java服务器，支持1.7.2-1.21.11版本，Purpur核心+Discord社区，无付费无广告！",
    images: [
      {
        url: BANNER_IMAGE,
        width: 1200,
        height: 630,
        alt: "EndlessPixel 服务器横幅",
      },
    ],
  },

  // 保留twitter卡片供Discord/QQ/微信预览，移除无用creator
  twitter: {
    card: "summary_large_image",
    title: "EndlessPixel - 免费纯净Minecraft Java服务器 | 1.7.2-1.21.11",
    description: "免费MC Java服务器，支持1.7.2-1.21.11，无付费无广告！",
    images: [BANNER_IMAGE],
  },

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

// 结构化数据 注入全站社交矩阵 sameAs
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EndlessPixel",
    url: DOMAIN,
    logo: LOGO,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "客服社区",
      url: `${DOMAIN}/contact`,
    },
    sameAs: [
      SOCIAL_LINKS.bilibili,
      SOCIAL_LINKS.kuaishou,
      SOCIAL_LINKS.github,
      SOCIAL_LINKS.gitee,
      SOCIAL_LINKS.codeberg,
      SOCIAL_LINKS.discord,
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.twitch,
      SOCIAL_LINKS.youtube,
    ],
  },
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
        <link rel="canonical" href={DOMAIN} />
        {jsonLd.map((ld, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(ld),
            }}
          />
        ))}
        <meta name="referrer" content="no-referrer" />
        <meta name="msvalidate.01" content="B9D8B7001682D3FB5F699A38C4C6DAF4" />
        <meta name="copyright" content={`© ${CURRENT_YEAR} ${BRAND_NAME}`} />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <noscript>
          本站部分功能需要JavaScript支持，请启用JS以获得最佳体验。
          <br />
          Some features of this site require JavaScript. Please enable JS for the best experience.
        </noscript>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>
            {children}
            <FloatActions />
          </ErrorBoundary>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}