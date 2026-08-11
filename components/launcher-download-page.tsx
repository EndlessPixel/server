"use client";

import { DownloadSection } from "@/components/download-section-launcher";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { DownloadCardSkeleton } from "@/components/ui/skeleton-templates";

export interface LauncherDownloadPageProps {
  owner: string;
  repo: string;
  repoOwner: string;
  repoName: string;
  description?: string;
  issuesHref: string;
  introCards?: { title: string; desc: string; icon: ReactNode }[];
  archived?: boolean;
  archivedDate?: string;
  backHref?: string;
}

export function LauncherDownloadPage({
  description,
  repoOwner,
  repoName,
  issuesHref,
  introCards = [],
}: LauncherDownloadPageProps) {
  const router = useRouter();
  const repoUrl = `https://github.com/${repoOwner}/${repoName}`;
  return (
    <div className="min-h-screen bg-background">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              资源下载 {repoOwner}/{repoName}
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {introCards.map((card, i) => (
              <div key={i} className="text-center p-6 bg-card rounded-2xl shadow-sm">
                <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-5 transition-shadow">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{card.title}</h3>
                <p className="text-muted-foreground text-sm whitespace-pre-line">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-2xl shadow-sm p-1">
            <button
              onClick={() => router.push("/downloads")}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              aria-label="返回下载页面"
            >
              <span className="text-sm font-medium">返回</span>
            </button>
            <Suspense
              fallback={
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (<DownloadCardSkeleton key={i} />))}
                  </div>
                </div>
              }
            >
              <DownloadSection githubApiUrl={`https://api.github.com/repos/${repoOwner}/${repoName}/releases`} itemsPerPage={20} />
            </Suspense>
          </div>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground text-lg mb-4">需要帮助？</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>如果您在下载/安装过程中遇到任何问题：</p>
                <div className="flex flex-wrap gap-3">
                  <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-medium transition-colors duration-200">
                    <ExternalLink className="w-4 h-4" /> 直达仓库
                  </a>
                  <a href={`https://github.com/${repoOwner}/${repoName}/issues`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-medium transition-colors duration-200">
                    <img src="https://cdn.simpleicons.org/github/white" width="18" height="18" alt="GitHub" className="w-4 h-4" /> 提交 Issue
                  </a>
                  <a href={issuesHref} className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-medium transition-colors duration-200">
                    <ArrowUpRight className="w-4 h-4" /> Issue 列表
                  </a>
                  <p>外部资源的问题请不要联系我们，我们不对此部分负责，我们只提供下载服务，请联系对应的作者</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}