"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star, GitBranch, Eye, Clock, Archive, Tag, Loader2, WifiOff, XCircle
} from "lucide-react";
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
      className="max-w-6xl mx-auto bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm p-6"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-wrap gap-2 mt-3">
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
      className="max-w-6xl mx-auto bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm"
      aria-label="仓库信息"
    >
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Star className="w-5 h-5 text-yellow-500" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {repoInfo.stargazers_count.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Stars</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <GitBranch className="w-5 h-5 text-blue-500" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {repoInfo.forks_count.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Forks</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Eye className="w-5 h-5 text-green-500" aria-hidden="true" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {repoInfo.watchers_count.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Watchers</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Clock className="w-5 h-5 text-purple-500" aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                {new Date(repoInfo.updated_at).toLocaleDateString("zh-CN")}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">最后更新</div>
            </div>
          </div>
        </div>

        {repoInfo.archived && (
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Archive className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">此仓库已归档，可能不再维护</span>
            </div>
          </div>
        )}

        {repoInfo.topics.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-slate-500" aria-hidden="true" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">主题标签：</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {repoInfo.topics.map((topic) => (
                <Badge key={topic} variant="secondary" className="px-3 py-1 text-xs bg-slate-100 dark:bg-slate-700">
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
        return { icon: Clock, title: "请求超时", message: "GitHub API 响应时间过长，请稍后重试" };
      case "error":
        return { icon: WifiOff, title: "网络错误", message: "无法连接到 GitHub API，请检查网络连接" };
      default:
        return { icon: XCircle, title: "获取失败", message: "无法获取版本信息，请稍后重试" };
    }
  };

  const { icon: Icon, title, message } = getErrorInfo();

  return (
    <Card className="border-red-200 dark:border-red-800 bg-red-50/80 dark:bg-red-900/10">
      <CardContent className="py-16 text-center">
        <Icon className="w-12 h-12 mx-auto text-red-500 dark:text-red-400 mb-4" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">{title}</h3>
        <p className="text-red-600 dark:text-red-400 mb-4">{message}</p>
        <Button variant="outline" onClick={onRetry} className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
  const [releases, setReleases] = useState<ParsedRelease[]>([]);
  const [repoInfo, setRepoInfo] = useState<GitHubRepoInfo | null>(null);
  const [repoStatus, setRepoStatus] = useState<RequestStatus>("idle");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<'semantic' | 'releaseDate' | 'downloadCount'>('semantic');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [displayedCount, setDisplayedCount] = useState(itemsPerPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allReleases, setAllReleases] = useState<ParsedRelease[]>([]);

  // 获取仓库信息
  const fetchRepoInfo = async () => {
    const repoUrlMatch = githubApiUrl.match(/repos\/([^\/]+)\/([^\/]+)/);
    if (!repoUrlMatch) return;

    try {
      const res = await fetch(`https://api.github.com/repos/${repoUrlMatch[1]}/${repoUrlMatch[2]}`, {
        signal: AbortSignal.timeout(requestTimeout),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data: GitHubRepoInfo = await res.json();
      setRepoInfo(data);
      setRepoStatus("success");
    } catch {
      setRepoStatus("error");
    }
  };

  // 获取发布版本
  const fetchReleases = async () => {
    try {
      setLoading(true);
      setRepoStatus("loading");

      // 并行获取仓库信息和发布版本
      await Promise.all([fetchRepoInfo(), fetchReleasesData()]);
    } catch {
      toast({ title: '获取版本信息失败', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const fetchReleasesData = async (page: number = 1) => {
    try {
      // GitHub API 默认只返回30条数据，需要添加 per_page 参数
      const apiUrl = githubApiUrl.includes('?')
        ? `${githubApiUrl}&per_page=100&page=${page}`
        : `${githubApiUrl}?per_page=100&page=${page}`;

      const res = await fetch(apiUrl, {
        signal: AbortSignal.timeout(requestTimeout),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data: GitHubRelease[] = await res.json();

      const parsed: ParsedRelease[] = data.map(r => {
        const files = r.assets.map(a => ({
          name: a.name,
          downloadUrl: a.browser_download_url,
          downloadCount: a.download_count,
        }));
        return {
          name: r.name || r.tag_name,
          version: r.tag_name,
          mcVersion: r.tag_name.match(/^(\d+\.\d+(\.\d+)?)/)?.[1] ?? 'Unknown',
          releaseDate: new Date(r.published_at).toLocaleDateString('zh-CN'),
          isPrerelease: r.prerelease,
          isLatest: false,
          downloadCount: files.reduce((s, f) => s + f.downloadCount, 0),
          files,
          changelog: r.body || '暂无更新日志。',
        };
      });

      // 如果是第一页，标记最新版本
      if (page === 1 && parsed.length > 0) {
        const stableReleases = parsed.filter(r => !r.isPrerelease);
        if (stableReleases.length > 0) {
          stableReleases.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))[0].isLatest = true;
        } else {
          parsed.sort((a, b) => b.releaseDate.localeCompare(a.releaseDate))[0].isLatest = true;
        }
      }

      // 更新数据
      if (page === 1) {
        setAllReleases(parsed);
        setReleases(parsed);
      } else {
        setAllReleases(prev => [...prev, ...parsed]);
        setReleases(prev => [...prev, ...parsed]);
      }

      // 判断是否还有更多数据
      setHasMore(parsed.length === 100);

      return parsed;
    } catch {
      throw new Error('Failed to fetch releases');
    }
  };

  // 加载更多数据
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = Math.floor(allReleases.length / 100) + 1;
      await fetchReleasesData(nextPage);
      setDisplayedCount(prev => prev + itemsPerPage);
    } catch {
      toast({ title: '加载更多失败', variant: 'destructive' });
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchReleases();
  }, [githubApiUrl]);

  const filtered = useReleaseFilter(allReleases, search, sortBy, sortOrder);

  // 加载状态
  if (loading) {
    return (
      <section className="space-y-6" aria-label="下载资源区域">
        {/* 标题区域 */}
        <header className="text-center space-y-3">
          <h2 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-blue-800 dark:from-slate-100 dark:to-blue-400 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {description}
          </p>
        </header>

        {/* 仓库信息骨架屏 */}
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

        {/* 工具栏骨架屏 */}
        <Card className="p-4 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Skeleton className="w-full h-12 rounded-lg" />
              </div>
              <Button variant="outline" disabled className="lg:w-auto">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                加载中...
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">排序：</span>
              {['版本号', '发布日期', '下载量'].map((label) => (
                <Skeleton key={label} className="h-9 w-20 rounded-lg" />
              ))}
            </div>
          </div>
        </Card>

        {/* 版本列表骨架屏 */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-slate-200/80 dark:border-slate-700/80">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <Skeleton className="w-16 h-16 rounded-xl" />
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
                  <Skeleton className="h-8 w-full mt-4" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  // 错误状态
  if (repoStatus === "error" && releases.length === 0) {
    return <ErrorState status={repoStatus} onRetry={fetchReleases} />;
  }

  return (
    <section className="space-y-6" aria-label="下载资源区域">
      {/* 标题区域 */}
      <header className="text-center space-y-3">
        <h2 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-blue-800 dark:from-slate-100 dark:to-blue-400 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {description}
        </p>
      </header>

      {/* 仓库信息卡片 */}
      {repoInfo && <RepoInfoCard repoInfo={repoInfo} />}

      {/* 工具栏 */}
      <Card className="p-4 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md border-slate-200/80 dark:border-slate-700/80">
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

      {/* 版本列表 */}
      <div className="space-y-4">
        <InfiniteReleaseGrid
          list={filtered.slice(0, displayedCount)}
          hasMore={hasMore && filtered.length > displayedCount}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          initialLoadCount={itemsPerPage}
        />
      </div>

      {/* 镜像说明 */}
      <MirrorFooter />
    </section>
  );
}

// 保持原有导出名称兼容
export { DownloadSectionLauncher as DownloadSection };