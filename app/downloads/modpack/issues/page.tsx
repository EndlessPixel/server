import { Suspense } from "react";
import GitHubIssuesList from "@/components/github-issues-list";

const MODPACK_REPO = {
  owner: "EndlessPixel",
  repo: "EndlessPixel-Modpack",
  backHref: "/downloads/modpack",
};

export default function IssuesPage() {
  return (
    <Suspense fallback={<div>加载Issue列表中...</div>}>
      <GitHubIssuesList
        owner={MODPACK_REPO.owner}
        repo={MODPACK_REPO.repo}
        backHref={MODPACK_REPO.backHref}
      />
    </Suspense>
  );
}
