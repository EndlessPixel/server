/**
 * 排行榜的共享类型与纯函数。
 *
 * 单独拆出来，是因为可排序的表格是**客户端**组件，它也要用这些常量 ——
 * 如果放在 `lib/rankings.ts` 里，import 会把服务端的 fetch 逻辑一起打进客户端 bundle。
 */

/** 榜单周期（上游 `?period=` 参数） */
export type RankingPeriod = "today" | "week" | "month" | "year";

/**
 * 四个周期会并排展示在**同一张表**里 —— 每列一个周期，方便横向对比同一模型
 * 在不同时间跨度下的名次与消耗量，而不是让用户来回切标签。
 */
export const RANKING_PERIODS: ReadonlyArray<{ key: RankingPeriod; label: string }> = [
  { key: "today", label: "今日" },
  { key: "week", label: "本周" },
  { key: "month", label: "本月" },
  { key: "year", label: "本年" },
];

export type RankedModel = {
  /** 当前名次 */
  rank: number;
  /** 上一周期名次；null 表示新上榜 */
  previousRank: number | null;
  /** 模型 ID，与 /api/ai/models 的 id 同源，可直接喂给 ModelIcon */
  name: string;
  /** 厂商名，上游对未识别厂商给 "Unknown" */
  vendor: string;
  /** 周期内消耗的 token 数 */
  tokens: number;
  /** 占全站的比例（0~1） */
  share: number;
  /** 相比上一周期的增长百分比，负数为下降 */
  growth: number;
};

/** 四个周期的榜单；键为周期 */
export type RankingsByPeriod = Record<RankingPeriod, RankedModel[]>;

/** 名次变化最剧烈的模型（上游 top_movers） */
export type RankedMover = {
  name: string;
  vendor: string;
  /** 名次变化，正数表示上升 */
  rankDelta: number;
  currentRank: number;
  /** 消耗量变化百分比 */
  growth: number;
};

/** 一个周期的完整榜单数据 */
export type PeriodRanking = {
  /** 该周期的模型榜（上游只给前 20） */
  models: RankedModel[];
  /** 名次上升最快的模型 */
  movers: RankedMover[];
};

/** 表格的一行：模型 + 各周期下的榜单条目 */
export type RankingRow = {
  name: string;
  vendor: string;
  /** 各周期下该模型的榜单条目；某周期未上榜则缺省 */
  cells: Partial<Record<RankingPeriod, RankedModel>>;
};

/**
 * 模型 ID 前缀 → 厂商名。
 *
 * 上游对不少模型给不出厂商（`vendor` 字段是 "Unknown"），
 * 但模型 ID 自带「厂商/模型名」的前缀，据此能推出更准确的厂商。
 */
const VENDOR_BY_PREFIX: Record<string, string> = {
  "01-ai": "零一万物",
  ai21labs: "AI21",
  "deepseek-ai": "DeepSeek",
  google: "Google",
  ibm: "IBM",
  meta: "Meta",
  microsoft: "Microsoft",
  minimaxai: "MiniMax",
  mistralai: "Mistral",
  moonshotai: "Moonshot",
  nvidia: "NVIDIA",
  openai: "OpenAI",
  "stepfun-ai": "阶跃星辰",
  "z-ai": "智谱",
};

/**
 * 解析厂商名：优先用模型 ID 的前缀推断，其次用上游给的厂商名。
 * 两者都认不出时返回「未知厂商」。
 */
export function resolveVendor(modelName: string, upstreamVendor: string): string {
  const slash = modelName.indexOf("/");
  if (slash > 0) {
    const guessed = VENDOR_BY_PREFIX[modelName.slice(0, slash).toLowerCase()];
    if (guessed) return guessed;
  }
  if (upstreamVendor && upstreamVendor !== "Unknown") return upstreamVendor;
  return "未知厂商";
}

/**
 * Token 数按中文习惯折算：亿 / 万 / 千分位。
 *
 * 万级取整 —— 免得出现「9319.7 万」这种又长又带小数的写法；
 * 亿级保留一位小数，保证「3.6 亿」这种量级读起来直观。
 */
export function formatTokens(n: number): string {
  if (n >= 1e8) return `${(n / 1e8).toFixed(1)} 亿`;
  if (n >= 1e4) return `${Math.round(n / 1e4).toLocaleString("zh-CN")} 万`;
  return n.toLocaleString("zh-CN");
}
