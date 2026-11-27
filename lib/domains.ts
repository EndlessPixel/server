/**
 * 域名注册信息 —— 状态页「域名状态」区块的数据源。
 *
 * ⚠️ 这里是**手写**的静态数据。域名续费不是自动的，续完之后记得回来改 `until`，
 * 否则状态页会一直显示「已过期」。页面上的剩余天数是按访问时间实时算出来的，
 * 只要改这里的日期，进度条与文案会自动跟着变。
 */

export type DomainEntry = {
  /** 完整域名，也是展示时的主标题 */
  name: string;
  /** 注册商 / 服务商 */
  registrar: string;
  /** 费用，写成给人看的样子 */
  cost: string;
  /** 注册或启用时间（带时区，按北京时间记录） */
  since: string;
  /** 到期时间 */
  until: string;
};

export const DOMAINS: DomainEntry[] = [
  {
    name: "endlesspixel.cn",
    registrar: "雨云",
    cost: "36￥/月",
    since: "2026-02-20T16:53:33+08:00",
    until: "2027-02-20T16:53:33+08:00",
  },
  {
    name: "epmc.top",
    registrar: "腾讯云",
    cost: "38￥/月",
    since: "2026-08-30T18:16:18+08:00",
    until: "2027-08-30T18:16:18+08:00",
  },
  {
    name: "epmc.cc.cd",
    registrar: "DNSHE",
    cost: "免费",
    since: "2026-05-27T12:38:00+08:00",
    until: "2027-05-27T20:38:00+08:00",
  },
  {
    name: "epmc.qzz.io",
    registrar: "DigitalPlat",
    cost: "免费",
    since: "2026-03-30T00:00:00+08:00",
    until: "2027-03-30T00:00:00+08:00",
  },
];

export type DomainProgress = {
  /** 总时长（天） */
  totalDays: number;
  /** 已用时间占比 0~1，用于进度条左段 */
  elapsedRatio: number;
  /** 剩余天数（不足一天按一天算；已过期为 0） */
  daysLeft: number;
  expired: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** 按当前时间算域名剩余进度；时间一律用绝对时间戳，不依赖运行环境的时区 */
export function domainProgress(entry: DomainEntry, now: number = Date.now()): DomainProgress {
  const start = Date.parse(entry.since);
  const end = Date.parse(entry.until);
  const total = end - start;
  const elapsed = now - start;

  return {
    totalDays: Math.round(total / DAY_MS),
    elapsedRatio: total > 0 ? Math.min(1, Math.max(0, elapsed / total)) : 1,
    daysLeft: Math.max(0, Math.ceil((end - now) / DAY_MS)),
    expired: now >= end,
  };
}

/** 把 ISO 时间显示成 `2027-02-20`（按北京时间，避免服务端 UTC 与本地差一天） */
export function formatDomainDate(iso: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(iso))
    .replace(/\//g, "-");
}
