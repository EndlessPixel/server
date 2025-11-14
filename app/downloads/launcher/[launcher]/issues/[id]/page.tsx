import GitHubIssueDetail from "@/components/GitHubIssueDetail";
import { launcherRepos } from "@/lib/launcherMeta";

export default async function IssueDetailPage({ params }: { params: { launcher: string; id: string } }) {
  const { launcher: key } = await params as { launcher: string; id: string };
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