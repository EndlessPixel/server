import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Server, Users, Heart, Shield, Gamepad2, Coins, Play, Sparkles, Zap, Crown, Globe, Star } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-emerald-950/20 py-24 lg:py-32 overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-800/20 dark:to-cyan-800/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-r from-green-200 to-emerald-200 dark:from-green-800/20 dark:to-emerald-800/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* 徽章 */}
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>欢迎来到 Minecraft 1.21.10 新世界</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          {/* 主标题 */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-emerald-600 dark:from-slate-100 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
              无尽像素
            </span>
            <br />
            <span className="text-xl md:text-2xl lg:text-3xl font-normal text-slate-600 dark:text-slate-400 mt-4 block">
              创造无限可能的 Minecraft 服务器
            </span>
          </h1>

          {/* 副标题 */}
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 max-w-3xl mx-auto leading-relaxed">
            一个充满活力与创意的 Minecraft 社区！支持离线模式，让所有玩家都能轻松加入冒险
          </p>
          <p className="text-lg text-slate-500 dark:text-slate-500 mb-12 max-w-2xl mx-auto flex flex-wrap justify-center gap-4">
            <span className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/30 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              <Zap className="w-4 h-4 text-yellow-500" />
              原汁原味体验
            </span>
            <span className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/30 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              <Coins className="w-4 h-4 text-yellow-500" />
              完全免费游玩
            </span>
            <span className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/30 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
              <Crown className="w-4 h-4 text-purple-500" />
              自由探索创造
            </span>
          </p>

          {/* 行动按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/status">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Server className="w-5 h-5 mr-2" />
                查看服务器状态
                <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </Button>
            </Link>
            <Link href="/downloads">
              <Button size="lg" variant="outline" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Users className="w-5 h-5 mr-2" />
                下载客户端
                <Sparkles className="w-4 h-4 ml-2 text-blue-500" />
              </Button>
            </Link>
            {/* 一键加入服务器按钮 - 移动端隐藏 */}
            <a
              href="minecraft://cd1.epmc.top?version=1.21.10"
              rel="noopener noreferrer"
              title="需安装Minecraft官方客户端，或支持minecraft://协议的第三方客户端"
              className="hidden sm:inline-block"
            >
              <Button size="lg" variant="outline" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-2 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                <Play className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                一键加入服务器
                <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse group-hover:bg-green-400"></div>
              </Button>
            </a>
          </div>

          {/* 服务器特性卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {[
              {
                icon: Server,
                title: "离线模式",
                description: "支持所有客户端",
                color: "text-green-600",
                bgColor: "bg-green-100 dark:bg-green-900/30"
              },
              {
                icon: Coins,
                title: "完全免费",
                description: "无任何付费内容",
                color: "text-yellow-600",
                bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
              },
              {
                icon: Gamepad2,
                title: "原汁原味",
                description: "保持原始平衡",
                color: "text-blue-600",
                bgColor: "bg-blue-100 dark:bg-blue-900/30"
              },
              {
                icon: Heart,
                title: "宽松规则",
                description: "自由探索创造",
                color: "text-red-600",
                bgColor: "bg-red-100 dark:bg-red-900/30"
              },
              {
                icon: Users,
                title: "活跃社区",
                description: "友好的玩家",
                color: "text-purple-600",
                bgColor: "bg-purple-100 dark:bg-purple-900/30"
              },
              {
                icon: Shield,
                title: "安全保障",
                description: "反作弊系统",
                color: "text-orange-600",
                bgColor: "bg-orange-100 dark:bg-orange-900/30"
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={feature.title}
                  className="group bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2 cursor-pointer"
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 text-sm group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-500 transition-colors">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* 底部装饰 */}
          <div className="mt-16 flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>全球多个节点</span>
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>99.9% 在线率</span>
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span>活跃玩家社区</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}