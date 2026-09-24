import GitHubIssuesList from "@/components/github-issues-list";
import { launcherRepos } from "@/lib/launcherMeta";

export default async function IssuesPage({ params }: { params: Promise<{ launcher: string }> }) {
  const { launcher: key } = await params;
  const meta = launcherRepos.find((r) => r.key === key);
  if (!meta) return <div>未知的启动器</div>;

  return (
    <GitHubIssuesList owner={meta.owner} repo={meta.repo} backHref={`/downloads/launcher/${key}`} />
  );
}
