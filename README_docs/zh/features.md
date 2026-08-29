# 功能总览

EndlessPixel 官网围绕「玩家服务」设计，以下模块均已上线。点击各条目查看详情。

| 功能 | 说明 | 详情 |
|------|------|------|
| 🤖 AI 助手 | 站内智能问答，支持流式回复与交互卡片 | [ai-assistant.md](./ai-assistant.md) |
| 🧍 皮肤预览 | 3D 皮肤查看（skinview3d）+ 同源代理容错 | [skin-preview.md](./skin-preview.md) |
| 📦 启动器下载 | 80+ 启动器与整合包高速下载，自定义镜像 | [downloads.md](./downloads.md) |
| 👤 个人中心 | 资料双栏排版、皮肤展示与账户信息 | [profile.md](./profile.md) |
| 📡 服务器状态 | 实时 MC 服务器状态监控 | [server-status.md](./server-status.md) |

## 技术底座

- ⚡ Next.js 16（App Router、SSR/SSG/ISR、Turbopack）
- 🎨 Tailwind CSS 4 原子化样式，暗色模式开箱即用
- 🧪 严格 TypeScript 类型检查，ESLint + Prettier
- 📱 响应式布局，PWA 离线支持（Workbox 自动生成）
- 🔐 HMAC 会话 Cookie，安全鉴权

## 🚀 本地运行

前置：Node.js ≥ 18、npm ≥ 9。

```bash
git clone https://github.com/EndlessPixel/server.git
cd server
npm install
npm run dev        # 或 npm run dev-https
```

浏览器访问 http://localhost:3000 或 https://localhost:3000。
