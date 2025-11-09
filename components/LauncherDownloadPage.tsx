import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { DownloadSection } from "@/components/download-section-launcher";
import { Github, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export interface LauncherDownloadPageProps {
  description: string;
  repoOwner: string;
  repoName: string;
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
  archived = false,
  archivedDate = "",
  backHref = "/downloads",
}: LauncherDownloadPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-cyan-950/20">
      {archived && (
        <div className="w-full bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 px-4 py-3 text-center text-sm font-medium">
          ⚠️ 此仓库已被所有者于 {archivedDate} 归档，现为只读状态。
        </div>
      )}
      <Navigation />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-600 dark:from-slate-100 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-6">
              资源下载
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {introCards.map((card, i) => (
              <div
                key={i}
                className="text-center p-6 bg-white/80 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 rounded-full flex items-center justify-center mx-auto mb-5 shadow-md shadow-purple-200/50 dark:shadow-purple-900/30 transition-shadow">
                  {card.icon}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{card.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm whitespace-pre-line">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm p-1">
            <DownloadSection
              githubApiUrl={`https://api.github.com/repos/${repoOwner}/${repoName}/releases`}
              itemsPerPage={20}
            />
          </div>

          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-4">需要帮助？</h3>
              <div className="space-y-4 text-slate-600 dark:text-slate-400">
                <p>如果您在安装过程中遇到任何问题：</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://github.com/${repoOwner}/${repoName}/issues`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    提交 Issue
                  </a>
                  <a
                    href={issuesHref}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/50 rounded-lg text-sm font-medium text-purple-700 dark:text-purple-300 transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    本地 Issue 列表
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}