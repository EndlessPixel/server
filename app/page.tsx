import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "首页",
  description:
    "EndlessPixel - 免费纯净Minecraft Java服务器。支持1.7.2-26.1.2版本，采用Purpur高性能核心，打造优质中文MC公益服社区体验。无需正版验证，完全免费游玩。",
  keywords: [
    "首页",
    "EndlessPixel",
    "Minecraft服务器",
    "免费MC",
    "Java服务器",
    "公益服",
    "Purpur",
  ],
  openGraph: {
    title: "EndlessPixel - 免费纯净Minecraft Java服务器",
    description:
      "一个充满活力与创意的 Minecraft 社区！支持无需正版，让所有玩家都能轻松加入冒险之旅。",
    url: "https://www.endlesspixel.cn/",
    type: "website",
    images: [
      {
        url: "/banner.jpg",
        width: 1200,
        height: 630,
        alt: "EndlessPixel 首页",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EndlessPixel - 免费纯净Minecraft Java服务器",
    description: "一个充满活力与创意的 Minecraft 社区！",
    images: ["/banner.jpg"],
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
  alternates: {
    canonical: "https://www.endlesspixel.cn/",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
