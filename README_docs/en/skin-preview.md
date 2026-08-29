# 🧍 Skin Preview

Renders players' 3D skins and capes in the browser with WebGL via [skinview3d](https://github.com/bs-community/skinview3d).

## Same-Origin Proxy `/api/skin`

Fetching third-party skin sources (e.g. crafatar) directly from the browser triggers CORS and makes skinview3d fail to load. A same-origin proxy is added:

```
client → /api/skin?uuid=<unsigned UUID> → server proxies crafatar → returns PNG
```

### Fallback Design

- On upstream 5xx / timeout / network error, the error is **not passed through** to the client; instead it falls back to the default skin (Mojang Steve: `069a79f444e94726a5befca90e38aaf5`).
- If even the default fails, a 1×1 transparent PNG (base64) is returned — always `200 image/png` — so skinview3d never crashes to a blank screen.
- `skin-viewer.tsx` guards `loadSkin()` with `.catch()`.

## On Skin Source (Microsoft Official vs Skin Site)

- **Distinguishing**: a UUID alone cannot reliably tell "skin-site source" from "Microsoft official source". In testing, LittleSkin's Yggdrasil `profile/{uuid}` returned `204` for every UUID tested and cannot be used as a branch condition.
- **Current approach**: always fetch from crafatar (Microsoft official skin library proxy); fall back to the default skin on failure. Stable, zero external dependency, and essentially bug-free.
- If we later want "skin-site users see their skin-site skin", it requires a stable **player name** from the account-info API, applies only to avatar display (not 3D full-body preview), and must respect LittleSkin API's 60 req/min rate limit and its experimental instability.
