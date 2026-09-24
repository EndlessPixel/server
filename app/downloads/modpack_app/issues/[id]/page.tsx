import GitHubIssueDetail from "@/components/github-issue-detail";

const MODPACK_APP_REPO = {
  owner: "EndlessPixel",
  repo: "EndlessPixel-ModpackAPP",
};

export default function IssueDetailPage() {
  return <GitHubIssueDetail owner={MODPACK_APP_REPO.owner} repo={MODPACK_APP_REPO.repo} />;
}
