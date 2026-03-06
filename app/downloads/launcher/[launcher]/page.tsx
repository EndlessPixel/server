import { LauncherDownloadPage } from "@/components/LauncherDownloadPage";
import { launcherRepos } from "@/lib/launcherMeta";
import { redirect } from "next/navigation";

// 静态参数生成（优化路由预渲染）
export async function generateStaticParams() {
  return launcherRepos.map((item) => ({
    launcher: item.key,
  }));
}

// 核心页面逻辑（无调试代码）
export default async function Page({ params }: { params: Promise<{ launcher: string }> }) {
  // 解析 Promise 类型的 params（Next.js 15+ 核心要求）
  const resolvedParams = await params;
  const key = (resolvedParams?.launcher || "").trim();

  // 参数为空则重定向到启动器列表页
  if (!key) {
    redirect("/downloads/launcher");
  }

  // 匹配启动器元数据
  const meta = launcherRepos.find((item) => item.key === key);
  
  // 未知启动器处理
  if (!meta) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>未知的启动器</h2>
        <p>你访问的启动器「{key}」不存在</p>
        <p><a href="/downloads/launcher" style={{ color: "#0070f3" }}>返回启动器列表</a></p>
      </div>
    );
  }

  // 正常渲染下载页面
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
