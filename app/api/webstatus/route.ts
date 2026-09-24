import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/proxy";

/**
 * 官网可达性探测代理（供外部监控 / 状态页调用）。
 * 上游：uapis.cn 的 urlstatus 接口。
 */
const TARGET_API_URL =
  "https://uapis.cn/api/v1/network/urlstatus?url=https%3A%2F%2Fwww.endlesspixel.cn";

export function GET(request: NextRequest) {
  return proxyJson(request, TARGET_API_URL);
}
