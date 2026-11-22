import { Card, CardContent } from "@/components/ui/card";
import { DOMAINS, domainProgress, formatDomainDate, type DomainProgress } from "@/lib/domains";

/**
 * 域名到期状态 —— 纯展示的服务端组件。
 *
 * 进度条分两段：左段灰色 = 已经用掉的时间，右段着色 = 剩下的时间。
 * 这样「还剩多少」是靠颜色和长度一起表达的，不用读数字也能看出来。
 */

/** 剩余 120 天内标黄（该准备续费了），30 天内标红；已过期直接红 */
function toneFor(progress: DomainProgress): { bar: string; text: string } {
  if (progress.expired || progress.daysLeft <= 30) {
    return { bar: "bg-red-500", text: "text-red-600 dark:text-red-400" };
  }
  if (progress.daysLeft <= 120) {
    return { bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" };
  }
  return { bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" };
}

export function DomainStatus() {
  const now = Date.now();

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {DOMAINS.map((domain) => {
        const progress = domainProgress(domain, now);
        const tone = toneFor(progress);
        const usedPercent = Math.round(progress.elapsedRatio * 100);

        return (
          <Card
            key={domain.name}
            className="rounded-2xl border-foreground/8 bg-card backdrop-blur-sm"
          >
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-foreground">{domain.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {domain.registrar} · {domain.cost}
                  </p>
                </div>
                <span className={`shrink-0 text-sm font-semibold ${tone.text}`}>
                  {progress.expired ? "已过期" : `剩 ${progress.daysLeft} 天`}
                </span>
              </div>

              <div
                className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-secondary"
                role="progressbar"
                aria-label={`${domain.name} 有效期已用 ${usedPercent}%`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={usedPercent}
              >
                {/* 过期后剩余段宽度为 0，已用段必须跟着转红，否则整条会变成一片灰看不出异常 */}
                <div
                  className={`h-full ${progress.expired ? tone.bar : "bg-muted-foreground/30"}`}
                  style={{ width: `${usedPercent}%` }}
                />
                <div className={`h-full ${tone.bar}`} style={{ width: `${100 - usedPercent}%` }} />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{formatDomainDate(domain.since)}</span>
                <span>{formatDomainDate(domain.until)}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
