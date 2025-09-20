import { Suspense } from 'react';
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ServerStatusCard } from "@/components/server-status-card"
import { ServerStatusSkeleton } from "@/components/server-status-skeleton";
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "服务器状态",
  description:
    "实时查看EndlessPixel Minecraft服务器的运行状态、在线玩家数量、服务器性能指标和延迟信息。24小时实时监控服务器健康状况。",
  keywords: ["服务器状态", "在线玩家", "服务器监控", "Minecraft状态", "实时状态", "服务器性能", "延迟查询"],
  openGraph: {
    title: "服务器状态 | EndlessPixel",
    description: "实时查看 EndlessPixel 服务器的运行状态、在线玩家和性能指标。",
    url: "https://ep.endlesspixel.fun/status",
  },
}

// 加载状态组件 - 与ServerStatusCard结构匹配的骨架屏
function ServerStatusFallback() {
  return (
    <div className="w-full max-w-[1200px] mx-auto shadow-2xl border-0 bg-white/90 dark:bg-zinc-900/90 rounded-lg p-8 animate-pulse">
      <div className="flex flex-wrap gap-4 px-2 pt-2 pb-6 justify-center mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-full px-7 py-2 bg-gray-200 dark:bg-gray-700 w-32 h-10"></div>
        ))}
      </div>
      <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="rounded-xl bg-gray-200 dark:bg-gray-700 p-7 h-40"></div>
        <div className="rounded-xl bg-gray-200 dark:bg-gray-700 p-7 h-40"></div>
      </div>
      <div className="rounded-xl bg-gray-200 dark:bg-gray-700 p-7 h-16 mb-8"></div>
      <div className="rounded-xl bg-gray-200 dark:bg-gray-700 p-7 h-32"></div>
    </div>
  );
}

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">服务器状态</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              实时查看 EndlessPixel 服务器的运行状态、在线玩家和性能指标
            </p>
          </div>

          {/* 使用Suspense包裹客户端组件，解决useSearchParams的构建错误 */}
          <Suspense fallback={<ServerStatusFallback />}>
            <ServerStatusCard />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}
    
