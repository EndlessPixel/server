import type { Metadata } from "next";
import LiveClient from "@/components/live-client";

export const metadata: Metadata = {
  title: "服务器实况 - EndlessPixel Minecraft 服务器",
  description:
    "观看 EndlessPixel Minecraft 服务器的实况录像与精彩回放，回顾服务器建设、活动与社区故事。",
  keywords: ["服务器实况", "Minecraft实况", "EndlessPixel", "B站回放", "服务器录像"],
  alternates: {
    canonical: "https://www.endlesspixel.cn/live/",
  },
  openGraph: {
    title: "服务器实况 | EndlessPixel Minecraft 服务器",
    description: "观看 EndlessPixel 服务器的实况录像与精彩回放。",
    url: "https://www.endlesspixel.cn/live/",
    type: "website",
    images: [{ url: "/banner.jpg", width: 1200, height: 630, alt: "EndlessPixel 服务器实况" }],
  },
};

export default function LivePage() {
  return <LiveClient />;
}
