import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";
import {
  CONSENT_COOKIE,
  CONSENT_MAX_AGE,
  createConsentToken,
  verifyConsentToken,
} from "@/lib/ai-data-consent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** 读取当前账号的授权状态 */
export async function GET() {
  const cookieStore = await cookies();
  const name = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!name) {
    return NextResponse.json({ error: "未登录或登录已失效" }, { status: 401 });
  }
  const current = verifyConsentToken(cookieStore.get(CONSENT_COOKIE)?.value);
  return NextResponse.json({
    granted: !!current && current.granted && current.name === name,
  });
}

/** 设置授权状态。只认签名会话，前端传的 name 一律忽略。 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const name = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!name) {
    return NextResponse.json({ error: "未登录或登录已失效" }, { status: 401 });
  }

  let body: { granted?: unknown } | null = null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
  if (typeof body?.granted !== "boolean") {
    return NextResponse.json({ error: "granted 必须是布尔值" }, { status: 400 });
  }

  cookieStore.set(CONSENT_COOKIE, createConsentToken(body.granted, name), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CONSENT_MAX_AGE,
  });

  return NextResponse.json({ granted: body.granted });
}
