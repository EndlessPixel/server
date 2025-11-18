"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle, MessageSquare, Calendar, User, Tag, ArrowLeft, ExternalLink, GitPullRequest, GitMerge } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

/* ---------------- 类型 ---------------- */
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
  body?: string;
  labels: { name: string; color: string }[];
  pull_request?: object;
}

/* ---------------- 统计卡片组件 ---------------- */
function StatsCard({ 
  icon, 
  label, 
  value, 
  description,
  trend,
  className = ""
}: { 
  icon: JSX.Element; 
  label: string; 
  value: number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}) {
  const getTrendColor = () => {
    switch (trend) {
      case "up": return "text-green-600 dark:text-green-400";
      case "down": return "text-red-600 dark:text-red-400";
      default: return "text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <Card className={`bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm backdrop-blur-sm ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
            {icon}
          </div>
          <div className={`text-2xl font-bold ${getTrendColor()}`}>
            {value}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {label}
          </div>
          {description && (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {description}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- 问题卡片组件 ---------------- */
function IssueCard({ issue, onClick }: { issue: GitHubIssue; onClick: (url: string) => void }) {
  const isPR = !!issue.pull_request;
  const timeAgo = getTimeAgo(issue.updated_at);

  return (
    <Card 
      className={`
        group bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl 
        backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600
        cursor-pointer transform hover:-translate-y-1
        ${issue.state === 'closed' ? 'opacity-80' : ''}
      `}
      onClick={() => onClick(issue.html_url)}
    >
      <CardContent className="p-6">
        {/* 标题和状态 */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isPR ? (
              <GitPullRequest className="w-4 h-4 text-purple-500 shrink-0" />
            ) : (
              <AlertCircle className={`w-4 h-4 shrink-0 ${
                issue.state === 'open' ? 'text-green-500' : 'text-purple-500'
              }`} />
            )}
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              {issue.title}
            </h3>
          </div>
          <Badge variant={issue.state === 'open' ? 'default' : 'secondary'} className="shrink-0">
            {isPR ? (
              <GitMerge className="w-3 h-3 mr-1" />
            ) : (
              issue.state === 'open' ? (
                <AlertCircle className="w-3 h-3 mr-1" />
              ) : (
                <CheckCircle className="w-3 h-3 mr-1" />
              )
            )}
            {isPR ? 'PR' : issue.state === 'open' ? '开放' : '已关闭'}
          </Badge>
        </div>

        {/* 元信息 */}
        <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{issue.user.login}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{timeAgo}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="w-4 h-4" />
            <span>{issue.comments}</span>
          </div>
        </div>

        {/* 标签 */}
        {issue.labels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {issue.labels.map((label) => (
              <Badge
                key={label.name}
                variant="outline"
                className="text-xs font-medium border-2"
                style={{
                  backgroundColor: `#${label.color}20`,
                  borderColor: `#${label.color}`,
                  color: getContrastColor(label.color),
                }}
              >
                {label.name}
              </Badge>
            ))}
          </div>
        )}

        {/* 悬停操作 */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>#{issue.number}</span>
            <div className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              <span>查看详情</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- 工具函数 ---------------- */
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
  return `${Math.floor(diffDays / 30)} 月前`;
}

function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

/* ---------------- 主页面 ---------------- */
export default function IssuesPage() {
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const cacheKey = "gh:issues:all";
    
    // 尝试从缓存获取
    try {
      const raw = sessionStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed._ts && Date.now() - parsed._ts < 30000) {
          setIssues(parsed.data as GitHubIssue[]);
          setLoading(false);
          return;
        }
      }
    } catch {}

    // 从 API 获取
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    fetch("https://api.github.com/repos/EndlessPixel/EndlessPixel-Modpack/issues?state=all&per_page=100", {
      headers: { 
        Accept: "application/vnd.github.v3+json",
      },
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: GitHubIssue[]) => {
        if (Array.isArray(data)) {
          setIssues(data);
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({ _ts: Date.now(), data }));
          } catch {}
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        // 回退到缓存数据
        try {
          const raw = sessionStorage.getItem(cacheKey);
          if (raw) {
            const parsed = JSON.parse(raw);
            setIssues(parsed.data as GitHubIssue[]);
          }
        } catch {}
        setLoading(false);
      });
  }, []);

  const handleIssueClick = (url: string) => {
    const issueNumber = url.split("/").pop();
    if (issueNumber) {
      router.push(`/downloads/modpack/issues/${issueNumber}`);
    }
  };

  const refreshData = () => {
    setLoading(true);
    setError(null);
    sessionStorage.removeItem("gh:issues:all");
    window.location.reload();
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-linear-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
              <GitPullRequest className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">正在加载 Issues</h3>
              <p className="text-slate-600 dark:text-slate-400">正在从 GitHub 获取最新数据...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error && issues.length === 0) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-linear-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md mx-auto p-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">加载失败</h3>
            <p className="text-slate-600 dark:text-slate-400">{error}</p>
            <Button onClick={refreshData} variant="outline" className="mt-4">
              重新尝试
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const openIssues = issues.filter((i) => i.state === "open" && !i.pull_request);
  const closedIssues = issues.filter((i) => i.state === "closed" && !i.pull_request);
  const openPRs = issues.filter((i) => i.pull_request && i.state === "open");
  const closedPRs = issues.filter((i) => i.pull_request && i.state === "closed");
  const totalComments = issues.reduce((a, i) => a + i.comments, 0);

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
                  <Link href="/downloads/modpack/">
                    <ArrowLeft className="w-4 h-4" />
                    返回下载页
                  </Link>
                </Button>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  GitHub Issues
                </Badge>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-blue-700 dark:from-slate-100 dark:to-blue-400 bg-clip-text text-transparent">
                问题与反馈
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                跟踪模组包的问题、功能请求和 Pull Requests
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={refreshData} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Loader2 className="w-4 h-4" />
                刷新数据
              </Button>
              <Button asChild size="sm">
                <a 
                  href="https://github.com/EndlessPixel/EndlessPixel-Modpack/issues/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4" />
                  新建 Issue
                </a>
              </Button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              icon={<AlertCircle className="w-6 h-6" />}
              label="开放问题"
              value={openIssues.length}
              description="需要处理的问题"
              trend={openIssues.length > 0 ? "up" : "neutral"}
            />
            <StatsCard 
              icon={<CheckCircle className="w-6 h-6" />}
              label="已解决问题"
              value={closedIssues.length}
              description="已完成的问题"
              trend="neutral"
            />
            <StatsCard 
              icon={<GitPullRequest className="w-6 h-6" />}
              label="开放 PR"
              value={openPRs.length}
              description="待合并的拉取请求"
              trend={openPRs.length > 0 ? "up" : "neutral"}
            />
            <StatsCard 
              icon={<MessageSquare className="w-6 h-6" />}
              label="总评论数"
              value={totalComments}
              description="所有讨论评论"
              trend="neutral"
            />
          </div>

          {/* 开放问题 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">开放问题</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    需要关注和解决的问题 ({openIssues.length} 个)
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                待处理
              </Badge>
            </div>

            {openIssues.length === 0 ? (
              <Card className="text-center py-16 border-dashed">
                <CardContent>
                  <CheckCircle className="w-16 h-16 text-green-300 dark:text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">暂无开放问题</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    所有问题都已解决！继续保持
                  </p>
                  <Button asChild variant="outline">
                    <a 
                      href="https://github.com/EndlessPixel/EndlessPixel-Modpack/issues/new" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      报告新问题
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {openIssues.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} onClick={handleIssueClick} />
                ))}
              </div>
            )}
          </section>

          {/* 开放 PRs */}
          {openPRs.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <GitPullRequest className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">开放 Pull Requests</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      待审查和合并的代码变更 ({openPRs.length} 个)
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
                  待审查
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {openPRs.map((issue) => (
                  <IssueCard key={issue.id} issue={issue} onClick={handleIssueClick} />
                ))}
              </div>
            </section>
          )}

          {/* 已关闭问题 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">已关闭问题</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    已解决和完成的问题 ({closedIssues.length} 个)
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                已完成
              </Badge>
            </div>

            {closedIssues.length === 0 ? (
              <Card className="text-center py-16 border-dashed">
                <CardContent>
                  <AlertCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">暂无已关闭问题</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    问题解决后将显示在这里
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {closedIssues.slice(0, 9).map((issue) => (
                  <IssueCard key={issue.id} issue={issue} onClick={handleIssueClick} />
                ))}
              </div>
            )}
          </section>

          {/* 页脚说明 */}
          <Card className="bg-white/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                <p>
                  数据来自 <a href="https://github.com/EndlessPixel/EndlessPixel-Modpack" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline">GitHub Repository</a>。
                  自动更新，缓存时间 30 秒。
                </p>
                <p className="mt-2">
                  发现 bug 或有功能建议？欢迎提交新的 Issue！
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}