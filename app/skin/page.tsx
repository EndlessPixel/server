import type { Metadata } from "next";
import { SkinLab } from "./SkinLab";

export const metadata: Metadata = {
  title: "皮肤预览 - EndlessPixel Minecraft 服务器",
  description: "输入角色名即可查看 Minecraft 皮肤 3D 预览，支持正版与 LittleSkin 两种来源。",
  keywords: ["Minecraft皮肤", "皮肤预览", "LittleSkin", "EndlessPixel"],
  alternates: {
    canonical: "https://www.endlesspixel.cn/skin/",
  },
  openGraph: {
    title: "皮肤预览 | EndlessPixel Minecraft 服务器",
    description: "输入角色名查看 Minecraft 皮肤 3D 预览，支持正版与 LittleSkin。",
    url: "https://www.endlesspixel.cn/skin/",
    type: "website",
  },
};

export default function SkinPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-12">
            <h1 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">皮肤预览</h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
              输入角色名即可查看 3D 皮肤，支持正版与 LittleSkin 两个来源
            </p>
          </div>

          <SkinLab />
        </div>
      </main>
    </div>
  );
}
