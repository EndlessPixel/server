

import { Suspense } from 'react';
import GitHubIssuesList from "@/components/github-issues-list";


const MODPACK_APP_REPO = {
  owner: 'EndlessPixel',
  repo: 'EndlessPixel-ModpackAPP',
  backHref: '/downloads/modpack_app'
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