import GitHubIssueDetail from "@/components/github-issue-detail";

const MODPACK_REPO = {
  owner: "EndlessPixel",
  repo: "EndlessPixel-Modpack",
};

export default function IssueDetailPage() {
  return <GitHubIssueDetail owner={MODPACK_REPO.owner} repo={MODPACK_REPO.repo} />;
}
