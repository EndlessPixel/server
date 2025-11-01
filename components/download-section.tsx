"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Package, ChevronDown, ChevronUp, Loader2, ExternalLink, Star, Shield, Zap, ArrowUp, ArrowDown, Search, Filter, Rocket, Calendar, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

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
  branch: "main" | "real"
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

export function DownloadSection() {
  const router = useRouter();
  const [releases, setReleases] = useState<ParsedRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBranch, setActiveBranch] = useState<"main" | "real">("main");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"semantic" | "releaseDate" | "downloadCount">("semantic");
  const [sortOrder, setSortOrder] = useState("desc");
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

  const compareVersionStrings = (v1: string, v2: string) => {
    const parseVersion = (version: string) => {
      const match = version.match(/^EndlessPixel-(\d+\.\d+\.\d+)-v(\d+)-(.*)$/i);
      
      if (!match) {
        return {
          mcVersion: "0.0.0",
          modVersion: 0,
          buildType: "",
          buildNum: 0,
          fullVersion: version
        };
      }
      
      const [, mcVersion, modVersionStr, buildInfo] = match;
      const modVersion = parseInt(modVersionStr, 10);
      
      let buildType = "release";
      let buildNum = 0;
      
      const betaMatch = buildInfo.match(/^b(\d+)$/i);
      if (betaMatch) {
        buildType = "beta";
        buildNum = parseInt(betaMatch[1], 10);
      } else {
        const releaseMatch = buildInfo.match(/^(\d+(?:\.\d+)*)$/);
        if (releaseMatch) {
          const versionParts = releaseMatch[1].split(".").map(Number);
          buildNum = versionParts[0] * 1000 + (versionParts[1] || 0) * 10 + (versionParts[2] || 0);
        }
      }
      
      return {
        mcVersion,
        modVersion,
        buildType,
        buildNum,
        fullVersion: version
      };
    };
    
    const v1Info = parseVersion(v1);
    const v2Info = parseVersion(v2);
    
    if (v1Info.mcVersion !== v2Info.mcVersion) {
      const mcParts1 = v1Info.mcVersion.split(".").map(Number);
      const mcParts2 = v2Info.mcVersion.split(".").map(Number);
      
      for (let i = 0; i < 3; i++) {
        if (mcParts1[i] !== mcParts2[i]) {
          return mcParts2[i] - mcParts1[i];
        }
      }
    }
    
    if (v1Info.modVersion !== v2Info.modVersion) {
      return v2Info.modVersion - v1Info.modVersion;
    }
    
    if (v1Info.buildType !== v2Info.buildType) {
      if (v1Info.buildType === "release") return -1;
      if (v2Info.buildType === "release") return 1;
    }
    
    if (v1Info.buildNum !== v2Info.buildNum) {
      return v2Info.buildNum - v1Info.buildNum;
    }
    
    return v1Info.fullVersion.localeCompare(v2Info.fullVersion);
  };

  const semanticCompare = (a: ParsedRelease, b: ParsedRelease) => {
    if (a.isLatest && !b.isLatest) return -1;
    if (!a.isLatest && b.isLatest) return 1;
    
    return compareVersionStrings(a.name, b.name);
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
        return sortOrder === "asc" ? -semanticCompare(a, b) : semanticCompare(a, b);
      }
      
      const compare = (key: "releaseDate" | "downloadCount") => {
        if (key === "releaseDate") {
          return new Date(b[key]).getTime() - new Date(a[key]).getTime();
        }
        return b[key] - a[key];
      };
      
      return sortOrder === "asc" ? -compare(sortBy) : compare(sortBy);
    });

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
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          下载模组包
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          选择适合您游戏风格的分支版本，体验不同的游戏乐趣
        </p>
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
            <Button variant="outline" onClick={() => router.push("/downloads/issues")} className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              查看问题
            </Button>
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

      {/* Branch Tabs */}
      <Tabs defaultValue="main" onValueChange={(value) => setActiveBranch(value as "main" | "real")}>
        <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <TabsTrigger 
            value="main" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 rounded-lg transition-all"
          >
            <Star className="w-4 h-4" />
            主分支
            {releases.filter(r => r.branch === "main" && r.isLatest).length > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs">
                最新
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="real" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-700 rounded-lg transition-all"
          >
            <Shield className="w-4 h-4" />
            Real分支
            {releases.filter(r => r.branch === "real" && r.isLatest).length > 0 && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
                最新
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-4 mt-6">
          {/* Main Branch Info */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-lg mb-2">主分支 (Main)</h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                  标准游戏体验，包含丰富的优化和辅助功能，适合大多数玩家。稳定可靠，持续更新，提供最佳的游戏体验。
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300">
                    正式版
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300">
                    稳定版
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300">
                    推荐使用
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Releases List */}
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
                <ReleaseCard key={release.version} release={release} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="real" className="space-y-4 mt-6">
          {/* Real Branch Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 text-lg mb-2">Real分支</h3>
                <p className="text-purple-700 dark:text-purple-300 text-sm leading-relaxed">
                  更注重真实性的游戏体验，跟随正式版。适合喜爱现实主义的玩家，提供更具挑战性和沉浸感的游戏内容。
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300">
                    真实版
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300">
                    硬核体验
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Releases List */}
          {filteredReleases.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">暂无Real分支版本</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">当前筛选条件下没有找到匹配的Real分支版本</p>
                <Button onClick={fetchReleases} variant="outline">
                  重新获取
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredReleases.map((release) => (
                <ReleaseCard key={release.version} release={release} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Footer Note */}
      <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700">
        <p>
          加速下载由 <a href="https://gh-proxy.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline">gh-proxy.com</a> 提供。
          如遇下载问题，请尝试不同的镜像链接。
        </p>
      </div>
    </div>
  );
}

function ReleaseCard({ release }: { release: ParsedRelease }) {
  const [showChangelog, setShowChangelog] = useState(false);

  const getVersionType = () => {
    if (release.isPrerelease) return "预发布版";
    if (release.branch === "real") return "真实版";
    return "正式版";
  }

  const getVersionBadgeColor = () => {
    if (release.isPrerelease) return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300";
    if (release.branch === "real") return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300";
    return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300";
  }

  return (
    <Card className={`
      relative overflow-hidden transition-all duration-300 hover:shadow-lg
      ${release.isLatest 
        ? release.branch === "main"
          ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 dark:border-green-800"
          : "border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 dark:border-purple-800"
        : "bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm border-slate-200 dark:border-slate-700"
      }
    `}>
      {/* Latest Version Ribbon */}
      {release.isLatest && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 shadow-lg flex items-center gap-1">
            <Zap className="w-3 h-3" />
            最新版本
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2 rounded-lg ${
              release.branch === "main" 
                ? "bg-blue-100 dark:bg-blue-900/30" 
                : "bg-purple-100 dark:bg-purple-900/30"
            }`}>
              <Package className={`w-5 h-5 ${
                release.branch === "main" 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-purple-600 dark:text-purple-400"
              }`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <CardTitle className="text-lg text-slate-900 dark:text-white truncate">
                  {release.name}
                </CardTitle>
                
                <Badge className={getVersionBadgeColor()}>
                  {getVersionType()}
                </Badge>

                <Badge variant="outline" className={
                  release.branch === "main"
                    ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300"
                    : "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300"
                }>
                  {release.branch === "main" ? "主分支" : "Real分支"}
                </Badge>
              </div>

              <CardDescription className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <Rocket className="w-4 h-4" />
                  Minecraft {release.mcVersion}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {release.files && release.files.map((file) => {
            const mirrors = [
              {
                name: "Cloudflare 主站（全球加速）",
                url: `https://gh-proxy.com/${file.downloadUrl}`,
                tag: "Cloudflare",
              },
              {
                name: "Fastly CDN",
                url: `https://cdn.gh-proxy.com/${file.downloadUrl}`,
                tag: "Fastly",
              },
              {
                name: "Edgeone 全球加速",
                url: `https://edgeone.gh-proxy.com/${file.downloadUrl}`,
                tag: "Edgeone",
              },
              {
                name: "Jasonzeng 文件代理加速",
                url: `https://gh.jasonzeng.dev/${file.downloadUrl}`,
                tag: "Jasonzeng",
                tip: "大文件下载不建议使用！",
              },
              {
                name: "Imixc 国内高速下载",
                url: `https://gh.imixc.top/${file.downloadUrl}`,
                tag: "Imixc",
                tip: "大文件下载不建议使用！",
              },
              {
                name: "香港 国内线路优化,secbit.ai&Sharon CDN赞助",
                url: `https://hk.gh-proxy.com/${file.downloadUrl}`,
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
                      ⚠️ 香港线路大文件不建议使用
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
            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 prose prose-sm max-w-none dark:prose-invert break-words">
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

// Add missing RefreshCw icon component
function RefreshCw({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 3v5h5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 16h5v5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}