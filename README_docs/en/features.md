# Features Overview

EndlessPixel's website is built around player services. The modules below are all live. Click each item for details.

| Feature | Description | Details |
|---------|-------------|---------|
| 🤖 AI Assistant | In-site smart Q&A with streaming replies and interactive cards; injects server context and player identity | [ai-assistant.md](./ai-assistant.md) |
| 🧍 Skin Preview | WebGL 3D skin viewer (skinview3d) + same-origin proxy with multi-level fallback | [skin-preview.md](./skin-preview.md) |
| 📦 Launcher Downloads | Launcher / mod-pack downloads with 5 switchable GitHub mirrors | [downloads.md](./downloads.md) |
| 👤 Profile | Two-column layout with 3D skin; HMAC session auth, GitHub OAuth supported | [profile.md](./profile.md) |
| 📡 Server Status | Live MC status, latency probe, uptime | [server-status.md](./server-status.md) |

---

## Page Map

```
/                          Home
/downloads                 Downloads overview (4 entries)
/downloads/launcher        Launcher list → /downloads/launcher/[launcher]
/downloads/modpack         Mod-pack (main / Real branch)
/downloads/modpack_app     Mod-pack download tool
/downloads/custom_downloads  Custom GitHub Releases download
/status                    Service status index
/status/mcserverstatus     MC server status detail
/login                     Sign in (password / GitHub OAuth)
/profile                   Profile (requires login)
/ai_link                   Safe redirect page for AI-generated links
```

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router, SSR / SSG / ISR, Turbopack) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 (utility-first, dark mode out of the box) |
| 3D | skinview3d (WebGL skin rendering) |
| Utils | `date-fns` (date formatting) |
| Quality | ESLint + Prettier |
| Misc | PWA (Workbox generated), HMAC session cookies |

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `API_KEY` | Bearer token for the AI upstream API |
| `API_BASE_URL` | AI upstream base, defaults to `https://xn--kiv260fv3i.cn` |
| `SESSION_SECRET` | HMAC session signing key, **must be ≥ 16 chars** |
| `TARGET_API_URL` | Upstream for host metrics (`/systemstatus/data`) |
| `GH_TOKEN` | GitHub API token (raises Releases / Issue rate limits) |
| `GH_CLIENT_ID` / `GH_CLIENT_SECRETS` | GitHub OAuth sign-in |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (canonical links, etc.) |

> ⚠️ If `SESSION_SECRET` is unset or shorter than 16 chars, the app falls back to a hardcoded string from the source and logs a warning in production. **Always configure it when deploying.**

---

## 🚀 Local Run

Prerequisites: Node.js ≥ 18, npm ≥ 9.

```bash
git clone https://github.com/EndlessPixel/server.git
cd server
npm install
npm run dev        # or: npm run dev-https (HTTPS, for PWA / secure cookies)
```

Visit <http://localhost:3000> or <https://localhost:3000>.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run dev-https` | Start dev server over HTTPS |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint check (`--max-warnings=0`) |
| `npm run lint:fix` | Auto-fix issues |
