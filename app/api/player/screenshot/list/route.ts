import { NextRequest } from "next/server";
import { proxyJson } from "@/lib/proxy";

/**
 * 玩家截图图册索引代理。
 * 上游：EndlessPixel-Player-Image 仓库的 assets.json。
 */
const TARGET_API_URL =
  "https://raw.githubusercontent.com/EndlessPixel/EndlessPixel-Player-Image/main/assets.json";

export function GET(request: NextRequest) {
  return proxyJson(request, TARGET_API_URL);
}
