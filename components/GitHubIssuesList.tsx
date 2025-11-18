"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2, AlertCircle, CheckCircle, MessageSquare, Calendar, User, Tag,
  ArrowLeft, ExternalLink, GitPullRequest, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export const dynamic = 'force-dynamic'

/* ------------------------------------------------------------------ */
/* Types
/* ------------------------------------------------------------------ */
interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  html_url: string;
  user: { login: string; avatar_url: string };
  created_at: string;
  updated_at: string;
  comments: number;
  state: "open" | "closed";
  labels: { name: string; color: string }[];
  pull_request?: object;
}

interface PaginationInfo {
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

/* ------------------------------------------------------------------ */
/* 工具函数
/* ------------------------------------------------------------------ */
const getTimeAgo = (d: string) => {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86_400_000);
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 7) return `${days} 天前`;
  if (days < 30) return `${Math.floor(days / 7)} 周前`;
  return `${Math.floor(days / 30)} 月前`;
};

const getContrastColor = (hex: string) => {
  const h = hex.length === 6 ? hex : hex.repeat(2);
  const [r, g, b] = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 > 128 ? "#000" : "#fff";
};

const parseLinkHeader = (header: string | null) => {
  if (!header) return {};
  const links: Record<string, string> = {};
  header.split(",").forEach(p => {
    const m = p.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (m) links[m[2]] = m[1];
  });
  return links;
};

const calcTotalPages = (link: string | null, per: number) => {
  if (!link) return 1;
  const last = parseLinkHeader(link).last;
  if (!last) return 1;
  const p = new URL(last).searchParams.get("page");
  return p ? parseInt(p, 10) : 1;
};

/* ------------------------------------------------------------------ */
/* 子组件
/* ------------------------------------------------------------------ */
function StatsCard({ icon, label, value }: { icon: JSX.Element; label: string; value: number }) {
  return (
    <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">{icon}</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</div>
        </div>
        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">{label}</div>
      </CardContent>
    </Card>
  );
}

function IssueCard({ issue, onClick }: { issue: GitHubIssue; onClick: (url: string) => void }) {
  const isPR = !!issue.pull_request;
  return (
    <Card
      onClick={() => onClick(issue.html_url)}
      className="group bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl backdrop-blur-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isPR ? <GitPullRequest className="w-4 h-4 text-purple-500" /> :
              <AlertCircle className={`w-4 h-4 ${issue.state === "open" ? "text-green-500" : "text-purple-500"}`} />}
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {issue.title}
            </h3>
          </div>
          <Badge variant={issue.state === "open" ? "default" : "secondary"}>
            {isPR ? "PR" : issue.state === "open" ? "开放" : "已关闭"}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
          <span className="flex items-center gap-1"><User className="w-4 h-4" />{issue.user.login}</span>
          <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{getTimeAgo(issue.updated_at)}</span>
          <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" />{issue.comments}</span>
        </div>
        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {issue.labels.map(lb => (
              <Badge
                key={lb.name}
                variant="outline"
                className="text-xs"
                style={{
                  backgroundColor: `#${lb.color}20`,
                  borderColor: `#${lb.color}`,
                  color: getContrastColor(lb.color),
                }}
              >
                {lb.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Pagination({ pagination, onChange }: { pagination: PaginationInfo; onChange: (p: number) => void }) {
  const { currentPage, totalPages } = pagination;
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        const p = currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
        return (
          <Button
            key={p}
            variant={p === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(p)}
          >
            {p}
          </Button>
        );
      })}
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 主组件：接收动态仓库参数
/* ------------------------------------------------------------------ */
export default function GitHubIssuesList({
  owner,
  repo,
  backHref = ".",
}: {
  owner: string;
  repo: string;
  backHref?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 20,
  });

  /* 读取 URL 页码 */
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    if (!isNaN(page) && page > 0) setPagination(p => ({ ...p, currentPage: page }));
  }, [searchParams]);

  /* 拉取数据 */
  useEffect(() => {
    const cacheKey = `gh:${owner}/${repo}/issues/page/${pagination.currentPage}/${pagination.itemsPerPage}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const { _ts, data } = JSON.parse(cached);
      if (Date.now() - _ts < 30_000) {
        setIssues(data);
        setLoading(false);
        return;
      }
    }

    const controller = new AbortController();
    const url = new URL(`https://api.github.com/repos/${owner}/${repo}/issues`);
    url.searchParams.set("state", "all");
    url.searchParams.set("per_page", String(pagination.itemsPerPage));
    url.searchParams.set("page", String(pagination.currentPage));

    fetch(url.toString(), {
      headers: { Accept: "application/vnd.github.v3+json" },
      signal: controller.signal,
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const link = r.headers.get("Link");
        setPagination(p => ({ ...p, totalPages: calcTotalPages(link, pagination.itemsPerPage) }));
        return r.json() as Promise<GitHubIssue[]>;
      })
      .then((data: GitHubIssue[]) => {
        setIssues(data);
        sessionStorage.setItem(cacheKey, JSON.stringify({ _ts: Date.now(), data }));
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, [owner, repo, pagination.currentPage, pagination.itemsPerPage]);

  const handlePage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  const handleIssueClick = (url: string) => {
    const num = url.split("/").pop();
    if (num) router.push(`${backHref}/issues/${num}`);
  };

  /* 统计数据 */
  const openCnt = issues.filter(i => i.state === "open" && !i.pull_request).length;
  const closeCnt = issues.filter(i => i.state === "closed" && !i.pull_request).length;
  const openPRCnt = issues.filter(i => i.state === "open" && !!i.pull_request).length;
  const totalCmt = issues.reduce((a, i) => a + i.comments, 0);

  if (loading)
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-linear-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        </div>
        <Footer />
      </>
    );

  if (error && !issues.length)
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-linear-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 flex items-center justify-center">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
              <p className="text-slate-700 dark:text-slate-300">{error}</p>
              <Button onClick={() => location.reload()}>重新加载</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-linear-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 头部 */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild className="flex items-center gap-2">
                  <Link href={backHref}>
                    <ArrowLeft className="w-4 h-4" />
                    返回
                  </Link>
                </Button>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {owner}/{repo}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-blue-700 dark:from-slate-100 dark:to-blue-400 bg-clip-text text-transparent">
                问题与反馈
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                跟踪 Issues 与 Pull Requests
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => location.reload()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4" />
                刷新
              </Button>
              <Button asChild size="sm">
                <a
                  href={`https://github.com/${owner}/${repo}/issues/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  新建 Issue
                </a>
              </Button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard icon={<AlertCircle className="w-6 h-6" />} label="开放问题" value={openCnt} />
            <StatsCard icon={<CheckCircle className="w-6 h-6" />} label="已关闭问题" value={closeCnt} />
            <StatsCard icon={<GitPullRequest className="w-6 h-6" />} label="开放 PR" value={openPRCnt} />
            <StatsCard icon={<MessageSquare className="w-6 h-6" />} label="总评论" value={totalCmt} />
          </div>

          {/* 分页 */}
          <Pagination pagination={pagination} onChange={handlePage} />

          {/*  issues 列表 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">全部条目</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    第 {pagination.currentPage} 页，共 {pagination.totalPages} 页
                  </p>
                </div>
              </div>
            </div>

            {issues.length === 0 ? (
              <Card className="text-center py-16 border-dashed">
                <CardContent>
                  <CheckCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">暂无条目</h3>
                  <p className="text-slate-600 dark:text-slate-400">成为第一个提交 Issue 的人吧！</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {issues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} onClick={handleIssueClick} />
                ))}
              </div>
            )}
          </section>

          {/* 分页 */}
          <Pagination pagination={pagination} onChange={handlePage} />

          {/* 页脚说明 */}
          <Card className="bg-white/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center text-sm text-slate-600 dark:text-slate-400">
              <p>
                数据来自{" "}
                <a
                  href={`https://github.com/${owner}/${repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
                >
                  GitHub Repository
                </a>
                。自动更新，缓存时间 30 秒。
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}