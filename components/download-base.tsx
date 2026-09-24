"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap,
  Rocket,
  Calendar,
  TrendingUp,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MirrorConfig, DEFAULT_MIRRORS, DEFAULT_MIRROR_DOMAINS } from "@/lib/mirrors";
import type { ParsedRelease } from "@/lib/github";

// ============ 类型定义 ============

// Release 数据模型统一维护在 lib/github，这里仅做再导出以保持既有引用不变
export type { GitHubRelease, ParsedRelease, ReleaseFile } from "@/lib/github";

// ============ 版本比较函数 ============

export const compareSemanticVersions = (v1: string, v2: string): number => {
  const parse = (v: string) => {
    const digits = v.match(/(\d+\.\d+(\.\d+)?)/g) || [];
    const mcParts = digits[0]?.split(".").map(Number) || [0];

    let mcScore = 0;
    if (mcParts[0] === 1) mcScore = 1;
    else if (mcParts.length === 2) mcScore = 2;
    else if (mcParts.length === 3) mcScore = 3;

    const isA = /-a\d+/.test(v);
    const isB = /-b\d+/.test(v);
    const type = isA ? 0 : isB ? 1 : 2;

    const numMatch = v.match(/-[ab]?(\d+)/) || [];
    const subNum = parseInt(numMatch[1] || "0");

    const lastParts = digits[digits.length - 1]?.split(".").map(Number) || [0];

    return { mcScore, mcParts, type, subNum, lastParts };
  };

  const a = parse(v1);
  const b = parse(v2);

  if (a.mcScore !== b.mcScore) return a.mcScore - b.mcScore;

  for (let i = 0; i < Math.max(a.mcParts.length, b.mcParts.length); i++) {
    const an = a.mcParts[i] ?? 0;
    const bn = b.mcParts[i] ?? 0;
    if (an !== bn) return an - bn;
  }

  if (a.type !== b.type) return a.type - b.type;
  if (a.subNum !== b.subNum) return a.subNum - b.subNum;

  for (let i = 0; i < Math.max(a.lastParts.length, b.lastParts.length); i++) {
    const an = a.lastParts[i] ?? 0;
    const bn = b.lastParts[i] ?? 0;
    if (an !== bn) return an - bn;
  }

  return 0;
};

// ============ 分页组件 ============

// 统一实现见 components/ui/pagination，这里再导出以保持既有引用不变
export { Pagination } from "@/components/ui/pagination";

// ============ 文件下载块组件 ============

interface FileBlockProps {
  file: {
    name: string;
    downloadUrl: string;
    downloadCount: number;
  };
  mirrors?: MirrorConfig[];
  getMirrorUrl?: (host: string, originalUrl: string) => string;
  showOfficial?: boolean;
}

export function FileBlock({
  file,
  mirrors = DEFAULT_MIRRORS,
  getMirrorUrl = (host, url) => `${host}${url}`,
  showOfficial = true,
}: FileBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-secondary/50 p-4 transition-all duration-300 hover:shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground" title={file.name}>
            {file.name}
          </span>
        </div>
        <Badge variant="secondary" className="shrink-0 text-xs">
          {file.downloadCount.toLocaleString()} 次下载
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {showOfficial && (
          <Button
            size="sm"
            asChild
            className="bg-foreground text-background hover:bg-foreground/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          >
            <a
              href={file.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`从官方下载 ${file.name}`}
            >
              <Download className="mr-1 h-3 w-3" aria-hidden="true" />
              官方
            </a>
          </Button>
        )}

        {mirrors.map((m) => (
          <Button
            key={m.tag}
            size="sm"
            variant="outline"
            asChild
            title={m.tip}
            className={cn(
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
              m.recommended && "bg-foreground/5",
            )}
          >
            <a
              href={getMirrorUrl(m.url, file.downloadUrl)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`从 ${m.tag} 镜像下载 ${file.name}`}
            >
              <ExternalLink className="mr-1 h-3 w-3" aria-hidden="true" />
              {m.tag}
              {m.recommended && <span className="ml-1 text-xs text-foreground/50">★</span>}
            </a>
          </Button>
        ))}
      </div>
    </motion.div>
  );
}

// ============ 发布版本卡片组件 ============

interface ReleaseCardProps {
  release: ParsedRelease;
  mirrors?: MirrorConfig[];
  getMirrorUrl?: (host: string, originalUrl: string) => string;
  defaultExpanded?: boolean;
  showBranchBadge?: boolean;
}

export function ReleaseCard({
  release,
  mirrors = DEFAULT_MIRRORS,
  getMirrorUrl = (host, url) => `${host}${url}`,
  defaultExpanded = false,
  showBranchBadge = false,
}: ReleaseCardProps) {
  const [open, setOpen] = useState(false);
  const [filesExpanded, setFilesExpanded] = useState(defaultExpanded);

  const isMain = release.branch === "main" || !release.branch;
  const typeLabel = release.isPrerelease ? "预发布版" : isMain ? "正式版" : "Real版";
  const hasManyFiles = release.files.length > 4;
  const displayFiles = filesExpanded ? release.files : release.files.slice(0, 4);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-md",
        release.isLatest ? "bg-foreground/5" : "bg-card",
      )}
    >
      {release.isLatest && (
        <Badge
          className="absolute top-4 right-4 flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-1.5 text-background shadow-sm"
          aria-label="最新版本"
        >
          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          最新版本
        </Badge>
      )}

      <div className="p-6">
        {/* 标题区域 */}
        <header className="mb-4 flex items-start gap-4">
          <div
            className={cn(
              "shrink-0 rounded-xl p-3 text-background",
              isMain ? "bg-foreground" : "bg-foreground/80",
            )}
            aria-hidden="true"
          >
            <Download className="h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-bold text-foreground" title={release.name}>
                {release.name}
              </h3>
              <Badge variant="secondary">{typeLabel}</Badge>
              {showBranchBadge && (
                <Badge variant="outline" className="text-xs">
                  {isMain ? "主分支" : "Real 分支"}
                </Badge>
              )}
            </div>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Rocket className="h-3.5 w-3.5" aria-hidden="true" />
                MC版本: <strong className="text-foreground">{release.mcVersion}</strong>
              </span>
              <span className="text-foreground/20" aria-hidden="true">
                •
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {release.releaseDate}
              </span>
              <span className="text-foreground/20" aria-hidden="true">
                •
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                {release.downloadCount.toLocaleString()} 次下载
              </span>
            </div>
          </div>
        </header>

        {/* 文件列表 */}
        <section aria-label="下载文件列表">
          <div className="mb-4 grid gap-3 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {displayFiles.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <FileBlock file={f} mirrors={mirrors} getMirrorUrl={getMirrorUrl} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasManyFiles && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilesExpanded((v) => !v)}
              className="w-full gap-2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              aria-expanded={filesExpanded}
              aria-label={filesExpanded ? "收起更多文件" : "展开更多文件"}
            >
              {filesExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                  收起更多文件 ({release.files.length - 4} 个)
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  展开更多文件 ({release.files.length - 4} 个)
                </>
              )}
            </Button>
          )}
        </section>

        {/* 更新日志 */}
        <footer className="mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen((v) => !v)}
            className="w-full gap-2 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            aria-expanded={open}
            aria-controls={`changelog-${release.version}`}
          >
            {open ? (
              <>
                <ChevronUp className="h-4 w-4" aria-hidden="true" />
                隐藏更新日志
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
                查看更新日志
              </>
            )}
          </Button>

          <AnimatePresence>
            {open && (
              <motion.div
                id={`changelog-${release.version}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 overflow-hidden"
              >
                <div
                  className="prose prose-sm dark:prose-invert max-h-60 max-w-none overflow-auto rounded-xl bg-secondary/50 p-4"
                  role="region"
                  aria-label="更新日志内容"
                >
                  <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                    {release.changelog || "暂无更新日志。"}
                  </ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </footer>
      </div>
    </motion.article>
  );
}

// ============ 镜像服务说明组件 ============

interface MirrorFooterProps {
  mirrors?: string[];
  className?: string;
}

export function MirrorFooter({
  mirrors = DEFAULT_MIRROR_DOMAINS,
  className = "",
}: MirrorFooterProps) {
  return (
    <footer
      className={`rounded-xl bg-secondary/30 p-6 text-center text-sm text-muted-foreground ${className}`}
      role="contentinfo"
      aria-label="镜像服务说明"
    >
      <p className="mb-3 font-medium text-foreground/80">加速下载由以下服务提供：</p>
      <div className="flex flex-wrap justify-center gap-3">
        {mirrors.map((d) => (
          <a
            key={d}
            href={`https://${d}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-foreground px-4 py-2 text-background transition-colors hover:bg-foreground/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            aria-label={`访问 ${d}`}
          >
            {d}
          </a>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground/70">
        镜像服务可加速 GitHub 文件下载，推荐中国大陆用户使用
      </p>
    </footer>
  );
}

// ============ 搜索和排序工具栏组件 ============

interface ToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: "semantic" | "releaseDate" | "downloadCount";
  onSortByChange: (value: "semantic" | "releaseDate" | "downloadCount") => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  onRefresh?: () => void;
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

export function Toolbar({
  search,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onRefresh,
  loading = false,
  placeholder = "搜索版本号、名称...",
  className = "",
}: ToolbarProps) {
  const sortOptions = [
    { key: "semantic", label: "版本号", icon: Rocket },
    { key: "releaseDate", label: "发布日期", icon: Calendar },
    { key: "downloadCount", label: "下载量", icon: TrendingUp },
  ] as const;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative flex-1">
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl bg-secondary py-3 pr-4 pl-10 text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-ring/30 focus:outline-none"
            aria-label="搜索版本"
          />
          <svg
            className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 lg:w-auto"
            aria-label="刷新数据"
          >
            {loading ? (
              <>
                <span
                  className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-foreground/30 border-t-transparent"
                  aria-hidden="true"
                />
                加载中...
              </>
            ) : (
              <>
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
                刷新
              </>
            )}
          </Button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-foreground/70">排序：</span>
        {sortOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = sortBy === opt.key;
          return (
            <Button
              key={opt.key}
              size="sm"
              variant={isActive ? "default" : "outline"}
              onClick={() => {
                if (isActive) {
                  onSortOrderChange(sortOrder === "desc" ? "asc" : "desc");
                } else {
                  onSortByChange(opt.key);
                  onSortOrderChange("desc");
                }
              }}
              className="gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              aria-label={`按${opt.label}排序`}
              aria-pressed={isActive}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {opt.label}
              {isActive && (
                <span className="ml-1" aria-hidden="true">
                  {sortOrder === "desc" ? "↓" : "↑"}
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

// ============ 空状态组件 ============

interface EmptyStateProps {
  message?: string;
  className?: string;
}

export function EmptyState({ message = "暂无匹配版本", className = "" }: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed border-foreground/8", className)}>
      <CardContent className="py-16 text-center">
        <div className="mb-2 text-muted-foreground">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

// ============ 加载状态组件 ============

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "正在加载 GitHub 数据...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground/50"
        aria-hidden="true"
      />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}

// ============ 发布版本列表组件 ============

interface ReleaseGridProps {
  list: ParsedRelease[];
  mirrors?: MirrorConfig[];
  getMirrorUrl?: (host: string, originalUrl: string) => string;
  showBranchBadge?: boolean;
  emptyMessage?: string;
}

export function ReleaseGrid({
  list,
  mirrors = DEFAULT_MIRRORS,
  getMirrorUrl = (host, url) => `${host}${url}`,
  showBranchBadge = false,
  emptyMessage = "暂无匹配版本",
}: ReleaseGridProps) {
  if (list.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="space-y-4" role="list" aria-label="版本列表">
      {list.map((r, i) => (
        <motion.div
          key={r.version}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          role="listitem"
        >
          <ReleaseCard
            release={r}
            mirrors={mirrors}
            getMirrorUrl={getMirrorUrl}
            showBranchBadge={showBranchBadge}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ============ 无限滚动发布版本列表组件 ============

interface InfiniteReleaseGridProps {
  list: ParsedRelease[];
  mirrors?: MirrorConfig[];
  getMirrorUrl?: (host: string, originalUrl: string) => string;
  showBranchBadge?: boolean;
  emptyMessage?: string;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  initialLoadCount?: number;
}

export function InfiniteReleaseGrid({
  list,
  mirrors = DEFAULT_MIRRORS,
  getMirrorUrl = (host, url) => `${host}${url}`,
  showBranchBadge = false,
  emptyMessage = "暂无匹配版本",
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  initialLoadCount = 10,
}: InfiniteReleaseGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || !onLoadMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { rootMargin: "100px" },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, onLoadMore]);

  if (list.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="space-y-4" role="list" aria-label="版本列表">
      {list.map((r, i) => (
        <motion.div
          key={r.version}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(i, initialLoadCount) * 0.05 }}
          role="listitem"
        >
          <ReleaseCard
            release={r}
            mirrors={mirrors}
            getMirrorUrl={getMirrorUrl}
            showBranchBadge={showBranchBadge}
          />
        </motion.div>
      ))}

      {/* 加载更多触发器 */}
      {hasMore && (
        <div ref={loadMoreRef} className="py-8 text-center">
          {isLoadingMore ? (
            <div className="flex items-center justify-center gap-3">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/30 border-t-transparent" />
              <span className="text-muted-foreground">加载更多版本...</span>
            </div>
          ) : (
            <button
              onClick={onLoadMore}
              className="cursor-pointer rounded-xl bg-secondary px-6 py-3 text-foreground/70 transition-colors hover:bg-secondary/70"
            >
              加载更多版本
            </button>
          )}
        </div>
      )}

      {/* 已加载全部提示 */}
      {!hasMore && list.length > 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          已加载全部 {list.length} 个版本
        </div>
      )}
    </div>
  );
}

// ============ Hooks ============

export function useReleaseFilter(
  releases: ParsedRelease[],
  search: string,
  sortBy: "semantic" | "releaseDate" | "downloadCount",
  sortOrder: "asc" | "desc",
  activeBranch?: "main" | "real",
) {
  return useMemo(() => {
    const list = releases
      .filter((r) => !activeBranch || r.branch === activeBranch)
      .filter((r) =>
        [r.name, r.version, r.mcVersion].some((v) =>
          v.toLowerCase().includes(search.toLowerCase()),
        ),
      )
      .sort((a, b) => {
        const m = sortOrder === "asc" ? 1 : -1;
        if (sortBy === "semantic") {
          return m * compareSemanticVersions(a.version, b.version);
        }
        if (sortBy === "releaseDate") {
          return m * (new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
        }
        return m * (a.downloadCount - b.downloadCount);
      });
    return list;
  }, [releases, activeBranch, search, sortBy, sortOrder]);
}

export function usePagination(filtered: ParsedRelease[], page: number, perPage: number) {
  const total = Math.ceil(filtered.length / perPage);
  const paged = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage],
  );
  return { total, paged };
}
