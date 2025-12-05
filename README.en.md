
# EndlessPixel Web

[![Next.js](https://img.shields.io/badge/Next.js-15+-000?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-06b6d4?logo=tailwindcss)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-AGPL_v3-007098)](LICENSE)

English | [简体中文](./README.md)

Official website & launcher distribution platform of EndlessPixel, built with Next.js App Router + TypeScript + Tailwind CSS.

## ✨ Features

- ⚡ Next.js 15 full-stack React framework, SSR/SSG/ISR ready  
- 🎨 Tailwind CSS 4 utility-first, dark-mode out of the box  
- 📦 60+ launchers & mod-packs high-speed download, custom mirror support  
- 🧪 Strict TypeScript checking, ESLint + Prettier automated   
- 📱 Responsive layout, PWA offline support (Workbox auto-generated)

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18  
- npm ≥ 9 (pnpm 8 recommended)

### Local Development

```bash
# 1. Clone repo
git clone https://github.com/EndlessPixel/server.git
cd server

# 2. Install dependencies
npm install
# or pnpm install

# 3. Start dev server
npm run dev
# or pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Common Commands

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start dev server (HMR) |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run type-check` | TypeScript type check |

## 🧩 Environment Variables

Create `.env.local`:

```bash
# GitHub OAuth
GITHUB_ID=your_github_oauth_app_id
GITHUB_SECRET=your_github_oauth_app_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=openssl_rand_base64_32
```

See `.env.example` for full list.

## 🤝 Contributing

1. Fork the repository  
2. Create feature branch: `git checkout -b feat/xxx`  
3. Commit: `git commit -m "feat: add xxx"` (follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/))  
4. Push and open a Pull Request  
5. Merge after CI & code review

### Code Style

- TypeScript strict mode on  
- Component names PascalCase, filenames kebab-case  
- Prefer Tailwind CSS, avoid inline styles  
- Run `npm run lint && npm run type-check` before commit

## 📄 License

[GNU Affero General Public License v3.0](./LICENSE)  
Commercial use, modification and redistribution are allowed, but modified network services must be open-sourced.

## 💬 Get in Touch

- Issues & Ideas: [open an issue](https://github.com/EndlessPixel/server/issues/new/choose)  
- Discussions: [GitHub Discussions](https://github.com/EndlessPixel/server/discussions)

---

Star ⭐ and Watch 👀 are the best supports for us!