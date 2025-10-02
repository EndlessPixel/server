"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Package, ChevronDown, ChevronUp, Loader2, ExternalLink, Star, Shield, Zap, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/input";
import { ParsedRelease } from "@/lib/utils"; // 确保正确导入类型
import { useRouter } from "next/navigation";

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

export function DownloadSection() {
  const router = useRouter();
  const [releases, setReleases] = useState<ParsedRelease[]>([]); // 确保 releases 使用正确的类型
  const [loading, setLoading] = useState(true);
  const [activeBranch, setActiveBranch] = useState<"main" | "real">("main");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"semantic" | "releaseDate" | "downloadCount">("semantic");
  const [sortOrder, setSortOrder] = useState("desc"); // 默认降序
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://api.github.com/repos/EndlessPixel/EndlessPixel-Modpack/releases?per_page=200", {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data: GitHubRelease[] = await response.json();

      // 首先确定每个分支的最新版本
      const mainReleases = data.filter(release =>
        !release.name.toLowerCase().includes("real") &&
        !release.tag_name.toLowerCase().includes("real")
      );

      const realReleases = data.filter(release =>
        release.name.toLowerCase().includes("real") ||
        release.tag_name.toLowerCase().includes("real")
      );

      const latestMain = mainReleases.length > 0 && !mainReleases[0].prerelease ? mainReleases[0].id : null;
      const latestReal = realReleases.length > 0 && !realReleases[0].prerelease ? realReleases[0].id : null;

      const parsedReleases: ParsedRelease[] = data.map((release) => {
        const mcVersionMatch = release.tag_name.match(/^(\d+\.\d+\.\d+)/);
        const mcVersion = mcVersionMatch ? mcVersionMatch[1] : "Unknown";

        // 确定分支 - 更精确的判断
        let branch: "main" | "real" = "main";
        if (release.name.toLowerCase().includes("real") ||
          release.tag_name.toLowerCase().includes("real")) {
          branch = "real";
        }

        const files = release.assets.map((asset) => ({
          name: asset.name,
          downloadUrl: asset.browser_download_url,
          downloadCount: asset.download_count,
        }));

        const downloadCount = files.reduce((total, file) => total + file.downloadCount, 0);

        const releaseDate = new Date(release.published_at).toLocaleDateString("zh-CN");

        // 确定是否为最新版本（非预发布版本）
        const isLatest = (branch === "main" && release.id === latestMain) ||
          (branch === "real" && release.id === latestReal);

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
          branch,
        }
      });

      setReleases(parsedReleases);

      // 提取所有标签
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

  const handleSortChange = (criteria: "semantic" | "releaseDate" | "downloadCount") => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("desc");
    }
  }

  /** 语义版本排序（字典序，v7-2.10 > v7-2.9） */
  const semanticCompare = (a: ParsedRelease, b: ParsedRelease) => {
    // 先比 MC 主版本
    const mcA = a.mcVersion.split('.').map(Number);
    const mcB = b.mcVersion.split('.').map(Number);
    for (let i = 0; i < 3; i++) if (mcA[i] !== mcB[i]) return mcA[i] - mcB[i];
    // 再比 tag 字符串（localeCompare 带 numeric 可正确处理 v7-2.10 > v7-2.9）
    return a.version.localeCompare(b.version, undefined, { numeric: true, sensitivity: 'base' });
  };

  const filteredReleases = releases
    .filter((release) => release.branch === activeBranch)
    .filter((release) =>
      release.name.toLowerCase().includes(search.toLowerCase()) ||
      release.version.toLowerCase().includes(search.toLowerCase()) ||
      release.mcVersion.toLowerCase().includes(search.toLowerCase())
    )
    .filter((release) => (selectedTag ? release.tags?.includes(selectedTag) : true))
    .sort((a, b) => {
      if (sortBy === "semantic") {
        return sortOrder === "asc" ? semanticCompare(a, b) : -semanticCompare(a, b);
      }
      const compare = (key: "releaseDate" | "downloadCount") => {
        if (key === "releaseDate") {
          return new Date(a[key]).getTime() - new Date(b[key]).getTime();
        }
        return a[key] - b[key];
      };
      return sortOrder === "asc" ? compare(sortBy) : -compare(sortBy);
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">正在获取版本信息...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">下载模组包</h2>
          <p className="text-muted-foreground">
            选择适合您游戏风格的分支版本
          </p>
        </div>
        <div className="flex gap-4">
          <Input
            className="w-64"
            placeholder="搜索版本号、名称、MC版本…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outline" onClick={() => router.push("/downloads/issues")}>查看问题</Button>
        </div>
      </div>

      <div className="flex justify-end items-center gap-4">
        {/* 排序按钮组：高亮当前选中 */}
        {(["semantic", "releaseDate", "downloadCount"] as const).map((key) => (
          <Button
            key={key}
            variant={sortBy === key ? "default" : "ghost"}
            size="sm"
            onClick={() => handleSortChange(key)}
            className="flex items-center gap-2"
          >
            {sortBy === key && sortOrder === "asc" ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            {key === "semantic" && "按版本号排序"}
            {key === "releaseDate" && "按发布日期排序"}
            {key === "downloadCount" && "按下载量排序"}
          </Button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedTag === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedTag(null)}
        >
          全部标签
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

      <Tabs defaultValue="main" onValueChange={(value) => setActiveBranch(value as "main" | "real")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="main" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            主分支
          </TabsTrigger>
          <TabsTrigger value="real" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Real分支
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-4 mt-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center">
              <Star className="w-5 h-5 mr-2" />
              主分支 (Main)
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
              标准游戏体验，包含丰富的优化和辅助功能，适合大多数玩家。稳定可靠，持续更新。
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                正式版
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                稳定版
              </Badge>
            </div>
          </div>

          {filteredReleases.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">暂无可用版本</p>
                <Button onClick={fetchReleases} variant="outline">
                  重新获取
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredReleases.map((release) => (
              <ReleaseCard key={release.version} release={release} />
            ))
          )}
        </TabsContent>

        <TabsContent value="real" className="space-y-4 mt-4">
          <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-purple-800 dark:text-purple-200 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Real分支
            </h3>
            <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">
              更注重真实性的游戏体验，跟随正式版。适合喜爱现实主义的玩家。
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                真实版
              </Badge>
            </div>
          </div>

          {filteredReleases.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">暂无Real分支版本</p>
                <Button onClick={fetchReleases} variant="outline">
                  重新获取
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredReleases.map((release) => (
              <ReleaseCard key={release.version} release={release} />
            ))
          )}
        </TabsContent>
      </Tabs>

      <div className="text-xs text-muted-foreground mt-4">
        加速下载由 <a href="https://gh-proxy.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">gh-proxy.com</a> 提供。
      </div>
    </div>
  );
}

function ReleaseCard({ release }: { release: ParsedRelease }) {
  const [showChangelog, setShowChangelog] = useState(false);

  // 判断版本类型
  const getVersionType = () => {
    if (release.isPrerelease) return "预发布版";
    if (release.branch === "real") return "真实版";
    return "正式版";
  }

  const getVersionBadgeVariant = () => {
    if (release.isPrerelease) return "secondary";
    if (release.branch === "real") return "outline";
    return "default";
  }

  const getVersionBadgeColor = () => {
    if (release.isPrerelease) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (release.branch === "real") return "bg-purple-100 text-purple-800 border-purple-300";
    return "bg-blue-100 text-blue-800 border-blue-300";
  }

  return (
    <Card
      className={
        release.isLatest
          ? release.branch === "main"
            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
            : "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20"
          : ""
      }
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-green-600" />
            <CardTitle className="text-lg">{release.name}</CardTitle>

            {/* 版本类型标签 */}
            <Badge variant={getVersionBadgeVariant()} className={getVersionBadgeColor()}>
              {getVersionType()}
            </Badge>

            {/* 最新版本标签 */}
            {release.isLatest && (
              <Badge className="bg-green-600 text-white flex items-center gap-1">
                <Zap className="w-3 h-3" />
                最新
              </Badge>
            )}

            {/* 分支标签 */}
            <Badge variant="outline" className={
              release.branch === "main"
                ? "bg-blue-100 text-blue-800 border-blue-300"
                : "bg-purple-100 text-purple-800 border-purple-300"
            }>
              {release.branch === "main" ? "主分支" : "Real分支"}
            </Badge>
          </div>
        </div>
        <CardDescription className="flex items-center gap-2 mt-2">
          <span>Minecraft {release.mcVersion}</span>
          <span>•</span>
          <span>发布于 {release.releaseDate}</span>
          <span>•</span>
          <span>下载次数：{release.downloadCount}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {release.files && release.files.map((file) => {
            // 镜像链接生成
            const mirrors = [
              {
                name: "Cloudflare 主站（全球加速）",
                url: `https://gh-proxy.com/${file.downloadUrl}`,
                tag: "全球",
              },
              {
                name: "Fastly CDN",
                url: `https://cdn.gh-proxy.com/${file.downloadUrl}`,
                tag: "Fastly",
              },
              {
                name: "香港（国内优化，secbit.ai赞助）",
                url: `https://hk.gh-proxy.com/${file.downloadUrl}`,
                tag: "香港",
                tip: "大文件下载不建议使用！",
              },
            ]
            return (
              <div key={file.name} className="flex flex-col gap-2 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{file.name}</span>
                    <span className="text-xs text-muted-foreground">下载次数: {file.downloadCount}</span>
                  </div>
                  <Button size="sm" asChild>
                    <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-1" />
                      官方下载
                    </a>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-[11px] text-muted-foreground">
                    镜像下载：<span className="text-muted-foreground/70">如遇GitHub下载缓慢可尝试</span>
                  </span>
                  {mirrors.some(m => m.tip) && (
                    <span className="text-[11px] text-orange-500">
                      香港线路大文件不建议用
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {mirrors.map((mirror) => (
                    <Button
                      key={mirror.url}
                      size="xs"
                      variant="outline"
                      asChild
                      className="flex items-center gap-1"
                      title={mirror.tip || ""}
                    >
                      <a href={mirror.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3 h-3" />
                        {mirror.tag}
                        <span className="sr-only">{mirror.name}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChangelog(!showChangelog)}
            className="flex items-center gap-2"
          >
            {showChangelog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showChangelog ? "隐藏更新日志" : "查看更新日志"}
          </Button>
          {showChangelog && (
            <div className="mt-4 p-4 bg-muted rounded-lg border prose prose-sm max-w-none dark:prose-invert break-words">
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({ node, ...props }) => (
                    <a target="_blank" rel="noopener noreferrer" {...props} />
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
  )
}