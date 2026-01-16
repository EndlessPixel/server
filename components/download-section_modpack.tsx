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
/**
 * 比较 EndlessPixel 整合包的自定义语义化版本号
 * 适配规则：
 * - 版本格式示例：v10-1.6（正式版）、v10-b4（预发布版）、1.21.11-v10-1.6（完整格式）
 * - 核心逻辑：先比较主版本号数字部分，再区分正式版/预发布版，最后比较预发布后缀数字
 * - 返回值：1 表示v1 > v2；-1 表示v1 < v2；0 表示版本相等
 * @param v1 第一个需要比较的版本号字符串
 * @param v2 第二个需要比较的版本号字符串
 * @returns 比较结果（1/-1/0）
 */
const compareSemanticVersions = (v1: string, v2: string): number => {
  /**
   * 解析 EndlessPixel 自定义版本号，分离主版本号和预发布后缀
   * 解析规则：
   * 1. 预发布后缀识别：以 "-" 后跟字母开头的部分（如 -b4、-beta2、-rc1）
   * 2. 主版本号提取：移除预发布后缀后，提取所有数字部分转为数字数组
   *    - 示例1：v10-1.6 → 无预发布后缀 → 主版本号 [10,1,6]
   *    - 示例2：v10-b4 → 预发布后缀 "b4" → 主版本号 [10]
   *    - 示例3：1.21.11-v10-1.5 → 无预发布后缀 → 主版本号 [1,21,11,10,1,5]
   * @param version 待解析的版本号字符串
   * @returns 解析结果：mainParts（主版本号数字数组）、preRelease（预发布后缀）
   */
  const parseVersion = (version: string) => {
    // 正则匹配预发布后缀：匹配 "-" 后紧跟字母开头的所有字符（如 -b4、-beta3、-rc2）
    // 捕获组1 提取后缀内容（如 b4、beta3）
    const preReleaseMatch = version.match(/-([a-zA-Z]+.*)$/);
    // 提取预发布后缀（无则为空字符串）
    const preRelease = preReleaseMatch ? preReleaseMatch[1] : '';

    // 提取主版本号部分：如果有预发布后缀则先移除，再提取所有数字片段转为数字数组
    // 例如："v10-b4" → 移除 "-b4" 得到 "v10" → 提取数字 [10]
    // 例如："1.21.11-v10-1.6" → 无后缀 → 提取数字 [1,21,11,10,1,6]
    const mainVersionStr = preRelease ? version.replace(/-[a-zA-Z]+.*$/, '') : version;
    // 匹配所有数字片段并转为数字（无数字则返回空数组）
    const mainParts = mainVersionStr.match(/\d+/g)?.map(Number) || [];

    return { mainParts, preRelease };
  };

  // 解析两个待比较的版本号
  const { mainParts: p1, preRelease: pr1 } = parseVersion(v1);
  const { mainParts: p2, preRelease: pr2 } = parseVersion(v2);

  // ========== 第一步：比较主版本号（核心逻辑） ==========
  // 取两个版本号主数字数组的最大长度，逐位比较
  const maxLen = Math.max(p1.length, p2.length);
  for (let i = 0; i < maxLen; i++) {
    // 数组长度不足的位补 0（如 [10] vs [10,1] → 10 vs 10 → 0 vs 1）
    const num1 = p1[i] || 0;
    const num2 = p2[i] || 0;

    // 某一位数字更大，则直接返回结果
    if (num1 > num2) return 1; // v1 主版本号更大
    if (num1 < num2) return -1; // v2 主版本号更大
  }

  // ========== 第二步：主版本号相同，区分正式版/预发布版 ==========
  // 规则：正式版（无预发布后缀）> 预发布版（有后缀）
  if (!pr1 && pr2) return 1; // v1是正式版，v2是预发布版 → v1更大（如 v10-1.0 > v10-b4）
  if (pr1 && !pr2) return -1; // v1是预发布版，v2是正式版 → v2更大（如 v10-b4 < v10-1.0）

  // ========== 第三步：都是预发布版，比较后缀中的数字 ==========
  if (pr1 && pr2) {
    /**
     * 提取预发布后缀中的数字（如 b4 → 4，beta10 → 10，rc3 → 3）
     * 无数字则返回 0（如 beta → 0）
     * @param pr 预发布后缀字符串
     * @returns 后缀中的数字（无则为0）
     */
    const getPreNum = (pr: string) => Number(pr.match(/\d+/)?.[0] || 0);

    // 后缀数字相减：正数表示v1更大，负数表示v2更大，0表示相等
    return getPreNum(pr1) - getPreNum(pr2); // 如 b4 - b3 = 1 → v1更大
  }

  // ========== 最终：版本完全相同 ==========
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
      const res = await fetch('/api/github-releases');
      if (!res.ok) throw new Error(String(res.status));
      const data: GitHubRelease[] = await res.json();
      const getLatestReleaseId = (branch: Branch) => {
        const branchReleases = data.filter(r =>
          (branch === 'main' && !/real/i.test(r.tag_name)) ||
          (branch === 'real' && /real/i.test(r.tag_name))
        ).filter(r => !r.prerelease);
        if (branchReleases.length === 0) return null;
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
          downloadUrl: a.browser_download_url,
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
          if (a.isLatest && !b.isLatest) return -1;
          if (!a.isLatest && b.isLatest) return 1;
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
function FileBlock({ file }: { file: { name: string; downloadUrl: string; downloadCount: number } }) {
  const getMirrorUrl = (host: string) => {
    return `${host}${file.downloadUrl}`;
  };
  const mirrors = [
    { tag: 'Cloudflare', url: getMirrorUrl('https://gh-proxy.org'), tip: '推荐' },
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