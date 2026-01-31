// D:\WEI\Code\server\app\downloads\modpack_app\issues\page.tsx
import GitHubIssuesList from "@/components/GitHubIssuesList";

// modpack_app 固定仓库配置（不用多仓库匹配，直接写死）
const MODPACK_APP_REPO = {
  owner: 'EndlessPixel',
  repo: 'EndlessPixel-Modpack',
  backHref: '/downloads/modpack_app' // 返回上级：modpack_app首页
};

// 异步页面解析params（这里无动态参数，保留写法和启动器页面统一）
export default async function IssuesPage() {
  return (
    <GitHubIssuesList
      owner={MODPACK_APP_REPO.owner}
      repo={MODPACK_APP_REPO.repo}
      backHref={MODPACK_APP_REPO.backHref}
    />
  );
}