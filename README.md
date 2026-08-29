<div align="center">
  <img src="./public/banner.jpg" alt="EndlessPixel" width="100%" />

  <h1>EndlessPixel Web</h1>

  <p><strong>EndlessPixel 服务器官方网站 —— 为玩家提供下载、资料、状态与智能问答的一站式门户。</strong></p>

[![Next.js](https://img.shields.io/badge/Next.js-16+-000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4+-06b6d4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-AGPL_v3-007098)](LICENSE)

简体中文 | [English](./README.en.md)

</div>

---

## 📖 项目简介

EndlessPixel 是一个 **Java 版** Minecraft 服务器的官方网站，基于 Next.js 16 App Router 构建。

它不是一个简单的展示页，而是围绕玩家真实需求设计的**服务型站点**：

- 新手要知道怎么进服 —— 由 AI 助手直接解答，而不是翻文档；
- 玩家想看自己的皮肤 —— 3D 预览，不用下载客户端；
- 找启动器和整合包 —— 80+ 资源一站式高速下载；
- 服务器是否在线 —— 实时状态一目了然；
- 登录后管理资料 —— 账户信息与皮肤统一管理。

> ⚠️ **版本说明**：本服仅支持 **Java 版**（含手机 Java 版启动器）加入，**不支持**基岩版（Bedrock）与网页版。

---

## ✨ 功能亮点

| 功能 | 说明 | 文档 |
|------|------|------|
| 🤖 **AI 助手** | 流式问答，注入服务器上下文与知识库；可在回答中插入 QQ 群、服务器信息等**交互卡片** | [ai-assistant.md](./README_docs/zh/ai-assistant.md) |
| 🧍 **3D 皮肤预览** | 基于 WebGL（skinview3d）渲染皮肤与披风；同源代理 + 多重容错，绝不白屏 | [skin-preview.md](./README_docs/zh/skin-preview.md) |
| 📦 **启动器下载** | 80+ 启动器与整合包，分栏展示；内置镜像加速，支持自定义镜像 | [downloads.md](./README_docs/zh/downloads.md) |
| 👤 **个人中心** | 桌面双栏（左信息 / 右皮肤），移动端自动单栏；HMAC 会话鉴权 | [profile.md](./README_docs/zh/profile.md) |
| 📡 **服务器状态** | 实时在线状态、玩家数与版本；接口异常时优雅降级 | [server-status.md](./README_docs/zh/server-status.md) |

此外还包括：响应式布局（手机/平板/桌面）、暗色模式、PWA 离线支持、站内安全跳转等。

---

## 🛠 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 16（App Router、SSR / SSG / ISR、Turbopack） |
| 语言 | TypeScript 5（严格模式） |
| 样式 | Tailwind CSS 4（原子化、暗色模式开箱即用） |
| 3D | skinview3d（WebGL 皮肤渲染） |
| 质量 | ESLint + Prettier |
| 其他 | PWA（Workbox）、HMAC 会话 Cookie |

---

## 🚀 快速开始

### 前置条件

- **Node.js** ≥ 18
- **npm** ≥ 9

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/EndlessPixel/server.git
cd server

# 安装依赖
npm install

# 启动开发服务器（HTTP）
npm run dev
```

浏览器访问 <http://localhost:3000>。

需要 HTTPS（例如调试 PWA 或安全 Cookie）时：

```bash
npm run dev-https
```

访问 <https://localhost:3000>。

### 可用脚本

| 命令 | 作用 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run dev-https` | 以 HTTPS 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm start` | 运行生产构建 |
| `npm run lint` | ESLint 检查（零警告） |
| `npm run lint:fix` | 自动修复可修复的 lint 问题 |

---

## 📚 文档

| 文档 | 内容 |
|------|------|
| [功能总览](./README_docs/zh/features.md) | 各模块概览、技术底座、本地运行说明 |
| [AI 助手](./README_docs/zh/ai-assistant.md) | 流式回复、<thinking> 推理、卡片渲染机制、链接安全 |
| [皮肤预览](./README_docs/zh/skin-preview.md) | `/api/skin` 代理、容错回退、皮肤来源判定说明 |
| [启动器下载](./README_docs/zh/downloads.md) | 资源分类、镜像加速、版本口径 |
| [个人中心](./README_docs/zh/profile.md) | 双栏排版、会话与安全、旧用户迁移 |
| [服务器状态](./README_docs/zh/server-status.md) | 状态轮询、降级策略、接口集成 |

---

## 🤝 贡献

欢迎提交 Issue 与 Pull Request。

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feat/xxx`
3. 按 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 提交：`git commit -m "feat: 新增 xxx"`
4. 推送分支并开启 Pull Request
5. CI 通过并完成 Code Review 后合并

**提交前请执行：**

```bash
npm run lint
npm run build
```

详细规范见 [CONTRIBUTING.md](./CONTRIBUTING.md)。

---

## 📄 许可证

本项目基于 **[GNU AGPL v3.0](./LICENSE)** 授权。

允许商业使用、修改与再分发，但**修改后的网络服务必须同样开源**。

---

## 💬 联系我们

- 问题与建议：[新建 Issue](https://github.com/EndlessPixel/server/issues/new/choose)
- 讨论区：[GitHub Discussions](https://github.com/EndlessPixel/server/discussions)
- 封禁申诉：加入 QQ 群 **870594910**，或发送邮件至 <support@endlesspixel.cn>

---

<div align="center">
Star ⭐ 与 Watch 👀 是对我们最大的支持！
</div>
