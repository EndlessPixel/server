"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  GitFork,
  Eye,
  AlertCircle,
  Scale,
  Database,
  Tag,
  GitCommit,
  Users,
  ExternalLink,
  RefreshCw,
  Clock,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";

/** 仓库坐标 */
const REPO_OWNER = "EndlessPixel";
const REPO_NAME = "server";
const REPO_API = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
const REPO_HTML = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;

/** 提交历史拉取条数 */
const COMMIT_PAGE_SIZE = 15;
/** 单次请求超时（毫秒） */
const REQUEST_TIMEOUT = 8000;
/** 数据缓存时长（毫秒）：避免每次进页面都打 GitHub API */
const CACHE_TTL = 60_000;

/* ------------------------------ 类型定义 ------------------------------ */

type RepoData = {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  subscribers_count: number;
  open_issues_count: number;
  size: number; // KB
  language: string | null;
  default_branch: string;
  license: { spdx_id: string; name: string } | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  topics?: string[];
};

type Contributor = {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
};

type Release = {
  tag_name: string;
  name: string;
  html_url: string;
  published_at: string;
  body?: string;
};

type Commit = {
  sha: string;
  html_url: string;
  commit: { message: string; author: { name: string; date: string } };
  author: { login: string; avatar_url: string } | null;
};

type Snapshot = {
  repo: RepoData | null;
  contributors: Contributor[];
  languages: Record<string, number>;
  release: Release | null;
  commits: Commit[];
  /** 各端点是否成功，用于部分降级展示 */
  errors: string[];
};

/* ------------------------------ 工具函数 ------------------------------ */

/** 经 /api/gh_api 代理请求 GitHub（服务端带 GH_TOKEN，避免未鉴权限流） */
async function ghFetch<T>(url: string): Promise<T> {
  const res = await fetch(`/api/gh_api?url=${encodeURIComponent(url)}`, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  // GitHub 限流/错误时返回对象而非数组，这里统一识别
  if (json && typeof json === "object" && !Array.isArray(json) && json.message) {
    throw new Error(String(json.message));
  }
  return json as T;
}

const formatCount = (n: number): string => {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
  }
  return String(n);
};

const formatSize = (kb: number): string => (kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`);

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "刚刚";
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} 天前`;
  const mon = Math.floor(day / 30);
  if (mon < 12) return `${mon} 个月前`;
  return `${Math.floor(mon / 12)} 年前`;
};

/** 常见语言的品牌色，用于占比条 */
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  CSS: "#663399",
  HTML: "#e34c26",
  Python: "#3572A5",
  Shell: "#89e051",
  Java: "#b07219",
  Rust: "#dea584",
  Go: "#00ADD8",
  Vue: "#41b883",
  Dockerfile: "#384d54",
  Makefile: "#427819",
  Lua: "#000080",
  "C++": "#f34b7d",
  C: "#555555",
};

const langColor = (name: string) => LANG_COLORS[name] ?? "#8b949e";

/* ------------------------------ 组件 ------------------------------ */

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-secondary ${className}`} />;
}

function StatCard({
  icon,
  label,
  value,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            {loading ? (
              <SkeletonBlock className="mt-2 h-7 w-16" />
            ) : (
              <p className="mt-1 text-2xl font-bold text-foreground truncate">{value}</p>
            )}
          </div>
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-foreground/60">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function RepoInfoSection() {
  const [data, setData] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  /** 拉取全部端点；单个失败不影响其他（Promise.allSettled） */
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [repoRes, contribRes, langRes, releaseRes, commitRes] = await Promise.allSettled([
        ghFetch<RepoData>(REPO_API),
        ghFetch<Contributor[]>(`${REPO_API}/contributors?per_page=20`),
        ghFetch<Record<string, number>>(`${REPO_API}/languages`),
        ghFetch<Release[]>(`${REPO_API}/releases?per_page=1`),
        ghFetch<Commit[]>(`${REPO_API}/commits?per_page=${COMMIT_PAGE_SIZE}`),
      ]);

      const errors: string[] = [];
      const repo = repoRes.status === "fulfilled" ? repoRes.value : null;
      const contributors = contribRes.status === "fulfilled" && Array.isArray(contribRes.value) ? contribRes.value : [];
      const languages = langRes.status === "fulfilled" && langRes.value && typeof langRes.value === "object" ? langRes.value : {};
      const release = releaseRes.status === "fulfilled" && Array.isArray(releaseRes.value) ? releaseRes.value[0] ?? null : null;
      const commits = commitRes.status === "fulfilled" && Array.isArray(commitRes.value) ? commitRes.value : [];

      if (repoRes.status === "rejected") errors.push("仓库信息");
      if (releaseRes.status === "rejected") errors.push("Releases");
      if (commitRes.status === "rejected") errors.push("提交历史");

      // 仓库主信息都拿不到才算整体失败
      if (!repo) throw new Error("无法获取仓库信息");

      setData({ repo, contributors, languages, release, commits, errors });
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 短时间内重复进入页面走 sessionStorage，避免频繁打接口
    const CACHE_KEY = "ep_repo_snapshot";
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { ts: number; data: Snapshot };
        if (Date.now() - parsed.ts < CACHE_TTL && parsed.data?.repo) {
          setData(parsed.data);
          setLoading(false);
          return;
        }
      }
    } catch {
      /* 缓存不可用时忽略 */
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data) return;
    try {
      sessionStorage.setItem("ep_repo_snapshot", JSON.stringify({ ts: Date.now(), data }));
    } catch {
      /* 忽略配额错误 */
    }
  }, [data]);

  /** 语言占比（按时长/字节数降序） */
  const langList = useMemo(() => {
    const entries = Object.entries(data?.languages ?? {});
    const total = entries.reduce((sum, [, v]) => sum + v, 0);
    if (!total) return [];
    return entries
      .sort((a, b) => b[1] - a[1])
      .map(([name, bytes]) => ({ name, percent: (bytes / total) * 100 }));
  }, [data]);

  const repo = data?.repo;

  return (
    <section className="space-y-6">
      {/* -------- 仓库头部 -------- */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 p-3 rounded-2xl bg-foreground text-background shadow-sm">
            <GithubIcon className="w-6 h-6" />
            <h2 className="text-xl font-bold">{REPO_OWNER} / {REPO_NAME}</h2>
          </div>
          <CardTitle className="text-2xl">仓库信息</CardTitle>
          <CardDescription>
            本站源码完全开源，数据实时来自 GitHub API。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && !repo ? (
            <SkeletonBlock className="h-5 w-3/4" />
          ) : repo?.description ? (
            <p className="text-sm text-muted-foreground leading-relaxed">{repo.description}</p>
          ) : null}

          <div className="flex items-center gap-3 flex-wrap">
            <Button size="sm" variant="ghost" onClick={() => window.open(REPO_HTML, "_blank")}>
              <GithubIcon className="w-4 h-4 mr-2" /> 访问仓库
            </Button>
            <Button size="sm" variant="ghost" onClick={() => window.open(`${REPO_HTML}/issues`, "_blank")}>
              <AlertCircle className="w-4 h-4 mr-2" /> 问题反馈
            </Button>
            <Button size="sm" variant="ghost" onClick={() => load()} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              刷新数据
            </Button>
            {repo?.pushed_at && !loading && (
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                最后推送 {timeAgo(repo.pushed_at)}
              </span>
            )}
          </div>

          {repo?.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {repo.topics.map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* -------- 统计卡片 -------- */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={<Star className="w-4 h-4" />} label="Stars" value={repo ? formatCount(repo.stargazers_count) : "—"} loading={loading && !repo} />
        <StatCard icon={<GitFork className="w-4 h-4" />} label="Forks" value={repo ? formatCount(repo.forks_count) : "—"} loading={loading && !repo} />
        <StatCard icon={<Eye className="w-4 h-4" />} label="Watchers" value={repo ? formatCount(repo.subscribers_count) : "—"} loading={loading && !repo} />
        <StatCard icon={<AlertCircle className="w-4 h-4" />} label="开放 Issues" value={repo ? formatCount(repo.open_issues_count) : "—"} loading={loading && !repo} />
        <StatCard
          icon={<Scale className="w-4 h-4" />}
          label="许可证"
          value={repo?.license?.spdx_id?.replace("NOASSERTION", "自定义") ?? "—"}
          loading={loading && !repo}
        />
        <StatCard icon={<Database className="w-4 h-4" />} label="仓库体积" value={repo ? formatSize(repo.size) : "—"} loading={loading && !repo} />
      </div>

      {/* -------- 语言占比 -------- */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">语言构成</CardTitle>
          <CardDescription>按代码字节数统计</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && langList.length === 0 ? (
            <>
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-4 w-1/2" />
            </>
          ) : langList.length > 0 ? (
            <>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-secondary">
                {langList.map((l) => (
                  <div
                    key={l.name}
                    style={{ width: `${l.percent}%`, backgroundColor: langColor(l.name) }}
                    title={`${l.name} ${l.percent.toFixed(1)}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {langList.map((l) => (
                  <span key={l.name} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: langColor(l.name) }} />
                    {l.name}
                    <span className="text-foreground/70">{l.percent.toFixed(1)}%</span>
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">暂无语言数据</p>
          )}
        </CardContent>
      </Card>

      {/* -------- 最新版本 -------- */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">最新版本</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading && !data?.release ? (
            <SkeletonBlock className="h-5 w-32" />
          ) : data?.release ? (
            <div className="space-y-2">
              <a
                href={data.release.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-foreground hover:underline"
              >
                {data.release.tag_name}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-xs text-muted-foreground">发布于 {formatDate(data.release.published_at)}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">暂无 Release</p>
          )}
        </CardContent>
      </Card>

      {/* -------- 提交历史 -------- */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-muted-foreground" />
              <CardTitle className="text-base">提交历史</CardTitle>
            </div>
            <a
              href={`${REPO_HTML}/commits/${repo?.default_branch ?? "main"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              在 GitHub 查看全部
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <CardDescription>最近 {COMMIT_PAGE_SIZE} 条提交</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (data?.commits?.length ?? 0) === 0 ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <SkeletonBlock className="h-4 w-3/4" />
                  <SkeletonBlock className="h-3 w-40" />
                </div>
              ))}
            </div>
          ) : (data?.commits?.length ?? 0) > 0 ? (
            <ol className="relative space-y-5 border-l border-border pl-5">
              {data!.commits.map((c) => {
                const authorName = c.author?.login ?? c.commit.author.name;
                const avatar = c.author?.avatar_url;
                return (
                  <li key={c.sha} className="relative">
                    {/* 时间线节点 */}
                    <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-foreground/40 ring-4 ring-background" />
                    <a
                      href={c.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="line-clamp-2 text-sm font-medium text-foreground hover:underline"
                    >
                      {c.commit.message.split("\n")[0]}
                    </a>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                      {avatar ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={avatar}
                          alt={authorName}
                          width={16}
                          height={16}
                          loading="lazy"
                          className="h-4 w-4 rounded-full bg-secondary"
                        />
                      ) : null}
                      <span className="text-foreground/70">{authorName}</span>
                      <span>·</span>
                      <span title={formatDate(c.commit.author.date)}>{timeAgo(c.commit.author.date)}</span>
                      <span>·</span>
                      <code className="rounded bg-secondary px-1 py-0.5 font-mono text-[11px]">
                        {c.sha.slice(0, 7)}
                      </code>
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">暂无提交记录</p>
          )}
        </CardContent>
      </Card>

      {/* -------- 贡献者 -------- */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-base">贡献者</CardTitle>
          </div>
          <CardDescription>感谢每一位提交代码的朋友</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (data?.contributors?.length ?? 0) === 0 ? (
            <div className="flex gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-10 w-10 rounded-full" />
              ))}
            </div>
          ) : (data?.contributors?.length ?? 0) > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data!.contributors.map((c) => (
                <a
                  key={c.login}
                  href={c.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${c.login} · ${c.contributions} 次提交`}
                  className="transition-transform hover:scale-110"
                >
                  {/* 使用原生 img：外链头像，避免 next/image 域名白名单限制 */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.avatar_url}
                    alt={c.login}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="h-10 w-10 rounded-full bg-secondary"
                  />
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">暂无贡献者数据</p>
          )}
        </CardContent>
      </Card>

      {/* -------- 错误/降级提示 -------- */}
      {error && (
        <Card className="border-destructive/30">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground">仓库数据加载失败</p>
                <p className="mt-1 text-muted-foreground">
                  {error}。可能是 GitHub API 限流（未配置 <code className="rounded bg-secondary px-1">GH_TOKEN</code> 时每小时仅 60 次），请稍后重试。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
