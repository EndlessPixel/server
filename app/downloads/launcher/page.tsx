import { LauncherListPage } from "@/components/launcher-list-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "启动器下载 - EndlessPixel Minecraft 服务器",
  description:
    "下载 EndlessPixel 官方推荐的 Minecraft 启动器，一键安装、自动配置，轻松进入 EndlessPixel 服务器。",
  keywords: ["Minecraft启动器", "PCL2", "HMCL", "启动器下载", "EndlessPixel", "一键进入服务器"],
  alternates: {
    canonical: "https://www.endlesspixel.cn/downloads/launcher/",
  },
  openGraph: {
    title: "启动器下载 | EndlessPixel Minecraft 服务器",
    description: "下载 EndlessPixel 官方推荐启动器，一键进入服务器。",
    url: "https://www.endlesspixel.cn/downloads/launcher/",
    type: "website",
    images: [{ url: "/banner.jpg", width: 1200, height: 630, alt: "EndlessPixel 启动器下载" }],
  },
};

export default function Page() {
  return <LauncherListPage />;
}