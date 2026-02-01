import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ServerFeatures } from "@/components/server-features"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "首页 - EndlessPixel Minecraft 服务器",
  description:
    "首页 - EndlessPixel Minecraft 服务器",
  keywords: ["首页", "EndlessPixel", "Minecraft服务器"],
  openGraph: {
    title: "首页 | EndlessPixel Minecraft 服务器",
    description: "首页 - EndlessPixel Minecraft 服务器",
    url: "https://www.endlesspixel.fun/",
    images: [
      {
        url: "/og-downloads.jpg",
        width: 1200,
        height: 630,
        alt: "EndlessPixel 首页",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.ico"
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
      </main>
      <Footer />
    </div>
  )
}