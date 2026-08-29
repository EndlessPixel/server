# 👤 个人中心

登录后的玩家资料页，展示账户信息与 3D 皮肤预览。

---

## 会话与鉴权

会话工具集中在 `lib/session.ts`（Node `crypto`，仅服务端可用）。

### 令牌结构

采用 **HMAC-SHA256 + base64url** 签名的无状态令牌：

```ts
export const SESSION_COOKIE = 'ep_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;   // 7 天 = 604800 秒
export const PROVIDER_COOKIE = 'ep_provider';      // 登录来源：minecraft / github

export function createSessionToken(name: string): string {
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${name}|${exp}`;
  const sig = sign(payload);          // createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${sig}`;
}
```

### 密钥 `SESSION_SECRET`

```ts
function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === 'production') {
    console.warn('[session] 生产环境未配置 SESSION_SECRET…会话可被伪造。');
  }
  return 'dev-only-insecure-session-secret-change-me';
}
```

**要求长度 ≥ 16 位**；不满足（含未设置）时回退到源码中的硬编码兜底串，并在生产环境打印警告。**部署时必须配置。**

> ⚠️ 该变量未写入 `.env.example`，是部署清单的一处缺口，需手动补上。

### 校验流程 `verifySessionToken`

```ts
export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const lastDot = token.lastIndexOf('.');
  if (lastDot <= 0) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = sign(payload);
  const a = Buffer.from(sig), b = Buffer.from(expected);
  // 先比长度再 timingSafeEqual（长度不等会抛异常），防计时侧信道
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const sep = payload.lastIndexOf('|');
  if (sep <= 0) return null;
  const name = payload.slice(0, sep);
  const exp = Number(payload.slice(sep + 1));
  if (!name || Number.isNaN(exp) || exp < Date.now()) return null;   // 过期
  return name;
}
```

判断顺序：空 → 结构 → 签名（常量时间比较）→ 用户名非空 → 是否过期。

### Cookie 属性

在 `app/api/auth/login/route.ts` 与 `app/api/auth/github/callback/route.ts` 中写入：

| Cookie | httpOnly | secure | sameSite | path | maxAge | 用途 |
|--------|----------|--------|----------|------|--------|------|
| `ep_session` | **true** | 生产环境 true | `lax` | `/` | 604800 | 会话令牌，**参与鉴权** |
| `mc_user` | false | 生产环境 true | `lax` | `/` | 604800 | 展示用游戏 ID，**不参与鉴权** |
| `ep_provider` | false | 生产环境 true | `lax` | `/` | 604800 | 登录来源标记，不参与鉴权 |

---

## 登录流程

页面 `app/login/page.tsx`（服务端组件）用 `Suspense` 包裹 `LoginContent`（因后者使用 `useSearchParams`）。

### 前端校验规则

| 项 | 规则 | 提示 |
|----|------|------|
| 用户名非空 | `!username.trim()` | 请输入用户名 |
| 用户名格式 | `/^[a-zA-Z0-9_]{3,16}$/` | 只能含字母、数字、下划线，长度 3-16 位 |
| 密码长度 | `password.length < 6` | 密码长度不能少于 6 位 |
| 协议勾选 | `!agreeTerms` | 请阅读并同意用户协议与隐私政策 |

### 登录方式

1. **Minecraft 账号密码**：走 `app/api/auth/login/route.ts`，校验后写 Cookie。
2. **GitHub OAuth**：走 `app/api/auth/github/*`，回调后写 `ep_provider=github`。

### 已修复的坑

- **未登录误跳主页**：早期登录页有探测 `/api/users/info` 的逻辑，失败会误跳转。已移除该探测跳转。
- **旧 Cookie 迁移**：检测到异常/旧版 Cookie 时自动清除，保证老用户平滑过渡。

---

## 页面布局

`app/profile/page.tsx`：

- **桌面端**：双栏网格 —— **左栏**账户信息（游戏 ID、UUID、账号状态等），**右栏** 3D 皮肤预览。
- **移动端**：自动折叠为单栏堆叠，保证可读性。

皮肤预览复用 `components/skin-viewer.tsx`（走 `/api/skin` 代理），详见 [skin-preview.md](./skin-preview.md)。

---

## 已知行为

由于令牌是**无状态**的（无 jti、无黑名单、无刷新/轮换机制）：

- 退出登录**仅删除 Cookie**；旧令牌在有效期内仍然可用。
- 轮换 `SESSION_SECRET` 会让**所有**已发放会话一次性失效。
- 令牌有效期固定 7 天，到期需重新登录。
