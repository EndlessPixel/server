import { LauncherDownloadPage } from "@/components/LauncherDownloadPage";
import { launcherRepos } from "@/lib/launcherMeta";

export default function Page({ params }: { params: { slug?: string[] } }) {
  const [key, branch] = params.slug ?? [];
  if (!key) return <div>请指定启动器</div>;

  const meta = launcherRepos.find(r => r.key === key);
  if (!meta) return <div>未知的启动器</div>;

  const branchPath = branch ? `/${branch}` : "";
  const issuesHref = `/downloads/launcher/${key}${branchPath}/issues`;

  return (
    <LauncherDownloadPage
      owner={meta.owner}
      repo={meta.repo}
      repoOwner={meta.owner}
      repoName={meta.repo}
      issuesHref={issuesHref}
      archived={meta.archived}
      archivedDate={meta.archivedDate}
      backHref="/downloads"
    />
  );
}