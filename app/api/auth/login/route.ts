import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, createSessionToken, SESSION_MAX_AGE } from "@/lib/session";

// 后端已迁到独立域名（同时承载登录与用户数据），走 HTTPS 443；接口路径不变。
const LOGIN_API_URL = `https://login-and-data.epmc.qzz.io/v1/api/auth/login`;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,16}$/;
const PASSWORD_MIN_LENGTH = 6;

/**
 * 取可信客户端 IP：只信由本机反代写入的 x-real-ip（外部不可伪造），
 * 不再信任可被调用方自由伪造的 x-forwarded-for。
 */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "127.0.0.1"
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, password } = body;
    if (!name || !password) {
      return NextResponse.json({ error: "缺少用户名或密码" }, { status: 400 });
    }
    if (!USERNAME_PATTERN.test(name)) {
      return NextResponse.json({ error: "用户名格式无效" }, { status: 400 });
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      return NextResponse.json({ error: "密码长度不足" }, { status: 400 });
    }
    const clientIp = getClientIp(request);
    const res = await fetch(LOGIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Real-IP": clientIp,
      },
      // 后端改为接收明文密码：全链路依赖 HTTPS 保障传输安全，
      // 该字段切勿写进日志或错误上报。
      body: JSON.stringify({ name, password }),
    });
    let data;
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { success: false, message: text || "未知错误" };
    }

    // 适配后端新增的限流/失败锁定：429 表示请求过于频繁或被临时锁定
    if (res.status === 429) {
      const retryAfter = res.headers.get("retry-after");
      return NextResponse.json(
        {
          success: false,
          error: "rate_limited",
          retryAfter: retryAfter ? Number(retryAfter) : undefined,
          message: data.message || "尝试过于频繁，请稍后再试",
        },
        { status: 429, headers: retryAfter ? { "Retry-After": retryAfter } : {} },
      );
    }

    const safeName = data.name && USERNAME_PATTERN.test(data.name) ? data.name : name;

    if (data.success === true) {
      // 下发签名会话 cookie（HttpOnly，前端无法伪造/读取）
      const sessionToken = createSessionToken(safeName);
      const cookieStore = await cookies();
      cookieStore.set(SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
      });
    }

    return NextResponse.json({
      name: safeName,
      success: data.success === true,
    });
  } catch (error) {
    console.error("登录代理失败:", error);
    return NextResponse.json({ error: "请求失败" }, { status: 500 });
  }
}
