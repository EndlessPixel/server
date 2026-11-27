import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

const USER_INFO_API_URL = `https://login-and-data.epmc.qzz.io/v1/api/users/info`;

export async function GET(request: NextRequest) {
  try {
    // 鉴权只认服务端签名的会话 cookie；明文 mc_user 仅前端显示用，不可作为凭证
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const name = verifySessionToken(token);

    if (!name) {
      // 清理异常会话 cookie：用户浏览器里若残留旧版/损坏/伪造的 ep_session
      // （例如登录系统升级前的旧 cookie），虽然校验失败会返回 401，但残留的
      // 坏 cookie 可能让旧用户一直卡在"未登录"的怪异状态。这里在检测到
      // 存在却无效的 ep_session 时主动清除，使其回到干净的"未登录"态，
      // 引导用户用新系统重新登录（旧签名机制不兼容，无法无损迁移，故做清理）。
      if (token) {
        try {
          const cookieStore = await cookies();
          cookieStore.delete(SESSION_COOKIE);
        } catch {
          // 忽略 cookie 写入失败，不影响 401 返回
        }
      }
      return NextResponse.json({ error: "未登录或登录已失效" }, { status: 401 });
    }

    const url = new URL(USER_INFO_API_URL);
    url.searchParams.append("name", name);

    // IP 来源只信由本机反代写入的 x-real-ip（外部不可伪造）
    const clientIp =
      request.headers.get("x-real-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "127.0.0.1";

    const res = await fetch(url.toString(), {
      headers: {
        // 后端 _client_ip() 读 x-forwarded-for 的第一个值（限流 60 次/60 秒按它计数）
        "X-Real-IP": clientIp,
        "X-Forwarded-For": clientIp,
      },
    });

    // 安全解析响应，防止非 JSON 崩溃。
    // 上游（FastAPI）故障时会直接吐 `text/plain` 的 "Internal Server Error"，
    // 这里要把它与「本站自身出错」区分开：返回 502 而不是 500，
    // 前端才能给出「数据服务暂时不可用」这类准确提示。
    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      console.error("[users/info] 上游返回非 JSON 响应:", res.status, contentType);
      return NextResponse.json(
        { error: "upstream_unavailable", message: "玩家数据服务暂时不可用，请稍后重试" },
        { status: 502 },
      );
    }

    const data = await res.json();

    if (!res.ok) {
      // 后端是 FastAPI：HTTPException 的提示语在 detail 字段里
      const detail = typeof data?.detail === "string" ? (data.detail as string) : "";
      // 适配后端限流：429 表示请求过于频繁
      if (res.status === 429) {
        const retryAfter = res.headers.get("retry-after");
        return NextResponse.json(
          {
            error: "rate_limited",
            retryAfter: retryAfter ? Number(retryAfter) : undefined,
            message: detail || "请求过于频繁，请稍后再试",
          },
          { status: 429, headers: retryAfter ? { "Retry-After": retryAfter } : {} },
        );
      }
      // 404 = 登录态有效、但该玩家在游戏库里没有记录，前端要能把这种情况与「后端故障」区分开
      if (res.status === 404) {
        return NextResponse.json(
          { error: "not_found", detail: detail || "未找到该玩家的数据" },
          { status: 404 },
        );
      }
      // 其余错误不直接透传，防止信息泄露
      return NextResponse.json({ error: "获取用户信息失败" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("用户信息代理失败:", error);
    return NextResponse.json({ error: "请求失败，请稍后重试" }, { status: 500 });
  }
}
