"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

import { ModelIcon } from "@/components/model-icon";
import { cn } from "@/lib/utils";
import {
  RANKING_PERIODS,
  formatTokens,
  type RankedModel,
  type RankingPeriod,
  type RankingRow,
} from "@/lib/ranking-types";

type SortMode = "rank" | "tokens";

type SortState = {
  /** 按哪个周期排；null 表示用默认顺序（今日名次优先） */
  period: RankingPeriod | null;
  /** rank = 名次升序；tokens = 消耗量降序 */
  mode: SortMode | null;
};

/**
 * 一个周期格子。
 *
 * 上行是名次（统一尺寸的徽章，前三名实心、其余浅底，视觉对齐更整齐），
 * 下行是该周期消耗的 Token 数。占比不单独列 —— 同一周期内总量固定，
 * 占比能由消耗量算出来，属于冗余信息。
 */
function PeriodCell({ cell }: { cell: RankedModel | undefined }) {
  if (!cell) {
    return (
      <td className="px-3 py-3 text-right">
        <span className="text-sm text-muted-foreground/40" aria-label="未上榜">
          —
        </span>
      </td>
    );
  }
  return (
    <td className="px-3 py-3 text-right">
      <span
        className={cn(
          "inline-flex h-6 w-7 items-center justify-center rounded-md text-xs font-semibold tabular-nums",
          cell.rank <= 3 ? "bg-foreground text-background" : "bg-foreground/8 text-foreground/70",
        )}
      >
        {cell.rank}
      </span>
      <div className="mt-1.5 text-xs whitespace-nowrap text-muted-foreground tabular-nums">
        {formatTokens(cell.tokens)} tok
      </div>
    </td>
  );
}

/**
 * 模型排行表格（客户端）。
 *
 * 表头可点击排序，每个周期列三态循环：
 *   按名次升序 → 按消耗量降序 → 恢复默认（今日名次优先）。
 */
export function RankingsTable({ rows }: { rows: RankingRow[] }) {
  const [sort, setSort] = useState<SortState>({ period: null, mode: null });

  const sorted = useMemo(() => {
    if (!sort.period || !sort.mode) return rows;
    const key = sort.period;
    const byRank = (a: RankingRow, b: RankingRow) => {
      const ca = a.cells[key];
      const cb = b.cells[key];
      if (!ca && !cb) return 0;
      if (!ca) return 1; // 未上榜的排最后
      if (!cb) return -1;
      return ca.rank - cb.rank;
    };
    const byTokens = (a: RankingRow, b: RankingRow) => {
      const ca = a.cells[key];
      const cb = b.cells[key];
      if (!ca && !cb) return 0;
      if (!ca) return 1;
      if (!cb) return -1;
      return cb.tokens - ca.tokens;
    };
    return [...rows].sort(sort.mode === "rank" ? byRank : byTokens);
  }, [rows, sort]);

  const toggleSort = (period: RankingPeriod) => {
    setSort((prev) => {
      if (prev.period !== period) return { period, mode: "rank" };
      if (prev.mode === "rank") return { period, mode: "tokens" };
      return { period: null, mode: null };
    });
  };

  return (
    <>
      <div className="overflow-x-auto [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/25 hover:[&::-webkit-scrollbar-thumb]:bg-foreground/45 [&::-webkit-scrollbar-track]:bg-transparent">
        <table className="w-full min-w-[720px] border-collapse">
          <caption className="sr-only">模型调用量排行（今日 / 本周 / 本月 / 本年）</caption>
          <thead>
            <tr className="border-b border-foreground/8 text-xs text-muted-foreground">
              <th scope="col" className="py-2 pl-5 text-left font-medium">
                模型
              </th>
              {RANKING_PERIODS.map((p) => {
                const active = sort.period === p.key;
                const title = !active
                  ? `点击按「${p.label}」的名次排序`
                  : sort.mode === "rank"
                    ? `当前按${p.label}名次排序，再点一次改为按消耗量`
                    : `当前按${p.label}消耗量排序，再点一次恢复默认`;
                return (
                  <th key={p.key} scope="col" className="px-3 py-2 text-right font-medium">
                    <button
                      type="button"
                      onClick={() => toggleSort(p.key)}
                      title={title}
                      aria-label={title}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors duration-200 hover:bg-foreground/8 hover:text-foreground",
                        active && "text-foreground",
                      )}
                    >
                      {p.label}
                      {active ? (
                        sort.mode === "rank" ? (
                          <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3.5 w-3.5 opacity-35" aria-hidden="true" />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.name}
                className="border-b border-foreground/5 transition-colors duration-200 last:border-0 hover:bg-secondary/40"
              >
                <td className="py-3 pl-5">
                  <div className="flex items-center gap-2.5">
                    {/* 固定宽度占位：没有品牌图标的模型（如自研 epai-1.0）也能对齐 */}
                    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center">
                      <ModelIcon modelId={row.name} size={18} />
                    </span>
                    <div className="min-w-0">
                      <div
                        className="truncate text-sm font-medium text-foreground"
                        title={row.name}
                      >
                        {/* 去掉「厂商/」前缀 —— 厂商名就在下面一行，重复了 */}
                        {row.name.includes("/")
                          ? row.name.slice(row.name.indexOf("/") + 1)
                          : row.name}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">{row.vendor}</div>
                    </div>
                  </div>
                </td>
                {RANKING_PERIODS.map((p) => (
                  <PeriodCell key={p.key} cell={row.cells[p.key]} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground md:hidden">
        ← 左右滑动查看其它周期 →
      </p>
    </>
  );
}
