"use client";

import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { githubProxyUrl, parseGitHubRelease } from "@/lib/github";

type Branch = "main" | "real";

const RELEASES_API = "https://api.github.com/repos/EndlessPixel/EndlessPixel-Modpack/releases";
/** GitHub 单页上限 100，per_page=500 会被截断，故按页拉取；最多 10 页 */
const MAX_PAGES = 10;
const PER_PAGE = 10;

export function DownloadSectionModpack() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [releases, setReleases] = useState<ParsedRelease[]>([]);
  const [activeBranch, setActiveBranch] = useState<Branch>("main");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"semantic" | "releaseDate" | "downloadCount">("semantic");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const fetchReleases = useCallback(async () => {
    try {
      setLoading(true);
      // 经 /api/gh_api 代理（带 GH_TOKEN 认证，避免限流），连续翻页拉全所有版本
      const all: GitHubRelease[] = [];
      for (let pageIndex = 1; pageIndex <= MAX_PAGES; pageIndex += 1) {
        const res = await fetch(githubProxyUrl(`${RELEASES_API}?per_page=100&page=${pageIndex}`));
        if (!res.ok) throw new Error(String(res.status));
        const data: GitHubRelease[] = await res.json();
        all.push(...data);
        if (data.length < 100) break;
      }

      const parsed: ParsedRelease[] = all.map((r) => ({
        ...parseGitHubRelease(r),
        branch: /real/i.test(r.name + r.tag_name) ? "real" : "main",
      }));

      // 同一分支 + 同一大版本（如 1.20）下标记最新稳定版
      const grouped: Record<string, Record<string, ParsedRelease[]>> = {};
      parsed.forEach((r) => {
        const branch = r.branch ?? "main";
        const mcMajor = r.mcVersion.split(".").slice(0, 2).join(".");
        grouped[branch] ??= {};
        grouped[branch][mcMajor] ??= [];
        grouped[branch][mcMajor].push(r);
      });

      Object.values(grouped).forEach((byMajor) => {
        Object.values(byMajor).forEach((list) => {
          const stable = list.filter((r) => !r.isPrerelease);
          const anchor = stable.length > 0 ? stable : list;
          anchor.sort((a, b) => compareSemanticVersions(b.version, a.version))[0].isLatest = true;
        });
      });

      setReleases(parsed);
    } catch {
      toast({ title: "获取版本信息失败", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchReleases();
  }, [fetchReleases]);

  const filtered = useReleaseFilter(releases, search, sortBy, sortOrder, activeBranch);
  const { total, paged } = usePagination(filtered, page, PER_PAGE);

  if (loading) return <LoadingState message="正在加载模组包数据..." />;

  return (
    <section className="space-y-6" aria-label="模组包下载区域">
      <header className="space-y-3 text-center">
        <h2 className="text-3xl font-bold text-foreground">下载模组包</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          选择适合你的分支版本，体验不同游戏乐趣
        </p>
      </header>

      <Card className="bg-card p-4 backdrop-blur-md">
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
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-foreground/5 pt-4">
          <span className="text-sm font-medium text-muted-foreground">分支：</span>
          <Tabs
            value={activeBranch}
            onValueChange={(v) => {
              setActiveBranch(v as Branch);
              setPage(1);
            }}
          >
            <TabsList className="grid h-10 grid-cols-2">
              <TabsTrigger
                value="main"
                className="gap-2 focus:outline-none data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                <Star className="h-4 w-4" aria-hidden="true" /> Main 分支
              </TabsTrigger>
              <TabsTrigger
                value="real"
                className="gap-2 focus:outline-none data-[state=active]:bg-foreground data-[state=active]:text-background"
              >
                <Shield className="h-4 w-4" aria-hidden="true" /> Real 分支
                <Badge variant="secondary" className="ml-1 text-xs">
                  不再维护
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      <div className="space-y-4 pt-4">
        <Pagination total={total} current={page} onPage={setPage} />
        <ReleaseGrid list={paged} showBranchBadge />
        <Pagination total={total} current={page} onPage={setPage} />
      </div>

      <MirrorFooter />
    </section>
  );
}

export { DownloadSectionModpack as DownloadSection };
