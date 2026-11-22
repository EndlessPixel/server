/**
 * 服务可用率历史 —— 读取外部探测数据仓库。
 *
 * 数据由 `EndlessPixel/status` 仓库的 GitHub Actions 每小时采集一次（见那边的
 * `scripts/check.mjs`），本站只负责读取与计算。不建数据库的原因：一小时一条，
 * 一年不到九千条，JSON 按月分文件完全够用，且公开仓库天然可审计。
 *
 * ⚠️ 数据仓库挂了不能拖垮状态页 —— 所以这里所有失败都返回 null，
 * 由页面决定「没有历史数据」时怎么展示。
 */

/** 探测数据仓库（公开，无需 token） */
const DATA_RAW_BASE = "https://raw.githubusercontent.com/EndlessPixel/status/main/data";

/** 展示窗口：30 天。脚本那边保留 3 个月，留了余量 */
export const HISTORY_DAYS = 30;

/** 与页面 revalidate 对齐；数据本身每小时才更新一次 */
const REVALIDATE_SECONDS = 300;

/** 月度文件里的一条记录：t = 时间，r = { 服务键: [是否成功, 耗时ms] } */
type CheckRecord = { t: string; r: Record<string, [number, number]> };

export type UptimeWindow = {
  /** 该窗口内的探测总次数（不含该服务缺失的记录） */
  total: number;
  up: number;
  /** 可用率 0~1；无样本时为 null */
  ratio: number | null;
};

/** 单次探测采样，供时间线悬浮时逐条展示 */
export type DailySample = {
  /** HH:MM（UTC，与数据源一致；页面上会注明） */
  time: string;
  ok: boolean;
  /** 耗时毫秒 */
  ms: number;
};

export type DailyBar = {
  /** YYYY-MM-DD（UTC） */
  date: string;
  ratio: number | null;
  total: number;
  samples: DailySample[];
};

export type ServiceHistory = {
  day: UptimeWindow;
  week: UptimeWindow;
  month: UptimeWindow;
  /** 最近 30 天，按日期升序，用于时间线 */
  days: DailyBar[];
};

/**
 * 可用率文案：不到 100% 时保留一位小数。
 *
 * 阈值取 99.95% —— 再高就直接说 100%，否则 `toFixed(1)` 会把 99.96% 四舍五入成
 * "100.0%"，看起来像一次都没失败过。
 */
export function formatRatio(ratio: number | null): string {
  if (ratio === null) return "—";
  if (ratio >= 0.9995) return "100%";
  return `${(ratio * 100).toFixed(1)}%`;
}

/** 与服务探测脚本里的 `SERVICES[].key` 保持一致 */
const SERVICE_KEYS = ["web", "mc", "ai", "rankings", "monitor"] as const;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

/**
 * 取需要的月份：30 天窗口最多跨两个自然月。
 * 返回由近到远，方便逐个尝试。
 */
function neededMonths(): string[] {
  const now = new Date();
  return [
    monthKey(now),
    monthKey(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))),
  ];
}

async function fetchMonth(month: string): Promise<CheckRecord[]> {
  const res = await fetch(`${DATA_RAW_BASE}/${month}.json`, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { Accept: "application/json" },
  });

  // 月初还没有上月文件是正常情况，不当成错误
  if (!res.ok) return [];

  const json = (await res.json()) as { checks?: CheckRecord[] };
  if (!Array.isArray(json.checks)) return [];

  return json.checks.filter((c) => typeof c?.t === "string" && c.r && typeof c.r === "object");
}

function makeWindow(records: CheckRecord[], key: string, sinceMs: number): UptimeWindow {
  let total = 0;
  let up = 0;
  for (const record of records) {
    if (Date.parse(record.t) < sinceMs) continue;
    const sample = record.r[key];
    if (!Array.isArray(sample)) continue;
    total += 1;
    if (sample[0] === 1) up += 1;
  }
  return { total, up, ratio: total > 0 ? up / total : null };
}

/** 按 UTC 日期聚合，供时间线使用（同时保留每次采样，供悬浮展示明细） */
function makeDailyBars(records: CheckRecord[], key: string, sinceMs: number): DailyBar[] {
  const buckets = new Map<string, { total: number; up: number; samples: DailySample[] }>();

  for (const record of records) {
    if (Date.parse(record.t) < sinceMs) continue;
    const sample = record.r[key];
    if (!Array.isArray(sample)) continue;

    const date = dayKey(record.t);
    const bucket = buckets.get(date) ?? { total: 0, up: 0, samples: [] };
    bucket.total += 1;
    if (sample[0] === 1) bucket.up += 1;
    bucket.samples.push({
      time: record.t.slice(11, 16),
      ok: sample[0] === 1,
      ms: sample[1] ?? 0,
    });
    buckets.set(date, bucket);
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, { total, up, samples }]) => ({
      date,
      total,
      ratio: total > 0 ? up / total : null,
      // 时间线从左到右就是时间顺序，这里再按时间排一次，避免数据被手动补跑打乱
      samples: samples.sort((a, b) => a.time.localeCompare(b.time)),
    }));
}

/**
 * 拉取全部服务的历史可用率。
 *
 * 返回 null 表示数据源完全不可用（页面据此隐藏历史区块，
 * 而不是显示一片 0% 让人误以为服务一直挂）。
 */
export async function fetchStatusHistory(): Promise<Record<string, ServiceHistory> | null> {
  try {
    const months = await Promise.all(neededMonths().map(fetchMonth));
    const records = months.flat().sort((a, b) => a.t.localeCompare(b.t));
    if (records.length === 0) return null;

    const now = Date.now();
    const DAY = 24 * 60 * 60 * 1000;
    const sinceThirty = now - HISTORY_DAYS * DAY;

    const result: Record<string, ServiceHistory> = {};
    for (const key of SERVICE_KEYS) {
      result[key] = {
        day: makeWindow(records, key, now - DAY),
        week: makeWindow(records, key, now - 7 * DAY),
        month: makeWindow(records, key, sinceThirty),
        days: makeDailyBars(records, key, sinceThirty),
      };
    }
    return result;
  } catch {
    return null;
  }
}
