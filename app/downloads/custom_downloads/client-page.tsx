"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { DownloadSection } from "@/components/download-section-launcher";
import { ArrowLeft, Search, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CustomDownloadsPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [recentRepos, setRecentRepos] = useState<
    { owner: string; repo: string; url: string }[]
  >([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("custom-downloads-recent");
      if (stored) {
        setRecentRepos(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const saveRecent = (owner: string, repo: string, url: string) => {
    const updated = [
      { owner, repo, url },
      ...recentRepos.filter((r) => r.url !== url),
    ].slice(0, 5);
    setRecentRepos(updated);
    localStorage.setItem("custom-downloads-recent", JSON.stringify(updated));
  };

  const parseRepo = (
    input: string,
  ): { owner: string; repo: string } | null => {
    const trimmed = input.trim();
    // owner/repo
    const shortMatch = trimmed.match(
      /^([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)$/,
    );
    if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] };
    // full GitHub URL
    const urlMatch = trimmed.match(
      /github\.com\/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)/,
    );
    if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] };
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseRepo(repoUrl);
    if (parsed) {
      saveRecent(parsed.owner, parsed.repo, repoUrl);
      setSubmittedUrl(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/releases`,
      );
    }
  };

  const parsed = parseRepo(repoUrl);
  const isValid = parsed !== null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/downloads"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="返回下载页面"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">返回</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">
              自定义 GitHub 下载
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              输入 GitHub 仓库地址，获取 Release 文件并选择合适的镜像下载
            </p>
          </motion.div>

          {/* URL Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label htmlFor="repo-input" className="sr-only">
                  输入 GitHub 仓库地址
                </label>
                <div
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 transition-colors",
                    inputFocused
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                  aria-hidden="true"
                >
                  <Search className="w-5 h-5" />
                </div>
                <input
                  id="repo-input"
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="输入 GitHub 仓库地址或 owner/repo..."
                  className="w-full pl-12 pr-4 py-4 bg-secondary rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:bg-background transition-all text-base"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  例如：<code className="px-2 py-1 bg-secondary rounded-lg text-foreground/70 text-xs">EndlessPixel/EndlessLauncher</code>
                </div>
                <button
                  type="submit"
                  disabled={!isValid}
                  className={cn(
                    "px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                    isValid
                      ? "bg-foreground text-background hover:bg-foreground/85 hover:shadow-md"
                      : "bg-secondary text-muted-foreground cursor-not-allowed",
                  )}
                >
                  <svg className="w-4 h-4 inline mr-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                  获取 Releases
                </button>
              </div>
            </form>

            {/* Recent repos */}
            {recentRepos.length > 0 && !submittedUrl && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8"
              >
                <h3 className="text-sm font-semibold text-foreground/70 mb-3">
                  最近使用
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentRepos.map((r) => (
                    <button
                      key={r.url}
                      onClick={() => {
                        setRepoUrl(r.url);
                        setSubmittedUrl(
                          `https://api.github.com/repos/${r.owner}/${r.repo}/releases`,
                        );
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-card rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-secondary/70 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                      {r.owner}/{r.repo}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Results */}
          <AnimatePresence mode="wait">
            {submittedUrl ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <DownloadSection
                  githubApiUrl={submittedUrl}
                  requestTimeout={15000}
                />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto text-center py-16"
              >
                <div className="w-20 h-20 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Settings className="w-10 h-10 text-muted-foreground" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  输入仓库地址开始
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  支持 <code className="px-1.5 py-0.5 bg-secondary rounded text-foreground/70 text-sm">owner/repo</code> 格式或完整的 GitHub 链接。
                  <br />
                  我们会列出该仓库所有 Release 并提供多种镜像下载选项。
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
}
