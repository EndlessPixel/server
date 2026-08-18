"use client";

import { useEffect, useState } from "react";
import { Clock, Server, CalendarClock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RunningDuration } from "@/components/running-duration";

/**
 * EPBot 富文本卡片组件。
 * 模型在回复中以 <widget name="xxx" attr="yyy" /> 形式输出，
 * 前端解析后渲染为对应卡片，原始标签不显示在正文里。
 */

export type WidgetDescriptor = {
  name: string;
  attrs: Record<string, string>;
};

/** 解析模型输出里所有 <widget ... /> 标签 */
export function parseWidgets(
  text: string,
): { widgets: WidgetDescriptor[]; rest: string } {
  const widgets: WidgetDescriptor[] = [];
  const rest = text.replace(
    /<widget\s+([^>]*?)\s*\/?>/gi,
    (_full, attrStr: string) => {
      const attrs: Record<string, string> = {};
      const nameMatch = attrStr.match(/name\s*=\s*["']([^"']+)["']/i);
      if (!nameMatch) return "";
      attrs.name = nameMatch[1];
      const re = /(\w+)\s*=\s*["']([^"']*)["']/gi;
      let m: RegExpExecArray | null;
      while ((m = re.exec(attrStr)) !== null) {
        if (m[1].toLowerCase() === "name") continue;
        attrs[m[1]] = m[2];
      }
      widgets.push({ name: attrs.name, attrs });
      return "";
    },
  );
  return { widgets, rest: rest.trim() };
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
    default:
      return null;
  }
}
