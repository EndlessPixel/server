import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { DownloadSection } from "@/components/download-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "资源下载 - EndlessPixel Minecraft 服务器",
  description:
    "下载 EndlessPixel Minecraft 服务器最新客户端整合包。支持 1.21.10 最新版、1.21.9，1.21.8，1.21.4 稳定版，包含 Fabric 模组包和优化配置。提供主分支和 Real 分支两种版本选择。",
  keywords: ["Minecraft下载", "模组包下载", "Fabric", "客户端下载", "1.21.10", "1.21.9", "1.21.8", "EndlessPixel", "整合包"],
  openGraph: {
    title: "资源下载 | EndlessPixel Minecraft 服务器",
    description: "下载 EndlessPixel Minecraft 服务器最新客户端整合包，体验优化的游戏内容和丰富的模组功能。",
    url: "https://ep.endlesspixel.fun/downloads",
    images: [
      {
        url: "/og-downloads.jpg",
        width: 1200,
        height: 630,
        alt: "EndlessPixel 资源下载",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-cyan-950/20">
      <Navigation />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              最新版本已发布
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-600 dark:from-slate-100 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-6">
              资源下载
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              下载 EndlessPixel 客户端整合包，开始你的冒险之旅。
              我们提供稳定可靠的模组包，包含丰富的优化和功能增强。
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-white/80 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">稳定可靠</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">经过严格测试，确保游戏稳定运行</p>
            </div>

            <div className="text-center p-6 bg-white/80 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">性能优化</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">包含性能优化模组，提升游戏体验</p>
            </div>

            <div className="text-center p-6 bg-white/80 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">社区支持</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">活跃的社区和及时的技术支持</p>
            </div>
          </div>

          {/* Downloads Section */}
          <div className="bg-white/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm p-1">
            <DownloadSection />
          </div>

          {/* Additional Info */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
              <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-4">需要帮助？</h3>
              <div className="space-y-4 text-slate-600 dark:text-slate-400">
                <p>如果您在下载或安装过程中遇到任何问题：</p>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://github.com/EndlessPixel/EndlessPixel-Modpack/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    提交 Issue
                  </a>
                  <a 
                    href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=EmTbLSL3XG_bU20-aDi4o4k_8rgBMdhs&authKey=xnbJ26rO4MI2bAemGcUt3Wj8I0Dw0nY%2Bq5Bx1HHxK1j5MS%2Bh%2FKDCQy6kOVMBl4%2FD&noverify=0&group_code=870594910" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg text-sm font-medium text-blue-700 dark:text-blue-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6z"/>
                    </svg>
                    加入 QQ 群
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}