"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { WikiSkeleton } from "@/components/wiki-skeleton"
import { useToast } from "@/hooks/use-toast"
import { Heart, Share2 } from "lucide-react"
import type { WikiContentProps, ArticleStats } from "./types"
import { articles } from "./articles"

export function WikiContent({ currentArticle }: WikiContentProps) {
  const { toast } = useToast()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [articleStats, setArticleStats] = useState<Record<string, ArticleStats>>({})
  const [hasIncrementedSkim, setHasIncrementedSkim] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previousArticle, setPreviousArticle] = useState<string | null>(null)

  useEffect(() => {
    const savedStats = localStorage.getItem("wiki-article-stats")
    if (savedStats) {
      setArticleStats(JSON.parse(savedStats))
    } else {
      const defaultStats: Record<string, ArticleStats> = {
        "launcher-guide": { likes: 0, skim: 0 },
        "server-commands": { likes: 0, skim: 0 },
        "create-claims": { likes: 0, skim: 0 },
        "server-rules": { likes: 0, skim: 0 },
        "client-versions": { likes: 0, skim: 0 },
        "connection-issues": { likes: 0, skim: 0 },
        "frp-guide": { likes: 0, skim: 0 },
        "special-features": { likes: 0, skim: 0 },
      }
      setArticleStats(defaultStats)
      localStorage.setItem("wiki-article-stats", JSON.stringify(defaultStats))
    }
  }, [])

  useEffect(() => {
    if (previousArticle !== null && previousArticle !== currentArticle) {
      setIsLoading(true)
      setFeedback(null)

      const timer = setTimeout(() => setIsLoading(false), 500)
      return () => clearTimeout(timer)
    }
    setPreviousArticle(currentArticle)
  }, [currentArticle, previousArticle])

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
        localStorage.setItem("wiki-article-stats", JSON.stringify(newStats))
        return newStats
      })
    }
  }, [currentArticle, hasIncrementedSkim])

  const handleFeedback = (type: "helpful" | "not-helpful") => {
    if (type === "helpful") {
      setArticleStats((prevStats) => {
        const newStats = {
          ...prevStats,
          [currentArticle]: {
            ...prevStats[currentArticle],
            likes: (prevStats[currentArticle]?.likes || 0) + 1,
          },
        }
        localStorage.setItem("wiki-article-stats", JSON.stringify(newStats))
        return newStats
      })

      setFeedback("helpful")
      toast({
        title: "感谢您的反馈！",
        description: "您的点赞已记录，这将帮助我们改进内容质量。",
      })
    } else {
      setFeedback("not-helpful")
      toast({
        title: "感谢您的反馈！",
        description: "我们会继续努力改进内容质量。",
      })
    }
  }

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/wiki?article=${currentArticle}`
      await navigator.clipboard.writeText(url)
      toast({
        title: "链接已复制！",
        description: "页面链接已复制到剪贴板，您可以分享给其他人。",
      })
    } catch (err) {
      toast({
        title: "复制失败",
        description: "无法复制链接，请手动复制页面地址。",
        variant: "destructive",
      })
    }
  }

  const currentStats = articleStats[currentArticle] || { likes: 0, skim: 0 }
  const currentArticleData = articles[currentArticle]

  if (isLoading) return <WikiSkeleton />

  if (!currentArticleData) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">文章未找到</h2>
          <p className="text-muted-foreground">请从左侧导航选择一篇文章进行阅读。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {currentArticleData.content}

      <Separator />

      <div className="flex items-center justify-between pt-6">
        <div className="flex items-center space-x-4">
          <Button
            variant={feedback === "helpful" ? "default" : "outline"}
            onClick={() => handleFeedback("helpful")}
            disabled={feedback === "helpful"}
          >
            <Heart className="mr-2 h-4 w-4" />
            非常有帮助
          </Button>
          <Button
            variant={feedback === "not-helpful" ? "default" : "outline"}
            onClick={() => handleFeedback("not-helpful")}
            disabled={feedback === "not-helpful"}
          >
            <Heart className="mr-2 h-4 w-4" />
            不太有帮助
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            分享
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {currentArticleData.category}
            </Badge>
            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
              {currentArticleData.readTime}
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              ❤️ {currentStats.likes}
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              👁️ {currentStats.skim}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WikiContent
