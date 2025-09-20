"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, X, BookOpen, FileText, Users, Settings, Wrench, HelpCircle } from "lucide-react"

const wikiArticles = [
  {
    id: "server-commands",
    title: "服务器玩家命令",
    category: "新手入门",
    excerpt: "了解服务器中可用的玩家命令，包括传送、皮肤管理、技能系统等功能...",
    icon: BookOpen,
  },
  {
    id: "create-claims",
    title: "如何创建领地",
    category: "新手入门",
    excerpt: "学习如何使用箭工具创建和管理你的领地，保护你的建筑和物品...",
    icon: Settings,
  },
  {
    id: "server-rules",
    title: "服务器规则",
    category: "规则制度",
    excerpt: "为了维护良好的游戏环境，请遵守服务器规则，包括禁止行为和处罚制度...",
    icon: FileText,
  },
  {
    id: "client-versions",
    title: "服务器客户端版本说明",
    category: "技术指南",
    excerpt: "了解服务器支持的Minecraft版本范围和兼容性信息...",
    icon: Wrench,
  },
  {
    id: "frp-guide",
    title: "服务器FRP节点贡献指南",
    category: "技术指南",
    excerpt: "学习如何配置和提交FRP节点，为服务器网络贡献力量...",
    icon: Settings,
  },
  {
    id: "special-features",
    title: "服务器特殊功能指南",
    category: "特色功能",
    excerpt: "探索服务器的特色功能，包括坐下、连锁挖掘、农田保护等...",
    icon: Users,
  },
  {
    id: "connection-issues",
    title: "服务器连接问题及解决方法",
    category: "故障排除",
    excerpt: "解决常见的服务器连接问题，包括网络异常、版本不兼容等...",
    icon: HelpCircle,
  },
]

export function WikiSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof wikiArticles>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setIsSearching(true)
      // Simulate search delay
      setTimeout(() => {
        const filtered = wikiArticles.filter(
          (article) =>
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
            article.category.toLowerCase().includes(query.toLowerCase()),
        )
        setSearchResults(filtered)
        setIsSearching(false)
      }, 300)
    } else {
      setSearchResults([])
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setIsSearching(false)
  }

  const handleArticleSelect = (articleId: string) => {
    window.dispatchEvent(new CustomEvent("wiki-article-change", { detail: { articleId } }))
    clearSearch()
  }

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="搜索 Wiki 内容..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results */}
      {(searchResults.length > 0 || isSearching) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isSearching ? (
              <div className="p-4 text-center text-muted-foreground">搜索中...</div>
            ) : searchResults.length > 0 ? (
              <div className="divide-y divide-border">
                {searchResults.map((result) => {
                  const Icon = result.icon
                  return (
                    <div
                      key={result.id}
                      className="p-4 hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => handleArticleSelect(result.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground mb-1">{result.title}</h4>
                          <p className="text-sm text-muted-foreground mb-1">{result.excerpt}</p>
                          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                            {result.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground">未找到相关内容</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
