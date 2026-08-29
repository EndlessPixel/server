# 📦 Launcher & Mod-Pack Downloads

Fast downloads for Minecraft launchers and mod-packs, with built-in GitHub file-acceleration mirrors to work around slow GitHub Releases in some regions.

---

## Page Structure

```
/downloads                        Downloads overview (4 entry cards)
├── /downloads/launcher           Launcher list
│   ├── /downloads/launcher/[launcher]            Single launcher page (generateStaticParams)
│   └── /downloads/launcher/[launcher]/issues     GitHub issues of that launcher repo
├── /downloads/modpack            EndlessPixel mod-pack (main / Real branch)
├── /downloads/modpack_app        Mod-pack download tool (APP)
└── /downloads/custom_downloads   Custom GitHub repo download
```

### The 4 Overview Entries

| Entry | Path | Description |
|-------|------|-------------|
| Minecraft Launcher | `/downloads/launcher` | Collection of third-party GitHub launchers, multiple MC versions |
| EndlessPixel Modpack | `/downloads/modpack` | Mod-pack built by the server owner: many optimization and feature mods |
| EndlessPixel Modpack APP | `/downloads/modpack_app` | Mod-pack download tool |
| Custom download | `/downloads/custom_downloads` | Paste any GitHub Releases URL to generate downloads |

---

## Mirror Acceleration

Mirrors are defined centrally in `lib/mirrors.ts` and shared by all download pages.

### `MirrorConfig` Fields

```ts
export interface MirrorConfig {
  tag: string;           // display name (button label / key)
  url: string;           // mirror prefix, prepended to the original direct link
  tip: string;           // hover tooltip (title attribute)
  recommended?: boolean; // recommended items get a tinted background + ★ badge
}
```

### Built-in Mirrors (5)

| tag | url | tip | recommended |
|-----|-----|-----|-------------|
| Cloudflare | `https://gh-proxy.org/` | recommended | ✅ |
| Fastly | `https://cdn.gh-proxy.org/` | recommended | ✅ |
| Edgeone | `https://edgeone.gh-proxy.org/` | recommended | ✅ |
| Jasonzeng | `https://gh.xmly.dev/` | caution with large files | — |
| Hong Kong | `https://hk.gh-proxy.org/` | Hong Kong node | — |

Domain constant used by the footer note:

```ts
export const DEFAULT_MIRROR_DOMAINS: string[] = ["gh-proxy.org", "gh.xmly.dev"];
```

### Concatenation Rule

Mirror URLs are built by **simple prefix concatenation**:

```ts
getMirrorUrl = (host, url) => `${host}${url}`
// https://gh-proxy.org/ + https://github.com/xxx/a.jar
//   → https://gh-proxy.org/https://github.com/xxx/a.jar
```

Every file entry renders buttons for all mirrors so users can pick one; recommended ones show a ★ badge.

### Extensibility

`FileBlock`, `ReleaseCard`, `ReleaseGrid` and `InfiniteReleaseGrid` all accept optional `mirrors` and `getMirrorUrl` props with built-in defaults — **the ability to plug in custom mirrors exists, but no caller passes them today**; everything uses `DEFAULT_MIRRORS`.

The AI assistant's download card (`epbot-widgets.tsx`) uses only the first 3 mirrors:

```tsx
{DEFAULT_MIRRORS.slice(0, 3).map((m) => (
  <a href={`${m.url}${download.url}`} title={m.tip}>{m.tag}{m.recommended && "recommended"}</a>
))}
```

---

## Data Source

Download entries come from the **GitHub Releases API** (`/downloads/custom_downloads` queries dynamically based on the repo URL the user enters).

- Setting `GH_TOKEN` raises the GitHub API rate limit and avoids the unauthenticated cap (60/hour).
- Individual launcher pages use `generateStaticParams`, so entries are fetched and prerendered at build time.

---

## Edition Policy

- The server supports **Java Edition** only (including mobile Java launchers such as POjavLauncher).
- **Not supported**: Bedrock Edition and web/browser clients.
- The year-based version scheme (e.g. 1.21.x) does not change these boundaries.
