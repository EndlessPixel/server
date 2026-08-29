# 📡 Server Status

View the Minecraft server's live state, player count, version and latency.

---

## Page Structure

```
/status                    Service status index (server component, own metadata)
└── /status/mcserverstatus MC server status detail (client component, the core page)
```

### Index `/status`

A server component exporting full metadata (title "服务状态 - EndlessPixel Minecraft 服务器", canonical `https://www.endlesspixel.cn/status/`, OG image `/banner.jpg`).

Structure:

1. Header: title + subtitle.
2. **Core services** section (`grid-cols-1 md:grid-cols-2`):

```ts
const SERVICES: ServiceItem[] = [
  { name: "Minecraft 服务器状态", path: "/status/mcserverstatus", icon: Server,
    status: "online", description: "游戏服务器实时状态" },
  { name: "服务器性能监控", path: "http://sys.epmc.qzz.io", icon: Activity,
    status: "online", description: "服务器性能监控", external: true },
];
```

3. Footer "Technical support": open an issue (GitHub), join the QQ group (`https://qm.qq.com/q/sFrax2Ilxe`).

> Note: `ServiceItem.status` supports `online | offline | maintenance`, but the **index UI doesn't render that status light** — external services only show an "external service" tag. So the index is a **static navigation page**, not a live status board.

---

## Detail Page `/status/mcserverstatus`

A client component (`"use client"`) and the core of status display.

### Key Constants

```ts
const ACTIVE_NODE = { name: "主服务器", ip: "epmc.qzz.io" };
const CACHE_DURATION = 30000;   // sessionStorage cache: 30s
const FETCH_TIMEOUT  = 8000;    // MC status request timeout: 8s
// latency probe has its own 10000 ms timeout
// refresh throttle 2000 ms; debounce 1000 ms; first load delay 100 ms
```

### ⚠️ Refresh Model: Manual, No Auto-Polling

**There is no `setInterval` auto-polling anywhere in the app.** The actual mechanism:

| Trigger | Behavior |
|---------|----------|
| First load | Requests once via `setTimeout(..., 100)` after mount |
| "Refresh" button | **1000 ms debounce** |
| "Force refresh" button | Bypasses the `sessionStorage` cache |
| Throttle | Non-forced refreshes are ignored within 2 seconds |

> Earlier docs said "periodically polls the status API", which doesn't match the code — now corrected. Status is **loaded once when the page opens; refresh manually afterwards**. Repeat visits within 30s hit the sessionStorage cache.

### Three Concurrent Data Sources

```ts
const [data, ping, ip] = await Promise.all([
  fetchServerData(ACTIVE_NODE.ip, skipCache),  // /api/mcserver/epmc
  fetchServerPing(ACTIVE_NODE.ip),             // /api/ping/epmc
  fetchMyIp(),                                 // current public IP
]);
```

| Endpoint | File | Purpose |
|----------|------|---------|
| `/api/mcserver/epmc` | `app/api/mcserver/epmc/route.ts` | Proxies mcsrvstat.us for server status (online / players / version / MOTD / icon) |
| `/api/ping/epmc` | `app/api/ping/epmc/route.ts` | Proxies the latency probe |
| `/systemstatus/data` | `app/systemstatus/data/route.ts` | Host hardware metrics proxy (upstream `TARGET_API_URL`) |
| `/api/webstatus` | `app/api/webstatus/route.ts` | Website reachability probe (**not used by any page today**) |

When the server icon is missing, `public/default-server-icon.png` is used as a fallback.

---

## Uptime Component

`components/running-duration.tsx` computes and shows how long the server has been running. It appears in:

- `components/footer.tsx`
- `components/contact-section.tsx`
- `components/epbot-widgets.tsx` (the AI assistant's `server_uptime` card)

---

## Status Cards in the AI Assistant

EPBot can inject status cards directly into replies (`components/epbot-widgets.tsx`):

| widget name | Purpose |
|-------------|---------|
| `server_status` | Server online state |
| `server_ping` | Latency probe result |
| `server_uptime` | Server uptime |

---

## Degradation

- Each source has its own timeout (8s / 10s); one failing doesn't block the others.
- The status page uses its own skeleton (not the shared `ServerStatusSkeleton`).
- When an API is unavailable, a degraded state is shown without blocking render.

---

## Known Limitations

- The detail page is a client component with **no `metadata` export**, so its SEO title falls back to the root layout template (`"… | EndlessPixel - 免费MC服务器"`), inconsistent with the index page's dedicated title.
- A single node is hardcoded (`ACTIVE_NODE`); only the **main server** `epmc.qzz.io` is monitored — no multi-node abstraction.
- No auto-polling; refresh manually to see the latest state.
