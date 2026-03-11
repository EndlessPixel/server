import { Suspense } from 'react';
import GitHubIssuesList from "@/components/GitHubIssuesList";
const MODPACK_APP_REPO = {
  owner: 'EndlessPixel',
  repo: 'EndlessPixel-Modpack',
  backHref: '/downloads/modpack'
};
export default async function IssuesPage() {
  return (
    <Suspense fallback={<div>加载Issue列表中...</div>}>
      <GitHubIssuesList
        owner={MODPACK_APP_REPO.owner}
        repo={MODPACK_APP_REPO.repo}
        backHref={MODPACK_APP_REPO.backHref}
      />
    </Suspense>
  );
}