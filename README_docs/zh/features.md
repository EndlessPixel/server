# 功能总览

EndlessPixel 官网围绕「玩家服务」设计，以下模块均已上线。点击各条目查看详细文档。

| 功能 | 说明 | 详情 |
|------|------|------|
| 🤖 AI 助手 | 站内智能问答，流式回复 + 交互卡片，注入服务器上下文与玩家身份 | [ai-assistant.md](./ai-assistant.md) |
| 🧍 皮肤预览 | WebGL 3D 皮肤查看（skinview3d）+ 同源代理多重容错 | [skin-preview.md](./skin-preview.md) |
| 📦 启动器下载 | 启动器/整合包高速下载，5 个 GitHub 加速镜像可切换 | [downloads.md](./downloads.md) |
| 👤 个人中心 | 双栏资料排版 + 3D 皮肤；HMAC 会话鉴权，支持 GitHub OAuth | [profile.md](./profile.md) |
| 📡 服务器状态 | MC 服务器实时状态、延迟探测、开服时长 | [server-status.md](./server-status.md) |

---

## 页面地图

```
/                          首页
/downloads                 下载总览（4 个入口）
/downloads/launcher        启动器列表 → /downloads/launcher/[launcher]
/downloads/modpack         整合包（主分支 / Real 分支）
/downloads/modpack_app     整合包下载工具
/downloads/custom_downloads  自定义 GitHub Releases 下载
/status                    服务状态索引
/status/mcserverstatus     MC 服务器状态详情
/login                     登录（账号密码 / GitHub OAuth）
/profile                   个人中心（登录后可访问）
/ai_link                   AI 输出外链的安全中转页
```

---

## 技术底座

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 16（App Router、SSR / SSG / ISR、Turbopack） |
| 语言 | TypeScript 5（严格模式） |
| 样式 | Tailwind CSS 4（原子化、暗色模式开箱即用） |
| 3D | skinview3d（WebGL 皮肤渲染） |
| 工具 | `date-fns`（时间格式化） |
| 质量 | ESLint + Prettier |
| 其他 | PWA（Workbox 自动生成）、HMAC 会话 Cookie |

### 环境变量

| 变量 | 用途 |
|------|------|
| `API_KEY` | AI 上游接口的 Bearer Token |
| `API_BASE_URL` | AI 上游地址，默认 `https://xn--kiv260fv3i.cn` |
| `SESSION_SECRET` | HMAC 会话签名密钥，**要求 ≥ 16 位** |
| `TARGET_API_URL` | 宿主机硬件监控（`/systemstatus/data`）的上游地址 |
| `GH_TOKEN` | GitHub API 访问令牌（提升 Releases / Issue 请求限额） |
| `GH_CLIENT_ID` / `GH_CLIENT_SECRETS` | GitHub OAuth 登录 |
| `NEXT_PUBLIC_SITE_URL` | 站点公开地址（用于 canonical 等） |

> ⚠️ `SESSION_SECRET` 未设置或长度不足 16 位时，会回退到源码中的硬编码兜底串，生产环境会打印警告。**部署时务必配置。**

---

## 🚀 本地运行

前置：Node.js ≥ 18、npm ≥ 9。

```bash
git clone https://github.com/EndlessPixel/server.git
cd server
npm install
npm run dev        # 或 npm run dev-https（HTTPS，调试 PWA / 安全 Cookie）
```

访问 <http://localhost:3000> 或 <https://localhost:3000>。

### 可用脚本

| 命令 | 作用 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run dev-https` | 以 HTTPS 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm start` | 运行生产构建 |
| `npm run lint` | ESLint 检查（`--max-warnings=0`） |
| `npm run lint:fix` | 自动修复 |
