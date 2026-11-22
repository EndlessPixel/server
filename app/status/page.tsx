import Link from "next/link";
import React from "react";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Server,
  Globe,
  Activity,
  ArrowRight,
  Users,
  Bot,
  Trophy,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { probeAllServices, type ServiceProbe, type ServiceState } from "@/lib/status-probes";
import {
  HISTORY_DAYS,
  fetchStatusHistory,
  formatRatio,
  type ServiceHistory,
} from "@/lib/status-history";
import { UptimeStrip } from "@/components/uptime-strip";
import { StatusRefreshButton } from "@/components/status-refresh-button";
import { DomainStatus } from "@/components/domain-status";

export const metadata: Metadata = {
  title: "服务状态 - EndlessPixel Minecraft 服务器",
  description:
    "实时查看 EndlessPixel Minecraft 服务器及各项服务的运行状态、性能监控与技术支持入口。",
  keywords: ["服务器状态", "Minecraft状态", "EndlessPixel", "服务监控", "在线状态"],
  alternates: {
    canonical: "https://www.endlesspixel.cn/status/",
  },
  openGraph: {
    title: "服务状态 | EndlessPixel Minecraft 服务器",
    description: "实时查看 EndlessPixel 服务器及各项服务的运行状态。",
    url: "https://www.endlesspixel.cn/status/",
    type: "website",
    images: [{ url: "/banner.jpg", width: 1200, height: 630, alt: "EndlessPixel 服务状态" }],
  },
};

/**
 * 状态页的自动有效期。
 *
 * 探测数据本身是**每小时**采集一次，历史部分 5 分钟内不会变；
 * 只有「当前状态」那几行会稍微旧一点。想要立刻看最新结果，用页面上的刷新按钮，
 * 不必为了这一个数字把整页压到 30 秒重算一遍（那会让每个访客都触发一轮上游探测）。
 */
export const revalidate = 300;

/** 状态 → 展示用的颜色与文案 */
const STATE_META: Record<ServiceState, { label: string; dot: string; text: string }> = {
  ok: { label: "运行正常", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
  degraded: { label: "响应异常", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  down: { label: "不可用", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
};

/** 每个服务配一个图标（按 key 取，探测层不关心展示） */
const SERVICE_ICONS: Record<string, React.ElementType> = {
  web: Globe,
  mc: Server,
  ai: Bot,
  rankings: Trophy,
  monitor: Activity,
};

const ServiceCard: React.FC<{ service: ServiceProbe; history?: ServiceHistory }> = React.memo(
  ({ service, history }) => {
    const Icon = SERVICE_ICONS[service.key] ?? Activity;
    const meta = STATE_META[service.state];

    return (
      <Card className="group rounded-2xl border-foreground/8 bg-card backdrop-blur-sm transition-all duration-300 hover:border-foreground/12 hover:shadow-xl">
        <CardContent className="flex h-full flex-col p-5 sm:p-6">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-xl bg-secondary p-3 text-foreground/70">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-foreground">{service.name}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 shrink-0 rounded-full ${meta.dot}`} aria-hidden="true" />
              <span className={`text-sm font-medium ${meta.text}`}>{meta.label}</span>
            </div>
            {service.latencyMs !== null && service.latencyMs > 0 && (
              <span className="text-xs text-muted-foreground">{service.latencyMs} ms</span>
            )}
          </div>
          <p className="mt-1 truncate text-xs text-muted-foreground" title={service.detail}>
            {service.detail}
          </p>

          {history && (
            <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">近 {HISTORY_DAYS} 天可用率</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatRatio(history.month.ratio)}
                </span>
              </div>
              <UptimeStrip days={history.days} />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>{HISTORY_DAYS} 天前</span>
                <span>今天</span>
              </div>
            </div>
          )}

          <div className="mt-auto flex items-center justify-end pt-6">
            <Button
              asChild
              size="sm"
              className="bg-foreground text-background transition-all group-hover:scale-105 hover:bg-foreground/85"
            >
              <Link
                href={service.href}
                target={service.external ? "_blank" : undefined}
                rel={service.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-2"
              >
                查看详情
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  },
);

/** 顶部总体结论：一眼看出「现在到底有没有事」 */
const OverallBanner: React.FC<{ services: ServiceProbe[] }> = ({ services }) => {
  const down = services.filter((s) => s.state === "down").length;
  const degraded = services.filter((s) => s.state === "degraded").length;

  const tone =
    down > 0
      ? {
          icon: AlertTriangle,
          box: "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400",
          title: `${down} 项服务不可用`,
          hint: "相关功能可能无法使用，我们正在排查。",
        }
      : degraded > 0
        ? {
            icon: AlertTriangle,
            box: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
            title: `${degraded} 项服务响应异常`,
            hint: "服务仍可用，但响应变慢或数据可能不完整。",
          }
        : {
            icon: CheckCircle2,
            box: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            title: "所有服务运行正常",
            hint: "未检测到异常。本页每 30 秒自动刷新检测结果。",
          };

  const Icon = tone.icon;

  return (
    <div className={`mb-10 flex items-start gap-3 rounded-2xl border p-5 ${tone.box}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-semibold">{tone.title}</p>
        <p className="mt-1 text-sm opacity-90">{tone.hint}</p>
      </div>
    </div>
  );
};

export default async function StatusIndexPage() {
  const [services, history] = await Promise.all([probeAllServices(), fetchStatusHistory()]);

  return (
    <div className="min-h-screen bg-background">
      <main className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center sm:mb-12">
            <h1 className="mb-4 text-3xl font-bold text-foreground sm:mb-6 sm:text-4xl md:text-5xl">
              服务状态监控
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
              实时状态由服务端探测得出；可用率与时间线来自
              <strong className="font-semibold text-foreground">每小时一次</strong>
              的持续监测
            </p>
            <div className="mt-6 flex flex-col items-center gap-2">
              <StatusRefreshButton />
              <p className="text-xs text-muted-foreground">
                页面每 5 分钟自动更新，也可手动刷新 · 悬停或点击时间线可查看每次检测（UTC 时间）
              </p>
            </div>
          </div>

          <OverallBanner services={services} />

          <section aria-labelledby="services-heading">
            <h2 id="services-heading" className="mb-6 text-2xl font-semibold text-foreground">
              核心服务
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <ServiceCard key={service.key} service={service} history={history?.[service.key]} />
              ))}
            </div>
          </section>

          <section className="mt-12" aria-labelledby="domains-heading">
            <h2 id="domains-heading" className="mb-2 text-2xl font-semibold text-foreground">
              域名状态
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              进度条左段为已用时间、右段为剩余时间，按北京时间计算；剩余不足 120 天标黄、不足 30
              天标红
            </p>
            <DomainStatus />
          </section>

          <section className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="rounded-2xl border-foreground/8 bg-card backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Users className="h-5 w-5 text-foreground/60" aria-hidden="true" />
                  遇到问题？
                </h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>如果你发现服务异常，或某张卡片显示不可用但实际上能用，欢迎反馈：</p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href="https://github.com/EndlessPixel/server/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="提交问题到GitHub"
                      >
                        提交 Issue
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link
                        href="https://qm.qq.com/q/sFrax2Ilxe"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="加入QQ群获取支持"
                      >
                        加入 QQ 群
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
