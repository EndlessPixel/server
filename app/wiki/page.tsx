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

  const getBreadcrumbItems = () => {
    const article = articleMetadata[currentArticle]
    if (!article) return [{ label: "Wiki" }]

    return [{ label: "Wiki", href: "/wiki" }, { label: article.category }, { label: article.title }]
  }

  return (
    <div className="min-h-screen bg-linear-to-r from-gray-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navigation />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Page Header */}
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