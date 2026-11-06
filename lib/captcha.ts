import crypto from "crypto";
import { getSessionSecret } from "@/lib/session";

/**
 * SVG 验证码。
 *
 * 设计要点：
 * 1. **无状态**：答案不存服务端内存/数据库（Vercel 多实例下不可靠），
 *    而是用 AES-256-GCM 加密后写进 HttpOnly cookie。只有服务端持有密钥，
 *    客户端 JS 读不到明文，也改不了内容（改了就解不开）。
 * 2. **用后即清**：登录接口校验通过后立即清除该 cookie，正常浏览器下次必须重新获取。
 *    注意这是**尽力而为**：令牌本身是无状态的，脚本若自己保留旧 cookie，在有效期内
 *    仍可重复提交。真正的防爆破靠后端限流（10 次/60 秒）与失败锁定（5 次 → 锁 5 分钟）。
 * 3. **短时效**：默认 3 分钟过期，过期后同样要求重新获取。
 *
 * ⚠️ 能力边界：SVG 里的字符是以 <text> 呈现的，解析 XML 就能读出字符，
 * 所以它挡得住「无脑脚本、简单批量尝试」，挡不住针对性的自动化。
 * 要更强的话得改用位图（PNG）或把字形转成 path 轮廓。
 */

export const CAPTCHA_COOKIE = "ep_captcha";
/** 有效期的秒数（同时用于 cookie maxAge 与令牌内的过期时间） */
export const CAPTCHA_MAX_AGE = 180;
const CAPTCHA_TTL_MS = CAPTCHA_MAX_AGE * 1000;

/** 去掉容易混淆的 I/O/0/1，减少「明明填对了却报错」 */
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 4;

function getKey(): Buffer {
  // 从会话密钥派生一把独立的验证码密钥，避免两处用途共用同一把 key
  return crypto.createHash("sha256").update(`captcha|${getSessionSecret()}`).digest();
}

/** 生成随机验证码（默认 4 位） */
export function randomCaptchaCode(length = CODE_LENGTH): string {
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

/** 把「验证码 + 过期时间」加密成可放进 cookie 的串（iv.tag.ciphertext，base64url） */
export function sealCaptcha(code: string, expiresAt = Date.now() + CAPTCHA_TTL_MS): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getKey(), iv);
  cipher.setAAD(Buffer.from("ep-captcha-v1"));
  const plaintext = JSON.stringify({ code: code.toUpperCase(), exp: expiresAt });
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((b) => b.toString("base64url")).join(".");
}

/**
 * 校验用户输入是否与 cookie 里的验证码一致（大小写不敏感）。
 * 令牌缺失 / 解密失败 / 过期 / 不匹配都返回 false。
 */
export function verifyCaptchaToken(token: string | undefined, input: unknown): boolean {
  if (!token || typeof input !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  try {
    const [ivB64, tagB64, dataB64] = parts;
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      getKey(),
      Buffer.from(ivB64, "base64url"),
    );
    decipher.setAAD(Buffer.from("ep-captcha-v1"));
    decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(dataB64, "base64url")),
      decipher.final(),
    ]).toString("utf8");

    const parsed = JSON.parse(plaintext) as { code?: unknown; exp?: unknown };
    if (typeof parsed.code !== "string" || typeof parsed.exp !== "number") return false;
    if (Date.now() > parsed.exp) return false;

    const expected = Buffer.from(parsed.code.toUpperCase());
    const actual = Buffer.from(input.trim().toUpperCase());
    // 常量时间比较，顺便挡住长度不同时的提前返回
    if (expected.length !== actual.length) return false;
    return crypto.timingSafeEqual(expected, actual);
  } catch {
    // 解密失败（篡改 / 换过密钥 / 格式不对）一律视为无效
    return false;
  }
}

/** 渲染验证码 SVG：随机旋转 + 波浪干扰线 + 噪点 */
export function renderCaptchaSvg(code: string): string {
  const chars = code.split("");
  const width = 120;
  const height = 40;

  const glyphs = chars
    .map((ch, i) => {
      const x = 14 + i * 24 + Math.random() * 6;
      const y = 28 + (Math.random() * 6 - 3);
      const rotate = (Math.random() * 30 - 15).toFixed(1);
      const gray = 60 + Math.floor(Math.random() * 60);
      const size = 22 + Math.floor(Math.random() * 5);
      return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${size}" fill="rgb(${gray},${gray},${gray})" transform="rotate(${rotate} ${x.toFixed(1)} ${y.toFixed(1)})">${ch}</text>`;
    })
    .join("");

  const lines = Array.from({ length: 3 })
    .map(() => {
      const y1 = Math.random() * height;
      const y2 = Math.random() * height;
      const cx1 = width * 0.25 + Math.random() * 20;
      const cx2 = width * 0.6 + Math.random() * 20;
      const cy1 = Math.random() * height;
      const cy2 = Math.random() * height;
      return `<path d="M0 ${y1.toFixed(1)} C ${cx1.toFixed(1)} ${cy1.toFixed(1)}, ${cx2.toFixed(1)} ${cy2.toFixed(1)}, ${width} ${y2.toFixed(1)}" stroke="rgba(128,128,128,0.45)" stroke-width="1" fill="none"/>`;
    })
    .join("");

  const dots = Array.from({ length: 28 })
    .map(() => {
      const cx = (Math.random() * width).toFixed(1);
      const cy = (Math.random() * height).toFixed(1);
      return `<circle cx="${cx}" cy="${cy}" r="${(Math.random() * 1.2 + 0.4).toFixed(1)}" fill="rgba(128,128,128,0.5)"/>`;
    })
    .join("");

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="验证码">`,
    `<g font-family="ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" font-weight="700" letter-spacing="1">${glyphs}</g>`,
    lines,
    dots,
    `</svg>`,
  ].join("");
}
