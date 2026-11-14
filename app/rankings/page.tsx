import type { Metadata } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { ContentContainer, PageHeader } from "@/components/page-primitives";
import { RankingsOverview } from "@/components/rankings-overview";
import { RankingsTable } from "@/components/rankings-table";
import {
  RANKING_PERIODS,
  fetchAllRankings,
  resolveVendor,
  type PeriodRanking,
  type RankingRow,
} from "@/lib/rankings";
import { fetchAvailableModels } from "@/lib/available-models";

export const metadata: Metadata = {
  title: "模型排行 - EndlessPixel Minecraft 服务器",
  description: "EndlessPixel AI 模型的调用量排行，今日、本周、本月、本年四个周期同表对比。",
  keywords: ["模型排行", "AI模型", "EndlessPixel", "调用量", "EPBot"],
  alternates: { canonical: "https://www.endlesspixel.cn/rankings/" },
  openGraph: {
    title: "模型排行 | EndlessPixel Minecraft 服务器",
    description: "EndlessPixel AI 模型的调用量排行，四个周期同表对比。",
    url: "https://www.endlesspixel.cn/rankings/",
    type: "website",
  },
};

/**
 * 把四个周期的榜单合成一张表。
 *
 * 行 = 四个周期出现过的模型的并集，再与「本站提供的模型」取交集 ——
 * 上游榜单里有些模型我们这边并没有（账号没开通或已过滤），展示出来玩家也选不到。
 * 列 = 周期。
 * 默认排序以「今日」名次优先，今日没上榜的再看本月 / 本周 / 本年，
 * 都没上榜的排到最后 —— 保证今天热门的模型永远在最上面。
 */
function buildRows(byPeriod: Record<string, PeriodRanking>, allowed: Set<string>): RankingRow[] {
  const map = new Map<string, RankingRow>();

  for (const period of RANKING_PERIODS) {
    for (const model of byPeriod[period.key]?.models ?? []) {
      if (!allowed.has(model.name)) continue;
      const row = map.get(model.name) ?? { name: model.name, vendor: "", cells: {} };
      row.cells[period.key] = model;
      // 厂商优先从模型 ID 的前缀推断（上游常给 "Unknown"）
      row.vendor = resolveVendor(model.name, model.vendor);
      map.set(model.name, row);
    }
  }

  const primaryRank = (row: RankingRow) =>
    row.cells.today?.rank ??
    row.cells.month?.rank ??
    row.cells.week?.rank ??
    row.cells.year?.rank ??
    Number.MAX_SAFE_INTEGER;

  return [...map.values()].sort((a, b) => primaryRank(a) - primaryRank(b));
}

export default async function RankingsPage() {
  let byPeriod: Record<string, PeriodRanking> | null = null;
  let allowed: Set<string> | null = null;
  let error: string | null = null;
  try {
    // 榜单与可用模型列表并行取；两者都命中各自的 5 分钟缓存
    const [rankings, models] = await Promise.all([
      fetchAllRankings(),
      fetchAvailableModels({ revalidate: 300 }),
    ]);
    byPeriod = rankings;
    allowed = new Set(models.map((m) => m.id));
  } catch (err) {
    error = err instanceof Error ? err.message : "未知错误";
  }

  const rows = byPeriod && allowed ? buildRows(byPeriod, allowed) : [];

  // 总览口径：只统计本站提供的模型，上游那些我们没开通的模型不计入
  const todayRows = rows.filter((r) => r.cells.today);
  const overview =
    byPeriod && allowed
      ? {
          totalModels: allowed.size,
          activeModels: todayRows.length,
          todayTokens: todayRows.reduce((sum, r) => sum + (r.cells.today?.tokens ?? 0), 0),
          vendorCount: new Set(todayRows.map((r) => r.vendor)).size,
          topModel: todayRows[0]
            ? { name: todayRows[0].name, share: todayRows[0].cells.today?.share ?? 0 }
            : undefined,
          topMover: (() => {
            const mover = byPeriod.today?.movers.find((m) => allowed.has(m.name));
            return mover ? { name: mover.name, rankDelta: mover.rankDelta } : undefined;
          })(),
        }
      : null;

  return (
    <div className="min-h-screen py-12 md:py-20">
      <ContentContainer maxWidth="wide">
        <PageHeader
          title="模型排行"
          description="按调用量统计的 AI 模型榜单，今日 / 本周 / 本月 / 本年四个周期同表对比。"
        />

        {overview && <RankingsOverview {...overview} />}

        <p className="mb-3 text-center text-xs text-muted-foreground">
          每格上方为该周期内的名次，下方为消耗的 Token 数（tok）；点击表头可排序
        </p>

        <Card className="rounded-2xl border-foreground/8 bg-card">
          <CardContent className="p-0">
            {error ? (
              <div className="px-6 py-16 text-center">
                <p className="mb-2 text-base font-medium text-foreground">排行榜暂时不可用</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <p className="mt-4 text-xs text-muted-foreground/70">
                  数据来自外部统计服务，稍后刷新重试即可。
                </p>
              </div>
            ) : rows.length === 0 ? (
              <div className="px-6 py-16 text-center text-sm text-muted-foreground">暂无数据</div>
            ) : (
              <RankingsTable rows={rows} />
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          「—」表示该周期未上榜；仅展示本站提供的模型
        </p>
      </ContentContainer>
    </div>
  );
}
