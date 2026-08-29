# 🧍 Skin Preview

Renders players' 3D skins and capes in the browser with WebGL via [skinview3d](https://github.com/bs-community/skinview3d). Used by the profile page and profile cards.

---

## Why a Same-Origin Proxy

skinview3d forces `crossOrigin="anonymous"` when loading a skin. Requesting a third-party skin source directly from the browser trips CORS, fails to load, and throws an opaque `[object Event]` error that is hard to debug.

So a same-origin proxy route `app/api/skin/route.ts` was added:

```
Browser skinview3d
    │  GET /api/skin?uuid=<unsigned UUID>
    ▼
Server proxies crafatar (Microsoft official skin mirror)
    │  success → 200 image/png
    │  failure → fall back to the default skin
    ▼
Browser (same origin, no CORS issue)
```

---

## Fallback Design (Three Levels)

This is the most critical part of the module — **it always returns `200 image/png` and never passes an upstream error through to the client**, because that would make skinview3d crash to a blank screen.

| Level | Condition | Behavior |
|-------|-----------|----------|
| 1 | crafatar responds normally | Return the player's skin PNG |
| 2 | Upstream 5xx / timeout / network error | Fall back to the **default skin** (Mojang Steve, `069a79f444e94726a5befca90e38aaf5`) |
| 3 | Even the default skin fails | Return a **1×1 transparent PNG** (inlined base64) |

Every `fetch` is wrapped in `tryFetch` so exceptions can't escape.

### Background: the production 500 incident

Production once returned 500 for `/api/skin?uuid=918fd80899aa3cebb2da671df75a3f3f` (body: `Skin not found`). Root cause: **crafatar itself returned 500 for that UUID and the route passed the upstream status straight through**, making skinview3d fail on the client. The fix is the three-level fallback above: upstream 5xx is never forwarded; the worst case is the default skin.

### Client-side Guard

`components/skin-viewer.tsx` uses `skinBase="proxy"` (i.e. `/api/skin`) and attaches `.catch()` to `loadSkin()` so no unhandled rejection escapes.

---

## On Skin Source (Microsoft Official vs Skin Site)

A recurring question is "should this skin come from Microsoft or from a skin site?". Conclusion: **a UUID alone cannot reliably tell them apart, so we always use the official source.**

### Measured Findings (LittleSkin)

LittleSkin (Blessing Skin / authlib-injector) was tested end-to-end with curl:

| Test | Result |
|------|--------|
| Yggdrasil `profile/{uuid}` (Steve, Notch, a broken UUID) | **`204 No Content` for all** |
| Hyphenated UUID | `404` (path must be an **unsigned** UUID) |
| `?unsigned=false` | Still `204` |
| `/players/{name}` | `405 Method Not Allowed` |
| `/avatar/player/{name}` | `200 image/webp` (works, but only a small avatar) |

Response headers confirm the server and its rate limit:

```
x-powered-by: Express
x-yggralt-req-id: 351914868204474368
x-ratelimit-limit: 60        # 60 requests per minute
```

**Key point**: `204` means neither "not in the database" nor "has no skin" — it cannot serve as a branch condition between "skin site" and "official". For example `/avatar/player/Notch` returns 200 (it exists), yet the Yggdrasil profile still returns 204.

### Adopted Approach

- **Always fetch from crafatar** (Microsoft official skin mirror); fall back to the default skin on failure.
- Benefits: no external branching dependency, no extra rate limits, essentially bug-free.

### If Skin-Site Skins Are Needed Later

All of the following must hold, and the limitations accepted:

1. A stable **player name** is required (skin-site APIs key off name, not UUID).
2. Only good for **avatar display** — `/avatar/player/{name}` returns a small webp, **not** the full-body PNG skinview3d needs; full-body skins require auth or a texture id and aren't available unauthenticated.
3. Must handle the **60 req/min** limit; any proxy needs caching.
4. LittleSkin states its API is **experimental and may change without notice**.

Given the cost/benefit, it is not integrated today.

---

## Known Limitations

- Cape rendering depends on upstream data; not every account has one.
- Players who logged in via a third-party (skin-site) auth and have no official-library skin will see the default skin rather than their skin-site skin (see above).
