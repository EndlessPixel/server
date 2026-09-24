"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  User,
  MessageSquare,
  ExternalLink,
  Tag,
  GitPullRequest,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { formatTimeAgo, getContrastColor } from "@/lib/format";
import { githubProxyUrl } from "@/lib/github";

interface GitHubIssueDetail {
  id: number;
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  user: { login: string; avatar_url: string };
  created_at: string;
  updated_at: string;
  comments: number;
  labels: { name: string; color: string }[];
  state: "open" | "closed";
  pull_request?: object;
}

interface GitHubComment {
  id: number;
  user: { login: string; avatar_url: string };
  created_at: string;
  body: string;
}

const SkeletonCard = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div className="h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
      <div className="h-10 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card
          key={i}
          className="rounded-xl border-slate-200 bg-white/60 dark:border-slate-700 dark:bg-slate-800/60"
        >
          <CardContent className="p-4">
            <div className="mb-2 h-4 w-16 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
            <div className="h-6 w-24 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Card className="rounded-xl border-slate-200 bg-white/60 dark:border-slate-700 dark:bg-slate-800/60">
      <CardContent className="space-y-4 p-6">
        <div className="h-6 w-3/4 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
        <div className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function GitHubIssueDetail({ owner, repo }: { owner: string; repo: string }) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; // Next.js 13+ app 路由
  const [issue, setIssue] = useState<GitHubIssueDetail | null>(null);
  const [comments, setComments] = useState<GitHubComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssueDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const issueKey = `gh:issue:${id}`;
      const commentsKey = `gh:issue:${id}:comments`;
      try {
        const raw = sessionStorage.getItem(issueKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed._ts && Date.now() - parsed._ts < 30_000) {
            setIssue(parsed.data);
          }
        }
      } catch {}
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 8_000);
      const issueRes = await fetch(
        githubProxyUrl(`https://api.github.com/repos/${owner}/${repo}/issues/${id}`),
        { signal: ctrl.signal },
      );
      clearTimeout(t);
      if (!issueRes.ok) throw new Error(`HTTP ${issueRes.status}`);
      const issueData: GitHubIssueDetail = await issueRes.json();
      setIssue(issueData);
      try {
        sessionStorage.setItem(issueKey, JSON.stringify({ _ts: Date.now(), data: issueData }));
      } catch {}
      const ctrl2 = new AbortController();
      const t2 = setTimeout(() => ctrl2.abort(), 8_000);
      const commentsRes = await fetch(
        githubProxyUrl(`https://api.github.com/repos/${owner}/${repo}/issues/${id}/comments`),
        { signal: ctrl2.signal },
      );
      clearTimeout(t2);
      if (commentsRes.ok) {
        const commentsData: GitHubComment[] = await commentsRes.json();
        setComments(commentsData);
        try {
          sessionStorage.setItem(
            commentsKey,
            JSON.stringify({ _ts: Date.now(), data: commentsData }),
          );
        } catch {}
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [id, owner, repo]);

  useEffect(() => {
    if (!id) return;
    fetchIssueDetail();
  }, [id, fetchIssueDetail]);

  const refreshData = () => {
    sessionStorage.removeItem(`gh:issue:${id}`);
    sessionStorage.removeItem(`gh:issue:${id}:comments`);
    fetchIssueDetail();
  };
  if (loading)
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl">
          <SkeletonCard />
        </div>
      </main>
    );
  if (error || !issue)
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl">
          <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="p-8 text-center">
              <AlertCircle className="mx-auto mb-4 h-8 w-8 text-red-500" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">加载失败</h3>
              <p className="mb-6 text-slate-600 dark:text-slate-400">{error ?? "未找到问题详情"}</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => router.back()}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回
                </Button>
                <Button onClick={refreshData}>重新加载</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );

  const isPR = !!issue.pull_request;
  const timeAgo = formatTimeAgo(issue.updated_at);

  return (
    <>
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* 头部 */}
          <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild className="flex items-center gap-2">
                  <a href="../issues">
                    <ArrowLeft className="h-4 w-4" />
                    返回问题列表
                  </a>
                </Button>
                <Badge variant="secondary" className="bg-secondary text-foreground/70">
                  #{issue.number}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-foreground">问题详情</h1>
              <p className="text-slate-600 dark:text-slate-400">
                {isPR ? "Pull Request" : "Issue"} 的详细信息和讨论
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={refreshData}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                刷新
              </Button>
              <Button asChild size="sm">
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />在 GitHub 查看
                </a>
              </Button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="rounded-xl border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-secondary p-2 text-foreground/60">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      创建者
                    </div>
                    <div className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {issue.user.login}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      问题报告者
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-secondary p-2 text-foreground/60">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      创建时间
                    </div>
                    <div className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {new Date(issue.created_at).toLocaleDateString("zh-CN")}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatTimeAgo(issue.created_at)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-secondary p-2 text-foreground/60">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      评论数
                    </div>
                    <div className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {issue.comments}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">讨论数量</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-secondary p-2 text-foreground/60">
                    {isPR ? (
                      <GitPullRequest className="h-5 w-5" />
                    ) : issue.state === "open" ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <CheckCircle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                      状态
                    </div>
                    <div className="truncate text-lg font-semibold text-slate-900 dark:text-slate-100">
                      <Badge
                        variant={issue.state === "open" ? "default" : "secondary"}
                        className="bg-secondary text-foreground/70"
                      >
                        {isPR ? "Pull Request" : issue.state === "open" ? "开放" : "已关闭"}
                      </Badge>
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {isPR ? "代码变更请求" : "问题状态"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 标签 */}
          {issue.labels.length > 0 && (
            <Card className="rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Tag className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">标签</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {issue.labels.map((lb) => (
                    <Badge
                      key={lb.name}
                      variant="outline"
                      className="border-2 px-3 py-1 text-sm font-medium"
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
              </CardContent>
            </Card>
          )}

          {/* 问题内容 */}
          <Card className="rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                {isPR ? (
                  <GitPullRequest className="h-6 w-6 text-foreground/60" />
                ) : issue.state === "open" ? (
                  <AlertCircle className="h-6 w-6 text-foreground/60" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-foreground/60" />
                )}
                <span className="text-slate-900 dark:text-white">{issue.title}</span>
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  最后更新 {timeAgo}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />#{issue.number}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {issue.body ? (
                <div className="prose prose-slate dark:prose-invert prose-sm md:prose-base max-w-none">
                  <div className="rounded-xl border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-800/50">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        a: ({ node, ...props }) => {
                          void node;
                          return (
                            <a
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-foreground/70 underline hover:text-foreground"
                              {...props}
                            />
                          );
                        },
                        code: ({ className, children }) => {
                          const isBlock = /language-/.test(className ?? "");
                          return (
                            <code
                              className={
                                isBlock
                                  ? "block overflow-x-auto rounded-lg bg-slate-200 p-3 text-sm dark:bg-slate-700"
                                  : "rounded bg-slate-200 px-1 py-0.5 text-sm dark:bg-slate-700"
                              }
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {issue.body}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border-slate-200 bg-slate-50 py-12 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                  <MessageSquare className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p className="text-lg">暂无问题描述</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 评论列表 */}
          {comments.length > 0 ? (
            <section>
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">讨论评论</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    共 {comments.length} 条评论
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                {comments.map((c) => (
                  <Card
                    key={c.id}
                    className="rounded-xl border-slate-200 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.user.avatar_url}
                            alt={c.user.login}
                            className="h-10 w-10 rounded-full border-2 border-slate-200 dark:border-slate-700"
                          />
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {c.user.login}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(c.created_at)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-slate-400 dark:text-slate-500">#{c.id}</div>
                      </div>
                      <div className="prose prose-sm dark:prose-invert prose-slate max-w-none">
                        <div className="rounded-lg border-slate-200 bg-slate-50 p-4 text-slate-700 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{c.body}</ReactMarkdown>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ) : (
            <Card className="border-dashed py-16 text-center">
              <CardContent>
                <MessageSquare className="mx-auto mb-4 h-16 w-16 text-slate-300 dark:text-slate-600" />
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  暂无评论
                </h3>
                <p className="text-slate-600 dark:text-slate-400">成为第一个参与讨论的人</p>
              </CardContent>
            </Card>
          )}

          {/* 页脚说明 */}
          <Card className="border-slate-200 bg-white/50 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/30">
            <CardContent className="p-6 text-center text-sm text-slate-600 dark:text-slate-400">
              <p>
                数据来自{" "}
                <a
                  href={`https://github.com/${owner}/${repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 underline hover:text-foreground"
                >
                  GitHub Repository
                </a>
                。自动更新，缓存时间 30 秒。
              </p>
              <p className="mt-2">想要参与讨论？点击右上角在 GitHub 中查看完整对话。</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
