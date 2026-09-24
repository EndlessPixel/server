import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/proxy";

/** 真实上游：Minecraft 服务器状态查询服务 */
const TARGET_API_URL = "https://api.mcsrvstat.us/3/epmc.qzz.io";

export function GET(request: NextRequest) {
  return proxyJson(request, TARGET_API_URL);
}
