import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/proxy";

/** 真实上游：第三方聚合服务（注意不要指向本项目自身域名，否则会自循环） */
const TARGET_API_URL = "https://uapis.cn/api/v1/network/ping?host=mc.endlesspixel.cn";

export function GET(request: NextRequest) {
  return proxyJson(request, TARGET_API_URL);
}
