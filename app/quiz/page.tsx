import type { Metadata } from "next";
import { QuizClient } from "@/components/quiz-client";

export const metadata: Metadata = {
  title: "服务器考试",
  description:
    "随机抽取 20 道题，测测你对 EndlessPixel 服务器接入方式、版本、玩法、整合包与规则的了解程度。成绩保存在浏览器本地，可反复挑战刷分。",
  keywords: ["EndlessPixel", "服务器考试", "Minecraft知识测验", "答题", "MC服务器", "整合包"],
  alternates: {
    canonical: "https://www.endlesspixel.cn/quiz/",
  },
  openGraph: {
    title: "服务器考试 | EndlessPixel Minecraft 服务器",
    description: "随机 20 题，测测你有多懂 EndlessPixel。成绩保存在本地浏览器。",
    url: "https://www.endlesspixel.cn/quiz/",
    images: [
      { url: "/og-downloads.jpg", width: 1200, height: 630, alt: "EndlessPixel 服务器考试" },
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

export default function QuizPage() {
  return <QuizClient />;
}
