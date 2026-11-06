import { NextResponse } from "next/server";
import {
  CAPTCHA_COOKIE,
  CAPTCHA_MAX_AGE,
  randomCaptchaCode,
  renderCaptchaSvg,
  sealCaptcha,
} from "@/lib/captcha";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 下发一张新验证码：
 * - 响应体是给用户看的 SVG
 * - 答案用 AES-GCM 加密后写进 HttpOnly cookie（客户端 JS 读不到明文）
 * 每次请求都会覆盖旧 cookie，所以「点击图片刷新」天然作废旧答案。
 */
export async function GET() {
  const code = randomCaptchaCode();

  const res = new NextResponse(renderCaptchaSvg(code), {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      // 验证码必须每次都不一样，禁止浏览器与 CDN 缓存
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
    },
  });

  res.cookies.set(CAPTCHA_COOKIE, sealCaptcha(code), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CAPTCHA_MAX_AGE,
  });

  return res;
}
