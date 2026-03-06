# 贡献指南
感谢你对 EndlessPixel Web 项目的关注！以下是简化版贡献指南，怎么方便怎么来～

## 行为准则
参与本项目即表示你同意遵守 [《行为准则》](./CODE_OF_CONDUCT.md)（核心：友好沟通，互相尊重）。

## 贡献方式
### 1. 报告问题（Bug/需求）
- 直接在 GitHub Issues 提就好，不用严格模板，说清楚问题就行
- Bug：能复现的步骤 + 你的环境（比如 Node 版本/浏览器）
- 需求：想实现啥功能，解决啥问题

### 2. 代码贡献（Pull Request）
#### 前置准备
1. 安装开发环境：Node.js ≥ 18、npm ≥ 9（推荐 pnpm 8）
2. Fork 本仓库 → 克隆到本地 → 随便建个分支（比如 feat/xxx 或 fix/xxx）

#### 开发规范（极简版）
1. 代码能跑、没明显报错就行，TypeScript 类型尽量对（实在不行也可以提 PR 一起改）
2. Commit 信息随便写，中英文都可以，能看懂改了啥就行（不用严格遵循 Conventional Commits）
3. 提交前可以跑一下 `npm run lint` 自动修复格式问题（不跑也没关系）

#### PR 提交流程
1. 推送分支到你的 Fork 仓库
2. 直接提交 PR 到主仓库 `main` 分支（不用走其他分支）
3. PR 描述随便写，能说明改了啥、解决啥问题就行
4. 等 CI 过了 + 简单评审后就合并

### 3. 文档贡献
- README/其他文档想改就改，中英文混写也没问题
- 错别字、漏写的功能说明，直接提 PR 就行

## 开发流程（快速版）
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 可选：启动 HTTPS 开发服务器
python ./localhost_pem_cert.py

npm run dev-https

# （可选）代码格式化
npm format
```