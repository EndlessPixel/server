"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { WikiSkeleton } from "@/components/wiki-skeleton"
import { useToast } from "@/hooks/use-toast"
import { Heart, Share2, Terminal, Shield, Wrench, HelpCircle, Trophy } from "lucide-react"

interface WikiContentProps {
  currentArticle: string
}

interface ArticleStats {
  likes: number
  skim: number
}

interface ArticleData {
  title: string
  category: string
  icon: any
  lastUpdated: string
  author: string
  readTime: string
  content: React.ReactNode
}

export function WikiContent({ currentArticle }: WikiContentProps) {
  const { toast } = useToast()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [articleStats, setArticleStats] = useState<Record<string, ArticleStats>>({})
  const [hasIncrementedSkim, setHasIncrementedSkim] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [previousArticle, setPreviousArticle] = useState<string | null>(null)

  useEffect(() => {
    // 从localStorage加载数据
    const savedStats = localStorage.getItem("wiki-article-stats")
    if (savedStats) {
      setArticleStats(JSON.parse(savedStats))
    } else {
      // 初始化默认数据
      const defaultStats: Record<string, ArticleStats> = {
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
      setFeedback(null) // Reset feedback when switching articles

      // Simulate loading delay for better UX
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 500)

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
      // 点击"非常有帮助"时增加likes
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

  const articles: Record<string, ArticleData> = {
    "server-commands": {
      title: "服务器玩家命令",
      category: "新手入门",
      icon: Terminal,
      lastUpdated: "2025/08/15",
      author: "system_mini",
      readTime: "5分钟",
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Terminal className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">服务器玩家命令</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <span>分类：新手入门</span>
                <span>•</span>
                <span>最后编辑：2025/08/15</span>
                <span>•</span>
                <span>作者：system_mini</span>
                <span>•</span>
                <span>阅读时间：5分钟</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-foreground mb-4">传送命令</h2>
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <ul className="space-y-2">
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/spawn</code> - 传送到主城
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/home</code> - 传送到家
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/sethome [名称]</code> - 设置家的位置
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/delhome [名称]</code> - 删除家
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/tpa [玩家名]</code> - 请求传送到某玩家
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/tpaccept</code> - 接受传送请求
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/tpdeny</code> - 拒绝传送请求
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-4">皮肤管理</h2>
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg mb-4">
              <ul className="space-y-2">
                <li>
                  <code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded text-foreground">
                    /skin set &lt;正版玩家用户名&gt;
                  </code>{" "}
                  - 设置皮肤
                </li>
                <li>
                  <code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded text-foreground">/skins</code> -
                  打开皮肤菜单
                </li>
                <li>
                  <code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded text-foreground">/skin clear</code> -
                  清除皮肤
                </li>
                <li>
                  <code className="bg-blue-200 dark:bg-blue-800 px-2 py-1 rounded text-foreground">/skin update</code> -
                  更新皮肤
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-4">技能系统</h2>
            <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg mb-4">
              <ul className="space-y-2">
                <li>
                  <code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded text-foreground">/skills</code> -
                  查看技能等级
                </li>
                <li>
                  <code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded text-foreground">
                    /skills lang [language]
                  </code>{" "}
                  - 更改您的个人语言
                </li>
                <li>
                  <code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded text-foreground">/stats</code> -
                  打开统计数据菜单，显示所有统计数据概览和玩家等级
                </li>
                <li>
                  <code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded text-foreground">/mana</code> -
                  显示当前法力值
                </li>
                <li>
                  <code className="bg-green-200 dark:bg-green-800 px-2 py-1 rounded text-foreground">
                    /sk sources [skill] [sortType]
                  </code>{" "}
                  - 打开技能的来源菜单，显示获得经验值的方法
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mt-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <strong>提示：</strong>所有命令都区分大小写，请确保正确输入。如果遇到问题，可以联系管理员获取帮助。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    "create-claims": {
      title: "如何创建领地",
      category: "新手入门",
      icon: Shield,
      lastUpdated: "2025/08/15",
      author: "system_mini",
      readTime: "8分钟",
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">如何创建领地</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <span>分类：新手入门</span>
                <span>•</span>
                <span>最后编辑：2025/08/15</span>
                <span>•</span>
                <span>作者：system_mini</span>
                <span>•</span>
                <span>阅读时间：8分钟</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-foreground mb-4">创建领地步骤</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">1. 准备工具</h3>
                <p className="text-blue-800 dark:text-blue-200">手持箭（Arrow）作为选择工具</p>
              </div>

              <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">2. 选择范围</h3>
                <ul className="text-green-800 dark:text-green-200 space-y-1">
                  <li>• 左键点击第一个角落</li>
                  <li>• 右键点击对角线的另一个角落</li>
                </ul>
              </div>

              <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">3. 创建领地</h3>
                <p className="text-purple-800 dark:text-purple-200">
                  输入命令：
                  <code className="bg-purple-200 dark:bg-purple-800 px-2 py-1 rounded text-foreground">
                    /rg define [领地名称]
                  </code>
                </p>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-4 mt-8">管理命令</h2>
            <div className="bg-muted/50 p-4 rounded-lg">
              <ul className="space-y-2">
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/rg remove [领地名称]</code> - 删除领地
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/rg info [领地名称]</code> - 查看领地信息
                </li>
                <li>
                  <code className="bg-muted px-2 py-1 rounded text-foreground">/rg list</code> - 查看所有领地
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    "server-rules": {
      title: "服务器规则",
      category: "规则制度",
      icon: Shield,
      lastUpdated: "2025/08/15",
      author: "system_mini",
      readTime: "10分钟",
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">服务器规则</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <span>分类：规则制度</span>
                <span>•</span>
                <span>最后编辑：2025/08/15</span>
                <span>•</span>
                <span>作者：system_mini</span>
                <span>•</span>
                <span>阅读时间：10分钟</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-400 dark:border-red-600 p-4 mb-6">
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">重要提醒</h2>
              <p className="text-red-800 dark:text-red-200">请仔细阅读并遵守以下规则，违规行为将受到相应处罚。</p>
            </div>

            <h2 className="text-xl font-semibold text-foreground mb-4">基本规则</h2>
            <div className="space-y-3">
              <div className="bg-muted/50 p-3 rounded">
                <strong>1. 禁止恶意破坏</strong> - 不得故意破坏他人建筑或服务器设施
              </div>
              <div className="bg-muted/50 p-3 rounded">
                <strong>2. 禁止使用外挂</strong> - 严禁使用任何形式的作弊工具
              </div>
              <div className="bg-muted/50 p-3 rounded">
                <strong>3. 文明聊天</strong> - 禁止发送不当言论、广告或刷屏
              </div>
            </div>
          </div>
        </div>
      ),
    },
    "client-versions": {
      title: "服务器客户端版本说明",
      category: "技术指南",
      icon: Wrench,
      lastUpdated: "2025/08/15",
      author: "system_mini",
      readTime: "6分钟",
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Wrench className="h-8 w-8 text-orange-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">服务器客户端版本说明</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>分类：技术指南</span>
                <span>•</span>
                <span>最后编辑：2025/08/15</span>
                <span>•</span>
                <span>作者：system_mini</span>
                <span>•</span>
                <span>阅读时间：6分钟</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">支持版本</h2>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-800">
                <strong>服务器支持版本：</strong>1.8 - 1.21.8
              </p>
              <p className="text-green-800">
                <strong>推荐版本：</strong>1.21.4
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">版本兼容性</h2>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded">
                <strong>最佳体验：</strong>使用1.21.4版本可获得最佳游戏体验
              </div>
              <div className="bg-yellow-50 p-3 rounded">
                <strong>兼容版本：</strong>1.8-1.21.8版本均可正常游戏
              </div>
            </div>
          </div>
        </div>
      ),
    },
    "connection-issues": {
      title: "服务器连接问题及解决方法",
      category: "故障排除",
      icon: HelpCircle,
      lastUpdated: "2025/08/15",
      author: "system_mini",
      readTime: "7分钟",
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <HelpCircle className="h-8 w-8 text-purple-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">服务器连接问题及解决方法</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>分类：故障排除</span>
                <span>•</span>
                <span>最后编辑：2025/08/15</span>
                <span>•</span>
                <span>作者：system_mini</span>
                <span>•</span>
                <span>阅读时间：7分钟</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">常见问题</h2>
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-2">连接超时</h3>
                <ul className="text-red-800 space-y-1">
                  <li>• 检查网络连接</li>
                  <li>• 尝试切换节点</li>
                  <li>• 重启游戏客户端</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-900 mb-2">版本不兼容</h3>
                <ul className="text-orange-800 space-y-1">
                  <li>• 确认客户端版本在1.8-1.21.8范围内</li>
                  <li>• 推荐使用1.21.4版本</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    "frp-guide": {
      title: "服务器FRP节点贡献指南",
      category: "技术指南",
      icon: Wrench,
      lastUpdated: "2025/08/15",
      author: "system_mini",
      readTime: "12分钟",
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Wrench className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">服务器FRP节点贡献指南</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>分类：技术指南</span>
                <span>•</span>
                <span>最后编辑：2025/08/15</span>
                <span>•</span>
                <span>作者：system_mini</span>
                <span>•</span>
                <span>阅读时间：12分钟</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">什么是FRP</h2>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-800">
                FRP（Fast Reverse Proxy）是一个高性能的反向代理应用，可以帮助您将内网服务暴露到公网。
              </p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">配置要求</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="space-y-2">
                <li>• 稳定的网络连接</li>
                <li>• 公网IP或域名</li>
                <li>• 足够的带宽支持</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    "special-features": {
      title: "服务器特殊功能指南",
      category: "特色功能",
      icon: Trophy,
      lastUpdated: "2025/08/15",
      author: "system_mini",
      readTime: "15分钟",
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">服务器特殊功能指南</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <span>分类：特色功能</span>
                <span>•</span>
                <span>最后编辑：2025/08/15</span>
                <span>•</span>
                <span>作者：system_mini</span>
                <span>•</span>
                <span>阅读时间：15分钟</span>
              </div>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">坐下功能</h2>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-800">空手右键点击下半砖或楼梯可以坐下，再次右键或移动即可站起。</p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">连锁挖掘</h2>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-800">蹲下并使用对应工具可以连锁挖掘最多128个相同方块，大大提高挖掘效率。</p>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-4">农田防踩踏</h2>
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <p className="text-yellow-800">农田踩踏后不会被破坏，保护您的农作物不受意外损害。</p>
            </div>
          </div>
        </div>
      ),
    },
  }

  const currentArticleData = articles[currentArticle]

  if (isLoading) {
    return <WikiSkeleton />
  }

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
