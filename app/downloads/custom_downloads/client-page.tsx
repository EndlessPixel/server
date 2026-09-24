"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DownloadSection } from "@/components/download-section-launcher";
import { ArrowLeft, Search, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CustomDownloadsPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [recentRepos, setRecentRepos] = useState<{ owner: string; repo: string; url: string }[]>(
    [],
  );

  useEffect(() => {
    try {
      const stored = localStorage.getItem("custom-downloads-recent");
      if (stored) {
        setRecentRepos(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const saveRecent = (owner: string, repo: string, url: string) => {
    const updated = [{ owner, repo, url }, ...recentRepos.filter((r) => r.url !== url)].slice(0, 5);
    setRecentRepos(updated);
    localStorage.setItem("custom-downloads-recent", JSON.stringify(updated));
  };

  const parseRepo = (input: string): { owner: string; repo: string } | null => {
    const trimmed = input.trim();
    // owner/repo
    const shortMatch = trimmed.match(/^([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)$/);
    if (shortMatch) return { owner: shortMatch[1], repo: shortMatch[2] };
    // full GitHub URL
    const urlMatch = trimmed.match(/github\.com\/([a-zA-Z0-9._-]+)\/([a-zA-Z0-9._-]+)/);
    if (urlMatch) return { owner: urlMatch[1], repo: urlMatch[2] };
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseRepo(repoUrl);
    if (parsed) {
      saveRecent(parsed.owner, parsed.repo, repoUrl);
      setSubmittedUrl(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/releases`);
    }
  };

  const parsed = parseRepo(repoUrl);
  const isValid = parsed !== null;

  return (
    <div className="min-h-screen bg-background">
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <Link
              href="/downloads"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="返回下载页面"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="text-sm font-medium">返回</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              自定义 GitHub 下载
            </h1>
            <p className="mx-auto max-w-2xl leading-relaxed text-muted-foreground">
              输入 GitHub 仓库地址，获取 Release 文件并选择合适的镜像下载
            </p>
          </motion.div>

          {/* URL Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mx-auto mb-12 max-w-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <label htmlFor="repo-input" className="sr-only">
                  输入 GitHub 仓库地址
                </label>
                <div
                  className={cn(
                    "absolute top-1/2 left-4 -translate-y-1/2 transition-colors",
                    inputFocused ? "text-foreground" : "text-muted-foreground",
                  )}
                  aria-hidden="true"
                >
                  <Search className="h-5 w-5" />
                </div>
                <input
                  id="repo-input"
                  type="text"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="输入 GitHub 仓库地址或 owner/repo..."
                  className="w-full rounded-2xl bg-secondary py-4 pr-4 pl-12 text-base text-foreground transition-all placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-ring/30 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  例如：
                  <code className="rounded-lg bg-secondary px-2 py-1 text-xs text-foreground/70">
                    EndlessPixel/EndlessLauncher
                  </code>
                </div>
                <button
                  type="submit"
                  disabled={!isValid}
                  className={cn(
                    "rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                    isValid
                      ? "bg-foreground text-background hover:bg-foreground/85 hover:shadow-md"
                      : "cursor-not-allowed bg-secondary text-muted-foreground",
                  )}
                >
                  <svg
                    className="mr-2 inline h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
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
                <h3 className="mb-3 text-sm font-semibold text-foreground/70">最近使用</h3>
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
                      className="flex items-center gap-2 rounded-xl bg-card px-3 py-2 text-sm text-foreground/70 transition-all hover:bg-secondary/70 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                      </svg>
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
                <DownloadSection githubApiUrl={submittedUrl} requestTimeout={15000} />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mx-auto max-w-2xl py-16 text-center"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
                  <Settings className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">输入仓库地址开始</h3>
                <p className="leading-relaxed text-muted-foreground">
                  支持{" "}
                  <code className="rounded bg-secondary px-1.5 py-0.5 text-sm text-foreground/70">
                    owner/repo
                  </code>{" "}
                  格式或完整的 GitHub 链接。
                  <br />
                  我们会列出该仓库所有 Release 并提供多种镜像下载选项。
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
