import type { Metadata } from "next";
import GalleryClient from "@/components/gallery-client";

export const metadata: Metadata = {
  title: "玩家截图图册 - EndlessPixel Minecraft 服务器",
  description:
    "浏览 EndlessPixel Minecraft 服务器玩家社区上传的游戏截图，支持多加速节点下载，遵循 CC BY-NC-SA 4.0 协议。",
  keywords: ["玩家截图", "Minecraft截图", "EndlessPixel", "游戏图册", "社区截图"],
  alternates: {
    canonical: "https://www.endlesspixel.cn/gallery/",
  },
  openGraph: {
    title: "玩家截图图册 | EndlessPixel Minecraft 服务器",
    description: "浏览 EndlessPixel 玩家社区上传的游戏截图，支持多加速节点下载。",
    url: "https://www.endlesspixel.cn/gallery/",
    type: "website",
    images: [{ url: "/banner.jpg", width: 1200, height: 630, alt: "EndlessPixel 玩家截图图册" }],
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}
