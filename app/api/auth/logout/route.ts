import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/session";
import { CONSENT_COOKIE } from "@/lib/ai-data-consent";

export async function POST() {
  const cookieStore = await cookies();
  // 清除 HttpOnly 签名会话 cookie（前端 JS 无法删除 HttpOnly cookie）
  cookieStore.delete(SESSION_COOKIE);
  // AI 读取玩家数据的授权随会话一起失效，避免下次登录被别人沿用
  cookieStore.delete(CONSENT_COOKIE);
  return NextResponse.json({ success: true });
}
