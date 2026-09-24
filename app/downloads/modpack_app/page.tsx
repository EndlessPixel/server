import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { DownloadSection } from "@/components/download-section-launcher";
import { BackButton, HelpSection } from "@/components/help-section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "资源下载 - EndlessPixel Minecraft 服务器",
  description:
    "下载 EndlessPixel Minecraft Modpack Downloader Tools。支持下载最新版 EndlessPixel 客户端整合包。",
  keywords: ["Minecraft", "模组包下载", "EndlessPixel", "整合包"],
  openGraph: {
    title: "资源下载 | EndlessPixel Minecraft 服务器",
    description:
      "下载 EndlessPixel Minecraft Modpack Downloader Tools。支持下载最新版 EndlessPixel 客户端整合包。",
    url: "https://www.endlesspixel.cn/downloads/modpack_app/",
    images: [
      {
        url: "/og-downloads.jpg",
        width: 1200,
        height: 630,
        alt: "EndlessPixel 资源下载 - EndlessPixel Modpack APP",
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
              下载EndlessPixel Modpack Downloader Tools
            </h1>
          </div>

          <div className="rounded-2xl border-foreground/8 bg-card p-1 backdrop-blur-sm">
            <BackButton href="/downloads" label="返回下载页面" />
            <Suspense fallback={<div className="p-8 text-center">加载下载区域中...</div>}>
              <DownloadSection
                title="EndlessPixel Modpack APP"
                description="下载 EndlessPixel Minecraft Modpack Downloader Tools。支持下载最新版 EndlessPixel 客户端整合包。"
                githubApiUrl="https://api.github.com/repos/EndlessPixel/EndlessPixel-ModpackAPP/releases"
              />
            </Suspense>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <HelpSection githubIssueUrl="https://github.com/EndlessPixel/EndlessPixel-ModpackAPP/issues">
              <Button asChild variant="secondary" size="sm">
                <Link href="/downloads/modpack_app/issues">Issue 列表</Link>
              </Button>
            </HelpSection>
          </div>
        </div>
      </main>
    </div>
  );
}
