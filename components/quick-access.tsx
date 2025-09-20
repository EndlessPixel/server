import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Activity, BookOpen, MessageCircle } from "lucide-react"
import Link from "next/link"

export function QuickAccess() {
  const quickLinks = [
    {
      title: "资源下载",
      description: "下载客户端、模组包和资源包",
      icon: Download,
      href: "/downloads",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
    {
      title: "服务器状态",
      description: "实时查看服务器运行状态",
      icon: Activity,
      href: "/status",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Wiki 百科",
      description: "游戏指南、规则和攻略",
      icon: BookOpen,
      href: "/wiki",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      title: "社区交流",
      description: "加入我们的 QQ 群和论坛",
      icon: MessageCircle,
      href: "/about#contact",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
  ]

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">快速入口</h2>
          <p className="text-lg text-muted-foreground">快速访问你需要的功能和资源</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Card key={link.href} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 ${link.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`w-6 h-6 ${link.color}`} />
                  </div>
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Link href={link.href}>
                    <Button className="w-full bg-transparent" variant="outline">
                      前往
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
