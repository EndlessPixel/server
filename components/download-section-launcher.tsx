"use client";

// 第一步：确保所有 import 顺序正确，React 只引入一次
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Download, Package, ChevronDown, ChevronUp, Loader2, ExternalLink,
  Star, Zap, ArrowUp, ArrowDown, Search, Filter, Archive, Tag, Eye, GitBranch, Clock,
  Rocket, Calendar, TrendingUp, ChevronLeft, ChevronRight, RefreshCw,
  AlertCircle, CheckCircle, XCircle, Clock as ClockIcon, WifiOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// ========== 类型定义（移到最前面，避免 Hooks 前有逻辑） ==========
interface LauncherMeta {
  id: string;
  name: string;
  description: string;
  githubRepo: string;
  category: string;
  tags: string[];
  icon?: string;
  featured?: boolean;
}

interface ParsedRelease {
  name: string
  version: string
  mcVersion: string
  releaseDate: string
  isPrerelease: boolean
  isLatest: boolean
  downloadCount: number
  files: Array<{
    name: string
    downloadUrl: string
    downloadCount: number
  }>
  changelog: string
  tags?: string[]
}

interface GitHubRelease {
  id: number
  tag_name: string
  name: string
  body: string
  published_at: string
  html_url: string
  prerelease: boolean
  assets: Array<{
    name: string
    download_count: number
    browser_download_url: string
  }>
}

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
interface RequestError {
  code?: number;
  message: string;
  type: "404" | "403" | "timeout" | "network" | "other";
}

interface DownloadSectionProps {
  githubApiUrl: string;
  title?: string;
  description?: string;
  showPrereleases?: boolean;
  itemsPerPage?: number;
  launcherMeta?: LauncherMeta;
  requestTimeout?: number;
}

// ========== 自定义 Hooks（抽离逻辑，避免组件内嵌套 Hooks） ==========
// 抽离分页参数处理逻辑为自定义 Hook
const usePaginationParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // 初始化页码
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page > 0) {
        setCurrentPage(page);
      }
    }
  }, [searchParams]);

  // 封装 URL 参数更新逻辑
  const updateUrlParams = useCallback((params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value.toString());
      }
    });
    router.replace(`?${newSearchParams.toString()}`, { scroll: false });
  }, [searchParams, router]);

  return { currentPage, setCurrentPage, updateUrlParams };
};

// ========== 独立组件（避免嵌套组件导致 Hooks 错误） ==========
// 仓库信息组件（纯组件，无嵌套 Hooks）
function RepoInfoCard({ repoInfo }: { repoInfo: GitHubRepoInfo }) {
  return (
    <Card className="max-w-6xl mx-auto bg-white/80 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {repoInfo.stargazers_count.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Stars</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <GitBranch className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {repoInfo.forks_count.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Forks</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Eye className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">
                {repoInfo.watchers_count.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Watchers</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <Clock className="w-5 h-5 text-purple-500" />
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
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
              <Archive className="w-5 h-5" />
              <span className="font-medium">此仓库已归档，可能不再维护</span>
            </div>
          </div>
        )}

        {repoInfo.topics.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-slate-500" />
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
    </Card>
  );
}

// 版本卡片组件（独立导出，避免嵌套）
function ReleaseCard({
  release,
  isExpanded,
  onToggleExpand,
  getMirrorUrl
}: {
  release: ParsedRelease;
  isExpanded: boolean;
  onToggleExpand: () => void;
  getMirrorUrl: (host: string, originalUrl: string) => string;
}) {
  // 这里的 Hooks 是合法的：函数组件顶层
  const [showChangelog, setShowChangelog] = useState(false);
  const hasManyFiles = release.files.length > 4;
  const displayFiles = isExpanded ? release.files : release.files.slice(0, 4);

  const getVersionType = () => {
    return release.isPrerelease ? "预发布版" : "正式版";
  };

  const getVersionBadgeColor = () => {
    if (release.isPrerelease) return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300";
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-md",
      release.isLatest
        ? "border-green-200 bg-green-50/80 dark:bg-green-900/10 dark:border-green-800/50"
        : "bg-white/80 dark:bg-slate-800/60 backdrop-blur-md border-slate-200/80 dark:border-slate-700/80"
    )}>
      {release.isLatest && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-green-600 text-white px-4 py-1.5 shadow-md flex items-center gap-1 rounded-lg">
            <Zap className="w-3 h-3" />
            最新版本
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white truncate">
                  {release.name}
                </CardTitle>
                <Badge className={cn(getVersionBadgeColor(), "px-2 py-1 rounded-md")}>
                  {getVersionType()}
                </Badge>
              </div>
              <CardDescription className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5">
                  <Rocket className="w-4 h-4" />
                  {release.version}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {release.releaseDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Download className="w-4 h-4" />
                  {release.downloadCount.toLocaleString()} 次下载
                </span>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          {displayFiles.map((file) => {
            const mirrors = [
              { name: "Cloudflare 主站（全球加速）", url: getMirrorUrl("https://gh-proxy.org", file.downloadUrl), tag: "Cloudflare" },
              { name: "Fastly CDN", url: getMirrorUrl("https://cdn.gh-proxy.org", file.downloadUrl), tag: "Fastly" },
              { name: "Edgeone 全球加速", url: getMirrorUrl("https://edgeone.gh-proxy.org", file.downloadUrl), tag: "Edgeone" },
              { name: "Jasonzeng 文件代理加速", url: getMirrorUrl("https://gh.xmly.dev", file.downloadUrl), tag: "Jasonzeng" },
              { name: "Imixc 国内高速下载", url: getMirrorUrl("https://gh.imixc.top", file.downloadUrl), tag: "Imixc" },
              { name: "香港 国内线路优化", url: getMirrorUrl("https://hk.gh-proxy.org", file.downloadUrl), tag: "香港", tip: "大文件下载不建议使用！" },
            ];

            return (
              <div key={file.name} className="bg-white/50 dark:bg-slate-800/30 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900 dark:text-white truncate">{file.name}</span>
                      <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700">
                        {file.downloadCount.toLocaleString()} 次下载
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" asChild className="flex items-center gap-2 h-9 px-4">
                    <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" />
                      官方下载
                    </a>
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400">镜像下载（如遇GitHub下载缓慢可尝试）：</div>
                  {mirrors.some(m => m.tip) && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded border border-amber-200/50 dark:border-amber-800/30">
                      ⚠️ 香港线路下载大文件时不建议使用
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {mirrors.map((mirror) => (
                      <Button
                        key={mirror.url}
                        size="xs"
                        variant="outline"
                        asChild
                        className="flex items-center gap-2 text-xs h-8 px-3 border-slate-200 dark:border-slate-700"
                        title={mirror.tip || mirror.name}
                      >
                        <a href={mirror.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" />
                          {mirror.tag}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {hasManyFiles && (
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleExpand}
              className="flex items-center gap-2 w-full justify-center py-2.5 border border-slate-200/50 dark:border-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-all"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  收起 {release.files.length - 4} 个文件
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  展开全部 {release.files.length} 个文件
                </>
              )}
            </Button>
          )}
        </div>

        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChangelog(!showChangelog)}
            className="flex items-center gap-2 w-full justify-center py-2.5 border border-slate-200/50 dark:border-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-all"
          >
            {showChangelog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showChangelog ? "隐藏更新日志" : "查看更新日志"}
          </Button>

          {showChangelog && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 prose prose-sm max-w-none dark:prose-invert wrap-break-word overflow-auto max-h-80">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <a target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" {...props} />
                  )
                }}
              >
                {release.changelog}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ========== 主组件（确保 Hooks 只在顶层调用） ==========
export function DownloadSection({
  githubApiUrl,
  description = "选择适合您的版本进行下载",
  showPrereleases = true,
  itemsPerPage = 20,
  launcherMeta,
  requestTimeout = 15000,
}: DownloadSectionProps) {
  // 第二步：所有 Hooks 必须在函数组件顶层调用（核心修复！）
  const { toast } = useToast();
  const { currentPage, setCurrentPage, updateUrlParams } = usePaginationParams();

  // 状态定义全部移到顶层
  const [allReleases, setAllReleases] = useState<ParsedRelease[]>([]);
  const [currentPageReleases, setCurrentPageReleases] = useState<ParsedRelease[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"semantic" | "releaseDate" | "downloadCount">("semantic");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReleases, setTotalReleases] = useState(0);
  const [repoInfo, setRepoInfo] = useState<GitHubRepoInfo | null>(null);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [releasesStatus, setReleasesStatus] = useState<RequestStatus>("loading");
  const [repoStatus, setRepoStatus] = useState<RequestStatus>("loading");
  const [requestError, setRequestError] = useState<RequestError | null>(null);

  // 第三步：所有 useCallback/useMemo 也在顶层定义
  // 统一错误处理函数
  const handleRequestError = useCallback((error: any, context: string): RequestError => {
    let errorInfo: RequestError = {
      message: "未知错误，请稍后重试",
      type: "other"
    };

    if (error.message === "Timeout") {
      errorInfo = {
        message: `请求${context}超时（${requestTimeout / 1000}秒），请检查网络或稍后重试`,
        type: "timeout"
      };
    } else if (error.code || error.status) {
      const statusCode = error.code || error.status;
      errorInfo.code = statusCode;

      if (statusCode === 404) {
        errorInfo = { code: 404, message: `${context}不存在（404），请检查API地址是否正确`, type: "404" };
      } else if (statusCode === 403) {
        errorInfo = { code: 403, message: `无权限访问${context}（403），可能是API限制或认证问题`, type: "403" };
      } else {
        errorInfo = { code: statusCode, message: `获取${context}失败（${statusCode}）：${error.message || "服务器错误"}`, type: "other" };
      }
    } else if (error.message.includes("Failed to fetch") || error.message.includes("Network")) {
      errorInfo = { message: `网络错误，无法连接到${context}，请检查网络连接`, type: "network" };
    }

    // 修复：移除不兼容的 icon 属性
    toast({
      title: "操作失败",
      description: errorInfo.message,
      variant: "destructive"
    });

    return errorInfo;
  }, [toast, requestTimeout]);

  // 获取仓库信息
  const fetchRepoInfo = useCallback(async () => {
    setRepoStatus("loading");
    try {
      const match = githubApiUrl.match(/repos\/([^/]+\/[^/]+)\/releases/);
      if (!match) {
        setRepoStatus("success");
        return;
      }

      const repoPath = match[1];
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

      const response = await fetch(`https://api.github.com/repos/${repoPath}`, {
        headers: { Accept: "application/vnd.github.v3+json" },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw { status: response.status, message: response.statusText };
      }

      const data = await response.json();
      setRepoInfo({
        description: data.description || "",
        stargazers_count: data.stargazers_count || 0,
        archived: data.archived || false,
        topics: data.topics || [],
        updated_at: data.updated_at || "",
        language: data.language || "",
        forks_count: data.forks_count || 0,
        watchers_count: data.watchers_count || 0,
      });
      setRepoStatus("success");
    } catch (error: any) {
      if (error.name === "AbortError") {
        handleRequestError({ message: "Timeout" }, "仓库信息");
      } else {
        handleRequestError(error, "仓库信息");
      }
      setRepoStatus("error");
    }
  }, [githubApiUrl, handleRequestError, requestTimeout]);

  // 获取版本数据
  const fetchReleases = useCallback(async () => {
    setReleasesStatus("loading");
    setRequestError(null);

    try {
      let allData: GitHubRelease[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const url = new URL(githubApiUrl);
        url.searchParams.set('per_page', '100');
        url.searchParams.set('page', page.toString());

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

        const response = await fetch(url.toString(), {
          headers: { Accept: "application/vnd.github.v3+json" },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw { status: response.status, message: response.statusText };
        }

        const data: GitHubRelease[] = await response.json();
        if (data.length === 0) {
          hasMore = false;
          break;
        }

        allData = [...allData, ...data];
        page++;
        if (page > 10) break;
      }

      const filteredData = showPrereleases ? allData : allData.filter(release => !release.prerelease);
      const latestRelease = filteredData
        .filter(release => !release.prerelease)
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())[0];

      const parsedReleases: ParsedRelease[] = filteredData.map((release) => {
        const mcVersionMatch = release.tag_name.match(/^(\d+\.\d+\.\d+)/);
        const mcVersion = mcVersionMatch ? mcVersionMatch[1] : "Unknown";

        const files = release.assets.map((asset) => ({
          name: asset.name || "",
          downloadUrl: asset.browser_download_url || "",
          downloadCount: asset.download_count || 0,
        }));

        const downloadCount = files.reduce((total, file) => total + file.downloadCount, 0);
        const releaseDate = new Date(release.published_at).toLocaleDateString("zh-CN");
        const isLatest = latestRelease ? release.id === latestRelease.id : false;

        const tagMatches = release.tag_name.match(/(beta|rc|alpha|stable|latest)/gi) || [];
        const bodyTags = release.body ? release.body.match(/\[(\w+)\]/g)?.map(tag => tag.replace(/\[|\]/g, '')) || [] : [];
        const releaseTags = [...new Set([...tagMatches, ...bodyTags])];

        return {
          name: release.name || release.tag_name || "",
          version: release.tag_name || "",
          mcVersion,
          releaseDate,
          isPrerelease: release.prerelease || false,
          isLatest,
          downloadCount,
          files,
          changelog: release.body || "暂无更新日志。",
          tags: releaseTags.length > 0 ? releaseTags : undefined
        };
      });

      setAllReleases(parsedReleases);
      const allTags = Array.from(new Set(parsedReleases.flatMap((release) => release.tags || [])));
      setTags(allTags);
      setReleasesStatus("success");

    } catch (error: any) {
      let errorInfo: RequestError;

      if (error.name === "AbortError") {
        errorInfo = handleRequestError({ message: "Timeout" }, "版本数据");
      } else {
        errorInfo = handleRequestError(error, "版本数据");
      }

      setRequestError(errorInfo);
      setReleasesStatus("error");
    }
  }, [githubApiUrl, showPrereleases, handleRequestError, requestTimeout]);

  // 版本比较函数
  const compareSemanticVersions = useCallback((v1: string, v2: string): number => {
    const parseVersion = (version: string) => {
      const preReleaseMatch = version.match(/-([a-zA-Z]+.*)$/);
      const preRelease = preReleaseMatch ? preReleaseMatch[1] : '';
      const mainParts = (preRelease ? version.replace(/-[a-zA-Z]+.*$/, '') : version)
        .match(/\d+/g)?.map(Number) || [];
      return { mainParts, preRelease };
    };

    const { mainParts: p1, preRelease: pr1 } = parseVersion(v1);
    const { mainParts: p2, preRelease: pr2 } = parseVersion(v2);

    const maxLen = Math.max(p1.length, p2.length);
    for (let i = 0; i < maxLen; i++) {
      const num1 = p1[i] || 0;
      const num2 = p2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }

    if (!pr1 && pr2) return 1;
    if (pr1 && !pr2) return -1;

    if (pr1 && pr2) {
      const getPreNum = (pr: string) => Number(pr.match(/\d+/)?.[0] || 0);
      return getPreNum(pr1) - getPreNum(pr2);
    }

    return 0;
  }, []);

  // 语义化排序
  const semanticCompare = useCallback((a: ParsedRelease, b: ParsedRelease) => {
    const versionCompare = compareSemanticVersions(a.version, b.version);
    return versionCompare !== 0 ? versionCompare : (a.isLatest ? -1 : b.isLatest ? 1 : 0);
  }, [compareSemanticVersions]);

  // 处理版本筛选排序
  const processReleases = useCallback((releases: ParsedRelease[]) => {
    return releases
      .filter((release) =>
        release.name.toLowerCase().includes(search.toLowerCase()) ||
        release.version.toLowerCase().includes(search.toLowerCase()) ||
        release.mcVersion.toLowerCase().includes(search.toLowerCase())
      )
      .filter((release) => (selectedTag ? release.tags?.includes(selectedTag) : true))
      .sort((a, b) => {
        if (sortBy === "semantic") {
          return sortOrder === "asc" ? semanticCompare(a, b) : -semanticCompare(a, b);
        } else if (sortBy === "releaseDate") {
          const dateCompare = new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
          return sortOrder === "asc" ? -dateCompare : dateCompare;
        } else {
          const countCompare = b.downloadCount - a.downloadCount;
          return sortOrder === "asc" ? -countCompare : countCompare;
        }
      });
  }, [search, selectedTag, sortBy, sortOrder, semanticCompare]);

  // 镜像链接拼接
  const getMirrorUrl = useCallback((host: string, originalUrl: string) => {
    const cleanUrl = originalUrl.replace(/^https?:\/\//, '');
    return `${host}/${cleanUrl}`;
  }, []);

  // 排序变更
  const handleSortChange = useCallback((criteria: "semantic" | "releaseDate" | "downloadCount") => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("desc");
    }
    setCurrentPage(1);
    updateUrlParams({ page: 1 });
  }, [sortBy, sortOrder, setCurrentPage, updateUrlParams]);

  // 文件展开/折叠
  const toggleFileExpansion = useCallback((releaseVersion: string) => {
    setExpandedFiles(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(releaseVersion)) {
        newExpanded.delete(releaseVersion);
      } else {
        newExpanded.add(releaseVersion);
      }
      return newExpanded;
    });
  }, []);

  // 分页按钮生成
  const generatePaginationButtons = useMemo(() => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setCurrentPage(i);
            updateUrlParams({ page: i });
          }}
          className={cn(
            "rounded-full transition-all hover:scale-105",
            i === currentPage ? 'bg-blue-600 hover:bg-blue-700' : ''
          )}
        >
          {i}
        </Button>
      );
    }

    return buttons;
  }, [currentPage, totalPages, updateUrlParams]);

  // 错误状态渲染
  const renderErrorState = useCallback(() => {
    let errorIcon = <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />;
    let errorTitle = "获取数据失败";

    if (requestError) {
      switch (requestError.type) {
        case "404":
          errorIcon = <XCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />;
          errorTitle = "资源不存在";
          break;
        case "403":
          errorIcon = <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />;
          errorTitle = "无访问权限";
          break;
        case "timeout":
          errorIcon = <ClockIcon className="w-12 h-12 text-blue-500 mx-auto mb-4" />;
          errorTitle = "请求超时";
          break;
        case "network":
          errorIcon = <WifiOff className="w-12 h-12 text-purple-500 mx-auto mb-4" />;
          errorTitle = "网络连接失败";
          break;
      }
    }

    return (
      <Card className="border-dashed">
        <CardContent className="py-16 text-center">
          {errorIcon}
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{errorTitle}</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{requestError?.message || "无法获取版本信息，请稍后重试"}</p>
          <Button onClick={fetchReleases} variant="default" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            重新加载
          </Button>
        </CardContent>
      </Card>
    );
  }, [requestError, fetchReleases]);

  // 骨架屏渲染
  const renderRepoInfoSkeleton = useCallback(() => (
    <Card className="max-w-6xl mx-auto bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full" />
              <div>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-10 w-full mt-6" />
      </CardContent>
    </Card>
  ), []);

  // 第四步：useEffect 也在顶层，依赖数组精准
  // 初始化数据
  useEffect(() => {
    fetchReleases();
    fetchRepoInfo();
  }, [fetchReleases, fetchRepoInfo]);

  // 处理版本列表分页
  useEffect(() => {
    if (allReleases.length === 0) return;

    const processedReleases = processReleases(allReleases);
    setTotalReleases(processedReleases.length);

    const calculatedTotalPages = Math.ceil(processedReleases.length / itemsPerPage);
    setTotalPages(Math.max(1, calculatedTotalPages));

    const validPage = Math.min(Math.max(1, currentPage), calculatedTotalPages);
    if (validPage !== currentPage) {
      setCurrentPage(validPage);
      updateUrlParams({ page: validPage });
    }

    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setCurrentPageReleases(processedReleases.slice(startIndex, endIndex));

  }, [allReleases, currentPage, itemsPerPage, processReleases, updateUrlParams]);

  // 加载状态渲染
  if (releasesStatus === "loading") {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          {renderRepoInfoSkeleton()}
        </div>
        <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-8 w-24 rounded-md" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full mb-4" />
                <Skeleton className="h-8 w-1/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 错误状态渲染
  if (releasesStatus === "error") {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          {repoStatus === "loading" ? renderRepoInfoSkeleton() : repoInfo && <RepoInfoCard repoInfo={repoInfo} />}
        </div>
        <div className="bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  className="pl-10 w-full"
                  placeholder="搜索版本号、名称、MC版本…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={fetchReleases} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                刷新
              </Button>
            </div>
          </div>
        </div>
        {renderErrorState()}
      </div>
    );
  }

  // 主内容渲染
  return (
    <div className="space-y-8">
      <div className="text-center space-y-6">
        {launcherMeta?.name && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {launcherMeta.name}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {launcherMeta.description || description}
            </p>
          </div>
        )}
        {repoStatus === "loading" ? renderRepoInfoSkeleton() : repoInfo && <RepoInfoCard repoInfo={repoInfo} />}
      </div>

      <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-xl p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                className="pl-10 w-full h-12 rounded-lg border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20"
                placeholder="搜索版本号、名称、MC版本…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={fetchReleases}
              className="flex items-center gap-2 h-12 px-4 border-slate-200 dark:border-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
              刷新
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Filter className="w-4 h-4 text-slate-500" />
            排序方式：
          </div>
          <div className="flex flex-wrap gap-2">
            {([
              { key: "semantic" as const, label: "版本号", icon: Rocket },
              { key: "releaseDate" as const, label: "发布日期", icon: Calendar },
              { key: "downloadCount" as const, label: "下载量", icon: TrendingUp }
            ]).map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={sortBy === key ? "default" : "outline"}
                size="sm"
                onClick={() => handleSortChange(key)}
                className="flex items-center gap-2 h-9 px-4 rounded-lg"
              >
                <Icon className="w-4 h-4" />
                {sortBy === key && (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                {label}
              </Button>
            ))}
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              <Filter className="w-4 h-4 text-slate-500" />
              标签筛选：
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
                className="h-9 px-4 rounded-lg"
              >
                全部
              </Button>
              {tags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  className="h-9 px-4 rounded-lg"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="releases" className="w-full">
        <TabsContent value="releases" className="space-y-6">
          {totalReleases === 0 ? (
            <Card className="border-dashed bg-white/50 dark:bg-slate-800/30">
              <CardContent className="py-16 text-center">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">暂无可用版本</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">当前筛选条件下没有找到匹配的版本</p>
                <Button onClick={fetchReleases} variant="outline">
                  重新获取
                </Button>
              </CardContent>
            </Card>
          ) : currentPageReleases.length === 0 ? (
            <Card className="border-dashed bg-white/50 dark:bg-slate-800/30">
              <CardContent className="py-16 text-center">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">当前页无数据</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">请尝试切换到其他页码</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {currentPageReleases.map((release) => (
                <ReleaseCard
                  key={release.version}
                  release={release}
                  isExpanded={expandedFiles.has(release.version)}
                  onToggleExpand={() => toggleFileExpansion(release.version)}
                  getMirrorUrl={getMirrorUrl}
                />
              ))}

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-6 p-4 bg-white/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    第 <span className="font-medium text-slate-900 dark:text-white">{currentPage}</span> 页，
                    共 <span className="font-medium text-slate-900 dark:text-white">{totalPages}</span> 页，
                    总计 <span className="font-medium text-slate-900 dark:text-white">{totalReleases}</span> 个版本
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (currentPage > 1) {
                          const newPage = currentPage - 1;
                          setCurrentPage(newPage);
                          updateUrlParams({ page: newPage });
                        }
                      }}
                      disabled={currentPage === 1}
                      className="rounded-full h-10 w-10 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {generatePaginationButtons}
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (currentPage < totalPages) {
                          const newPage = currentPage + 1;
                          setCurrentPage(newPage);
                          updateUrlParams({ page: newPage });
                        }
                      }}
                      disabled={currentPage === totalPages}
                      className="rounded-full h-10 w-10 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="text-center text-sm text-slate-600 dark:text-slate-400 mt-4 p-6 bg-white/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
        <p className="mb-4 font-medium text-slate-700 dark:text-slate-300">加速下载服务由以下镜像站点提供：</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="https://gh-proxy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-all hover:shadow-md hover:scale-105"
          >
            gh-proxy.com
          </a>
          <a
            href="https://gh.imixc.top/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-all hover:shadow-md hover:scale-105"
          >
            gh.imixc.top
          </a>
          <a
            href="https://gh.jasonzeng.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-all hover:shadow-md hover:scale-105"
          >
            gh.jasonzeng.dev
          </a>
        </div>
      </div>
    </div>
  );
}