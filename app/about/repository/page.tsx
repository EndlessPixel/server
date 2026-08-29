import { RepoInfoSection } from "@/components/repo-info-section";
import { LicenseSection } from "@/components/license-section";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "仓库信息 - EndlessPixel Minecraft 服务器",
  description:
    "查看 EndlessPixel 官网仓库的开源信息：Stars、Forks、语言构成、最新版本、贡献者与开源许可证（AGPL-3.0）。",
  keywords: ["EndlessPixel", "仓库信息", "开源", "GitHub", "AGPL-3.0", "源代码"],
  openGraph: {
    title: "仓库信息 | EndlessPixel Minecraft 服务器",
    description: "本站源码完全开源，实时同步 GitHub 仓库数据与开源许可证信息。",
    url: "https://www.endlesspixel.cn/about/repository",
    images: [{ url: "/og-about.jpg", width: 1200, height: 630, alt: "EndlessPixel 仓库信息" }],
  },
  robots: { index: true, follow: true },
};

export default function RepositoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* -------------- Hero -------------- */}
          <section className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              仓库信息
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              本站源码托管在 GitHub，采用 AGPL-3.0 开源。下面的数据实时来自 GitHub API。
            </p>
          </section>

          {/* -------------- 返回入口 -------------- */}
          <div className="flex justify-center">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回关于我们
            </Link>
          </div>

          {/* -------------- 仓库数据 -------------- */}
          <RepoInfoSection />

          {/* -------------- 许可证（由关于我们页迁移至此） -------------- */}
          <LicenseSection />

          {/* -------------- 说明 -------------- */}
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>
                数据由服务端代理 <code className="rounded bg-secondary px-1">/api/gh_api</code> 向
                GitHub 请求，配置 <code className="rounded bg-secondary px-1">GH_TOKEN</code> 可提升接口限额。
              </p>
              <p>页面数据会缓存 60 秒，点击「刷新数据」可强制更新。</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
