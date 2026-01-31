// D:\WEI\Code\server\app\downloads\modpack_app\issues\page.tsx
// 新增：导入React.Suspense
import { Suspense } from 'react';
import GitHubIssuesList from "@/components/GitHubIssuesList";

// modpack_app 固定仓库配置（无需修改）
const MODPACK_APP_REPO = {
  owner: 'EndlessPixel',
  repo: 'EndlessPixel-ModpackAPP',
  backHref: '/downloads/modpack_app'
};

// 异步页面（无需修改async，保留原有写法）
export default async function IssuesPage() {
  return (
    // 新增：用Suspense包裹组件，添加加载兜底
    <Suspense fallback={<div>加载Issue列表中...</div>}>
      <GitHubIssuesList
        owner={MODPACK_APP_REPO.owner}
        repo={MODPACK_APP_REPO.repo}
        backHref={MODPACK_APP_REPO.backHref}
      />
    </Suspense>
  );
}