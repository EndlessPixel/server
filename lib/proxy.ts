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

/**
 * 纯转发代理路由的「路径 → 上游 URL」映射表。
 *
 * 这些接口此前各自占一个 route.ts（内容完全一致：常量 + proxyJson），
 * 现由 `app/api/[...proxy]/route.ts` 统一处理；**对外 URL 保持不变**。
 *
 * ⚠️ 属于对外公共接口，仓库内零引用属正常现象，勿按“未引用”删除。
 */
export const PROXY_TARGETS: Record<string, string> = {
  // Minecraft 服务器状态查询
  "mcserver/epmc": "https://api.mcsrvstat.us/3/epmc.qzz.io",
  // 第三方聚合服务（注意不要指向本项目自身域名，否则会自循环）
  "ping/epmc": "https://uapis.cn/api/v1/network/ping?host=mc.endlesspixel.cn",
  "qq/groupinfo": "https://uapis.cn/api/v1/social/qq/groupinfo?group_id=870594910",
  // 官网可达性探测（供外部监控 / 状态页调用）
  webstatus: "https://uapis.cn/api/v1/network/urlstatus?url=https%3A%2F%2Fwww.endlesspixel.cn",
  // 玩家截图图册索引
  "player/screenshot/list":
    "https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main/assets.json",
};
