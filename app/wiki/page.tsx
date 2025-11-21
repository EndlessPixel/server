"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { WikiSidebar } from "@/components/wiki-sidebar"
import { WikiContent } from "@/components/wiki-content"
import { WikiSearch } from "@/components/wiki-search"
import { Breadcrumb } from "@/components/breadcrumb"
import { BookOpen, Sparkles, Users, Zap } from "lucide-react"

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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-blue-500 to-cyan-500 rounded-3xl shadow-lg mb-6">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-linear-to-r from-gray-900 to-blue-700 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent mb-4">
              EndlessPixel Wiki
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              游戏指南、服务器规则、新手教程和进阶攻略，助您畅游 EndlessPixel 世界
            </p>
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

          {/* Quick Links Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">快速开始</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">选择您需要的指南快速开始</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                className="bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                onClick={() => window.dispatchEvent(new CustomEvent("wiki-article-change", { detail: { articleId: "launcher-guide" } }))}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-xl">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="font-bold text-blue-900 dark:text-blue-100 text-lg">新手入门</h3>
                </div>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
                  从零开始学习如何安装整合包、连接服务器和基础操作
                </p>
                <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">开始游戏 →</div>
              </div>
              
              <div 
                className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                onClick={() => window.dispatchEvent(new CustomEvent("wiki-article-change", { detail: { articleId: "server-commands" } }))}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-green-100 dark:bg-green-800 p-3 rounded-xl">
                    <span className="text-2xl">⌨️</span>
                  </div>
                  <h3 className="font-bold text-green-900 dark:text-green-100 text-lg">命令大全</h3>
                </div>
                <p className="text-green-700 dark:text-green-300 text-sm mb-4">
                  掌握服务器所有可用命令，包括传送、皮肤管理和技能系统
                </p>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">查看命令 →</div>
              </div>
              
              <div 
                className="bg-linear-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg"
                onClick={() => window.dispatchEvent(new CustomEvent("wiki-article-change", { detail: { articleId: "special-features" } }))}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-purple-100 dark:bg-purple-800 p-3 rounded-xl">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="font-bold text-purple-900 dark:text-purple-100 text-lg">特色功能</h3>
                </div>
                <p className="text-purple-700 dark:text-purple-300 text-sm mb-4">
                  探索服务器的独特功能，包括连锁挖掘、坐下功能和领地系统
                </p>
                <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">探索功能 →</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}