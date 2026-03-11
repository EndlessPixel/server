import { LauncherDownloadPage } from "@/components/LauncherDownloadPage";
import { launcherRepos } from "@/lib/launcherMeta";
import { redirect } from "next/navigation";


export async function generateStaticParams() {
  return launcherRepos.map((item) => ({
    launcher: item.key,
  }));
}


export default async function Page({ params }: { params: Promise<{ launcher: string }> }) {

  const resolvedParams = await params;
  const key = (resolvedParams?.launcher || "").trim();


  if (!key) {
    redirect("/downloads/launcher");
  }


  const meta = launcherRepos.find((item) => item.key === key);


  if (!meta) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>未知的启动器</h2>
        <p>你访问的启动器「{key}」不存在</p>
        <p><a href="/downloads/launcher" style={{ color: "#0070f3" }}>返回启动器列表</a></p>
      </div>
    );
  }


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
