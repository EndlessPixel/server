import { NextRequest, NextResponse } from "next/server";

/**
 * 登录凭据校验的**本地开发转发**。
 *
 * 为什么需要它：登录后端（`login-and-data.epmc.qzz.io`）的 CORS 白名单只放行官网域名，
 * 本地开发时页面的 origin 是 `https://localhost:3000`，浏览器预检直接被拒
 * （后端返回 `Disallowed CORS origin`，前端表现为 `TypeError: Failed to fetch`），
 * 本地根本没法登录，也就没法验证需要登录态的功能。
 *
 * ⚠️ 转发时**绝对不要带 `Origin` / `Referer` / 伪造的 `User-Agent`**。
 * 实测带浏览器特征反而会被后端前面的 Cloudflare 判成可疑请求，直接返回
 * `404 Page not found`；不带这些头则正常返回业务 JSON。
 *
 * 生产环境不走这里：`LoginContent` 在 production 下仍由浏览器直连后端，
 * 那边 origin 与白名单匹配，且能避开服务端出口 IP 的风控问题。
 * 本路由在 production 下直接 404，不对外暴露。
 */
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const base = (
    process.env.NEXT_PUBLIC_AUTH_API_BASE_URL || "https://login-and-data.epmc.qzz.io"
  ).replace(/\/+$/, "");

  let body: string;
  try {
    body = await req.text();
  } catch {
    return NextResponse.json({ success: false, message: "请求格式错误" }, { status: 400 });
  }

  try {
    const res = await fetch(`${base}/v1/api/auth/login`, {
      method: "POST",
      // 只保留必要的内容类型，其余头一律不带 —— 见文件头的说明
      headers: { "Content-Type": "application/json" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    const text = await res.text();
    return new NextResponse(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json",
        // 限流时的重试提示要透传，前端依赖它给出等待时间
        ...(res.headers.get("retry-after")
          ? { "Retry-After": res.headers.get("retry-after") as string }
          : {}),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "登录服务暂时不可用，请稍后重试" },
      { status: 502 },
    );
  }
}
