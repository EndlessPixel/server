"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WikiSidebar } from "@/components/wiki-sidebar"
import { WikiContent } from "@/components/wiki-content"
import { WikiSearch } from "@/components/wiki-search"
import { Breadcrumb } from "@/components/breadcrumb"
import { BookOpen } from "lucide-react"

const articleMetadata: Record<string, { title: string; category: string }> = {
  "server-commands": { title: "服务器玩家命令", category: "新手入门" },
  "launcher-guide": { title: "整合包安装指南", category: "新手入门" },
  "create-claims": { title: "领地管理", category: "新手入门" },
  "server-rules": { title: "服务器规则", category: "规则制度" },
  "client-versions": { title: "服务器客户端版本说明", category: "技术指南" },
  "frp-guide": { title: "服务器FRP节点贡献指南", category: "技术指南" },
  "special-features": { title: "服务器特殊功能指南", category: "特色功能" },
  "connection-issues": { title: "服务器连接问题及解决方法", category: "故障排除" },
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000
const CONFIRMED_KEY = "wiki-deprecation-confirmed-at"
const BANNER_DISMISSED_KEY = "wiki-deprecation-banner-dismissed"

export default function WikiPage() {
  const [currentArticle, setCurrentArticle] = useState("server-commands")

  useEffect(() => {
    const handleArticleChange = (event: CustomEvent) => {
      setCurrentArticle(event.detail.articleId)
    }

    window.addEventListener("wiki-article-change", handleArticleChange as EventListener)

    return () => {
      window.removeEventListener("wiki-article-change", handleArticleChange as EventListener)
    }
  }, [])

  // 新增：弃用提示状态：模态与顶部横幅
  const [showDeprecationModal, setShowDeprecationModal] = useState(false)
  const [showDeprecationBanner, setShowDeprecationBanner] = useState(false)

  useEffect(() => {
    try {
      const ts = Number(localStorage.getItem(CONFIRMED_KEY))
      const bannerDismissed = !!localStorage.getItem(BANNER_DISMISSED_KEY)

      if (!ts || Number.isNaN(ts)) {
        // 未确认过：首次 -> 弹模态
        setShowDeprecationModal(true)
        setShowDeprecationBanner(false)
        return
      }

      const age = Date.now() - ts
      if (age > ONE_DAY_MS) {
        // 超过一天 -> 需要再次确认 -> 弹模态
        setShowDeprecationModal(true)
        setShowDeprecationBanner(false)
        return
      }

      // 已确认且未超过一天 -> 显示顶部横幅（若未被关闭）
      if (!bannerDismissed) {
        setShowDeprecationBanner(true)
      }
    } catch {
      // localStorage 不可用 -> 弹模态以保证可见性
      setShowDeprecationModal(true)
    }
  }, [])

  const confirmNow = (alsoShowBanner = true) => {
    try {
      localStorage.setItem(CONFIRMED_KEY, String(Date.now()))
      localStorage.removeItem(BANNER_DISMISSED_KEY)
    } catch {
      // ignore
    }
    setShowDeprecationModal(false)
    setShowDeprecationBanner(alsoShowBanner)
  }

  const dismissBanner = () => {
    try {
      localStorage.setItem(BANNER_DISMISSED_KEY, "true")
    } catch {
      // ignore
    }
    setShowDeprecationBanner(false)
  }

  const handleContinueModal = () => {
    confirmNow(true)
  }

  const handleRedirectModal = () => {
    confirmNow(false)
    const url = "https://docs.qq.com/aio/p/sc0m6qoo8xschku?p=7OQN4lhJjGdrbLfHXNz7rs"
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleContinueBanner = () => {
    // 点击继续：确认并隐藏横幅（短期内不再显示）
    try {
      localStorage.setItem(CONFIRMED_KEY, String(Date.now()))
      localStorage.setItem(BANNER_DISMISSED_KEY, "true")
    } catch {
      // ignore
    }
    setShowDeprecationBanner(false)
  }

  const handleRedirectBanner = () => {
    try {
      localStorage.setItem(CONFIRMED_KEY, String(Date.now()))
      localStorage.setItem(BANNER_DISMISSED_KEY, "true")
    } catch {
      // ignore
    }
    const url = "https://docs.qq.com/aio/p/sc0m6qoo8xschku?p=7OQN4lhJjGdrbLfHXNz7rs"
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const getBreadcrumbItems = () => {
    const article = articleMetadata[currentArticle]
    if (!article) return [{ label: "Wiki" }]

    return [{ label: "Wiki", href: "/wiki" }, { label: article.category }, { label: article.title }]
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />

      {/* 顶部横幅（降级展示） */}
      {showDeprecationBanner && (
        <div className="fixed top-30 left-0 right-0 z-40 flex items-center justify-center px-4">
          <div className="w-full max-w-7xl bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-b-xl shadow-sm py-3 px-4 flex items-center gap-4">
            <div className="flex-1 text-sm text-yellow-900 dark:text-yellow-100">
              此 Wiki 将不再维护，预计在2026/01/10左右会移除此页面。建议访问腾讯文档获取最新帮助：
              <span className="ml-2 underline text-blue-600 dark:text-blue-300">https://docs.qq.com/aio/p/sc0m6qoo8xschku?p=7OQN4lhJjGdrbLfHXNz7rs</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                onClick={handleContinueBanner}
              >
                继续查看
              </button>
              <button
                type="button"
                className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                onClick={handleRedirectBanner}
              >
                跳转新Wiki
              </button>
              <button
                aria-label="关闭提示"
                type="button"
                className="ml-2 text-sm text-gray-500 hover:text-gray-700"
                onClick={dismissBanner}
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 弃用提示模态框 */}
      {showDeprecationModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wiki-deprecation-title"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleContinueModal}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-2xl mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 id="wiki-deprecation-title" className="text-lg font-semibold mb-2">
                    此 Wiki 将不再维护
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    本页面将不再维护，预计在2026/01/10左右会移除此页面。建议访问腾讯文档以获取最新帮助：
                    <span className="break-all text-blue-600 dark:text-blue-400">https://docs.qq.com/aio/p/sc0m6qoo8xschku?p=7OQN4lhJjGdrbLfHXNz7rs</span>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm"
                  onClick={handleContinueModal}
                >
                  继续查看
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                  onClick={handleRedirectModal}
                >
                  跳转新Wiki
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Page Header */}
          <br /><br /><br />
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-linear-to-r from-gray-900 to-blue-700 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent mb-4">
              EndlessPixel Wiki
            </h1>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <WikiSearch />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <WikiSidebar />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <Breadcrumb items={getBreadcrumbItems()} />
              </div>
              
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
                <div className="p-8">
                  <WikiContent currentArticle={currentArticle} />
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