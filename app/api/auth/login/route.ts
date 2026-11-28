import { NextRequest, NextResponse } from "next/server";

/**
 * 登录凭据校验的服务端转发（本地与生产统一走这里）。
 *
 * 浏览器直连后端时，Cloudflare 会间歇性把请求判为可疑，返回 404 HTML 挑战页
 * （实测 5 次里约 1 次），用户表现为随机登录失败。
 * 本站转发剥离了 Origin / Referer / User-Agent 等浏览器特征，后端稳定返回业务 JSON。
 *
 * ⚠️ 转发时**绝对不要带 `Origin` / `Referer` / 伪造的 `User-Agent`**。
 * 实测带浏览器特征反而会被后端前面的 Cloudflare 判成可疑请求，直接返回
 * `404 Page not found`；不带这些头则正常返回业务 JSON。
 */
export async function POST(req: NextRequest) {
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
    const post = () =>
      fetch(`${base}/v1/api/auth/login`, {
        method: "POST",
        // 只保留必要的内容类型，其余头一律不带 —— 见文件头的说明
        headers: { "Content-Type": "application/json" },
        body,
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
      });

    let res = await post();
    let text = await res.text();

    // Cloudflare 偶发返回 404 HTML 挑战页（实测约 1/5），不是业务响应。
    // 重试一次；还不行就明确报 502，绝不把 HTML 透传给前端冒充 JSON。
    const looksLikeChallenge =
      res.status === 404 || !(res.headers.get("content-type") || "").includes("application/json");
    if (looksLikeChallenge) {
      console.warn("[auth/login] 后端返回非业务响应，重试一次:", res.status);
      res = await post();
      text = await res.text();
    }

    if (
      res.status === 404 ||
      !(res.headers.get("content-type") || "").includes("application/json")
    ) {
      console.error("[auth/login] 后端连续返回非业务响应");
      return NextResponse.json(
        { success: false, message: "登录服务暂时不可用，请稍后重试" },
        { status: 502 },
      );
    }

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
