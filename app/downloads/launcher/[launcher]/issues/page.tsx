import GitHubIssuesList from "@/components/GitHubIssuesList";
import { launcherRepos } from "@/lib/launcherMeta";

export default function IssuesPage({ params }: { params: { launcher: string } }) {
  const key = params.launcher;
  const meta = launcherRepos.find(r => r.key === key);
  if (!meta) return <div>未知的启动器</div>;

  return (
    <GitHubIssuesList
      owner={meta.owner}
      repo={meta.repo}
      backHref={`/downloads/launcher/${key}`}
    />
  );
}