import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/proxy";

/**
 * SystemStatus 后端汇总接口：一次性返回完整快照
 * { hardware_info, real_time_data, disk_usage, timestamp }
 */
const TARGET_BASE = `${process.env.TARGET_API_URL ?? ""}`.replace(/\/$/, "");
const TARGET_API_URL = `${TARGET_BASE.includes(":") ? TARGET_BASE : `${TARGET_BASE}:10735`}/api/data`;

export function GET(request: NextRequest) {
  return proxyJson(request, TARGET_API_URL);
}
