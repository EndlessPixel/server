"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BookOpen, ExternalLink, Loader2 } from "lucide-react"

// 你的腾讯文档新Wiki地址
const NEW_WIKI_URL = "https://docs.qq.com/aio/p/sc0m6qoo8xschku?p=7OQN4lhJjGdrbLfHXNz7rs"

export default function WikiPage() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 保留原有导航栏，视觉统一 */}
      <Navigation />

      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-10xl mx-auto">
          {/* 轻量引导栏：告知用户已迁移，提供新窗口打开选项 */}
          <div className="mb-4 flex items-center justify-between gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300">
                Wiki已迁移至腾讯文档，点击左侧按钮进行跳转，或在下方进行预览。
              </span>
            </div>
            <a
              href={NEW_WIKI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
              title="新窗口打开Wiki"
            >
              新窗口打开 <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/wiki/full_screen_preview"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
              title="全屏预览Wiki"
            >
              全屏预览 <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* iframe容器：核心内容区，适配样式+加载状态 */}
          {/* 加载中占位 */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">加载最新Wiki内容...</p>
              </div>
            </div>
          )}

          {/* 核心iframe：嵌入腾讯文档 */}
          <div style={{ width: "100%", height: "100vh", margin: 0, padding: 0, overflow: "hidden" }}>
            <iframe
              src={NEW_WIKI_URL}
              title="EndlessPixel 最新Wiki-腾讯文档"
              width="100%"
              height="100%"
              onLoad={() => setIsLoading(false)}
              className="transition-opacity duration-300"
              // 允许iframe内的弹窗/新窗口，兼容腾讯文档的操作
              allow="fullscreen; popups; clipboard-write"
            />
          </div>
        </div>
      </main>

      {/* 保留原有页脚，视觉闭环 */}
      <Footer />
    </div>
  )
}