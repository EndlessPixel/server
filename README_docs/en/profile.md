# 👤 Profile

The player profile page shown after sign-in: account info plus a 3D skin preview.

---

## Session & Auth

Session utilities live in `lib/session.ts` (Node `crypto`, server-side only).

### Token Structure

Stateless tokens signed with **HMAC-SHA256 + base64url**:

```ts
export const SESSION_COOKIE = 'ep_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;   // 7 days = 604800 seconds
export const PROVIDER_COOKIE = 'ep_provider';      // sign-in source: minecraft / github

export function createSessionToken(name: string): string {
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${name}|${exp}`;
  const sig = sign(payload);          // createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${sig}`;
}
```

### The `SESSION_SECRET` Key

```ts
function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === 'production') {
    console.warn('[session] SESSION_SECRET not configured in production… sessions can be forged.');
  }
  return 'dev-only-insecure-session-secret-change-me';
}
```

**Must be at least 16 characters.** Otherwise (including when unset) it falls back to a hardcoded string from the source and warns in production. **Always configure it when deploying.**

> ⚠️ This variable is missing from `.env.example` — a gap in the deployment checklist that should be added manually.

### Verification `verifySessionToken`

```ts
export function verifySessionToken(token: string | undefined): string | null {
  if (!token) return null;
  const lastDot = token.lastIndexOf('.');
  if (lastDot <= 0) return null;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = sign(payload);
  const a = Buffer.from(sig), b = Buffer.from(expected);
  // compare length first (timingSafeEqual throws on length mismatch), then constant-time compare
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const sep = payload.lastIndexOf('|');
  if (sep <= 0) return null;
  const name = payload.slice(0, sep);
  const exp = Number(payload.slice(sep + 1));
  if (!name || Number.isNaN(exp) || exp < Date.now()) return null;   // expired
  return name;
}
```

Order of checks: empty → structure → signature (constant time) → non-empty name → expiry.

### Cookie Attributes

Written in `app/api/auth/login/route.ts` and `app/api/auth/github/callback/route.ts`:

| Cookie | httpOnly | secure | sameSite | path | maxAge | Purpose |
|--------|----------|--------|----------|------|--------|---------|
| `ep_session` | **true** | true in prod | `lax` | `/` | 604800 | Session token, **used for auth** |
| `mc_user` | false | true in prod | `lax` | `/` | 604800 | Display game ID, **not used for auth** |
| `ep_provider` | false | true in prod | `lax` | `/` | 604800 | Sign-in source marker, not used for auth |

---

## Sign-in Flow

`app/login/page.tsx` (server component) wraps `LoginContent` in `Suspense` because the latter uses `useSearchParams`.

### Client-side Validation

| Field | Rule | Message |
|-------|------|---------|
| Username non-empty | `!username.trim()` | Please enter a username or email |
| Username / email format | username `/^[a-zA-Z0-9_]{3,16}$/` or email `/^[^@\s]+@[^@\s]+\.[^@\s]+$/` | Username: letters, digits and underscores only, 3–16 chars; or a bound email address |
| Password length | `password.length < 6` | Password must be at least 6 characters |
| Captcha | `captchaInput.trim().length !== 4` | Enter the 4 characters shown in the image |
| Terms checkbox | `!agreeTerms` | Please read and accept the terms and privacy policy |

### Sign-in Methods

1. **Minecraft username + password**: handled by `app/api/auth/login/route.ts`; **either the in-game username or the bound email works**. The session stores the username, never the email. A captcha is required on every attempt.
2. **GitHub OAuth**: handled by `app/api/auth/github/*`, sets `ep_provider=github` after the callback.

### SVG Captcha

`GET /api/auth/captcha` returns an SVG and stores the answer **AES-256-GCM encrypted** in the HttpOnly cookie `ep_captcha`:

- **Stateless**: the answer is never kept in server memory or a database, so it works across instances; the key is derived from `SESSION_SECRET` (see `lib/captcha.ts`)
- **Cleared after use**: the login route clears the cookie right after a successful check, and the client fetches a fresh image after every attempt. ⚠️ This is **best-effort** — the token is stateless, so a script that keeps its own copy can resubmit it until it expires. Real brute-force protection comes from the backend's rate limiting (10/min) and failure lockout (5 tries → 5 min)
- **TTL** 3 minutes; the alphabet excludes `I/O/0/1`; comparison is case-insensitive
- **Failure**: a wrong captcha returns `400 { error: "captcha_invalid" }`, distinct from a wrong password
- ⚠️ **Limitation**: SVG characters are `<text>` nodes, readable by any XML parser — it stops naive scripts, not targeted automation. A raster image or glyph outlines would be needed for that.

### Fixed Pitfalls

- **Wrong redirect to home when not signed in**: the login page used to probe `/api/users/info` and redirect on failure. That probe has been removed.
- **Legacy cookie migration**: abnormal/legacy cookies are cleared automatically for a smooth transition for returning users.

---

## Page Layout

`app/profile/page.tsx`:

- **Desktop**: two-column grid — **left** account info (game ID, UUID, account status, etc.), **right** 3D skin preview.
- **Mobile**: collapses to a single stacked column for readability.

The skin preview reuses `components/skin-viewer.tsx` (via the `/api/skin` proxy) — see [skin-preview.md](./skin-preview.md).

---

## Known Behavior

Because tokens are **stateless** (no jti, no blacklist, no refresh/rotation):

- Signing out **only deletes the cookie**; an old token stays valid until it expires.
- Rotating `SESSION_SECRET` invalidates **all** issued sessions at once.
- Tokens live for a fixed 7 days; re-authentication is required after that.
