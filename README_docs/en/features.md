# Features Overview

EndlessPixel's website is built around player services. The modules below are all live. Click each item for details.

| Feature | Description | Details |
|---------|-------------|---------|
| 🤖 AI Assistant | In-site smart Q&A with streaming replies and interactive cards | [ai-assistant.md](./ai-assistant.md) |
| 🧍 Skin Preview | 3D skin viewer (skinview3d) + same-origin proxy with fallback | [skin-preview.md](./skin-preview.md) |
| 📦 Launcher Downloads | 80+ launchers & mod-packs, high-speed with custom mirrors | [downloads.md](./downloads.md) |
| 👤 Profile | Two-column profile layout, skin display & account info | [profile.md](./profile.md) |
| 📡 Server Status | Real-time MC server status monitoring | [server-status.md](./server-status.md) |

## Tech Stack

- ⚡ Next.js 16 (App Router, SSR/SSG/ISR, Turbopack)
- 🎨 Tailwind CSS 4 utility-first, dark-mode out of the box
- 🧪 Strict TypeScript checking, ESLint + Prettier
- 📱 Responsive layout, PWA offline support (Workbox auto-generated)
- 🔐 HMAC session cookies for secure auth
