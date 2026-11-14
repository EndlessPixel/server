import { Flame, TrendingUp, Trophy } from "lucide-react";

import { formatTokens } from "@/lib/ranking-types";

export type RankingsOverviewProps = {
  /** 本站提供的模型总数 */
  totalModels: number;
  /** 今日有调用的模型数 */
  activeModels: number;
  /** 今日消耗的 Token 数（只算本站提供的模型） */
  todayTokens: number;
  /** 今日活跃的厂商数 */
  vendorCount: number;
  /** 今日最热门的模型 */
  topModel?: { name: string; share: number };
  /** 今日名次上升最多的模型 */
  topMover?: { name: string; rankDelta: number };
};

/** 去掉模型 ID 的「厂商/」前缀，与表格里的显示保持一致 */
const shortName = (name: string) => (name.includes("/") ? name.slice(name.indexOf("/") + 1) : name);

/**
 * 排行榜总览。
 *
 * 口径说明：所有数字都只统计**本站提供的模型** ——
 * 上游榜单里还有我们没有开通的模型，混进来会让「今日消耗」对不上玩家看到的排行。
 */
export function RankingsOverview({
  totalModels,
  activeModels,
  todayTokens,
  vendorCount,
  topModel,
  topMover,
}: RankingsOverviewProps) {
  const stats = [
    { label: "本站模型", value: String(totalModels), hint: "个可选", icon: Trophy },
    { label: "今日活跃", value: String(activeModels), hint: "个模型有调用", icon: Flame },
    { label: "今日消耗", value: formatTokens(todayTokens), hint: "tok", icon: Flame },
    { label: "覆盖厂商", value: String(vendorCount), hint: "个品牌", icon: TrendingUp },
  ];

  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-foreground/8 bg-card px-4 py-3 backdrop-blur-sm"
            >
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {s.label}
              </div>
              <div className="mt-1.5 text-2xl font-bold text-foreground tabular-nums">
                {s.value}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground/70">{s.hint}</div>
            </div>
          );
        })}
      </div>

      {(topModel || topMover) && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 text-xs text-muted-foreground">
          {topModel && (
            <span>
              今日最热：
              <b className="font-medium text-foreground">{shortName(topModel.name)}</b>
              <span className="ml-1">占比 {(topModel.share * 100).toFixed(1)}%</span>
            </span>
          )}
          {topMover && (
            <span>
              名次上升最快：
              <b className="font-medium text-foreground">{shortName(topMover.name)}</b>
              <span className="ml-1 text-emerald-600 dark:text-emerald-400">
                ↑ {topMover.rankDelta} 位
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
