import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, createSessionToken, SESSION_MAX_AGE } from "@/lib/session";

// 后端已迁到独立域名（同时承载登录与用户数据），走 HTTPS 443；接口路径不变。
const LOGIN_API_URL = `https://login-and-data.epmc.qzz.io/v1/api/auth/login`;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,16}$/;
// 后端支持「用户名 或 邮箱」登录：命中邮箱格式按 email 列查，否则按 name 列查。
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PASSWORD_MIN_LENGTH = 6;

const isLoginIdentifier = (value: unknown): value is string =>
  typeof value === "string" && (USERNAME_PATTERN.test(value) || EMAIL_PATTERN.test(value));

/**
 * 后端是 FastAPI：业务响应是 `{ success, message }`，
 * 而 HTTPException（限流 / 失败锁定 / 参数校验）的响应体是 `{ detail }`。
 * 两种都要取，否则会丢掉「账号已临时锁定，请 N 秒后重试」这类关键提示。
 */
function pickBackendMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object") {
    const { detail, message } = data as { detail?: unknown; message?: unknown };
    if (typeof detail === "string" && detail) return detail;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}

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
    if (!isLoginIdentifier(name)) {
      return NextResponse.json({ error: "用户名或邮箱格式无效" }, { status: 400 });
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      return NextResponse.json({ error: "密码长度不足" }, { status: 400 });
    }
    const clientIp = getClientIp(request);
    const res = await fetch(LOGIN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 后端 _client_ip() 读的是 x-forwarded-for 的第一个值；只发 X-Real-IP 的话，
        // 后端看到的是本机地址，限流与失败锁定都会按它计数（等于全站共用一个额度）。
        "X-Real-IP": clientIp,
        "X-Forwarded-For": clientIp,
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

    // 后端限流（10 次/60 秒）与失败锁定（5 次/5 分钟 → 锁 5 分钟）都返回 429 + Retry-After，
    // 提示语在 FastAPI 的 detail 里，要取出来（含剩余秒数）。
    if (res.status === 429) {
      const retryAfter = res.headers.get("retry-after");
      return NextResponse.json(
        {
          success: false,
          error: "rate_limited",
          retryAfter: retryAfter ? Number(retryAfter) : undefined,
          message: pickBackendMessage(data, "尝试过于频繁，请稍后再试"),
        },
        { status: 429, headers: retryAfter ? { "Retry-After": retryAfter } : {} },
      );
    }

    // 其余非 2xx（FastAPI 的参数校验会返回 422）不能被当成「密码错误」，
    // 统一按后端故障处理，避免误导玩家去反复改密码。
    if (!res.ok) {
      console.error(`[auth/login] 后端异常 ${res.status}: ${pickBackendMessage(data, "")}`);
      return NextResponse.json(
        { success: false, error: pickBackendMessage(data, "登录服务暂时不可用，请稍后再试") },
        { status: 502 },
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
      // 后端在响应里带 email（登录成功时为绑定邮箱，失败为空串），一并透传
      email: typeof data.email === "string" ? data.email : "",
      message: pickBackendMessage(data, ""),
      success: data.success === true,
    });
  } catch (error) {
    console.error("登录代理失败:", error);
    return NextResponse.json({ error: "请求失败" }, { status: 500 });
  }
}
