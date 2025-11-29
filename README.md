# EndlessPixel Web

[![Next.js](https://img.shields.io/badge/Next.js-15+-000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-06b6d4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-AGPL_v3-007098)](LICENSE)

简体中文 | [English](./README.en.md)

EndlessPixel 官方网站与启动器分发平台，基于 Next.js App Router + TypeScript + Tailwind CSS 构建。

## ✨ 特性

- ⚡ 全栈 React 框架 Next.js 15，支持 SSR/SSG/ISR  
- 🎨 Tailwind CSS 4 原子化样式，暗色模式开箱即用  
- 🔐 GitHub OAuth 一键登录  
- 📦 60+ 启动器与整合包高速下载，支持自定义镜像  
- 🧪 严格 TypeScript 类型检查，ESLint + Prettier 自动化  
- 🌍 国际化就绪（i18n 路由已预埋）  
- 📱 响应式布局，PWA 离线支持（Workbox 自动生成）

## 🚀 快速开始

### 前置条件

- Node.js ≥ 18  
- npm ≥ 9（推荐 pnpm 8）

### 本地开发

```bash
# 1. 克隆仓库
git clone https://github.com/EndlessPixel/server.git
cd server

# 2. 安装依赖
npm install
# or pnpm install

# 3. 启动开发服务器
npm run dev
# or pnpm dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000) 即可实时预览。

### 常用命令

| 命令 | 说明 |
| ---- | ---- |
| `npm run dev` | 开发服务器（热更新） |
| `npm run build` | 构建生产版本 |
| `npm start` | 启动生产服务器 |
| `npm run lint` | ESLint 检查 |
| `npm run lint:fix` | 自动修复 ESLint 问题 |
| `npm run type-check` | TypeScript 类型检查 |

## 🧩 环境变量

新建 `.env.local` 并填入：

```bash
# GitHub OAuth
GITHUB_ID=your_github_oauth_app_id
GITHUB_SECRET=your_github_oauth_app_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=openssl_rand_base64_32
```

完整示例见 `.env.example`

## 🤝 贡献指南

1. Fork 本仓库  
2. 创建特性分支：`git checkout -b feat/xxx`  
3. 提交 Commit：`git commit -m "feat: 新增 xxx"`（遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/)）  
4. 推送分支并提交 Pull Request  
5. CI 通过 & Code Review 合并

### 代码规范

- 使用 TypeScript 严格模式  
- 组件名 PascalCase，文件名小写连字符  
- 样式优先使用 Tailwind CSS，避免行内样式  
- 提交前执行 `npm run lint && npm run type-check`

## 📄 许可证

[GNU Affero General Public License v3.0](./LICENSE)  
允许商业使用、修改、再发布，但修改后的网络服务必须开源。

## 💬 联系我们

- 问题与建议：[新建 Issue](https://github.com/EndlessPixel/server/issues/new/choose)  
- 讨论区：[GitHub Discussions](https://github.com/EndlessPixel/server/discussions)

---

Star ⭐ 与 Watch 👀 是对我们最大的支持！