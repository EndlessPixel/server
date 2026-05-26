'use client';

import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Download, Package, ChevronDown, ChevronUp, Loader2, ExternalLink,
  Star, Shield, Zap, Search, Rocket, Calendar, TrendingUp,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
type Branch = 'main' | 'real';
interface ParsedRelease {
  name: string;
  version: string;
  mcVersion: string;
  releaseDate: string;
  isPrerelease: boolean;
  isLatest: boolean;
  downloadCount: number;
  files: Array<{ name: string; downloadUrl: string; downloadCount: number }>;
  changelog: string;
  branch: Branch;
}
interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
  prerelease: boolean;
  assets: Array<{ name: string; download_count: number; browser_download_url: string }>;
}
const cn = (...e: any[]) => e.filter(Boolean).join(' ');
const compareSemanticVersions = (v1: string, v2: string): number => {
  const parse = (v: string) => {
    // 1. 提取纯数字段，忽略所有字母、横杠前缀
    const digits = v.match(/(\d+\.\d+(\.\d+)?)/g) || [];
    const mcParts = digits[0]?.split(".").map(Number) || [0];

    // 2. 判断 MC 版本类型（决定 1.21 < 26.1 < 26.1.2）
    let mcScore = 0;
    if (mcParts[0] === 1) mcScore = 1;       // 1.21.x
    else if (mcParts.length === 2) mcScore = 2; // 26.1
    else if (mcParts.length === 3) mcScore = 3; // 26.1.2

    // 3. 提取后缀类型 a / b / 正式版
    const isA = /-a\d+/.test(v);
    const isB = /-b\d+/.test(v);
    const type = isA ? 0 : isB ? 1 : 2; // a=0, b=1, 正式=2

    // 4. 提取后缀数字
    const numMatch = v.match(/-[ab]?(\d+)/) || [];
    const subNum = parseInt(numMatch[1] || "0");

    // 5. 提取最终版本号数字（如 3.7 → 3.7）
    const lastParts = digits[digits.length - 1]?.split(".").map(Number) || [0];

    return { mcScore, mcParts, type, subNum, lastParts };
  };

  const a = parse(v1);
  const b = parse(v2);

  // 1. 先比 MC 大版本等级：1.21 < 26.1 < 26.1.2
  if (a.mcScore !== b.mcScore) {
    return a.mcScore - b.mcScore;
  }

  // 2. 比 MC 具体数字（26.1.2 > 26.1.1）
  for (let i = 0; i < Math.max(a.mcParts.length, b.mcParts.length); i++) {
    const an = a.mcParts[i] ?? 0;
    const bn = b.mcParts[i] ?? 0;
    if (an !== bn) return an - bn;
  }

  // 3. 比类型：正式 > b > a
  if (a.type !== b.type) return a.type - b.type;

  // 4. 比子版本数字（b3 > b2，a3 > a2）
  if (a.subNum !== b.subNum) return a.subNum - b.subNum;

  // 5. 比最后版本号（3.7 > 3.6 > 1.0）
  for (let i = 0; i < Math.max(a.lastParts.length, b.lastParts.length); i++) {
    const an = a.lastParts[i] ?? 0;
    const bn = b.lastParts[i] ?? 0;
    if (an !== bn) return an - bn;
  }

  return 0;
};
export function DownloadSection() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [releases, setReleases] = useState<ParsedRelease[]>([]);
  const [activeBranch, setActiveBranch] = useState<Branch>('main');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'semantic' | 'releaseDate' | 'downloadCount'>('semantic');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;
  useEffect(() => {
    fetchReleases();
  }, []);
  const fetchReleases = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://api.github.com/repos/EndlessPixel/EndlessPixel-Modpack/releases?per_page=500');
      if (!res.ok) throw new Error(String(res.status));
      const data: GitHubRelease[] = await res.json();
      const parsed: ParsedRelease[] = data.map(r => {
        const branch: Branch = /real/i.test(r.name + r.tag_name) ? 'real' : 'main';
        const files = r.assets.map(a => ({
          name: a.name,
          downloadUrl: a.browser_download_url,
          downloadCount: a.download_count,
        }));
        return {
          name: r.name || r.tag_name,
          version: r.tag_name,
          mcVersion: r.tag_name.match(/^(\d+\.\d+\.\d+)/)?.[1] ?? 'Unknown',
          releaseDate: new Date(r.published_at).toLocaleDateString('zh-CN'),
          isPrerelease: r.prerelease,
          isLatest: false, // 先初始化为 false，后续再计算
          downloadCount: files.reduce((s, f) => s + f.downloadCount, 0),
          files,
          changelog: r.body || '暂无更新日志。',
          branch,
        };
      });

      // 按分支和MC大版本分组，找出每组的最新版本
      const groupedReleases: Record<string, Record<string, ParsedRelease[]>> = {};
      parsed.forEach(r => {
        if (!groupedReleases[r.branch]) {
          groupedReleases[r.branch] = {};
        }
        // 提取MC大版本作为分组key（如 "1.21" 或 "26.1"）
        const mcMajorVersion = r.mcVersion.split('.').slice(0, 2).join('.');
        if (!groupedReleases[r.branch][mcMajorVersion]) {
          groupedReleases[r.branch][mcMajorVersion] = [];
        }
        groupedReleases[r.branch][mcMajorVersion].push(r);
      });

      // 为每个分组的最新版本设置 isLatest 标志
      Object.keys(groupedReleases).forEach(branch => {
        Object.keys(groupedReleases[branch]).forEach(mcVersion => {
          const releases = groupedReleases[branch][mcVersion];
          // 过滤掉预发布版，找到最新的正式版
          const stableReleases = releases.filter(r => !r.isPrerelease);
          if (stableReleases.length > 0) {
            const latestStable = stableReleases.sort((a, b) =>
              compareSemanticVersions(b.version, a.version)
            )[0];
            latestStable.isLatest = true;
          } else if (releases.length > 0) {
            // 如果没有正式版，则标记最新的预发布版
            const latest = releases.sort((a, b) =>
              compareSemanticVersions(b.version, a.version)
            )[0];
            latest.isLatest = true;
          }
        });
      });

      setReleases(parsed);
    } catch {
      toast({ title: '获取版本信息失败', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };
  const filtered = useMemo(() => {
    const list = releases
      .filter(r => r.branch === activeBranch)
      .filter(r =>
        [r.name, r.version, r.mcVersion].some(v =>
          v.toLowerCase().includes(search.toLowerCase()),
        ),
      )
      .sort((a, b) => {
        const m = sortOrder === 'asc' ? 1 : -1;
        if (sortBy === 'semantic') {
          return m * compareSemanticVersions(a.version, b.version);
        }
        if (sortBy === 'releaseDate') {
          return m * (new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
        }
        return m * (a.downloadCount - b.downloadCount);
      });
    return list;
  }, [releases, activeBranch, search, sortBy, sortOrder]);
  const total = Math.ceil(filtered.length / PER_PAGE);
  const paged = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-(--accent-main)" />
        <p className="text-muted-foreground">正在加载 GitHub 数据 …</p>
      </div>
    );
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
          下载模组包
        </h1>
        <p className="text-muted-foreground">选择适合你的分支版本，体验不同游戏乐趣</p>
      </div>
      <Card className="p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索版本号、名称、MC版本…"
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={fetchReleases}>刷新</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">分支：</span>
          <Tabs defaultValue={activeBranch} onValueChange={v => { setActiveBranch(v as Branch); setPage(1); }}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="main" className="gap-2">
                <Star className="w-4 h-4" /> Main 分支
              </TabsTrigger>
              <TabsTrigger value="real" className="gap-2">
                <Shield className="w-4 h-4" /> Real 分支 (不再维护)
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-sm text-muted-foreground">排序：</span>
          {(['semantic', 'releaseDate', 'downloadCount'] as const).map(key => (
            <Button
              key={key}
              size="sm"
              variant={sortBy === key ? 'default' : 'outline'}
              onClick={() => {
                if (sortBy === key) setSortOrder(o => (o === 'desc' ? 'asc' : 'desc'));
                else {
                  setSortBy(key);
                  setSortOrder('desc');
                }
              }}
            >
              {key === 'semantic' && <Rocket className="w-4 h-4 mr-1" />}
              {key === 'releaseDate' && <Calendar className="w-4 h-4 mr-1" />}
              {key === 'downloadCount' && <TrendingUp className="w-4 h-4 mr-1" />}
              {key === 'semantic' ? '版本号' : key === 'releaseDate' ? '发布日期' : '下载量'}
              {sortBy === key && (
                <span className="ml-1">{sortOrder === 'desc' ? '↓' : '↑'}</span>
              )}
            </Button>
          ))}
        </div>
      </Card>
      <Tabs defaultValue={activeBranch} onValueChange={v => { setActiveBranch(v as Branch); setPage(1); }}>
        <TabsContent value="main" className="space-y-4 pt-4">
          <Pagination total={total} current={page} onPage={setPage} />
          <ReleaseGrid list={paged} />
          <Pagination total={total} current={page} onPage={setPage} />
        </TabsContent>
        <TabsContent value="real" className="space-y-4 pt-4">
          <Pagination total={total} current={page} onPage={setPage} />
          <ReleaseGrid list={paged} />
          <Pagination total={total} current={page} onPage={setPage} />
        </TabsContent>
      </Tabs>
      <MirrorFooter />
    </div>
  );
}
function ReleaseGrid({ list }: { list: ParsedRelease[] }) {
  if (list.length === 0)
    return (
      <Card className="border-dashed">
        <CardContent className="py-16 text-center text-muted-foreground">暂无匹配版本</CardContent>
      </Card>
    );
  return (
    <div className="space-y-4">
      {list.map(r => (
        <ReleaseCard key={r.version} release={r} />
      ))}
    </div>
  );
}
function ReleaseCard({ release }: { release: ParsedRelease }) {
  const [open, setOpen] = useState(false);
  const isMain = release.branch === 'main';
  const typeLabel = release.isPrerelease ? '预发布版' : isMain ? '正式版' : '真实版';
  return (
    <Card
      className={cn(
        'relative',
        release.isLatest && (isMain ? 'border-green-200 bg-green-50 dark:border-green-400/30 dark:bg-green-900/20' : ''),
      )}
    >
      {release.isLatest && (
        <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-600 gap-1">
          <Zap className="w-3 h-3" />最新版本
        </Badge>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'p-2 rounded-lg text-white',
              isMain ? 'bg-blue-500' : 'bg-purple-500',
            )}
          >
            <Package className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-base truncate">{release.name}</CardTitle>
              <Badge className={release.isPrerelease ? 'bg-amber-500 hover:bg-amber-600' : isMain ? 'bg-blue-500 hover:bg-blue-600' : 'bg-purple-500 hover:bg-purple-600'}>
                {typeLabel}
              </Badge>
              <Badge variant="outline">{isMain ? '主分支' : 'Real 分支'}</Badge>
            </div>
            <CardDescription className="flex flex-wrap items-center gap-2 text-sm mt-1 text-muted-foreground">
              <span className="flex items-center gap-1"><Rocket className="w-3 h-3" />Minecraft版本: {release.mcVersion}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />发布日期: {release.releaseDate}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Download className="w-3 h-3" />下载次数: {release.downloadCount}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          {release.files.map(f => (
            <FileBlock key={f.name} file={f} />
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setOpen(v => !v)} className="w-full gap-2">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {open ? '隐藏更新日志' : '查看更新日志'}
        </Button>
        {open && (
          <div className="code-block rounded-lg  p-3 prose prose-sm dark:prose-invert max-w-none overflow-auto max-h-60">
            <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
              {release.changelog}
            </ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
function FileBlock({ file }: { file: { name: string; downloadUrl: string; downloadCount: number } }) {
  const getMirrorUrl = (host: string) => {
    return `${host}${file.downloadUrl}`;
  };
  const mirrors = [
    { tag: 'Cloudflare', url: getMirrorUrl('https://gh-proxy.org/'), tip: '推荐' },
    { tag: 'Fastly', url: getMirrorUrl('https://cdn.gh-proxy.org/'), tip: '推荐' },
    { tag: 'Edgeone', url: getMirrorUrl('https://edgeone.gh-proxy.org/'), tip: '推荐' },
    { tag: 'Jasonzeng', url: getMirrorUrl('https://gh.xmly.dev/'), tip: '大文件慎用' },
    { tag: '香港', url: getMirrorUrl('https://hk.gh-proxy.org/'), tip: '香港节点' },
  ];
  return (
    <div className="p-3 rounded-xl  bg-card/50">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm truncate">{file.name}</span>
        <Badge variant="secondary" className="text-xs">下载 {file.downloadCount} 次</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="xs" asChild>
          <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
            <Download className="w-3 h-3 mr-1" />官方
          </a>
        </Button>
        {mirrors.map(m => (
          <Button key={m.tag} size="xs" variant="outline" asChild title={m.tip}>
            <a href={m.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1" />{m.tag}
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
function Pagination({ total, current, onPage }: { total: number; current: number; onPage: (p: number) => void }) {
  if (total <= 1) return null;
  const delta = 2;
  const left = Math.max(1, current - delta);
  const right = Math.min(total, current + delta);
  const pages: (number | string)[] = [];
  if (left > 1) pages.push(1, '...');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total) pages.push('...', total);
  return (
    <div className="flex justify-center gap-2 pt-2">
      {pages.map((p, i) =>
        typeof p === 'number' ? (
          <Button key={i} size="sm" variant={p === current ? 'default' : 'outline'} onClick={() => onPage(p)}>
            {p}
          </Button>
        ) : (
          <span key={i} className="px-2 text-muted-foreground">...</span>
        ),
      )}
    </div>
  );
}
function MirrorFooter() {
  return (
    <div className="text-center text-sm text-muted-foreground p-4 rounded-lg  bg-secondary/30">
      <p className="mb-2">加速下载由以下服务提供：</p>
      <div className="flex flex-wrap justify-center gap-2">
        {['gh-proxy.com', 'gh.xmly.dev'].map(d => (
          <a
            key={d}
            href={`https://${d}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 bg-primary text-primary-foreground rounded hover:opacity-90 transition-opacity"
          >
            {d}
          </a>
        ))}
      </div>
    </div>
  );
}