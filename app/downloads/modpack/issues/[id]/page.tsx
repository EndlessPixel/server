"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, MessageSquare, ExternalLink, Tag, GitPullRequest, AlertCircle, CheckCircle, Clock, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

/* ---------------- 类型 ---------------- */
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
  body_html?: string;
}

// 修复类型：为 code 组件定义正确的 props 类型
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/* ---------------- 骨架屏 ---------------- */
function SkeletonCard() {
  return (
    <div className="space-y-6">
      {/* 头部骨架 */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
      
      {/* 统计卡片骨架 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
            <CardContent className="p-4">
              <div className="h-4 w-16 bg-slate-300 dark:bg-slate-600 rounded animate-pulse mb-2" />
              <div className="h-6 w-24 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 内容骨架 */}
      <Card className="bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
        <CardContent className="p-6 space-y-4">
          <div className="h-6 w-3/4 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
            <div className="h-4 w-full bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-slate-300 dark:bg-slate-600 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- 信息卡片组件 ---------------- */
function InfoCard({ 
  icon, 
  label, 
  value, 
  description,
  className = ""
}: { 
  icon: JSX.Element; 
  label: string; 
  value?: React.ReactNode;
  description?: string;
  className?: string;
}) {
  return (
    <Card className={`bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm backdrop-blur-sm ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</div>
            <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
              {value ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
            </div>
            {description && (
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- 评论组件 ---------------- */
function CommentCard({ comment }: { comment: GitHubComment }) {
  const timeAgo = getTimeAgo(comment.created_at);

  return (
    <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl backdrop-blur-sm">
      <CardContent className="p-6">
        {/* 评论头部 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={comment.user.avatar_url} 
              alt={comment.user.login}
              className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700"
            />
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {comment.user.login}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500">
            #{comment.id}
          </div>
        </div>

        {/* 评论内容 */}
        <div className="prose prose-sm max-w-none dark:prose-invert prose-slate">
          {comment.body_html ? (
            <div 
              className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700"
              dangerouslySetInnerHTML={{ __html: comment.body_html }}
            />
          ) : (
            <div className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 whitespace-pre-wrap break-words">
              {comment.body}
            </div>
          )}
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
  // 确保 hexColor 是有效的6位十六进制
  const hex = hexColor.length === 6 ? hexColor : 
              hexColor.length === 3 ? hexColor.repeat(2) : '000000';
  
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

/* ---------------- 主页面 ---------------- */
export default function IssueDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;
  const [issue, setIssue] = useState<GitHubIssueDetail | null>(null);
  const [comments, setComments] = useState<GitHubComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIssueDetail();
  }, [id]);

  const fetchIssueDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const issueKey = `gh:issue:${id}`;
      const commentsKey = `gh:issue:${id}:comments`;

      // 尝试从缓存获取
      try {
        const raw = sessionStorage.getItem(issueKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed._ts && Date.now() - parsed._ts < 30000) {
            setIssue(parsed.data as GitHubIssueDetail);
          }
        }
      } catch {}

      // 获取 Issue 详情
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      
      try {
        const issueRes = await fetch(
          `https://api.github.com/repos/EndlessPixel/EndlessPixel-Modpack/issues/${id}`,
          {
            headers: { 
              Accept: "application/vnd.github.v3+json",
            },
            signal: controller.signal,
          }
        );
        clearTimeout(timeout);
        
        if (!issueRes.ok) throw new Error(`HTTP ${issueRes.status}`);
        
        const issueData: GitHubIssueDetail = await issueRes.json();
        setIssue(issueData);
        
        try {
          sessionStorage.setItem(issueKey, JSON.stringify({ _ts: Date.now(), data: issueData }));
        } catch {}
      } catch (err) {
        // 回退到缓存数据
        try {
          const raw = sessionStorage.getItem(issueKey);
          if (raw) setIssue(JSON.parse(raw).data as GitHubIssueDetail);
        } catch {}
      }

      // 获取评论
      const controller2 = new AbortController();
      const timeout2 = setTimeout(() => controller2.abort(), 8000);
      
      try {
        const commentsRes = await fetch(
          `https://api.github.com/repos/EndlessPixel/EndlessPixel-Modpack/issues/${id}/comments`,
          {
            headers: { 
              Accept: "application/vnd.github.v3+json",
            },
            signal: controller2.signal,
          }
        );
        clearTimeout(timeout2);
        
        if (commentsRes.ok) {
          const commentsData: GitHubComment[] = await commentsRes.json();
          setComments(commentsData);
          
          try {
            sessionStorage.setItem(commentsKey, JSON.stringify({ _ts: Date.now(), data: commentsData }));
          } catch {}
        }
      } catch (err) {
        // 回退到缓存数据
        try {
          const rawc = sessionStorage.getItem(commentsKey);
          if (rawc) setComments(JSON.parse(rawc).data as GitHubComment[]);
        } catch {}
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setLoading(true);
    setError(null);
    sessionStorage.removeItem(`gh:issue:${id}`);
    sessionStorage.removeItem(`gh:issue:${id}:comments`);
    fetchIssueDetail();
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 p-6">
          <div className="max-w-6xl mx-auto">
            <SkeletonCard />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !issue) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 p-6">
          <div className="max-w-6xl mx-auto">
            <Card className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">加载失败</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">{error ?? "未找到问题详情"}</p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    返回
                  </Button>
                  <Button onClick={refreshData}>
                    重新加载
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const isPR = !!issue.pull_request;
  const timeAgo = getTimeAgo(issue.updated_at);

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* 头部 */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild className="flex items-center gap-2">
                  <a href="/downloads/modpack/issues">
                    <ArrowLeft className="w-4 h-4" />
                    返回问题列表
                  </a>
                </Button>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  #{issue.number}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 dark:from-slate-100 dark:to-blue-400 bg-clip-text text-transparent">
                问题详情
              </h1>
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
                <Clock className="w-4 h-4" />
                刷新
              </Button>
              <Button asChild size="sm">
                <a 
                  href={issue.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  在 GitHub 查看
                </a>
              </Button>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard 
              icon={<User className="w-5 h-5" />}
              label="创建者"
              value={issue.user.login}
              description="问题报告者"
            />
            <InfoCard 
              icon={<Calendar className="w-5 h-5" />}
              label="创建时间"
              value={new Date(issue.created_at).toLocaleDateString("zh-CN")}
              description={getTimeAgo(issue.created_at)}
            />
            <InfoCard 
              icon={<MessageSquare className="w-5 h-5" />}
              label="评论数"
              value={issue.comments}
              description="讨论数量"
            />
            <InfoCard 
              icon={isPR ? <GitPullRequest className="w-5 h-5" /> : 
                    issue.state === "open" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
              label="状态"
              value={
                <Badge variant={issue.state === "open" ? "default" : "secondary"} className={
                  issue.state === "open" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" 
                    : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                }>
                  {isPR ? "Pull Request" : issue.state === "open" ? "开放" : "已关闭"}
                </Badge>
              }
              description={isPR ? "代码变更请求" : "问题状态"}
            />
          </div>

          {/* 标签 */}
          {issue.labels.length > 0 && (
            <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">标签</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {issue.labels.map((label) => (
                    <Badge
                      key={label.name}
                      variant="outline"
                      className="text-sm font-medium border-2 px-3 py-1"
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
              </CardContent>
            </Card>
          )}

          {/* 问题内容 */}
          <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl flex items-center gap-3 mb-2">
                    {isPR ? (
                      <GitPullRequest className="w-6 h-6 text-purple-500" />
                    ) : (
                      issue.state === "open" ? (
                        <AlertCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <CheckCircle className="w-6 h-6 text-purple-500" />
                      )
                    )}
                    <span className="text-slate-900 dark:text-white">{issue.title}</span>
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>最后更新 {timeAgo}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>#{issue.number}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {issue.body ? (
                <div className="prose prose-slate max-w-none dark:prose-invert prose-sm md:prose-base">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        a: ({ node, ...props }: any) => (
                          <a 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
                            {...props} 
                          />
                        ),
                        code: ({ node, inline, className, children, ...props }: CodeProps) => {
                          const isInline = inline;
                          return isInline ? (
                            <code 
                              className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-sm" 
                              {...props}
                            >
                              {children}
                            </code>
                          ) : (
                            <code 
                              className="block bg-slate-200 dark:bg-slate-700 p-3 rounded-lg text-sm overflow-x-auto" 
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {issue.body}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">暂无问题描述</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 评论列表 */}
          {comments.length > 0 ? (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">讨论评论</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    共 {comments.length} 条评论
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {comments.map((comment) => (
                  <CommentCard key={comment.id} comment={comment} />
                ))}
              </div>
            </section>
          ) : (
            <Card className="text-center py-16 border-dashed">
              <CardContent>
                <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">暂无评论</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  成为第一个参与讨论的人
                </p>
              </CardContent>
            </Card>
          )}

          {/* 页脚说明 */}
          <Card className="bg-white/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                <p>
                  数据来自 <a href="https://github.com/EndlessPixel/EndlessPixel-Modpack" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline">GitHub Repository</a>。
                  自动更新，缓存时间 30 秒。
                </p>
                <p className="mt-2">
                  想要参与讨论？点击右上角在 GitHub 中查看完整对话。
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