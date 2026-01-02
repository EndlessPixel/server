'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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

/* ----------  类型  ---------- */
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

/* ----------  工具  ---------- */
const cn = (...e: any[]) => e.filter(Boolean).join(' ');

// 修复：完整语义化版本比较（支持正式版 > 预发布版，且预发布版后缀排序）
const compareSemanticVersions = (v1: string, v2: string): number => {
  // 解析版本：分离 主版本号 + 预发布后缀（如 v9-2.0 → [9,2,0], 无后缀；v9-b2 → [9], 后缀 b2）
  const parseVersion = (version: string) => {
    // 匹配预发布后缀（-b/-beta/-rc 等开头）
    const preReleaseMatch = version.match(/-([a-zA-Z]+.*)$/);
    const preRelease = preReleaseMatch ? preReleaseMatch[1] : '';
    // 提取主版本号的数字部分
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

/* ----------  主组件  ---------- */
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

  /* 初始拉取 */
  useEffect(() => {
    fetchReleases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReleases = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/github-releases');
      if (!res.ok) throw new Error(String(res.status));
      const data: GitHubRelease[] = await res.json();

      // 修复：最新版本判断（按发布时间，而非 ID）
      const getLatestReleaseId = (branch: Branch) => {
        const branchReleases = data.filter(r =>
          (branch === 'main' && !/real/i.test(r.tag_name)) ||
          (branch === 'real' && /real/i.test(r.tag_name))
        ).filter(r => !r.prerelease); // 正式版优先
        if (branchReleases.length === 0) return null;
        // 按发布时间排序，取最新的
        return branchReleases.sort((a, b) =>
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        )[0].id;
      };

      const latestMain = getLatestReleaseId('main');
      const latestReal = getLatestReleaseId('real');

      const parsed: ParsedRelease[] = data.map(r => {
        const branch: Branch = /real/i.test(r.name + r.tag_name) ? 'real' : 'main';
        const files = r.assets.map(a => ({
          name: a.name,
          downloadUrl: a.browser_download_url, // 保留完整 GitHub 下载 URL
          downloadCount: a.download_count,
        }));
        return {
          name: r.name || r.tag_name,
          version: r.tag_name,
          mcVersion: r.tag_name.match(/^(\d+\.\d+\.\d+)/)?.[1] ?? 'Unknown',
          releaseDate: new Date(r.published_at).toLocaleDateString('zh-CN'),
          isPrerelease: r.prerelease,
          isLatest: (branch === 'main' && r.id === latestMain) || (branch === 'real' && r.id === latestReal),
          downloadCount: files.reduce((s, f) => s + f.downloadCount, 0),
          files,
          changelog: r.body || '暂无更新日志。',
          branch,
        };
      });
      setReleases(parsed);
    } catch {
      toast({ title: '获取版本信息失败', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  /* 筛选 / 排序（核心修复：语义化排序） */
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
          // 最新版本始终排在最前面
          if (a.isLatest && !b.isLatest) return -1;
          if (!a.isLatest && b.isLatest) return 1;
          // 使用修复后的语义化比较函数
          return m * compareSemanticVersions(a.version, b.version);
        }
        if (sortBy === 'releaseDate') {
          return m * (new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
        }
        return m * (a.downloadCount - b.downloadCount);
      });
    return list;
  }, [releases, activeBranch, search, sortBy, sortOrder]);

  /* 分页 */
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
      {/* 标题 */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          下载模组包
        </h1>
        <p className="text-muted-foreground">选择适合你的分支版本，体验不同游戏乐趣</p>
      </div>
      <Tabs defaultValue={activeBranch} onValueChange={v => { setActiveBranch(v as Branch); setPage(1); }}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="main" className="gap-2">
            <Star className="w-4 h-4" /> Main 分支
          </TabsTrigger>
          <TabsTrigger value="real" className="gap-2">
            <Shield className="w-4 h-4" /> Real 分支
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {/* 搜索 / 排序 */}
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

      {/* 分支 Tab */}
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

/* ----------  子组件  ---------- */

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
          <div className="code-block rounded-lg border p-3 prose prose-sm dark:prose-invert max-w-none overflow-auto max-h-60">
            <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
              {release.changelog}
            </ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// 只替换 FileBlock 组件里的 getMirrorUrl 函数，其他代码不变！
function FileBlock({ file }: { file: { name: string; downloadUrl: string; downloadCount: number } }) {
  // 正确：直接拼接镜像站 + GitHub 原始 URL（和官网格式完全一致）
  const getMirrorUrl = (host: string) => {
    return `${host}/${file.downloadUrl}`;
  };

  const mirrors = [
    { tag: 'Cloudflare', url: getMirrorUrl('https://gh-proxy.org'), tip: '推荐' }, // 注意：官网用的是 gh-proxy.org，之前是 gh-proxy.com，统一对齐
    { tag: 'Fastly', url: getMirrorUrl('https://cdn.gh-proxy.org'), tip: '推荐' },
    { tag: 'Edgeone', url: getMirrorUrl('https://edgeone.gh-proxy.org'), tip: '推荐' },
    { tag: 'Jasonzeng', url: getMirrorUrl('https://gh.xmly.dev'), tip: '大文件慎用' },
    { tag: 'Imixc', url: getMirrorUrl('https://gh.imixc.top'), tip: '大文件慎用' },
    { tag: '香港', url: getMirrorUrl('https://hk.gh-proxy.org'), tip: '香港节点' },
  ];

  return (
    <div className="p-3 rounded-xl border bg-card/50">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm truncate">{file.name}</span>
        <Badge variant="secondary" className="text-xs">下载 {file.downloadCount} 次</Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* 官方链接：完整 GitHub 原始 URL */}
        <Button size="xs" asChild>
          <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
            <Download className="w-3 h-3 mr-1" />官方
          </a>
        </Button>
        {/* 镜像链接：和官网格式一致（镜像站 + 未编码的 GitHub 完整 URL） */}
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
    <div className="text-center text-sm text-muted-foreground p-4 rounded-lg border bg-secondary/30">
      <p className="mb-2">加速下载由以下服务提供：</p>
      <div className="flex flex-wrap justify-center gap-2">
        {['gh-proxy.com', 'gh.imixc.top', 'gh.xmly.dev'].map(d => (
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