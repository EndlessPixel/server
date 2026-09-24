"use client";

import { JSX, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Calendar,
  User,
  ArrowLeft,
  ExternalLink,
  GitPullRequest,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { formatTimeAgo, getContrastColor } from "@/lib/format";

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

const parseLinkHeader = (header: string | null) => {
  if (!header) return {};
  const links: Record<string, string> = {};
  header.split(",").forEach((p) => {
    const m = p.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (m) links[m[2]] = m[1];
  });
  return links;
};

const calcTotalPages = (link: string | null) => {
  if (!link) return 1;
  const last = parseLinkHeader(link).last;
  if (!last) return 1;
  const p = new URL(last).searchParams.get("page");
  return p ? parseInt(p, 10) : 1;
};
function StatsCard({ icon, label, value }: { icon: JSX.Element; label: string; value: number }) {
  return (
    <Card className="rounded-xl border-border bg-card/80 shadow-sm backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-xl bg-secondary p-3 text-foreground/60">{icon}</div>
          <div className="text-2xl font-bold text-foreground">{value}</div>
        </div>
        <div className="text-lg font-semibold text-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
function IssueCard({ issue, onClick }: { issue: GitHubIssue; onClick: (url: string) => void }) {
  const isPR = !!issue.pull_request;
  return (
    <Card
      onClick={() => onClick(issue.html_url)}
      className="group cursor-pointer rounded-xl border-border bg-card/80 backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <CardContent className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {isPR ? (
              <GitPullRequest className="h-4 w-4 text-foreground/60" />
            ) : (
              <AlertCircle className="h-4 w-4 text-foreground/60" />
            )}
            <h3 className="truncate font-semibold text-foreground transition-colors group-hover:text-foreground/80">
              {issue.title}
            </h3>
          </div>
          <Badge variant={issue.state === "open" ? "default" : "secondary"}>
            {isPR ? "PR" : issue.state === "open" ? "开放" : "已关闭"}
          </Badge>
        </div>
        <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {issue.user.login}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatTimeAgo(issue.updated_at)}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            {issue.comments}
          </span>
        </div>
        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {issue.labels.map((lb) => (
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
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    if (!isNaN(page) && page > 0) setPagination((p) => ({ ...p, currentPage: page }));
  }, [searchParams]);
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
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const link = r.headers.get("Link");
        setPagination((p) => ({
          ...p,
          totalPages: calcTotalPages(link),
        }));
        return r.json() as Promise<GitHubIssue[]>;
      })
      .then((data: GitHubIssue[]) => {
        setIssues(data);
        sessionStorage.setItem(cacheKey, JSON.stringify({ _ts: Date.now(), data }));
        setLoading(false);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : String(e));
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
  const openCnt = issues.filter((i) => i.state === "open" && !i.pull_request).length;
  const closeCnt = issues.filter((i) => i.state === "closed" && !i.pull_request).length;
  const openPRCnt = issues.filter((i) => i.state === "open" && !!i.pull_request).length;
  const totalCmt = issues.reduce((a, i) => a + i.comments, 0);
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-foreground/40" />
      </div>
    );
  if (error && !issues.length)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card>
          <CardContent className="space-y-4 p-8 text-center">
            <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => location.reload()}>重新加载</Button>
          </CardContent>
        </Card>
      </div>
    );
  return (
    <>
      <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild className="flex items-center gap-2">
                  <Link href={backHref}>
                    <ArrowLeft className="h-4 w-4" />
                    返回下载页
                  </Link>
                </Button>
                <Badge variant="secondary" className="bg-secondary text-foreground/70">
                  {owner}/{repo}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">问题与反馈</h1>
              <p className="text-muted-foreground">跟踪 Issues 与 Pull Requests</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => location.reload()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Loader2 className="h-4 w-4" />
                刷新
              </Button>
              <Button asChild size="sm">
                <a
                  href={`https://github.com/${owner}/${repo}/issues/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  新建 Issue
                </a>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              icon={<AlertCircle className="h-6 w-6" />}
              label="开放问题"
              value={openCnt}
            />
            <StatsCard
              icon={<CheckCircle className="h-6 w-6" />}
              label="已关闭问题"
              value={closeCnt}
            />
            <StatsCard
              icon={<GitPullRequest className="h-6 w-6" />}
              label="开放 PR"
              value={openPRCnt}
            />
            <StatsCard
              icon={<MessageSquare className="h-6 w-6" />}
              label="总评论"
              value={totalCmt}
            />
          </div>
          <Pagination
            total={pagination.totalPages}
            current={pagination.currentPage}
            onPage={handlePage}
          />
          <section>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-secondary p-2">
                  <MessageSquare className="h-5 w-5 text-foreground/60" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">全部条目</h2>
                  <p className="text-sm text-muted-foreground">
                    第 {pagination.currentPage} 页，共 {pagination.totalPages} 页
                  </p>
                </div>
              </div>
            </div>
            {issues.length === 0 ? (
              <Card className="border-dashed py-16 text-center">
                <CardContent>
                  <CheckCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
                  <h3 className="mb-2 text-lg font-semibold text-foreground">暂无条目</h3>
                  <p className="text-muted-foreground">成为第一个提交 Issue 的人吧！</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {issues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} onClick={handleIssueClick} />
                ))}
              </div>
            )}
          </section>
          <Pagination
            total={pagination.totalPages}
            current={pagination.currentPage}
            onPage={handlePage}
          />
        </div>
      </main>
    </>
  );
}
