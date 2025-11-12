import { LauncherDownloadPage } from "@/components/LauncherDownloadPage";
import { launcherRepos } from "@/lib/launcherMeta";

export default function Page({ params }: { params: { launcher: string } }) {
  const key = params.launcher;
  const meta = launcherRepos.find(r => r.key === key);
  if (!meta) return <div>未知的启动器</div>;

  return (
    <LauncherDownloadPage
      owner={meta.owner}
      repo={meta.repo}
      repoOwner={meta.owner}
      repoName={meta.repo}
      issuesHref={`/downloads/launcher/${key}/issues`}
      archived={meta.archived}
      archivedDate={meta.archivedDate}
      backHref="/downloads"
    />
  );
}