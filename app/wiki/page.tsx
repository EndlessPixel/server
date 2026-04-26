"use client"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BookOpen, ExternalLink } from "lucide-react"

// 你的 HTTP Wiki（只能跳转，不能嵌入）
const NEW_WIKI_URL = "http://wiki.epmc.top"

export default function WikiPage() {
  return (
    <div className="min-h-screen bg-linear-to-r from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-10xl mx-auto">
          <div className="mb-4 flex items-center justify-between gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border-gray-200 dark:border-gray-700 p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300">
                Wiki 已使用 VitePress 重构，点击下方按钮前往查看
              </span>
            </div>
          </div>

          {/* 👇 核心：跳转卡片，无 iframe，不卡顿，不报错 */}
          <div className="flex flex-col items-center justify-center bg-white/90 dark:bg-gray-800/90 rounded-xl p-10 shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text:text-gray-100 mb-3">
              访问 EndlessPixel Wiki
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              由于安全策略限制，Wiki 需要在新窗口打开
            </p>
            
            <a
              href={NEW_WIKI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-base transition-colors"
            >
              <ExternalLink className="w-5 h-5" />
              打开 Wiki 文档
            </a>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
}