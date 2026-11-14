/**
 * 模型用量排行榜 —— 服务端数据层。
 *
 * 数据由外部服务提供（`RANKINGS_API_BASE_URL`，默认走上游代理的公网出口），
 * 在**服务端**拉取并裁剪字段：
 *   - 上游一次返回 40KB 左右，其中还带时间序列（models_history / vendor_share_history），
 *     页面只用得到前 20 名，所以这里只保留展示需要的字段；
 *   - 服务端拉取也顺便绕开了浏览器跨域限制。
 *
 * 类型与常量放在 `lib/ranking-types.ts` —— 客户端组件（可排序的表格）也要用它们，
 * 放这里会把 fetch 逻辑一起打进客户端 bundle。
 */

import {
  RANKING_PERIODS,
  type PeriodRanking,
  type RankedMover,
  type RankingPeriod,
} from "@/lib/ranking-types";

export {
  RANKING_PERIODS,
  formatTokens,
  resolveVendor,
  type PeriodRanking,
  type RankedModel,
  type RankedMover,
  type RankingsByPeriod,
  type RankingPeriod,
  type RankingRow,
} from "@/lib/ranking-types";

type UpstreamRanking = {
  rank?: number;
  previous_rank?: number | null;
  model_name?: string;
  vendor?: string;
  total_tokens?: number;
  share?: number;
  growth_pct?: number;
};

type UpstreamMover = {
  model_name?: string;
  vendor?: string;
  rank_delta?: number;
  current_rank?: number;
  growth_pct?: number;
};

/**
 * 拉取某个周期的榜单。
 *
 * 失败时抛出异常，由调用方决定怎么展示 —— 排行榜是锦上添花的功能，
 * 上游挂了不该把整页拖垮。
 * `revalidate: 300` 让 Next 在 5 分钟内复用结果，避免每次访问都打到上游。
 *
 * ⚠️ 默认地址是**代理的公网出口**（即 `API_BASE_URL` 指向的那台），
 * 不是真实上游域名 —— 直连上游会被 Cloudflare 拦（403 咨询页）。
 * 代理的白名单里必须放行 `/api/rankings`，否则会拿到 403 Forbidden。
 */
export async function fetchRankings(period: RankingPeriod): Promise<PeriodRanking> {
  const baseUrl =
    process.env.RANKINGS_API_BASE_URL || process.env.API_BASE_URL || "http://156.239.230.98:8800";
  const res = await fetch(`${baseUrl}/api/rankings?period=${period}`, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`排行榜上游返回 ${res.status}`);
  }

  const json: { data?: { models?: UpstreamRanking[]; top_movers?: UpstreamMover[] } } =
    await res.json();
  const models = json.data?.models;
  if (!Array.isArray(models)) {
    throw new Error("排行榜上游返回的数据格式异常");
  }

  const movers: RankedMover[] = (json.data?.top_movers ?? [])
    .map((m) => ({
      name: String(m.model_name || ""),
      vendor: String(m.vendor || "Unknown"),
      rankDelta: Number(m.rank_delta) || 0,
      currentRank: Number(m.current_rank) || 0,
      growth: Number(m.growth_pct) || 0,
    }))
    .filter((m) => m.name);

  return {
    models: models
      .map((m) => ({
        rank: Number(m.rank) || 0,
        previousRank:
          typeof m.previous_rank === "number" && m.previous_rank > 0 ? m.previous_rank : null,
        name: String(m.model_name || ""),
        vendor: String(m.vendor || "Unknown"),
        tokens: Number(m.total_tokens) || 0,
        share: Number(m.share) || 0,
        growth: Number(m.growth_pct) || 0,
      }))
      .filter((m) => m.name),
    movers,
  };
}

/**
 * 并行拉取全部周期的榜单。
 *
 * 四个请求同时发出，各自命中 Next 的 5 分钟缓存，因此不会把首屏时间叠加成 4 倍。
 */
export async function fetchAllRankings(): Promise<Record<RankingPeriod, PeriodRanking>> {
  const entries = await Promise.all(
    RANKING_PERIODS.map(async (p) => [p.key, await fetchRankings(p.key)] as const),
  );
  return Object.fromEntries(entries) as Record<RankingPeriod, PeriodRanking>;
}
