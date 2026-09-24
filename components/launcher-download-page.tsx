"use client";

import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { DownloadSection } from "@/components/download-section-launcher";
import { BackButton, HelpSection } from "@/components/help-section";
import { Button } from "@/components/ui/button";
import { DownloadCardSkeleton } from "@/components/ui/skeleton-templates";

export interface LauncherDownloadPageProps {
  repoOwner: string;
  repoName: string;
  description?: string;
  issuesHref: string;
  introCards?: { title: string; desc: string; icon: ReactNode }[];
}

export function LauncherDownloadPage({
  description,
  repoOwner,
  repoName,
  issuesHref,
  introCards = [],
}: LauncherDownloadPageProps) {
  const repoUrl = `https://github.com/${repoOwner}/${repoName}`;

  return (
    <div className="min-h-screen bg-background">
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              资源下载 {repoOwner}/{repoName}
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {introCards.map((card, i) => (
              <div key={i} className="rounded-2xl bg-card p-6 text-center shadow-sm">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary transition-shadow">
                  {card.icon}
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{card.title}</h3>
                <p className="text-sm whitespace-pre-line text-muted-foreground">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-card p-1 shadow-sm">
            <BackButton href="/downloads" />
            <Suspense
              fallback={
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <DownloadCardSkeleton key={i} />
                    ))}
                  </div>
                </div>
              }
            >
              <DownloadSection
                githubApiUrl={`https://api.github.com/repos/${repoOwner}/${repoName}/releases`}
                itemsPerPage={20}
              />
            </Suspense>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-3">
              <HelpSection githubIssueUrl={`${repoUrl}/issues`}>
                <Button asChild variant="secondary" size="sm">
                  <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                    直达仓库
                  </a>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link href={issuesHref}>
                    <ArrowUpRight className="mr-2 h-4 w-4" aria-hidden="true" />
                    Issue 列表
                  </Link>
                </Button>
              </HelpSection>
              <p className="px-1 text-xs text-muted-foreground">
                外部资源的问题请不要联系我们，我们不对此部分负责，我们只提供下载服务，请联系对应的作者。
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
