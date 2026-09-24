"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitBranch, Eye, Clock, Archive, Tag, Loader2, WifiOff, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Toolbar,
  MirrorFooter,
  useReleaseFilter,
  InfiniteReleaseGrid,
  GitHubRelease,
  ParsedRelease,
} from "@/components/download-base";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { githubProxyUrl, parseGitHubRelease } from "@/lib/github";

// ============ 类型定义 ============

interface GitHubRepoInfo {
  description: string;
  stargazers_count: number;
  archived: boolean;
  topics: string[];
  updated_at: string;
  language: string;
  forks_count: number;
  watchers_count: number;
}

type RequestStatus = "idle" | "loading" | "success" | "error" | "timeout";

// ============ Props ============

interface DownloadSectionLauncherProps {
  githubApiUrl: string;
  title?: string;
  description?: string;
  itemsPerPage?: number;
  requestTimeout?: number;
}

// ============ 仓库信息卡片骨架屏 ============

function RepoInfoCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-6xl rounded-2xl bg-card p-6 shadow-sm backdrop-blur-md"
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl bg-secondary p-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Skeleton className="h-4 w-32" />
        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============ 仓库信息卡片 ============

function RepoInfoCard({ repoInfo }: { repoInfo: GitHubRepoInfo }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-6xl rounded-2xl bg-card shadow-sm"
      aria-label="仓库信息"
    >
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
            <div className="rounded-full bg-background p-2">
              <Star className="h-5 w-5 text-foreground/60" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">
                {repoInfo.stargazers_count.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Stars</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
            <div className="rounded-full bg-background p-2">
              <GitBranch className="h-5 w-5 text-foreground/60" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">
                {repoInfo.forks_count.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Forks</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
            <div className="rounded-full bg-background p-2">
              <Eye className="h-5 w-5 text-foreground/60" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">
                {repoInfo.watchers_count.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Watchers</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
            <div className="rounded-full bg-background p-2">
              <Clock className="h-5 w-5 text-foreground/60" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">
                {new Date(repoInfo.updated_at).toLocaleDateString("zh-CN")}
              </div>
              <div className="text-xs text-muted-foreground">最后更新</div>
            </div>
          </div>
        </div>

        {repoInfo.archived && (
          <div className="mt-6 rounded-xl bg-secondary p-4">
            <div className="flex items-center gap-2 text-foreground/70">
              <Archive className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium">此仓库已归档，可能不再维护</span>
            </div>
          </div>
        )}

        {repoInfo.topics.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground/70">主题标签：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {repoInfo.topics.map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </motion.article>
  );
}

// ============ 错误状态组件 ============

function ErrorState({ status, onRetry }: { status: RequestStatus; onRetry: () => void }) {
  const getErrorInfo = () => {
    switch (status) {
      case "timeout":
        return {
          icon: Clock,
          title: "请求超时",
          message: "GitHub API 响应时间过长，请稍后重试",
        };
      case "error":
        return {
          icon: WifiOff,
          title: "网络错误",
          message: "无法连接到 GitHub API，请检查网络连接",
        };
      default:
        return {
          icon: XCircle,
          title: "获取失败",
          message: "无法获取版本信息，请稍后重试",
        };
    }
  };

  const { icon: Icon, title, message } = getErrorInfo();

  return (
    <Card className="bg-destructive/5">
      <CardContent className="py-16 text-center">
        <Icon className="mx-auto mb-4 h-12 w-12 text-destructive/60" aria-hidden="true" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
        <p className="mb-4 text-muted-foreground">{message}</p>
        <Button
          variant="outline"
          onClick={onRetry}
          className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          重试
        </Button>
      </CardContent>
    </Card>
  );
}

// ============ 主组件 ============

export function DownloadSectionLauncher({
  githubApiUrl,
  title = "下载资源",
  description = "选择适合你的版本进行下载",
  itemsPerPage = 20,
  requestTimeout = 15000,
}: DownloadSectionLauncherProps) {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [allReleases, setAllReleases] = useState<ParsedRelease[]>([]);
  const [repoInfo, setRepoInfo] = useState<GitHubRepoInfo | null>(null);
  const [repoStatus, setRepoStatus] = useState<RequestStatus>("idle");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"semantic" | "releaseDate" | "downloadCount">("semantic");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // 获取仓库信息（经 /api/gh_api 代理，带 GH_TOKEN 认证，避免限流）
  const fetchRepoInfo = useCallback(async () => {
    const repoUrlMatch = githubApiUrl.match(/repos\/([^/]+)\/([^/]+)/);
    if (!repoUrlMatch) return;

    const target = `https://api.github.com/repos/${repoUrlMatch[1]}/${repoUrlMatch[2]}`;
    try {
      const res = await fetch(githubProxyUrl(target), {
        signal: AbortSignal.timeout(requestTimeout),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data: GitHubRepoInfo = await res.json();
      setRepoInfo(data);
      setRepoStatus("success");
    } catch {
      setRepoStatus("error");
    }
  }, [githubApiUrl, requestTimeout]);

  // 经 /api/gh_api 代理单次拉取一页，限流（403）时退避重试一次
  const fetchReleasesPage = useCallback(
    async (page: number): Promise<ParsedRelease[]> => {
      const baseUrl = githubApiUrl.includes("?")
        ? `${githubApiUrl}&per_page=100&page=${page}`
        : `${githubApiUrl}?per_page=100&page=${page}`;

      const repoMatch = githubApiUrl.match(/repos\/([^/]+)\/([^/]+)/);
      const target = baseUrl.startsWith("http")
        ? baseUrl
        : `https://api.github.com/repos/${repoMatch?.[1]}/${repoMatch?.[2]}/releases?per_page=100&page=${page}`;

      const proxyUrl = githubProxyUrl(target);

      for (let attempt = 0; attempt < 2; attempt += 1) {
        const res = await fetch(proxyUrl, {
          signal: AbortSignal.timeout(requestTimeout),
        });
        if (res.ok) {
          const data: GitHubRelease[] = await res.json();
          return data.map(parseGitHubRelease);
        }
        if (res.status === 403 && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
        throw new Error(String(res.status));
      }
      throw new Error("Failed to fetch releases");
    },
    [githubApiUrl, requestTimeout],
  );

  // 拉取发布版本：首屏自动连续翻页直到拉全（上限 10 页 / 1000 条）
  const fetchReleasesData = useCallback(
    async (startPage = 1): Promise<ParsedRelease[]> => {
      const MAX_PAGES = 10;
      let collected: ParsedRelease[] = [];
      let page = startPage;
      let more = true;

      while (more && page <= MAX_PAGES) {
        const parsed = await fetchReleasesPage(page);
        collected = collected.concat(parsed);
        if (parsed.length < 100) {
          more = false;
        } else {
          page += 1;
        }
      }

      if (collected.length > 0) {
        const stableReleases = collected.filter((r) => !r.isPrerelease);
        const anchor = stableReleases.length > 0 ? stableReleases : collected;
        anchor.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))[0].isLatest = true;
      }

      if (startPage === 1) {
        setAllReleases(collected);
      } else {
        setAllReleases((prev) => [...prev, ...collected]);
      }

      setHasMore(page <= MAX_PAGES && more);

      return collected;
    },
    [fetchReleasesPage],
  );

  // 获取发布版本
  const fetchReleases = useCallback(async () => {
    try {
      setLoading(true);
      setRepoStatus("loading");

      // 并行获取仓库信息和发布版本
      await Promise.all([fetchRepoInfo(), fetchReleasesData()]);
    } catch {
      toast({ title: "获取版本信息失败", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [fetchRepoInfo, fetchReleasesData, toast]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = Math.floor(allReleases.length / 100) + 1;
      await fetchReleasesData(nextPage);
      setDisplayedCount((prev) => prev + itemsPerPage);
    } catch {
      toast({ title: "加载更多失败", variant: "destructive" });
    } finally {
      setIsLoadingMore(false);
    }
  }, [allReleases.length, fetchReleasesData, hasMore, isLoadingMore, itemsPerPage, toast]);

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  const filtered = useReleaseFilter(allReleases, search, sortBy, sortOrder);

  // 加载状态
  if (loading) {
    return (
      <section className="space-y-6" aria-label="下载资源区域">
        <header className="space-y-3 text-center">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">{description}</p>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key="repo-skeleton"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <RepoInfoCardSkeleton />
          </motion.div>
        </AnimatePresence>

        <Card className="bg-card p-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <Button variant="outline" disabled className="lg:w-auto">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                加载中...
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-foreground/70">排序：</span>
              {["版本号", "发布日期", "下载量"].map((label) => (
                <Skeleton key={label} className="h-9 w-20 rounded-lg" />
              ))}
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start gap-4">
                    <Skeleton className="h-16 w-16 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 2 }).map((_, j) => (
                      <Skeleton key={j} className="h-16 rounded-xl" />
                    ))}
                  </div>
                  <Skeleton className="mt-4 h-8 w-full" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  if (repoStatus === "error" && allReleases.length === 0) {
    return <ErrorState status={repoStatus} onRetry={fetchReleases} />;
  }

  return (
    <section className="space-y-6" aria-label="下载资源区域">
      <header className="space-y-3 text-center">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">{description}</p>
      </header>

      {repoInfo && <RepoInfoCard repoInfo={repoInfo} />}

      <Card className="bg-card p-4">
        <Toolbar
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onRefresh={fetchReleases}
          loading={loading}
          placeholder="搜索版本号、名称..."
        />
      </Card>

      <div className="space-y-4">
        <InfiniteReleaseGrid
          list={filtered.slice(0, displayedCount)}
          hasMore={hasMore && filtered.length > displayedCount}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          initialLoadCount={itemsPerPage}
        />
      </div>

      <MirrorFooter />
    </section>
  );
}

export { DownloadSectionLauncher as DownloadSection };
