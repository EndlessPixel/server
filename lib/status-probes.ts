/**
 * 服务状态探测 —— 供 `/status` 页面使用。
 *
 * 这里探测的都是**真实**可用性：拿得到数据才算正常。
 * 早前 `/status` 只是两张卡片 + 硬编码的 `status: "online"`，渲染时连这个字段都没读，
 * 等于没有状态可言（上游挂了页面照样亮绿灯）。
 *
 * 探测在服务端完成（页面是 Server Component），因此不受 CORS 限制，
 * 也不会把上游地址暴露给浏览器。
 */

import { upstreamBaseUrl } from "@/lib/upstream";

export type ServiceState = "ok" | "degraded" | "down";

export type ServiceProbe = {
  key: string;
  name: string;
  description: string;
  state: ServiceState;
  /** 探测耗时，未测到为 null */
  latencyMs: number | null;
  /** 卡片上的一行补充信息（在线人数、响应耗时、错误原因等） */
  detail: string;
  href: string;
  external?: boolean;
};

/** 单次探测上限：状态页不能因为某个服务卡住而一直转圈 */
const PROBE_TIMEOUT_MS = 5000;

/**
 * 与页面 `revalidate` 保持一致。
 *
 * ⚠️ Next 会把页面内**所有 fetch 里最小的 revalidate** 当成页面有效期，
 * 所以这里写 30 会让整页被压到 30 秒重算（页面自己写 300 也没用）。
 * 改这里之前先确认页面的 `export const revalidate`。
 */
const REVALIDATE_SECONDS = 300;

type FetchInit = RequestInit & { next?: { revalidate: number } };

/** 带超时与缓存的 fetch，避免各探针重复写同样的样板 */
function probeFetch(url: string, init: FetchInit = {}) {
  return fetch(url, {
    ...init,
    signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    next: { revalidate: REVALIDATE_SECONDS },
  });
}

/** 跑一次探测，统一捕获异常并计时 —— 探针失败不能让整页 500 */
async function runProbe(
  fn: () => Promise<{ state: ServiceState; detail: string }>,
): Promise<{ state: ServiceState; latencyMs: number | null; detail: string }> {
  const startedAt = Date.now();
  try {
    const result = await fn();
    return { ...result, latencyMs: Date.now() - startedAt };
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "TimeoutError"
        ? "响应超时"
        : error instanceof Error
          ? error.message
          : "未知错误";
    return { state: "down", latencyMs: Date.now() - startedAt, detail: reason };
  }
}

/** 取上游地址；未配置时返回 null，由调用方标记为 down 而不是整页崩掉 */
function safeUpstreamBaseUrl(): string | null {
  try {
    return upstreamBaseUrl();
  } catch {
    return null;
  }
}

/** Minecraft 服务器：以 mcsrvstat 的 online 字段为准，顺带带上在线人数 */
async function probeMinecraft(): Promise<{ state: ServiceState; detail: string }> {
  const res = await probeFetch("https://api.mcsrvstat.us/3/epmc.qzz.io");
  if (!res.ok) {
    return { state: "degraded", detail: `状态接口返回 ${res.status}` };
  }

  const json = (await res.json()) as {
    online?: boolean;
    version?: string;
    players?: { online?: number; max?: number };
  };

  if (!json.online) {
    return { state: "down", detail: "服务器当前离线" };
  }

  const online = json.players?.online ?? 0;
  const max = json.players?.max ?? 0;
  const version = json.version ? ` · ${json.version}` : "";
  return { state: "ok", detail: `${online}/${max} 人在线${version}` };
}

/** AI 对话：只探代理的 /ping，证明转发链路活着（不消耗模型配额） */
async function probeAi(): Promise<{ state: ServiceState; detail: string }> {
  const base = safeUpstreamBaseUrl();
  if (!base) {
    return { state: "down", detail: "未配置 API_BASE_URL" };
  }

  const res = await probeFetch(`${base}/ping`);
  if (!res.ok) {
    return { state: "degraded", detail: `代理返回 ${res.status}` };
  }
  return { state: "ok", detail: "转发链路正常" };
}

/** 模型排行数据源：与 AI 同一台代理，只是路径不同 */
async function probeRankings(): Promise<{ state: ServiceState; detail: string }> {
  const base = safeUpstreamBaseUrl();
  if (!base) {
    return { state: "down", detail: "未配置 API_BASE_URL" };
  }

  const res = await probeFetch(`${base}/api/rankings?period=today`);
  // 只关心可达性与状态码；榜单正文好几万字节，没必要在状态页下载
  await res.body?.cancel();
  if (!res.ok) {
    return { state: "degraded", detail: `上游返回 ${res.status}` };
  }
  return { state: "ok", detail: "榜单数据可获取" };
}

/** 服务器性能监控：独立的一台上游，地址走 TARGET_API_URL */
async function probeMonitor(): Promise<{ state: ServiceState; detail: string }> {
  const target = process.env.TARGET_API_URL?.trim();
  if (!target) {
    return { state: "down", detail: "未配置 TARGET_API_URL" };
  }

  const res = await probeFetch(`${target.replace(/\/+$/, "")}/api/data`);
  await res.body?.cancel();
  if (!res.ok) {
    return { state: "degraded", detail: `监控接口返回 ${res.status}` };
  }
  return { state: "ok", detail: "性能数据可获取" };
}

/**
 * 并行探测全部服务。
 *
 * 每个探针各自兜底，任何一个失败都不影响其它卡片。
 */
export async function probeAllServices(): Promise<ServiceProbe[]> {
  const [minecraft, ai, rankings, monitor] = await Promise.all([
    runProbe(probeMinecraft),
    runProbe(probeAi),
    runProbe(probeRankings),
    runProbe(probeMonitor),
  ]);

  // 本站不用探：页面能渲染出来，本身就说明它在跑
  const website: ServiceProbe = {
    key: "web",
    name: "网站服务",
    description: "本站页面与接口",
    state: "ok",
    latencyMs: 0,
    detail: "当前页面由本站渲染",
    href: "/",
  };

  return [
    website,
    {
      key: "mc",
      name: "Minecraft 服务器",
      description: "游戏服务器在线状态",
      href: "/status/mcserverstatus",
      ...minecraft,
    },
    {
      key: "ai",
      name: "AI 对话服务",
      description: "EPBot 所用上游转发链路",
      href: "/",
      ...ai,
    },
    {
      key: "rankings",
      name: "模型排行数据源",
      description: "模型用量榜单上游",
      href: "/rankings",
      ...rankings,
    },
    {
      key: "monitor",
      name: "服务器性能监控",
      description: "宿主机硬件数据",
      href: process.env.TARGET_API_URL?.trim() || "/status",
      external: true,
      ...monitor,
    },
  ];
}
