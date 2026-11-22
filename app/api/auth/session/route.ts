import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from "@/lib/session";
import { CAPTCHA_COOKIE, verifyCaptchaToken } from "@/lib/captcha";

/**
 * 用后端签发的短期凭据换取正式会话。
 *
 * 登录流程改为「浏览器直连后端校验密码」之后，`ep_session` 仍然只能由本站签发
 * （HttpOnly cookie + 服务端密钥 HMAC，浏览器永远拿不到也伪造不了），所以留了这一跳：
 *
 *   1. 浏览器 → 后端 `/v1/api/auth/login`（直连；服务端转发会被 Cloudflare 挑战）
 *   2. 后端返回 `{ name, token }`，token = HMAC(密钥, "name|过期时间戳")
 *   3. 浏览器 → 本站 `/api/auth/session`（带 token + 验证码）
 *   4. 本站验签通过 → 签发 ep_session
 *
 * 密钥必须与源站的 `.auth_secret`（或那边的 AUTH_TOKEN_SECRET）一致。
 * 未配置时本接口一律 500 —— 宁可登不上，也不能静默放行。
 */
const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET || "";
const NAME_PATTERN = /^[a-zA-Z0-9_-]{3,16}$/;

/**
 * 校验后端签发的 `name|exp.hexsig`，返回用户名；无效/过期返回 null。
 * 用 `timingSafeEqual` 比较签名，避免时序侧信道。
 */
function verifyBackendToken(token: string): string | null {
  if (!AUTH_TOKEN_SECRET || !token) return null;

  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = createHmac("sha256", AUTH_TOKEN_SECRET).update(payload).digest("hex");
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const bar = payload.lastIndexOf("|");
  if (bar <= 0) return null;
  const name = payload.slice(0, bar);
  const exp = Number(payload.slice(bar + 1));

  if (!NAME_PATTERN.test(name)) return null;
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;
  return name;
}

export async function POST(request: NextRequest) {
  if (!AUTH_TOKEN_SECRET) {
    console.error("[auth/session] 未配置 AUTH_TOKEN_SECRET，无法签发会话");
    return NextResponse.json(
      { error: "server_misconfigured", message: "服务端登录配置缺失，请联系管理员" },
      { status: 500 },
    );
  }

  let body: { token?: unknown; captcha?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const token = typeof body.token === "string" ? body.token : "";
  const name = verifyBackendToken(token);
  if (!name) {
    return NextResponse.json(
      { error: "token_invalid", message: "登录凭据无效或已过期，请重新登录" },
      { status: 401 },
    );
  }

  // 验证码和原来保持一致：先校验，通过后立即作废（一次性）。
  // 校验失败时不消耗 token —— 用户只需换一张验证码重试，不用重新输密码。
  if (!verifyCaptchaToken(request.cookies.get(CAPTCHA_COOKIE)?.value, body.captcha)) {
    (await cookies()).delete(CAPTCHA_COOKIE);
    return NextResponse.json(
      { error: "captcha_invalid", message: "验证码错误或已过期，请点击图片刷新后重试" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.delete(CAPTCHA_COOKIE);
  cookieStore.set(SESSION_COOKIE, createSessionToken(name), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return NextResponse.json({ success: true, name });
}
