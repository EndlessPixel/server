"use client"

import React, { useEffect, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { WikiSkeleton } from "@/components/wiki-skeleton"
import { useToast } from "@/hooks/use-toast"
import { Heart, Share2, ThumbsUp, ThumbsDown, Eye, Clock, User, Calendar } from "lucide-react"
import type { WikiContentProps, ArticleStats, ArticleData } from "./types"
import { articles } from "./articles"

// 默认统计数据
const DEFAULT_STATS: Record<string, ArticleStats> = {
  "launcher-guide": { likes: 0, skim: 0 },
  "server-commands": { likes: 0, skim: 0 },
  "create-claims": { likes: 0, skim: 0 },
  "server-rules": { likes: 0, skim: 0 },
  "client-versions": { likes: 0, skim: 0 },
  "connection-issues": { likes: 0, skim: 0 },
  "frp-guide": { likes: 0, skim: 0 },
  "special-features": { likes: 0, skim: 0 },
}

// 文章未找到组件
const ArticleNotFound = () => (
  <div className="space-y-8">
    <div className="text-center py-20">
      <div className="bg-linear-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 border-2 border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
        <div className="w-24 h-24 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">📚</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">文章未找到</h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
          请从左侧导航选择一篇文章进行阅读。
        </p>
        <Button
          onClick={() => window.dispatchEvent(new CustomEvent("wiki-article-change", { detail: { articleId: "server-commands" } }))}
          className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 rounded-xl"
        >
          查看新手指南
        </Button>
      </div>
    </div>
  </div>
)

// 反馈组件
const FeedbackSection = ({
  feedback,
  onFeedback,
  onShare
}: {
  feedback: string | null;
  onFeedback: (type: "helpful" | "not-helpful") => void;
  onShare: () => void;
}) => (
  <div className="bg-linear-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700">
    <div className="text-center mb-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">这篇文章对您有帮助吗？</h3>
      <p className="text-gray-600 dark:text-gray-400">您的反馈将帮助我们改进文档质量</p>
    </div>

    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Feedback Buttons */}
      <div className="flex items-center space-x-4">
        <Button
          variant={feedback === "helpful" ? "default" : "outline"}
          onClick={() => onFeedback("helpful")}
          disabled={feedback === "helpful"}
          className={`px-6 py-3 rounded-xl transition-all duration-200 ${feedback === "helpful"
              ? "bg-linear-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg"
              : "border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950/20"
            }`}
        >
          <ThumbsUp className="mr-2 h-5 w-5" />
          非常有帮助
        </Button>
        <Button
          variant={feedback === "not-helpful" ? "default" : "outline"}
          onClick={() => onFeedback("not-helpful")}
          disabled={feedback === "not-helpful"}
          className={`px-6 py-3 rounded-xl transition-all duration-200 ${feedback === "not-helpful"
              ? "bg-linear-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg"
              : "border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
            }`}
        >
          <ThumbsDown className="mr-2 h-5 w-5" />
          不太有帮助
        </Button>
      </div>

      {/* Share Button */}
      <Button
        variant="outline"
        onClick={onShare}
        className="px-6 py-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/20"
      >
        <Share2 className="mr-2 h-5 w-5" />
        分享文章
      </Button>
    </div>
  </div>
)

// 文章元数据组件
const ArticleMetadata = ({
  article,
  stats
}: {
  article: ArticleData;
  stats: ArticleStats;
}) => (
  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-6">
    <div className="flex flex-wrap items-center gap-4">
      <Badge className="bg-linear-to-r from-blue-500 to-cyan-500 text-white border-0 px-4 py-2 rounded-full text-sm font-semibold">
        {article.category}
      </Badge>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="outline" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 px-3 py-2 rounded-full">
          <Clock className="w-4 h-4 mr-2 text-gray-500" />
          {article.readTime}
        </Badge>

        <Badge variant="outline" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 px-3 py-2 rounded-full">
          <User className="w-4 h-4 mr-2 text-gray-500" />
          {article.author}
        </Badge>

        <Badge variant="outline" className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 px-3 py-2 rounded-full">
          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
          {article.lastUpdated}
        </Badge>
      </div>
    </div>

    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-linear-to-r from-pink-50 to-red-50 dark:from-pink-950/20 dark:to-red-950/20 px-4 py-2 rounded-full border-2 border-pink-200 dark:border-pink-800">
          <Heart className="w-4 h-4 text-pink-500" />
          <span className="text-pink-700 dark:text-pink-300 font-semibold">{stats.likes}</span>
        </div>

        <div className="flex items-center space-x-2 bg-linear-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 px-4 py-2 rounded-full border-2 border-purple-200 dark:border-purple-800">
          <Eye className="w-4 h-4 text-purple-500" />
          <span className="text-purple-700 dark:text-purple-300 font-semibold">{stats.skim}</span>
        </div>
      </div>
    </div>
  </div>
)

export function WikiContent({ currentArticle }: WikiContentProps) {
  const { toast } = useToast()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [articleStats, setArticleStats] = useState<Record<string, ArticleStats>>(DEFAULT_STATS)
  const [hasIncrementedSkim, setHasIncrementedSkim] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previousArticle, setPreviousArticle] = useState<string | null>(null)

  // 加载本地存储的统计数据
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem("wiki-article-stats")
      if (savedStats) {
        const parsedStats = JSON.parse(savedStats)
        // 合并默认数据，确保所有文章都有统计数据
        setArticleStats({ ...DEFAULT_STATS, ...parsedStats })
      }
    } catch (error) {
      console.error("Failed to load article stats:", error)
      toast({
        title: "数据加载失败",
        description: "无法加载文章统计数据，将使用默认值。",
        variant: "destructive",
      })
    }
  }, [toast])

  // 处理文章切换
  useEffect(() => {
    if (previousArticle !== null && previousArticle !== currentArticle) {
      setIsLoading(true)
      setFeedback(null)

      const timer = setTimeout(() => setIsLoading(false), 500)
      return () => clearTimeout(timer)
    }
    setPreviousArticle(currentArticle)
  }, [currentArticle, previousArticle])

  // 增加浏览量
  useEffect(() => {
    if (currentArticle && hasIncrementedSkim !== currentArticle) {
      setHasIncrementedSkim(currentArticle)
      setArticleStats((prevStats) => {
        const newStats = {
          ...prevStats,
          [currentArticle]: {
            likes: prevStats[currentArticle]?.likes || 0,
            skim: (prevStats[currentArticle]?.skim || 0) + 1,
          },
        }
        try {
          localStorage.setItem("wiki-article-stats", JSON.stringify(newStats))
        } catch (error) {
          console.error("Failed to save article stats:", error)
        }
        return newStats
      })
    }
  }, [currentArticle, hasIncrementedSkim])

  // 处理用户反馈
  const handleFeedback = useCallback((type: "helpful" | "not-helpful") => {
    if (type === "helpful") {
      setArticleStats((prevStats) => {
        const newStats = {
          ...prevStats,
          [currentArticle]: {
            ...prevStats[currentArticle],
            likes: (prevStats[currentArticle]?.likes || 0) + 1,
          },
        }
        try {
          localStorage.setItem("wiki-article-stats", JSON.stringify(newStats))
        } catch (error) {
          console.error("Failed to save article stats:", error)
        }
        return newStats
      })

      setFeedback("helpful")
      toast({
        title: "🎉 感谢您的反馈！",
        description: "您的点赞已记录，这将帮助我们改进内容质量。",
      })
    } else {
      setFeedback("not-helpful")
      toast({
        title: "🙏 感谢您的反馈！",
        description: "我们会继续努力改进内容质量。",
      })
    }
  }, [currentArticle, toast])

  // 处理分享功能
  const handleShare = useCallback(async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error("剪贴板API不可用")
      }
      
      const url = `${window.location.origin}/wiki?article=${currentArticle}`
      await navigator.clipboard.writeText(url)
      toast({
        title: "🔗 链接已复制！",
        description: "页面链接已复制到剪贴板，您可以分享给其他人。",
      })
    } catch (err) {
      console.error("Share failed:", err)
      toast({
        title: "❌ 复制失败",
        description: "无法复制链接，请手动复制页面地址。",
        variant: "destructive",
      })
    }
  }, [currentArticle, toast])

  // 获取当前文章数据和统计
  const currentArticleData = useMemo(() => articles[currentArticle] as ArticleData | undefined, [currentArticle])
  const currentStats = useMemo(
    () => articleStats[currentArticle] || { likes: 0, skim: 0 },
    [articleStats, currentArticle]
  )

  if (isLoading) return <WikiSkeleton />

  if (!currentArticleData) {
    return <ArticleNotFound />
  }

  return (
    <div className="space-y-8">
      {currentArticleData.content}

      <Separator />

      <FeedbackSection
        feedback={feedback}
        onFeedback={handleFeedback}
        onShare={handleShare}
      />

      <ArticleMetadata
        article={currentArticleData}
        stats={currentStats}
      />
    </div>
  )
}

export default WikiContent