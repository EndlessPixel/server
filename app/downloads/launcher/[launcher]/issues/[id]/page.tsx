import GitHubIssueDetail from "@/components/GitHubIssueDetail";
import { launcherRepos } from "@/lib/launcherMeta";

export default function IssueDetailPage({ params }: { params: { launcher: string; id: string } }) {
  const key = params.launcher;
  const meta = launcherRepos.find(r => r.key === key);
  if (!meta) return <div>未知的启动器</div>;

  return (
    <GitHubIssueDetail
      owner={meta.owner}
      repo={meta.repo}
      backHref={`/downloads/launcher/${key}/issues`}
    />
  );
}