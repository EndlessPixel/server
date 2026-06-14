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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// ============ 类型定义 ============

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
  prerelease: boolean;
  assets: Array<{
    name: string;
    download_count: number;
    browser_download_url: string;
  }>;
}

export interface ParsedRelease {
  name: string;
  version: string;
  mcVersion: string;
  releaseDate: string;
  isPrerelease: boolean;
  isLatest: boolean;
  downloadCount: number;
  files: Array<{
    name: string;
    downloadUrl: string;
    downloadCount: number;
  }>;
  changelog: string;
  branch?: "main" | "real";
  tags?: string[];
}

export interface MirrorConfig {
  tag: string;
  url: string;
  tip: string;
  recommended?: boolean;
}

// 默认镜像配置
export const DEFAULT_MIRRORS: MirrorConfig[] = [
  {
    tag: "Cloudflare",
    url: "https://gh-proxy.org/",
    tip: "推荐",
    recommended: true,
  },
  {
    tag: "Fastly",
    url: "https://cdn.gh-proxy.org/",
    tip: "推荐",
    recommended: true,
  },
  {
    tag: "Edgeone",
    url: "https://edgeone.gh-proxy.org/",
    tip: "推荐",
    recommended: true,
  },
  { tag: "Jasonzeng", url: "https://gh.xmly.dev/", tip: "大文件慎用" },
  { tag: "香港", url: "https://hk.gh-proxy.org/", tip: "香港节点" },
];

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

interface PaginationProps {
  total: number;
  current: number;
  onPage: (p: number) => void;
  className?: string;
}

export function Pagination({
  total,
  current,
  onPage,
  className = "",
}: PaginationProps) {
  if (total <= 1) return null;

  const delta = 2;
  const left = Math.max(1, current - delta);
  const right = Math.min(total, current + delta);
  const pages: (number | string)[] = [];

  if (left > 1) pages.push(1, "...");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total) pages.push("...", total);

  return (
    <nav
      className={`flex justify-center items-center gap-2 pt-4 ${className}`}
      role="navigation"
      aria-label="分页导航"
    >
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPage(Math.max(1, current - 1))}
        disabled={current === 1}
        aria-label="上一页"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </Button>

      {pages.map((p, i) =>
        typeof p === "number" ? (
          <Button
            key={i}
            size="sm"
            variant={p === current ? "default" : "outline"}
            onClick={() => onPage(p)}
            aria-label={`第 ${p} 页`}
            aria-current={p === current ? "page" : undefined}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {p}
          </Button>
        ) : (
          <span
            key={i}
            className="px-2 text-muted-foreground"
            aria-hidden="true"
          >
            ...
          </span>
        ),
      )}

      <Button
        size="sm"
        variant="outline"
        onClick={() => onPage(Math.min(total, current + 1))}
        disabled={current === total}
        aria-label="下一页"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}

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
  // 根据文件扩展名判断文件类型
  const getFileType = (name: string) => {
    if (name.endsWith(".mrpack") || name.endsWith(".zip")) return "modpack";
    if (name.endsWith(".exe") || name.endsWith(".msi")) return "installer";
    if (name.endsWith(".jar")) return "jar";
    if (name.endsWith(".deb") || name.endsWith(".rpm")) return "linux";
    if (name.endsWith(".dmg") || name.endsWith(".app")) return "mac";
    return "other";
  };

  const fileType = getFileType(file.name);
  const fileTypeColors: Record<string, string> = {
    modpack: "text-blue-600",
    installer: "text-green-600",
    jar: "text-purple-600",
    linux: "text-orange-600",
    mac: "text-pink-600",
    other: "text-slate-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Download
            className={`w-4 h-4 ${fileTypeColors[fileType]} shrink-0`}
            aria-hidden="true"
          />
          <span
            className="font-medium text-sm truncate text-slate-900 dark:text-white"
            title={file.name}
          >
            {file.name}
          </span>
        </div>
        <Badge variant="secondary" className="text-xs shrink-0">
          {file.downloadCount.toLocaleString()} 次下载
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {showOfficial && (
          <Button
            size="sm"
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <a
              href={file.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`从官方下载 ${file.name}`}
            >
              <Download className="w-3 h-3 mr-1" aria-hidden="true" />
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
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
              m.recommended && "border-green-300 dark:border-green-700",
            )}
          >
            <a
              href={getMirrorUrl(m.url, file.downloadUrl)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`从 ${m.tag} 镜像下载 ${file.name}`}
            >
              <ExternalLink className="w-3 h-3 mr-1" aria-hidden="true" />
              {m.tag}
              {m.recommended && (
                <span className="ml-1 text-green-500 text-xs">★</span>
              )}
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
  const typeLabel = release.isPrerelease
    ? "预发布版"
    : isMain
      ? "正式版"
      : "Real版";
  const hasManyFiles = release.files.length > 4;
  const displayFiles = filesExpanded
    ? release.files
    : release.files.slice(0, 4);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg",
        release.isLatest
          ? "border-2 border-green-300 dark:border-green-700 bg-green-50/80 dark:bg-green-900/10"
          : "bg-white/90 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80",
      )}
    >
      {release.isLatest && (
        <Badge
          className="absolute top-4 right-4 bg-green-600 text-white px-4 py-1.5 shadow-md flex items-center gap-1.5 rounded-lg"
          aria-label="最新版本"
        >
          <Zap className="w-3.5 h-3.5" aria-hidden="true" />
          最新版本
        </Badge>
      )}

      <div className="p-6">
        {/* 标题区域 */}
        <header className="flex items-start gap-4 mb-4">
          <div
            className={cn(
              "p-3 rounded-xl text-white shrink-0",
              isMain ? "bg-blue-600" : "bg-purple-600",
            )}
            aria-hidden="true"
          >
            <Download className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3
                className="text-lg font-bold truncate text-slate-900 dark:text-white"
                title={release.name}
              >
                {release.name}
              </h3>
              <Badge
                className={cn(
                  release.isPrerelease
                    ? "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300"
                    : isMain
                      ? "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300",
                )}
              >
                {typeLabel}
              </Badge>
              {showBranchBadge && (
                <Badge variant="outline" className="text-xs">
                  {isMain ? "主分支" : "Real 分支"}
                </Badge>
              )}
            </div>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Rocket className="w-3.5 h-3.5" aria-hidden="true" />
                MC版本:{" "}
                <strong className="text-slate-900 dark:text-white">
                  {release.mcVersion}
                </strong>
              </span>
              <span className="text-slate-400" aria-hidden="true">
                •
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                {release.releaseDate}
              </span>
              <span className="text-slate-400" aria-hidden="true">
                •
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                {release.downloadCount.toLocaleString()} 次下载
              </span>
            </div>
          </div>
        </header>

        {/* 文件列表 */}
        <section aria-label="下载文件列表">
          <div className="grid gap-3 md:grid-cols-2 mb-4">
            <AnimatePresence mode="popLayout">
              {displayFiles.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <FileBlock
                    file={f}
                    mirrors={mirrors}
                    getMirrorUrl={getMirrorUrl}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasManyFiles && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilesExpanded((v) => !v)}
              className="w-full gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-expanded={filesExpanded}
              aria-label={filesExpanded ? "收起更多文件" : "展开更多文件"}
            >
              {filesExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  收起更多文件 ({release.files.length - 4} 个)
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" aria-hidden="true" />
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
            className="w-full gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-expanded={open}
            aria-controls={`changelog-${release.version}`}
          >
            {open ? (
              <>
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
                隐藏更新日志
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
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
                  className="rounded-xl bg-slate-100/80 dark:bg-slate-900/40 p-4 prose prose-sm dark:prose-invert max-w-none overflow-auto max-h-60 border border-slate-200/50 dark:border-slate-700/50"
                  role="region"
                  aria-label="更新日志内容"
                >
                  <ReactMarkdown
                    rehypePlugins={[rehypeRaw]}
                    remarkPlugins={[remarkGfm]}
                  >
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
  mirrors = ["gh-proxy.org", "gh.xmly.dev"],
  className = "",
}: MirrorFooterProps) {
  return (
    <footer
      className={`text-center text-sm text-slate-600 dark:text-slate-400 p-6 rounded-xl bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 ${className}`}
      role="contentinfo"
      aria-label="镜像服务说明"
    >
      <p className="mb-3 font-medium">加速下载由以下服务提供：</p>
      <div className="flex flex-wrap justify-center gap-3">
        {mirrors.map((d) => (
          <a
            key={d}
            href={`https://${d}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label={`访问 ${d}`}
          >
            {d}
          </a>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
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
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder:text-slate-400"
            aria-label="搜索版本"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
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
            className="lg:w-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="刷新数据"
          >
            {loading ? (
              <>
                <span
                  className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2"
                  aria-hidden="true"
                />
                加载中...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
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
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
          排序：
        </span>
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
              className="gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={`按${opt.label}排序`}
              aria-pressed={isActive}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
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

export function EmptyState({
  message = "暂无匹配版本",
  className = "",
}: EmptyStateProps) {
  return (
    <Card
      className={`border-dashed border-slate-300 dark:border-slate-600 ${className}`}
    >
      <CardContent className="py-16 text-center">
        <div className="text-slate-400 dark:text-slate-500 mb-2">
          <svg
            className="w-12 h-12 mx-auto"
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
        <p className="text-slate-600 dark:text-slate-400">{message}</p>
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
      className={`flex flex-col items-center justify-center py-16 gap-4 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
        aria-hidden="true"
      />
      <p className="text-slate-600 dark:text-slate-400">{message}</p>
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

  // 设置无限滚动观察器
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
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-slate-500">加载更多版本...</span>
            </div>
          ) : (
            <button
              onClick={onLoadMore}
              className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400 transition-colors"
            >
              加载更多版本
            </button>
          )}
        </div>
      )}

      {/* 已加载全部提示 */}
      {!hasMore && list.length > 0 && (
        <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-500">
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
          return (
            m *
            (new Date(a.releaseDate).getTime() -
              new Date(b.releaseDate).getTime())
          );
        }
        return m * (a.downloadCount - b.downloadCount);
      });
    return list;
  }, [releases, activeBranch, search, sortBy, sortOrder]);
}

export function usePagination(
  filtered: ParsedRelease[],
  page: number,
  perPage: number,
) {
  const total = Math.ceil(filtered.length / perPage);
  const paged = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage],
  );
  return { total, paged };
}
