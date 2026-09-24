import Link from "next/link";
import type { Metadata } from "next";
import { DownloadSection } from "@/components/download-section_modpack";
import { BackButton, HelpSection } from "@/components/help-section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "资源下载 - EndlessPixel Minecraft 服务器 - EndlessPixel 整合包",
  description:
    "下载 EndlessPixel Minecraft 服务器最新客户端整合包。当前最新版为 26.2。兼容 26.1.2、26.1.1、26.1、1.21.11、1.21.10、1.21.9、1.21.8、1.21.4 等历史稳定版，包含 Fabric 模组包和优化配置。提供主分支和 Real 分支两种版本选择。",
  keywords: [
    "Minecraft下载",
    "模组包下载",
    "Fabric",
    "客户端下载",
    "26.2",
    "EndlessPixel",
    "整合包",
    "26.1.2",
    "26.1.1",
    "26.1",
    "1.21.11",
    "1.21.9",
    "1.21.8",
    "1.21.6",
    "1.21.4",
  ],
  openGraph: {
    title: "资源下载 | EndlessPixel Minecraft 服务器",
    description:
      "下载 EndlessPixel Minecraft 服务器最新客户端整合包，体验优化的游戏内容和丰富的模组功能。",
    url: "https://www.endlesspixel.cn/downloads/modpack/",
    images: [
      {
        url: "/og-downloads.jpg",
        width: 1200,
        height: 630,
        alt: "EndlessPixel 资源下载",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
              下载EndlessPixel 整合包
            </h1>
          </div>
          <div className="rounded-2xl border-foreground/8 bg-card p-1 backdrop-blur-sm">
            <BackButton href="/downloads" label="返回下载页面" />
            <DownloadSection />
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <HelpSection githubIssueUrl="https://github.com/EndlessPixel/EndlessPixel-Modpack/issues">
              <Button asChild variant="secondary" size="sm">
                <Link href="/downloads/modpack/issues">Issue 列表</Link>
              </Button>
            </HelpSection>
          </div>
        </div>
      </main>
    </div>
  );
}
