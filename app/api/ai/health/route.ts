/**
 * AI 链路健康自检。
 *
 * 用途：AI 对话失败时，告诉玩家「断在哪一层」。
 * 链路：浏览器 → 网站后端 → 代理服务器 → 上游服务
 *
 * 各层如何判定：
 * - 浏览器 / 网站后端：能拿到这个接口的响应，本身就证明这两层是通的，恒为 true。
 * - 代理服务器：GET /ping，非 2xx 即视为不通。
 * - 上游服务：**不单独探测**。走到这个接口说明本次对话已经失败了：下面那层
 *   只要不通，上游必然不可达；它通的时候，错误只可能出在上游。所以恒为 false。
 *
 * 注意：本接口只负责「探测并如实回报」，不判断该不该展示给玩家 ——
 * 是否展示由客户端根据失败原因是否属于服务端问题决定（403/429 等不展示）。
 */
import { upstreamBaseUrl } from "@/lib/upstream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 单次探测超时：自检不该让玩家在失败提示上再等很久 */
const PROBE_TIMEOUT_MS = 3000;

/**
 * 探测代理服务器。
 *
 * 地址复用 `API_BASE_URL` —— 对话、模型列表、排行榜都指向同一台代理，
 * 没必要为自检单开一个变量（见 `lib/upstream.ts`）。
 * 读不到地址时探测结果直接判为 false，不在这里抛异常。
 */
async function probe(path: string): Promise<boolean> {
  try {
    const res = await fetch(`${upstreamBaseUrl()}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  const proxyOk = await probe("/ping");

  const layers = [
    { id: "browser", label: "浏览器", ok: true },
    { id: "backend", label: "网站后端", ok: true },
    { id: "proxy", label: "代理服务器", ok: proxyOk },
    { id: "upstream", label: "上游服务", ok: false },
  ];

  return Response.json({ layers });
}
