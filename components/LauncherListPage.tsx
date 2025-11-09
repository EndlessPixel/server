"use client";
import { launcherRepos } from "@/lib/launcherMeta";
import { getIcon } from "@/components/IconMap";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function LauncherListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-cyan-950/20 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-600 dark:from-slate-100 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-6">
            资源下载
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">选择适合您设备的启动器版本</p>
        </div>

        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-blue-600 dark:text-blue-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> 返回首页
        </Link>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {launcherRepos.map((r) => (
            <Link
              key={r.key}
              href={`/downloads/launcher/${r.key}`}
              className="group block p-6 bg-white/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm hover:shadow-lg transition-all"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                {getIcon(((r as any).introCards?.[0]?.icon) ?? "Settings")}
              </div>
              <h3>{r.displayName}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                {((r as any).introCards?.[0]?.desc) ?? ""}
              </p>
              <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                <span>查看详情</span>
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}