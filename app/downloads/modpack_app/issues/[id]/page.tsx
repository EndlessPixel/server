
import GitHubIssueDetail from "@/components/GitHubIssueDetail";


const MODPACK_APP_REPO = {
  owner: 'EndlessPixel',
  repo: 'EndlessPixel-ModpackAPP',
  backHref: '/downloads/modpack_app/issues'
};


export default async function IssueDetailPage({}: { params: { id: string } }) {
  return (
    <GitHubIssueDetail
      owner={MODPACK_APP_REPO.owner}
      repo={MODPACK_APP_REPO.repo}
      backHref={MODPACK_APP_REPO.backHref}
    />
  );
}