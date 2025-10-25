import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Layers, Database, Globe, Server } from "lucide-react"

export function TechStackSection() {
  const techCategories = [
    {
      title: "前端框架",
      icon: Globe,
      color: "text-blue-600",
      technologies: ["Next.js 15", "React 18", "TypeScript", "Tailwind CSS"],
    },
    {
      title: "开发工具",
      icon: Code,
      color: "text-green-600",
      technologies: ["ESLint", "Prettier", "Git", "GitHub Copilot", "Vercel v0 AI"],
    },
    {
      title: "UI组件",
      icon: Layers,
      color: "text-purple-600",
      technologies: ["shadcn/ui", "Radix UI", "Lucide Icons", "Framer Motion"],
    },
    {
      title: "API服务",
      icon: Database,
      color: "text-orange-600",
      technologies: ["api.mcsrvstat.us", "uapis.cn", "api.github.com", "cf-v2.uapis.cn"],
    },
    {
      title: "服务器环境",
      icon: Server,
      color: "text-red-600",
      technologies: ["Temurin Java 21", "Minecraft 1.21.10", "PurpurCore", "Velocity", "Windows Server 2019"],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-blue-600" />
          <span>关于官网</span>
        </CardTitle>
        <CardDescription>了解我们网站使用的现代化技术栈</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-orange-500 mb-4">使用的技术栈</h3>
          <div className="space-y-6">
            {techCategories.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.title} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon className={`w-5 h-5 ${category.color}`} />
                    <h4 className="text-lg font-medium text-blue-600">{category.title}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-gray-100 text-gray-800">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-foreground mb-2">现代化架构</h4>
            <p className="text-muted-foreground text-sm">
              我们使用最新的Web技术栈构建了这个网站，确保快速、安全、响应式的用户体验。
              采用服务端渲染(SSR)和静态生成(SSG)技术，提供卓越的性能和SEO优化。 服务器运行在Java
              21环境上，使用PurpurCore + Velocity核心在Windows Server 2019系统中为玩家提供稳定可靠的游戏体验。
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
