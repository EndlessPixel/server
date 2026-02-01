import { LauncherDownloadPage } from "@/components/LauncherDownloadPage";
import { launcherRepos } from "@/lib/launcherMeta";

export default async function Page({ params }: { params: { launcher: string } }) {
  const { launcher: key } = params as { launcher: string };
  const meta = launcherRepos.find(r => r.key === key);
  if (!meta) return <div>未知的启动器</div>;

  return (
    <LauncherDownloadPage
      owner={meta.owner}
      repo={meta.repo}
      repoOwner={meta.owner}
      repoName={meta.repo}
      issuesHref={`/downloads/launcher/${key}/issues`}
      backHref="/downloads/launcher"
    />
  );
}