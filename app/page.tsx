import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "首页",
  description:
    "EndlessPixel - 免费纯净Minecraft Java服务器。支持1.7.2-26.2版本，用Purpur核心，不用正版也能玩，完全免费。",
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
      "EndlessPixel 是玩家自发的 Minecraft 社区服务器，不用正版验证也能进服，全免费。",
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
    description: "EndlessPixel - 免费纯净Minecraft Java服务器",
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
