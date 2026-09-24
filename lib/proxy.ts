import { NextRequest, NextResponse } from "next/server";

/**
 * 第三方 JSON 代理的公共实现。
 *
 * 多个路由（mcserver / ping / qq / systemstatus）此前是一模一样的复制粘贴：
 * 透传请求头 -> fetch -> 原样返回 JSON -> 失败兜底。这里统一收敛一份。
 */

/** 透传客户端 IP：部分第三方聚合接口按来源 IP 计费 / 限流 */
function forwardedHeaders(request: NextRequest): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-Forwarded-For":
      request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1",
    Referer: "",
    Origin: "",
  };
}

/** GET 上游并把 JSON 原样透传给前端；失败统一返回 { error: '请求失败' } 500 */
export async function proxyJson(request: NextRequest, targetUrl: string): Promise<NextResponse> {
  try {
    const res = await fetch(targetUrl, {
      method: "GET",
      headers: forwardedHeaders(request),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "请求失败" }, { status: 500 });
  }
}
