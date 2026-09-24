import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/proxy";

/** 真实上游：第三方聚合服务（注意不要指向本项目自身域名，否则会自循环） */
const TARGET_API_URL = "https://uapis.cn/api/v1/social/qq/groupinfo?group_id=870594910";

export function GET(request: NextRequest) {
  return proxyJson(request, TARGET_API_URL);
}
