import { NextRequest, NextResponse } from "next/server";
import { PROXY_TARGETS, proxyJson } from "@/lib/proxy";

/**
 * 纯转发代理路由的统一入口。
 *
 * 此前 /api/mcserver/epmc、/api/ping/epmc、/api/qq/groupinfo、/api/webstatus、
 * /api/player/screenshot/list 各自占一个 route.ts，内容完全一致（上游常量 + proxyJson）。
 * 现合并到本文件，由 lib/proxy.ts 的 PROXY_TARGETS 做「路径 → 上游 URL」映射。
 *
 * **对外 URL 保持不变**；这些是供第三方调用的公共接口，仓库内零引用属正常现象，
 * 勿按“未引用”删除。
 *
 * 注意：Next.js 中具体路由（如 /api/ai/chat、/api/mclang/items）优先级高于 catch-all，
 * 本文件只兜底 PROXY_TARGETS 中登记的路径，未登记的一律 404。
 */
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ proxy: string[] }> },
) {
  const { proxy } = await params;
  const target = PROXY_TARGETS[proxy.join("/")];

  if (!target) {
    return NextResponse.json({ error: "未找到对应的代理端点" }, { status: 404 });
  }

  return proxyJson(request, target);
}
