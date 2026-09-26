/**
 * AI 链路健康自检。
 *
 * 用途：AI 对话失败时，告诉玩家「断在哪一层」。
 * 链路：浏览器 → 网站后端 → nginx → 代理服务器 → 上游服务
 *
 * 各层如何判定：
 * - 浏览器 / 网站后端：能拿到这个接口的响应，本身就证明这两层是通的，恒为 true。
 * - nginx：GET /ping-nginx，非 2xx 即视为不通。
 * - 代理服务器：GET /ping，非 2xx 即视为不通。
 * - 上游服务：**不单独探测**。走到这个接口说明本次对话已经失败了：下面两层
 *   只要有一层不通，上游必然不可达；两层都通时，错误只可能出在上游。所以恒为 false。
 *
 * 注意：本接口只负责「探测并如实回报」，不判断该不该展示给玩家 ——
 * 是否展示由客户端根据失败原因是否属于服务端问题决定（403/429 等不展示）。
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** nginx 与代理服务器所在的基础地址 */
const EDGE_BASE_URL = process.env.AI_EDGE_BASE_URL || "http://156.239.230.98:8800";

/** 单次探测超时：自检不该让玩家在失败提示上再等很久 */
const PROBE_TIMEOUT_MS = 3000;

async function probe(path: string): Promise<boolean> {
  try {
    const res = await fetch(`${EDGE_BASE_URL}${path}`, {
      cache: "no-store",
      signal: AbortSignal.timeout(PROBE_TIMEOUT_MS),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  const [nginxOk, proxyOk] = await Promise.all([probe("/ping-nginx"), probe("/ping")]);

  const layers = [
    { id: "browser", label: "浏览器", ok: true },
    { id: "backend", label: "网站后端", ok: true },
    { id: "nginx", label: "nginx", ok: nginxOk },
    { id: "proxy", label: "代理服务器", ok: proxyOk },
    { id: "upstream", label: "上游服务", ok: false },
  ];

  return Response.json({ layers });
}
