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
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 代理服务器所在的基础地址。
 *
 * 现在的 `API_BASE_URL` 本身就是那台代理的公网出口（代理再转发到真正的上游），
 * 所以自检默认复用它 —— 少一个需要同步维护的变量，也就少一处配错的机会。
 * `AI_EDGE_BASE_URL` 仅在上游与代理分离部署时才需要单独指定。
 */
const EDGE_BASE_URL =
  process.env.AI_EDGE_BASE_URL || process.env.API_BASE_URL || "http://156.239.230.98:8800";

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
  const proxyOk = await probe("/ping");

  const layers = [
    { id: "browser", label: "浏览器", ok: true },
    { id: "backend", label: "网站后端", ok: true },
    { id: "proxy", label: "代理服务器", ok: proxyOk },
    { id: "upstream", label: "上游服务", ok: false },
  ];

  return Response.json({ layers });
}
