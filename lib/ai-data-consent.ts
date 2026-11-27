/**
 * AI 读取玩家数据的授权开关。
 *
 * 权限存在独立的 HMAC 签名 cookie 里，不塞进 ep_session（改动会话结构风险大）。
 * 格式 `granted|name|expires.sig`，服务端用 SESSION_SECRET 验签，
 * 前端拿不到密钥，改不动授权状态。
 *
 * 默认关闭 —— 没这个 cookie（或验签失败）时，AI 不会拿到任何玩家数据。
 */

import { createHmac, timingSafeEqual } from "crypto";
import { getSessionSecret } from "@/lib/session";

export const CONSENT_COOKIE = "ep_ai_consent";
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 90; // 90 天

export type Consent = {
  granted: boolean;
  name: string;
  expires: number;
};

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function createConsentToken(granted: boolean, name: string): string {
  const expires = Date.now() + CONSENT_MAX_AGE * 1000;
  const payload = `${granted ? 1 : 0}|${name}|${expires}`;
  return `${payload}.${sign(payload)}`;
}

/** 验签并解析；任何异常都当作未授权 */
export function verifyConsentToken(token: string | undefined): Consent | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;

  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payload);

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const [grantedRaw, name, expiresRaw] = payload.split("|");
  const expires = Number(expiresRaw);
  if (!name || !/^[01]$/.test(grantedRaw) || Number.isNaN(expires) || expires < Date.now()) {
    return null;
  }

  return { granted: grantedRaw === "1", name, expires };
}

/**
 * 只有授权人本人且 granted 才生效。
 * 防止 A 的授权 cookie 被复制到 B 的浏览器后仍然生效。
 */
export function isAiDataAllowed(token: string | undefined, sessionName: string): boolean {
  const consent = verifyConsentToken(token);
  return !!consent && consent.granted && consent.name === sessionName;
}
