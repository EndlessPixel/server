import { Suspense } from 'react';
import type { Metadata } from 'next';
import CustomDownloadsPage from './client-page';

export const metadata: Metadata = {
  title: "资源合集下载 - EndlessPixel Minecraft 服务器",
  description:
    "EndlessPixel 资源合集：整合包、材质包、光影、插件等玩家自制与官方资源的集中下载入口。",
  keywords: ["EndlessPixel资源", "材质包下载", "光影下载", "插件下载", "Minecraft资源合集"],
  alternates: {
    canonical: "https://www.endlesspixel.cn/downloads/custom_downloads/",
  },
  openGraph: {
    title: "资源合集下载 | EndlessPixel Minecraft 服务器",
    description: "整合包、材质、光影、插件等资源的集中下载入口。",
    url: "https://www.endlesspixel.cn/downloads/custom_downloads/",
    type: "website",
    images: [{ url: "/banner.jpg", width: 1200, height: 630, alt: "EndlessPixel 资源合集" }],
  },
};

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <CustomDownloadsPage />
        </Suspense>
    );
}