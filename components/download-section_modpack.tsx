"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, Shield } from "lucide-react";
import {
  Pagination,
  ReleaseGrid,
  Toolbar,
  MirrorFooter,
  LoadingState,
  useReleaseFilter,
  usePagination,
  compareSemanticVersions,
  GitHubRelease,
  ParsedRelease,
} from "@/components/download-base";

type Branch = "main" | "real";

export function DownloadSectionModpack() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [releases, setReleases] = useState<ParsedRelease[]>([]);
  const [activeBranch, setActiveBranch] = useState<Branch>("main");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"semantic" | "releaseDate" | "downloadCount">("semantic");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  useEffect(() => {
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://api.github.com/repos/EndlessPixel/EndlessPixel-Modpack/releases?per_page=500");
      if (!res.ok) throw new Error(String(res.status));
      const data: GitHubRelease[] = await res.json();

      const parsed: ParsedRelease[] = data.map((r) => {
        const branch: Branch = /real/i.test(r.name + r.tag_name) ? "real" : "main";
        const files = r.assets.map((a) => ({
          name: a.name,
          downloadUrl: a.browser_download_url,
          downloadCount: a.download_count,
        }));
        return {
          name: r.name || r.tag_name,
          version: r.tag_name,
          mcVersion: r.tag_name.match(/^(\d+\.\d+\.\d+)/)?.[1] ?? "Unknown",
          releaseDate: new Date(r.published_at).toLocaleDateString("zh-CN"),
          isPrerelease: r.prerelease,
          isLatest: false,
          downloadCount: files.reduce((s, f) => s + f.downloadCount, 0),
          files,
          changelog: r.body || "暂无更新日志。",
          branch,
        };
      });

      const groupedReleases: Record<string, Record<string, ParsedRelease[]>> = {};
      parsed.forEach((r) => {
        if (!groupedReleases[r.branch!]) groupedReleases[r.branch!] = {};
        const mcMajorVersion = r.mcVersion.split(".").slice(0, 2).join(".");
        if (!groupedReleases[r.branch!][mcMajorVersion]) groupedReleases[r.branch!][mcMajorVersion] = [];
        groupedReleases[r.branch!][mcMajorVersion].push(r);
      });

      Object.keys(groupedReleases).forEach((branch) => {
        Object.keys(groupedReleases[branch]).forEach((mcVersion) => {
          const releases = groupedReleases[branch][mcVersion];
          const stableReleases = releases.filter((r) => !r.isPrerelease);
          if (stableReleases.length > 0) {
            const latestStable = stableReleases.sort((a, b) => compareSemanticVersions(b.version, a.version))[0];
            latestStable.isLatest = true;
          } else if (releases.length > 0) {
            const latest = releases.sort((a, b) => compareSemanticVersions(b.version, a.version))[0];
            latest.isLatest = true;
          }
        });
      });

      setReleases(parsed);
    } catch {
      toast({ title: "获取版本信息失败", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filtered = useReleaseFilter(releases, search, sortBy, sortOrder, activeBranch);
  const { total, paged } = usePagination(filtered, page, PER_PAGE);

  if (loading) return <LoadingState message="正在加载模组包数据..." />;

  return (
    <section className="space-y-6" aria-label="模组包下载区域">
      <header className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-foreground">下载模组包</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">选择适合你的分支版本，体验不同游戏乐趣</p>
      </header>

      <Card className="p-4 bg-card backdrop-blur-md">
        <Toolbar
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onRefresh={fetchReleases}
          loading={loading}
          placeholder="搜索版本号、名称、MC版本..."
        />
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-foreground/5">
          <span className="text-sm font-medium text-muted-foreground">分支：</span>
          <Tabs defaultValue={activeBranch} onValueChange={(v) => { setActiveBranch(v as Branch); setPage(1); }}>
            <TabsList className="grid grid-cols-2 h-10">
              <TabsTrigger value="main" className="gap-2 data-[state=active]:bg-foreground data-[state=active]:text-background focus:outline-none">
                <Star className="w-4 h-4" aria-hidden="true" /> Main 分支
              </TabsTrigger>
              <TabsTrigger value="real" className="gap-2 data-[state=active]:bg-foreground data-[state=active]:text-background focus:outline-none">
                <Shield className="w-4 h-4" aria-hidden="true" /> Real 分支
                <Badge variant="secondary" className="ml-1 text-xs">不再维护</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      <Tabs defaultValue={activeBranch} onValueChange={(v) => { setActiveBranch(v as Branch); setPage(1); }}>
        <TabsContent value="main" className="space-y-4 pt-4">
          <Pagination total={total} current={page} onPage={setPage} />
          <ReleaseGrid list={paged} showBranchBadge={true} />
          <Pagination total={total} current={page} onPage={setPage} />
        </TabsContent>
        <TabsContent value="real" className="space-y-4 pt-4">
          <Pagination total={total} current={page} onPage={setPage} />
          <ReleaseGrid list={paged} showBranchBadge={true} />
          <Pagination total={total} current={page} onPage={setPage} />
        </TabsContent>
      </Tabs>
      <MirrorFooter />
    </section>
  );
}

export { DownloadSectionModpack as DownloadSection };