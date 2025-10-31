import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pickaxe, Home, Zap, MapPin, Users, Shield, Sparkles, Target, Clock, Crown, Gem, Award } from "lucide-react"

export function ServerFeatures() {
  const features = [
    {
      title: "坐下功能",
      description: "空手右键点击下半砖或楼梯可以坐下休息，享受悠闲时光",
      icon: Home,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      borderColor: "border-blue-200 dark:border-blue-800",
      gradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20"
    },
    {
      title: "连锁挖掘",
      description: "蹲下并使用对应工具可以连锁挖掘最多128个方块，大幅提升采集效率",
      icon: Pickaxe,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      borderColor: "border-green-200 dark:border-green-800",
      gradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
    },
    {
      title: "农田保护",
      description: "农田踩踏后不会被破坏，保护你的农作物免受意外损坏",
      icon: Shield,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      gradient: "from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20"
    },
    {
      title: "探险结构",
      description: "新增300多个探险结构，包括各种主题村庄、地下城和神秘遗迹",
      icon: MapPin,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      borderColor: "border-purple-200 dark:border-purple-800",
      gradient: "from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20"
    },
    {
      title: "大师切割机",
      description: "切石机新增500多种配方，包括木刻、基石切割等高级工艺",
      icon: Zap,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      borderColor: "border-red-200 dark:border-red-800",
      gradient: "from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20"
    },
    {
      title: "领地系统",
      description: "创建和管理你的专属领地，保护建筑安全，防止他人破坏",
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      gradient: "from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20"
    },
  ]

  const stats = [
    { icon: Target, label: "特色功能", value: "6+" },
    { icon: Clock, label: "持续更新", value: "24/7" },
    { icon: Crown, label: "优质体验", value: "99.9%" },
    { icon: Gem, label: "独特内容", value: "800+" },
  ]

  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/20 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-r from-cyan-200 to-blue-200 dark:from-cyan-800/20 dark:to-blue-800/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-r from-emerald-200 to-green-200 dark:from-emerald-800/20 dark:to-green-800/20 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部区域 */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 mb-6">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            <span>丰富功能 • 优质体验</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-blue-700 to-cyan-600 dark:from-slate-100 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              服务器特色功能
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            精心设计的游戏功能，全面提升你的 Minecraft 体验
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div 
                key={stat.label}
                className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-200 dark:border-slate-700 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* 功能卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card 
                key={feature.title}
                className={`
                  group bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border-2 ${feature.borderColor}
                  transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 cursor-pointer
                  overflow-hidden relative
                `}
              >
                {/* 悬停效果装饰 */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <CardHeader className="text-center pb-6 relative z-10">
                  <div className="flex justify-center mb-4">
                    <div 
                      className={`
                        w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center
                        group-hover:scale-110 transition-transform duration-300 shadow-lg
                      `}
                    >
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 text-base leading-relaxed group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors">
                    {feature.description}
                  </CardDescription>
                </CardHeader>

                {/* 底部装饰线 */}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 ${feature.bgColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </Card>
            )
          })}
        </div>

        {/* 底部召唤行动 */}
        <div className="text-center mt-16">
          <div className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto">
            <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">准备好开始冒险了吗？</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
              加入我们的服务器，体验这些丰富的特色功能，开启你的 Minecraft 新篇章
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="/downloads" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Zap className="w-5 h-5" />
                下载客户端
              </a>
              <a 
                href="/status" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Users className="w-5 h-5" />
                查看状态
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}