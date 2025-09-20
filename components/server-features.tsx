import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pickaxe, Home, Zap, MapPin, Users, Shield } from "lucide-react"

export function ServerFeatures() {
  const features = [
    {
      title: "坐下功能",
      description: "空手右键点击下半砖或楼梯可以坐下休息",
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "连锁挖掘",
      description: "蹲下并使用对应工具可以连锁挖掘最多128个方块",
      icon: Pickaxe,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "农田保护",
      description: "农田踩踏后不会被破坏，保护你的农作物",
      icon: Shield,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "探险结构",
      description: "新增300多个探险结构，包括各种主题村庄",
      icon: MapPin,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "大师切割机",
      description: "切石机新增500多种配方，包括木刻、基石切割等",
      icon: Zap,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "领地系统",
      description: "创建和管理你的专属领地，保护建筑安全",
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">服务器特色功能</h2>
          <p className="text-lg text-muted-foreground">丰富的游戏功能，提升你的游戏体验</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
