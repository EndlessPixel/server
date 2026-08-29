# 📦 启动器与整合包下载

提供 Minecraft 启动器与整合包的高速下载，内置 GitHub 文件加速镜像，解决国内拉取 GitHub Releases 慢的问题。

---

## 页面结构

```
/downloads                        下载总览（4 个入口卡片）
├── /downloads/launcher           启动器列表
│   ├── /downloads/launcher/[launcher]       单个启动器下载页（generateStaticParams 预生成）
│   └── /downloads/launcher/[launcher]/issues   该启动器仓库的 GitHub Issue
├── /downloads/modpack            EndlessPixel 整合包（主分支 / Real 分支）
├── /downloads/modpack_app        整合包下载工具（APP）
└── /downloads/custom_downloads   自定义 GitHub 仓库下载
```

### 总览页的 4 个入口

| 入口 | 路径 | 说明 |
|------|------|------|
| Minecraft Launcher | `/downloads/launcher` | GitHub 第三方启动器合集，适配多版本 MC |
| EndlessPixel Modpack | `/downloads/modpack` | 服主开发的模组包，含大量优化与功能模组 |
| EndlessPixel Modpack APP | `/downloads/modpack_app` | 模组包下载工具 |
| 自定义下载 | `/downloads/custom_downloads` | 输入任意 GitHub Releases 地址，一键生成下载 |

---

## 镜像加速

镜像定义集中在 `lib/mirrors.ts`，所有下载页共用，便于统一维护。

### `MirrorConfig` 字段

```ts
export interface MirrorConfig {
  tag: string;           // 显示名（按钮文案 / key）
  url: string;           // 镜像前缀，拼接到原始直链前面
  tip: string;           // 悬停提示（title 属性）
  recommended?: boolean; // 是否推荐（推荐项加浅色底 + ★ 角标）
}
```

### 内置镜像（5 个）

| tag | url | tip | 推荐 |
|-----|-----|-----|------|
| Cloudflare | `https://gh-proxy.org/` | 推荐 | ✅ |
| Fastly | `https://cdn.gh-proxy.org/` | 推荐 | ✅ |
| Edgeone | `https://edgeone.gh-proxy.org/` | 推荐 | ✅ |
| Jasonzeng | `https://gh.xmly.dev/` | 大文件慎用 | — |
| 香港 | `https://hk.gh-proxy.org/` | 香港节点 | — |

页脚说明文案使用的域名常量：

```ts
export const DEFAULT_MIRROR_DOMAINS: string[] = ["gh-proxy.org", "gh.xmly.dev"];
```

### 拼接规则

镜像 URL 采用**简单前缀拼接**：

```ts
getMirrorUrl = (host, url) => `${host}${url}`
// https://gh-proxy.org/ + https://github.com/xxx/a.jar
//   → https://gh-proxy.org/https://github.com/xxx/a.jar
```

每个文件条目都会渲染全部镜像按钮，用户可任选一个下载；推荐项带 ★ 角标。

### 扩展性

`FileBlock` / `ReleaseCard` / `ReleaseGrid` / `InfiniteReleaseGrid` 四个组件都接受可选的 `mirrors` 与 `getMirrorUrl` props，并内置默认实现 —— **预留了自定义镜像的能力，但当前无调用方传入**，均使用 `DEFAULT_MIRRORS`。

AI 助手的下载卡片（`epbot-widgets.tsx`）只取前 3 个镜像：

```tsx
{DEFAULT_MIRRORS.slice(0, 3).map((m) => (
  <a href={`${m.url}${download.url}`} title={m.tip}>{m.tag}{m.recommended && "荐"}</a>
))}
```

---

## 数据来源

下载条目来自 **GitHub Releases API**（`/downloads/custom_downloads` 则是用户输入仓库地址后动态查询）。

- 配置 `GH_TOKEN` 可提升 GitHub API 的请求限额，避免未鉴权限流（60 次/小时）。
- 单个启动器页使用 `generateStaticParams` 预生成，构建期拉取并静态化。

---

## 版本口径

- 服务器**仅支持 Java 版**加入（含手机 Java 版启动器，如 POjavLauncher）。
- **不支持**基岩版（Bedrock）与网页版加入。
- 版本号年份体系（如 1.21.x）不改变上述接入边界。
