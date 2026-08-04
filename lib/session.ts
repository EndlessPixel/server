import { createHmac, timingSafeEqual } from 'crypto';

/**
 * 服务端签名会话工具。
 *
 * 登录态不再使用明文用户名 cookie，而是改为服务端用密钥 HMAC 签名的
 * 「name|过期时间戳」令牌，写入 HttpOnly + Secure + SameSite=Lax 的 cookie。
 * 这样客户端无法伪造身份（拿不到密钥、也改不了内容），旧的明文 mc_user
 * 仅保留给前端显示昵称，不再承担任何鉴权作用。
 */

export const SESSION_COOKIE = 'ep_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 天（秒）

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  // 开发环境兜底：生产环境务必通过环境变量配置 SESSION_SECRET（>=16 位）
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      '[session] 生产环境未配置 SESSION_SECRET，请设置至少 16 位的环境变量，否则会话可被伪造。'
    );
  }
  return 'dev-only-insecure-session-secret-change-me';
}

function sign(payload: string): string {
  const mac = createHmac('sha256', getSecret()).update(payload).digest('base64url');
  return mac;
}

/** 生成签名会话令牌 */
export function createSessionToken(name: string): string {
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${name}|${exp}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

/** 校验会话令牌，返回用户名；无效/过期返回 null */
export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const lastDot = token.lastIndexOf('.');
  if (lastDot <= 0) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = sign(payload);
  // 常量时间比较，避免计时侧信道
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const sep = payload.lastIndexOf('|');
  if (sep <= 0) return null;
  const name = payload.slice(0, sep);
  const exp = Number(payload.slice(sep + 1));
  if (!name || Number.isNaN(exp) || exp < Date.now()) return null;
  return name;
}
