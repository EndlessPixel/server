// D:\WEI\Code\server\app\downloads\modpack_app\issues\[id]\page.tsx
import GitHubIssueDetail from "@/components/GitHubIssueDetail";

// modpack_app 固定仓库配置
const MODPACK_APP_REPO = {
  owner: 'EndlessPixel',
  repo: 'EndlessPixel-Modpack',
  backHref: '/downloads/modpack/issues' // 返回上级：modpack_app的Issue列表
};

// 异步解析动态路由params（id是Issue编号，和启动器页面的params解析逻辑一致）
export default async function IssueDetailPage({ params }: { params: { id: string } }) {
  // 异步解析params（和启动器页面写法保持统一，兼容Next.js异步路由）
  const { id } = params as { id: string };
  // 转数字（通用组件大概率需要数字类型的issueId，和启动器逻辑对齐）
  const issueId = Number(id);

  return (
    <GitHubIssueDetail
      owner={MODPACK_APP_REPO.owner}
      repo={MODPACK_APP_REPO.repo}
      backHref={MODPACK_APP_REPO.backHref}
    />
  );
}