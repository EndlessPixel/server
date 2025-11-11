import GitHubIssueDetail from "@/components/GitHubIssueDetail";
import { launcherRepos } from "@/lib/launcherMeta";

export default function IssueDetailPage({ params }: { params: { slug?: string[]; id: string } }) {
  const [key, branch] = params.slug ?? [];
  if (!key) return <div>请指定启动器</div>;

  const meta = launcherRepos.find(r => r.key === key);
  if (!meta) return <div>未知的启动器</div>;

  const backHref = `/downloads/launcher/${key}${branch ? `/${branch}` : ""}/issues`;

  return <GitHubIssueDetail owner={meta.owner} repo={meta.repo} backHref={backHref} />;
}