import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ServerStatusCard } from "@/components/server-status-card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "服务器状态",
  description:
    "实时查看EndlessPixel Minecraft服务器的运行状态、在线玩家数量、服务器性能指标和延迟信息。24小时实时监控服务器健康状况。",
  keywords: ["服务器状态", "在线玩家", "服务器监控", "Minecraft状态", "实时状态", "服务器性能", "延迟查询"],
  openGraph: {
    title: "服务器状态 | EndlessPixel",
    description: "实时查看 EndlessPixel 服务器的运行状态、在线玩家和性能指标。",
    url: "https://endlesspixel.com/status",
  },
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

          <ServerStatusCard />
        </div>
      </main>
      <Footer />
    </div>
  )
}
