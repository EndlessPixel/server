"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download,
  Package,
  ChevronDown,
  ChevronUp,
  Loader2,
  ExternalLink,
  Star,
  Zap,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Rocket,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Github,
  Archive,
  Tag,
  Eye,
  GitBranch,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";

// 添加 launcherMeta.ts 的类型定义
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

interface DownloadSectionProps {
  githubApiUrl: string;
  title?: string;
  description?: string;
  showPrereleases?: boolean;
  itemsPerPage?: number;
  launcherMeta?: LauncherMeta; // 添加 launcherMeta 参数
}

export function DownloadSection({
  githubApiUrl,
  description = "选择适合您的版本进行下载",
  showPrereleases = true,
  itemsPerPage = 20,
  launcherMeta
}: DownloadSectionProps) {
  const [releases, setReleases] = useState<ParsedRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"semantic" | "releaseDate" | "downloadCount">("semantic");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState<{
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
  }>({});
  const [repoInfo, setRepoInfo] = useState<GitHubRepoInfo | null>(null);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  // 从URL参数中获取当前页码
  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page) && page > 0) {
        setCurrentPage(page);
      }
    }
  }, [searchParams]);

  // 当githubApiUrl或currentPage变化时，重新获取数据
  useEffect(() => {
    fetchReleases();
    fetchRepoInfo();
  }, [githubApiUrl, currentPage]);

  const fetchRepoInfo = async () => {
    try {
      // 从 GitHub API URL 提取仓库信息
      const match = githubApiUrl.match(/repos\/([^/]+\/[^/]+)\/releases/);
      if (!match) return;

      const repoPath = match[1];
      const response = await fetch(`https://api.github.com/repos/${repoPath}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      setRepoInfo({
        description: data.description,
        stargazers_count: data.stargazers_count,
        archived: data.archived,
        topics: data.topics || [],
        updated_at: data.updated_at,
        language: data.language,
        forks_count: data.forks_count,
        watchers_count: data.watchers_count,
      });
    } catch (error) {
      console.error("Failed to fetch repo info:", error);
    }
  };

  // 解析GitHub API返回的分页链接
  const parseLinkHeader = (header: string | null) => {
    if (!header) return {};

    const links: { [key: string]: string } = {};
    const parts = header.split(',');

    parts.forEach(part => {
      const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
      if (match) {
        const url = match[1];
        const rel = match[2];
        links[rel] = url;
      }
    });

    return links;
  };

  // 修复calculateTotalPages函数
  const calculateTotalPages = (linkHeader: string | null, currentPage: number, itemsPerPage: number, dataLength: number) => {
    if (!linkHeader) {
      // 如果没有分页信息，说明只有一页或者数据量小于每页数量
      return dataLength < itemsPerPage ? 1 : Math.ceil(dataLength / itemsPerPage);
    }

    const links = parseLinkHeader(linkHeader);
    if (links.last) {
      const url = new URL(links.last);
      const lastPage = Number(url.searchParams.get("page") || 1);
      return lastPage;
    }

    // 如果没有last链接，但当前页数据量小于每页数量，说明当前页是最后一页
    if (dataLength < itemsPerPage) {
      return currentPage;
    }

    // 保守估计，返回当前页+1作为总页数
    return currentPage + 1;
  };

  const fetchReleases = async () => {
    try {
      setLoading(true);

      // 构建带分页参数的URL
      const url = new URL(githubApiUrl);
      url.searchParams.set('per_page', itemsPerPage.toString());
      url.searchParams.set('page', currentPage.toString());

      const response = await fetch(url.toString(), {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data: GitHubRelease[] = await response.json();

      // 解析分页链接
      const linkHeader = response.headers.get('Link');
      const links = parseLinkHeader(linkHeader);
      setPaginationLinks({
        first: links.first,
        prev: links.prev,
        next: links.next,
        last: links.last
      });

      // 计算总页数
      const calculatedTotalPages = calculateTotalPages(linkHeader, currentPage, itemsPerPage, data.length);
      setTotalPages(calculatedTotalPages);

      // Filter out prereleases if not needed
      const filteredData = showPrereleases ? data : data.filter(release => !release.prerelease);

      // 修复：正确识别最新版本（按发布时间排序取最新正式版）
      const latestRelease = filteredData
        .filter(release => !release.prerelease)
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())[0]?.id || null;

      const parsedReleases: ParsedRelease[] = filteredData.map((release) => {
        const mcVersionMatch = release.tag_name.match(/^(\d+\.\d+\.\d+)/);
        const mcVersion = mcVersionMatch ? mcVersionMatch[1] : "Unknown";

        const files = release.assets.map((asset) => ({
          name: asset.name,
          downloadUrl: asset.browser_download_url,
          downloadCount: asset.download_count,
        }));

        const downloadCount = files.reduce((total, file) => total + file.downloadCount, 0);
        const releaseDate = new Date(release.published_at).toLocaleDateString("zh-CN");
        const isLatest = release.id === latestRelease;

        return {
          name: release.name || release.tag_name,
          version: release.tag_name,
          mcVersion,
          releaseDate,
          isPrerelease: release.prerelease,
          isLatest,
          downloadCount,
          files,
          changelog: release.body || "暂无更新日志。",
        }
      });

      setReleases(parsedReleases);
      const allTags = Array.from(new Set(parsedReleases.flatMap((release) => release.tags || [])));
      setTags(allTags);
    } catch (error) {
      console.error("Failed to fetch releases:", error);
      toast({
        title: "获取版本信息失败",
        description: "无法从GitHub获取最新版本信息，请稍后重试。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // 更新URL参数
  const updateUrlParams = (params: Record<string, string | number | null>) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, value.toString());
      }
    });

    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const handleSortChange = (criteria: "semantic" | "releaseDate" | "downloadCount") => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("desc");
    }
  }

  // 🌟 核心修复：完整语义化版本比较（支持正式版 > 预发布版，解决2.0排在1.x前面的问题）
  const compareSemanticVersions = (v1: string, v2: string): number => {
    // 解析版本：分离 主版本号 + 预发布后缀（如 v9-2.0 → [9,2,0], 无后缀；v9-b2 → [9], 后缀 b2）
    const parseVersion = (version: string) => {
      // 匹配预发布后缀（-b/-beta/-rc 等开头）
      const preReleaseMatch = version.match(/-([a-zA-Z]+.*)$/);
      const preRelease = preReleaseMatch ? preReleaseMatch[1] : '';
      // 提取主版本号的数字部分（忽略前缀，只取数字序列）
      const mainParts = (preRelease ? version.replace(/-[a-zA-Z]+.*$/, '') : version)
        .match(/\d+/g)?.map(Number) || [];
      return { mainParts, preRelease };
    };

    const { mainParts: p1, preRelease: pr1 } = parseVersion(v1);
    const { mainParts: p2, preRelease: pr2 } = parseVersion(v2);

    // 1. 先比较主版本号（核心逻辑）
    const maxLen = Math.max(p1.length, p2.length);
    for (let i = 0; i < maxLen; i++) {
      const num1 = p1[i] || 0;
      const num2 = p2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }

    // 2. 主版本号相同 → 正式版 > 预发布版
    if (!pr1 && pr2) return 1; // v1是正式版，v2是预发布版 → v1大
    if (pr1 && !pr2) return -1; // v1是预发布版，v2是正式版 → v2大

    // 3. 都是预发布版 → 比较后缀（如 b2 > b1）
    if (pr1 && pr2) {
      // 提取后缀里的数字（b2 → 2, b10 →10）
      const getPreNum = (pr: string) => Number(pr.match(/\d+/)?.[0] || 0);
      return getPreNum(pr1) - getPreNum(pr2);
    }

    // 版本完全相同
    return 0;
  };

  // 修复语义化排序逻辑
  const semanticCompare = (a: ParsedRelease, b: ParsedRelease) => {
    if (a.isLatest && !b.isLatest) return -1;
    if (!a.isLatest && b.isLatest) return 1;

    // 使用修复后的语义化比较函数
    return compareSemanticVersions(a.version, b.version);
  };

  const filteredReleases = releases
    .filter((release) =>
      release.name.toLowerCase().includes(search.toLowerCase()) ||
      release.version.toLowerCase().includes(search.toLowerCase()) ||
      release.mcVersion.toLowerCase().includes(search.toLowerCase())
    )
    .filter((release) => (selectedTag ? release.tags?.includes(selectedTag) : true))
    .sort((a, b) => {
      if (sortBy === "semantic") {
        // 排序方向：desc → 新版本在前，asc → 旧版本在前
        return sortOrder === "asc" ? semanticCompare(a, b) : -semanticCompare(a, b);
      }

      const compare = (key: "releaseDate" | "downloadCount") => {
        if (key === "releaseDate") {
          return new Date(b[key]).getTime() - new Date(a[key]).getTime();
        }
        return b[key] - a[key];
      };

      return sortOrder === "asc" ? -compare(sortBy) : compare(sortBy);
    });

  // 生成分页按钮，限制显示数量
  const generatePaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // 调整起始页，确保显示maxVisiblePages个按钮
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
          className={`rounded-full ${i === currentPage ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
        >
          {i}
        </Button>
      );
    }

    return buttons;
  };

  // 处理文件展开/折叠
  const toggleFileExpansion = (releaseVersion: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(releaseVersion)) {
      newExpanded.delete(releaseVersion);
    } else {
      newExpanded.add(releaseVersion);
    }
    setExpandedFiles(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <Rocket className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">正在获取版本信息</h3>
          <p className="text-slate-600 dark:text-slate-400">正在从 GitHub 加载最新的模组包信息...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4">
        {/* Repository Info Card */}
        {repoInfo && (
          <Card className="max-w-6xl mx-auto bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {repoInfo.stargazers_count.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Stars</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {repoInfo.forks_count.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Forks</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {repoInfo.watchers_count.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Watchers</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {new Date(repoInfo.updated_at).toLocaleDateString("zh-CN")}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">最后更新</div>
                  </div>
                </div>
              </div>

              {repoInfo.archived && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                    <Archive className="w-4 h-4" />
                    <span className="font-medium">此仓库已归档</span>
                  </div>
                </div>
              )}

              {repoInfo.topics.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">主题标签：</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {repoInfo.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Search and Controls */}
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

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">排序方式：</span>
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
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {sortBy === key && (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tags Filter */}
        {tags.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">标签筛选：</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTag === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(null)}
              >
                全部
              </Button>
              {tags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Releases List */}
      <Tabs defaultValue="releases" className="w-full">
        <div className="space-y-4">
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                第 {currentPage} 页，共 {totalPages} 页，总计 {filteredReleases.length} 个版本
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
                  className="rounded-full"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {generatePaginationButtons()}
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
                  className="rounded-full"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <TabsContent value="releases" className="space-y-4">
          {filteredReleases.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">暂无可用版本</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">当前筛选条件下没有找到匹配的版本</p>
                <Button onClick={fetchReleases} variant="outline">
                  重新获取
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReleases.map((release) => (
                <ReleaseCard
                  key={release.version}
                  release={release}
                  isExpanded={expandedFiles.has(release.version)}
                  onToggleExpand={() => toggleFileExpansion(release.version)}
                />
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    第 {currentPage} 页，共 {totalPages} 页，总计 {filteredReleases.length} 个版本
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
                      className="rounded-full"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-1">
                      {generatePaginationButtons()}
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
                      className="rounded-full"
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

      {/* Footer Note */}
      <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700">
        <p className="mb-3">
          加速下载服务由以下镜像站点提供：
        </p>

        <div className="flex flex-wrap gap-2">
          <a
            href="https://gh-proxy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md transition-colors duration-200"
          >
            gh-proxy.com
          </a>
          <a
            href="https://gh.imixc.top/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md transition-colors duration-200"
          >
            gh.imixc.top
          </a>
          <a
            href="https://gh.jasonzeng.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md transition-colors duration-200"
          >
            gh.jasonzeng.dev
          </a>
        </div>
      </div>
    </div>
  );
}

interface ReleaseCardProps {
  release: ParsedRelease;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

function ReleaseCard({ release, isExpanded, onToggleExpand }: ReleaseCardProps) {
  const [showChangelog, setShowChangelog] = useState(false);
  const hasManyFiles = release.files.length > 4;
  const displayFiles = isExpanded ? release.files : release.files.slice(0, 4);

  const getVersionType = () => {
    if (release.isPrerelease) return "预发布版";
    return "正式版";
  }

  const getVersionBadgeColor = () => {
    if (release.isPrerelease) return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300";
    return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300";
  }

  // 🌟 修复：镜像链接拼接（去掉多余空格，和官网格式一致）
  const getMirrorUrl = (host: string, originalUrl: string) => {
    return `${host}/${originalUrl}`;
  };

  return (
    <Card className={`
      relative overflow-hidden transition-all duration-300 hover:shadow-lg
      ${release.isLatest
        ? "border-green-200 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800"
        : "bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border-slate-200 dark:border-slate-700"
      }
    `}>
      {/* Latest Version Ribbon */}
      {release.isLatest && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-linear-to-r from-green-500 to-emerald-600 text-white px-3 py-1 shadow-lg flex items-center gap-1">
            <Zap className="w-3 h-3" />
            最新版本
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30`}>
              <Package className={`w-5 h-5 text-blue-600 dark:text-blue-400`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <CardTitle className="text-lg text-slate-900 dark:text-white truncate">
                  {release.name}
                </CardTitle>

                <Badge className={getVersionBadgeColor()}>
                  {getVersionType()}
                </Badge>
              </div>

              <CardDescription className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <Rocket className="w-4 h-4" />
                  版本号 {release.version}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  发布于 {release.releaseDate}
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  下载 {release.downloadCount} 次
                </span>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Download Files */}
        <div className="space-y-4">
          {displayFiles.map((file) => {
            const mirrors = [
              {
                name: "Cloudflare 主站（全球加速）",
                url: getMirrorUrl("https://gh-proxy.org", file.downloadUrl),
                tag: "Cloudflare",
              },
              {
                name: "Fastly CDN",
                url: getMirrorUrl("https://cdn.gh-proxy.org", file.downloadUrl),
                tag: "Fastly",
              },
              {
                name: "Edgeone 全球加速",
                url: getMirrorUrl("https://edgeone.gh-proxy.org", file.downloadUrl),
                tag: "Edgeone",
              },
              {
                name: "Jasonzeng 文件代理加速",
                url: getMirrorUrl("https://gh.xmly.dev", file.downloadUrl),
                tag: "Jasonzeng",
              },
              {
                name: "Imixc 国内高速下载",
                url: getMirrorUrl("https://gh.imixc.top", file.downloadUrl),
                tag: "Imixc",
              },
              {
                name: "香港 国内线路优化,secbit.ai&Sharon CDN赞助",
                url: getMirrorUrl("https://hk.gh-proxy.org", file.downloadUrl),
                tag: "香港",
                tip: "大文件下载不建议使用！",
              },
            ]

            return (
              <div key={file.name} className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900 dark:text-white truncate">
                        {file.name}
                      </span>
                      <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700">
                        {file.downloadCount} 次下载
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" asChild className="flex items-center gap-2">
                    <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4" />
                      官方下载
                    </a>
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    镜像下载（如遇GitHub下载缓慢可尝试）：
                  </div>

                  {mirrors.some(m => m.tip) && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded border border-amber-200 dark:border-amber-800">
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
                        className="flex items-center gap-2 text-xs"
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
            )
          })}

          {/* Expand/Collapse Button */}
          {hasManyFiles && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="flex items-center gap-2 w-full justify-center py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50"
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

        {/* Changelog */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChangelog(!showChangelog)}
            className="flex items-center gap-2 w-full justify-center py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50"
          >
            {showChangelog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showChangelog ? "隐藏更新日志" : "查看更新日志"}
          </Button>

          {showChangelog && (
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 prose prose-sm max-w-none dark:prose-invert wrap-break-word overflow-auto max-h-60">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <a target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400" {...props} />
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