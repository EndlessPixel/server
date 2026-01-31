// D:\WEI\Code\server\app\downloads\modpack_app\issues\[id]\page.tsx
import GitHubIssueDetail from "@/components/GitHubIssueDetail";

// modpack_app 固定仓库配置
const MODPACK_APP_REPO = {
  owner: 'EndlessPixel',
  repo: 'EndlessPixel-Modpack',
  backHref: '/downloads/modpack/issues' // 返回上级：modpack_app的Issue列表
};

// 异步解析动态路由params（id是Issue编号，和启动器页面的params解析逻辑一致）
export default async function IssueDetailPage({}: { params: { id: string } }) {

  return (
    <GitHubIssueDetail
      owner={MODPACK_APP_REPO.owner}
      repo={MODPACK_APP_REPO.repo}
      backHref={MODPACK_APP_REPO.backHref}
    />
  );
}