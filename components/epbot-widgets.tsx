"use client";

import { useEffect, useState, type HTMLAttributes } from "react";
import { Clock, Server, CalendarClock, Loader2, Star, GitFork, ExternalLink, Signal, Users, MessageCircle, Package, Tag, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { RunningDuration } from "@/components/running-duration";
import { DEFAULT_MIRRORS, type MirrorConfig } from "@/lib/mirrors";

/**
 * 轻量请求缓存：同一 URL 在 TTL 内只真正请求一次。
 * 卡片组件（ping / github / qq 等）在父组件频繁 re-render 或重挂载时
 * 会反复触发 useEffect，加缓存可避免重复打后端、浪费接口额度。
 */
const FETCH_CACHE_TTL = 60_000;
const _fetchCache = new Map<string, { expires: number; ok: boolean; json: unknown }>();
async function fetchCached(
  url: string,
): Promise<{ ok: boolean; json: any }> {
  const now = Date.now();
  const hit = _fetchCache.get(url);
  if (hit && hit.expires > now) {
    return { ok: hit.ok, json: hit.json };
  }
  const res = await fetch(url);
  const json = await res.json().catch(() => ({}));
  _fetchCache.set(url, { expires: now + FETCH_CACHE_TTL, ok: res.ok, json });
  return { ok: res.ok, json };
}

/**
 * EPBot 富文本卡片组件。
 * 模型在回复中以独立的 HTML 标签 <widget name="xxx" attr="yyy" /> 输出，
 * 必须独占一行（前后换行），不嵌入普通句子。
 * 前端用 react-markdown + rehype-raw 直接把 <widget> 标签渲染成卡片，
 * 原始标签不显示在正文里，也不再使用脆弱的占位符机制。
 */

export type WidgetDescriptor = {
  name: string;
  attrs: Record<string, string>;
};

/**
 * 供 react-markdown 的 components.widget 使用：把原始 <widget> HTML 标签
 * 的属性直接映射成 WidgetDescriptor 并渲染为对应卡片。
 * HTML 属性经 rehype-raw 传递后保留原始小写名称（name/host/repo/...）。
 */
export function WidgetTag(props: HTMLAttributes<HTMLElement>) {
  const { name, host, repo, number, founded, date, children, node, ...rest } =
    props as Record<string, string> & { children?: React.ReactNode };
  void children;
  void node;
  void rest;
  const widgetName = name || "";
  const attrs: Record<string, string> = {};
  for (const [k, v] of Object.entries(props)) {
    if (typeof v === "string" && k !== "node" && k !== "children" && k !== "ref") {
      attrs[k] = v;
    }
  }
  return (
    <div data-widget-card>
      <WidgetBlock widget={{ name: widgetName, attrs }} />
    </div>
  );
}


function WidgetShell({
  icon,
  title,
  children,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        "my-2 rounded-xl border border-border/60 bg-secondary/40 p-3",
        "flex items-start gap-3 backdrop-blur-sm",
      )}
    >
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
        style={accent ? { color: accent } : undefined}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-muted-foreground">{title}</div>
        <div className="mt-1 text-sm text-foreground">{children}</div>
      </div>
    </div>
  );
}

/** 当前时间卡片：纯前端实时走，不依赖 API */
function ClockWidget() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = (d: Date) =>
    d.toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
    });
  return (
    <WidgetShell icon={<Clock className="w-4 h-4" />} title="当前时间">
      {now ? fmt(now) : <Loader2 className="w-4 h-4 animate-spin" />}
      <span className="ml-1 text-xs text-muted-foreground">(北京时间 CST)</span>
    </WidgetShell>
  );
}

type McStatus = {
  online?: boolean;
  players?: { online?: number; max?: number };
  version?: string | { name?: string };
  motd?: { raw?: string[] } | string;
};

/** 服务器状态卡片：调 /api/ping/epmc 与 /api/mcserver/epmc */
function ServerStatusWidget({ host }: { host: string }) {
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [data, setData] = useState<McStatus | null>(null);
  const [ping, setPing] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [mc, pg] = await Promise.all([
          fetch("/api/mcserver/epmc").then((r) => r.json()),
          fetch("/api/ping/epmc").then((r) => r.json()),
        ]);
        if (!alive) return;
        const pingStatus =
          pg?.data?.status ?? pg?.status;
        const online: boolean =
          typeof mc?.online === "boolean"
            ? mc.online
            : pingStatus === "up";
        const players = mc?.players ?? {};
        const version: string =
          typeof mc?.version === "object"
            ? mc?.version?.name ?? "—"
            : (mc?.version as string) ?? "—";
        setData({
          online,
          players,
          version,
          motd: mc?.motd,
        });
        setPing(
          typeof pg?.data?.ping === "number"
            ? pg.data.ping
            : typeof pg?.ping === "number"
              ? pg.ping
              : null,
        );
        setState("ok");
      } catch {
        if (alive) setState("err");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (state === "loading")
    return (
      <WidgetShell icon={<Server className="w-4 h-4" />} title={`服务器状态 · ${host}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
      </WidgetShell>
    );

  const online = data?.online;
  const players = data?.players?.online ?? 0;
  const max = data?.players?.max ?? "—";
  const version = data?.version ?? "—";

  return (
    <WidgetShell
      icon={<Server className="w-4 h-4" />}
      title={`服务器状态 · ${host}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span
          className={cn(
            "inline-flex items-center gap-1 font-medium",
            online ? "text-green-500" : "text-destructive",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              online ? "bg-green-500" : "bg-destructive",
            )}
          />
          {online ? "在线" : "离线"}
        </span>
        <span>在线 {String(players)}/{String(max)}</span>
        <span className="text-muted-foreground">版本 {String(version)}</span>
        {ping !== null && (
          <span className="text-muted-foreground">延迟 {ping}ms</span>
        )}
      </div>
    </WidgetShell>
  );
}

/** 服务器创立时长卡片：直接复用项目现成的 RunningDuration 组件 */
function ServerUptimeWidget({ founded }: { founded?: string }) {
  let startDate: Date | undefined;
  if (founded) {
    const d = new Date(founded);
    if (!Number.isNaN(d.getTime())) startDate = d;
  }
  return (
    <WidgetShell icon={<CalendarClock className="w-4 h-4" />} title="服务器已运行">
      <RunningDuration size="md" showIcon startDate={startDate} />
      {startDate && (
        <span className="ml-1 text-xs text-muted-foreground">
          （自 {startDate.toLocaleDateString("zh-CN", { timeZone: "Asia/Shanghai" })}）
        </span>
      )}
    </WidgetShell>
  );
}

/** 根据 widget 描述渲染对应卡片 */
export function WidgetBlock({ widget }: { widget: WidgetDescriptor }) {
  switch (widget.name) {
    case "clock":
      return <ClockWidget />;
    case "server_status":
      return (
        <ServerStatusWidget host={widget.attrs.host || "mc.endlesspixel.cn"} />
      );
    case "server_uptime":
      return (
        <ServerUptimeWidget
          founded={widget.attrs.founded || widget.attrs.date}
        />
      );
    case "github_repo":
      return <GithubRepoWidget repo={widget.attrs.repo || ""} />;
    case "server_ping":
      return (
        <ServerPingWidget host={widget.attrs.host || "mc.endlesspixel.cn"} />
      );
    case "qq_group":
      return <QQGroupWidget number={widget.attrs.number || "870594910"} />;
    case "modpack_latest":
      return (
        <ModpackLatestWidget
          repo={widget.attrs.repo || "EndlessPixel/EndlessPixel-Modpack"}
        />
      );
    default:
      return null;
  }
}

type GithubRepoData = {
  full_name: string;
  owner?: string;
  owner_avatar?: string;
  description?: string | null;
  html_url?: string;
  homepage?: string | null;
  language?: string | null;
  stargazers_count?: number;
  forks_count?: number;
  watchers_count?: number;
  open_issues_count?: number;
  license?: string | null;
  topics?: string[];
  archived?: boolean;
  updated_at?: string;
};

/** GitHub 仓库卡片：前端只给 owner/repo，服务端预取 star 等元数据 */
function GithubRepoWidget({ repo }: { repo: string }) {
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [data, setData] = useState<GithubRepoData | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");

  useEffect(() => {
    if (!repo) {
      setState("err");
      setErrMsg("缺少仓库名（应为 owner/repo）");
      return;
    }
    let alive = true;
    (async () => {
      try {
        const { ok, json } = await fetchCached(
          `/api/github/repo?repo=${encodeURIComponent(repo)}`,
        );
        if (!alive) return;
        if (!ok) {
          setState("err");
          setErrMsg(json?.error || "获取仓库信息失败");
          return;
        }
        setData(json);
        setState("ok");
      } catch {
        if (alive) {
          setState("err");
          setErrMsg("网络错误");
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [repo]);

  const title = data?.full_name || repo || "GitHub 仓库";

  if (state === "loading") {
    return (
      <WidgetShell icon={<Star className="w-4 h-4" />} title={title}>
        <Loader2 className="w-4 h-4 animate-spin" />
      </WidgetShell>
    );
  }

  if (state === "err") {
    return (
      <WidgetShell icon={<Star className="w-4 h-4" />} title={title}>
        <span className="text-destructive">{errMsg || "加载失败"}</span>
      </WidgetShell>
    );
  }

  const d = data!;
  return (
    <a
      href={d.html_url || `https://github.com/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-opacity hover:opacity-80"
    >
      <WidgetShell
        icon={
          d.owner_avatar ? (
            // 用 img 渲染头像，lucide 无 GitHub 图标
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={d.owner_avatar}
              alt={d.owner || ""}
              className="h-4 w-4 rounded-full"
            />
          ) : (
            <Star className="w-4 h-4" />
          )
        }
        title={title}
      >
        {d.description && (
          <div className="mb-1.5 text-sm text-foreground/90">
            {d.description}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {d.language && (
            <span className="inline-flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary/70" />
              {d.language}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5" />
            {d.stargazers_count?.toLocaleString("zh-CN") ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5" />
            {d.forks_count?.toLocaleString("zh-CN") ?? 0}
          </span>
          {d.license && <span>{d.license}</span>}
          {d.archived && (
            <span className="text-amber-500">已归档</span>
          )}
          <span className="inline-flex items-center gap-0.5 text-primary">
            在 GitHub 查看
            <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </WidgetShell>
    </a>
  );
}

/** 服务器延迟卡片：调 /api/ping/epmc 获取延迟 */
function ServerPingWidget({ host }: { host?: string }) {
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [ping, setPing] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { json } = await fetchCached("/api/ping/epmc");
        if (!alive) return;
        const s =
          json?.data?.status ?? json?.status ?? (json?.ping != null ? "up" : "");
        const p =
          typeof json?.data?.ping === "number"
            ? json.data.ping
            : typeof json?.ping === "number"
              ? json.ping
              : typeof json?.avg === "number"
                ? json.avg
                : null;
        if (p == null && !s) {
          setState("err");
          return;
        }
        setStatus(s);
        setPing(typeof p === "number" ? Math.round(p) : p);
        setState("ok");
      } catch {
        if (alive) setState("err");
      }
    })();
    return () => {
      alive = false;
    };
  }, [host]);

  if (state === "loading")
    return (
      <WidgetShell icon={<Signal className="w-4 h-4" />} title={`网络延迟 · ${host}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
      </WidgetShell>
    );

  if (state === "err")
    return (
      <WidgetShell icon={<Signal className="w-4 h-4" />} title={`网络延迟 · ${host}`}>
        <span className="text-destructive">获取延迟失败</span>
      </WidgetShell>
    );

  const up = status === "up" || status === "online" || ping !== null;
  const quality =
    ping === null
      ? null
      : ping < 50
        ? { label: "极佳", color: "text-green-500" }
        : ping < 120
          ? { label: "良好", color: "text-emerald-500" }
          : ping < 250
            ? { label: "一般", color: "text-amber-500" }
            : { label: "偏高", color: "text-destructive" };

  return (
    <WidgetShell icon={<Signal className="w-4 h-4" />} title={`网络延迟 · ${host}`}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span
          className={cn(
            "inline-flex items-center gap-1 font-medium",
            up ? "text-green-500" : "text-destructive",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              up ? "bg-green-500" : "bg-destructive",
            )}
          />
          {up ? "可达" : "不可达"}
        </span>
        {ping !== null && (
          <span className="text-muted-foreground">{Math.round(ping)}ms</span>
        )}
        {quality && <span className={quality.color}>网络{quality.label}</span>}
      </div>
    </WidgetShell>
  );
}

type QQGroupData = {
  group_id?: string;
  group_name?: string;
  avatar_url?: string;
  description?: string;
  join_url?: string;
  member_count?: number;
  max_member_count?: number;
  tag?: string;
};

/** QQ 群卡片：调 /api/qq/groupinfo 拉取官方群信息 */
function QQGroupWidget({ number }: { number: string }) {
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [data, setData] = useState<QQGroupData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { json } = await fetchCached("/api/qq/groupinfo");
        if (!alive) return;
        if (!json?.group_id && !json?.group_name) {
          setState("err");
          return;
        }
        setData(json);
        setState("ok");
      } catch {
        if (alive) setState("err");
      }
    })();
    return () => {
      alive = false;
    };
  }, [number]);

  const copy = async () => {
    const id = data?.group_id || number;
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const title = data?.group_name || `官方 QQ 群 ${data?.group_id || number}`;
  const joinUrl =
    data?.join_url || `https://qm.qq.com/q/${data?.group_id || number}`;

  if (state === "loading")
    return (
      <WidgetShell icon={<MessageCircle className="w-4 h-4" />} title="官方 QQ 群">
        <Loader2 className="w-4 h-4 animate-spin" />
      </WidgetShell>
    );

  if (state === "err")
    return (
      <WidgetShell icon={<MessageCircle className="w-4 h-4" />} title="官方 QQ 群">
        <span className="text-destructive">获取群信息失败</span>
      </WidgetShell>
    );

  const d = data!;
  return (
    <WidgetShell
      icon={
        d.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={d.avatar_url}
            alt={d.group_name || ""}
            className="h-4 w-4 rounded"
          />
        ) : (
          <MessageCircle className="w-4 h-4" />
        )
      }
      title={title}
    >
      {d.description && (
        <div className="mb-1.5 text-sm text-foreground/90">{d.description}</div>
      )}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {d.group_id && (
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            群号 {d.group_id}
          </span>
        )}
        {typeof d.member_count === "number" && (
          <span>
            {d.member_count.toLocaleString("zh-CN")}
            {typeof d.max_member_count === "number"
              ? ` / ${d.max_member_count.toLocaleString("zh-CN")}`
              : ""}{" "}
            人
          </span>
        )}
        {d.tag && <span>{d.tag}</span>}
        <a
          href={joinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 text-primary hover:underline"
        >
          申请加入
          <ExternalLink className="h-3 w-3" />
        </a>
        <button
          type="button"
          onClick={copy}
          className="transition-colors hover:text-foreground"
        >
          {copied ? "已复制" : "复制群号"}
        </button>
      </div>
    </WidgetShell>
  );
}

type ReleaseData = {
  tag_name?: string;
  name?: string;
  html_url?: string;
  published_at?: string | null;
  prerelease?: boolean;
  body?: string;
  assets?: { name: string; url: string; size: number }[];
};

function formatSize(bytes?: number) {
  if (typeof bytes !== "number" || bytes <= 0) return "";
  const mb = bytes / 1024 / 1024;
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  return `${mb.toFixed(0)} MB`;
}

function formatDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 官方整合包最新版本卡片：调 /api/github/release 拉取最新 release */
function ModpackLatestWidget({ repo }: { repo: string }) {
  const [state, setState] = useState<"loading" | "ok" | "err">("loading");
  const [data, setData] = useState<ReleaseData | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { json } = await fetchCached(
          `/api/github/release?repo=${encodeURIComponent(repo)}`,
        );
        if (!alive) return;
        if (!json?.tag_name) {
          setState("err");
          return;
        }
        setData(json);
        setState("ok");
      } catch {
        if (alive) setState("err");
      }
    })();
    return () => {
      alive = false;
    };
  }, [repo]);

  if (state === "loading")
    return (
      <WidgetShell icon={<Package className="w-4 h-4" />} title="官方整合包">
        <Loader2 className="w-4 h-4 animate-spin" />
      </WidgetShell>
    );

  if (state === "err")
    return (
      <WidgetShell icon={<Package className="w-4 h-4" />} title="官方整合包">
        <span className="text-destructive">获取最新版本失败</span>
      </WidgetShell>
    );

  const d = data!;
  const download =
    d.assets && d.assets.length > 0
      ? d.assets[0]
      : { name: "", url: d.html_url || "", size: 0 };

  return (
    <WidgetShell
      icon={<Package className="w-4 h-4" />}
      title={`官方整合包 · ${d.name || d.tag_name}`}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-1 font-medium text-primary">
          <Tag className="h-3.5 w-3.5" />
          最新版 {d.tag_name}
        </span>
        {d.published_at && (
          <span className="text-muted-foreground">
            发布于 {formatDate(d.published_at)}
          </span>
        )}
        {d.prerelease && <span className="text-amber-500">预发布</span>}
      </div>
      {download.url && (
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <a
            href={download.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <Download className="h-3.5 w-3.5" />
            {download.name || "前往下载"}
            {formatSize(download.size) && (
              <span className="opacity-70">
                （{formatSize(download.size)}）
              </span>
            )}
            <ExternalLink className="h-3 w-3" />
          </a>
          <a
            href={d.html_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-muted-foreground hover:text-foreground"
          >
            更新说明
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}
      {download.url && (
        <div className="mt-1.5 border-t border-border/60 pt-1.5">
          <div className="mb-1 text-xs text-muted-foreground">镜像加速下载</div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            {DEFAULT_MIRRORS.slice(0, 3).map((m: MirrorConfig) => (
              <a
                key={m.tag}
                href={`${m.url}${download.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-primary hover:underline"
                title={m.tip}
              >
                {m.tag}
                {m.recommended && (
                  <span className="text-[10px] text-emerald-500">荐</span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}
    </WidgetShell>
  );
}
