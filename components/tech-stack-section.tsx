"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Database, Server, Zap, Cpu, Globe, Package, Wrench } from "lucide-react"
import { useState } from "react"

export function TechStackSection() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const techStacks = [
    {
      title: "核心技术",
      icon: Cpu,
      color: "from-blue-500 to-cyan-500",
      technologies: [
        { name: "Next.js 14", type: "framework" },
        { name: "React 18", type: "library" },
        { name: "TypeScript", type: "language" },
        { name: "Tailwind CSS", type: "styling" }
      ],
      description: "现代化的全栈开发框架"
    },
    {
      title: "服务器环境",
      icon: Server,
      color: "from-green-500 to-emerald-500",
      technologies: [
        { name: "Java 21", type: "runtime" },
        { name: "PurpurCore", type: "server" },
        { name: "Velocity", type: "proxy" },
        { name: "Windows Server", type: "os" }
      ],
      description: "高性能游戏服务器架构"
    },
    {
      title: "开发工具",
      icon: Wrench,
      color: "from-orange-500 to-red-500",
      technologies: [
        { name: "Git", type: "vcs" },
        { name: "ESLint", type: "linter" },
        { name: "Prettier", type: "formatter" },
        { name: "GitHub Copilot", type: "ai" }
      ],
      description: "专业的开发工作流"
    },
    {
      title: "部署平台",
      icon: Globe,
      color: "from-purple-500 to-pink-500",
      technologies: [
        { name: "Vercel", type: "hosting" },
        { name: "Cloudflare", type: "cdn" },
        { name: "GitHub Actions", type: "ci-cd" }
      ],
      description: "可靠的云服务平台"
    }
  ]

  const dependencies = [
    {
      category: "UI组件",
      items: ["@radix-ui/*", "lucide-react", "sonner", "cmdk", "vaul"],
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    },
    {
      category: "状态管理",
      items: ["react-hook-form", "zod", "@hookform/resolvers"],
      color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    },
    {
      category: "数据可视化",
      items: ["recharts", "chart.js", "react-chartjs-2"],
      color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
    },
    {
      category: "工具库",
      items: ["date-fns", "clsx", "tailwind-merge", "class-variance-authority"],
      color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
    }
  ]

  const toggleCategory = (title: string) => {
    setExpandedCategory(expandedCategory === title ? null : title)
  }

  return (
    <div className="space-y-6">
      {/* 主要技术栈 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techStacks.map((stack) => {
          const Icon = stack.icon
          return (
            <Card key={stack.title} className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stack.color}`} />
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${stack.color} text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{stack.title}</CardTitle>
                    <CardDescription>{stack.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stack.technologies.map((tech) => (
                    <Badge
                      key={tech.name}
                      variant="secondary"
                      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700"
                    >
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 架构概览 */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-0">
        <CardContent className="pt-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-3">
              现代化全栈架构
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              采用 Next.js 14 全栈框架，结合 TypeScript 和 Tailwind CSS，
              构建高性能、类型安全的 Web 应用。游戏服务器运行在 Java 21 环境，
              使用 PurpurCore + Velocity 核心，为玩家提供稳定流畅的游戏体验。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-white/50 dark:bg-slate-800/30 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">~92.9%</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">可用性</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-slate-800/30 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">&lt;~200ms</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">响应时间</div>
            </div>
            <div className="text-center p-4 bg-white/50 dark:bg-slate-800/30 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">50+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400">技术组件</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 依赖管理 */}
      <Card className="border-0 bg-slate-50 dark:bg-slate-900/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <span>依赖管理</span>
          </CardTitle>
          <CardDescription>精心挑选的技术依赖，确保项目的稳定性和可维护性</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dependencies.map((dep) => (
              <div key={dep.category} className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">{dep.category}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {dep.items.map((item) => (
                    <span
                      key={item}
                      className={`px-2 py-1 rounded-md text-xs font-medium ${dep.color} border border-transparent`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 扩展依赖列表 */}
          <div className="mt-6">
            <button
              onClick={() => toggleCategory("all-deps")}
              className="w-full text-left p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    完整依赖列表
                  </span>
                </div>
                <span className="text-sm text-slate-500">
                  {expandedCategory === "all-deps" ? "收起" : "展开"}
                </span>
              </div>

              {expandedCategory === "all-deps" && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {[
                    "autoprefixer", "date-fns", "embla-carousel-react", "geist",
                    "input-otp", "next-themes", "react-day-picker", "react-markdown",
                    "react-resizable-panels", "rehype-raw", "remark-gfm", "tailwindcss-animate",
                    "@types/node", "@types/react", "@types/react-dom", "postcss", "typescript"
                  ].map((dep) => (
                    <code
                      key={dep}
                      className="block p-2 bg-slate-100 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300 font-mono text-xs"
                    >
                      {dep}
                    </code>
                  ))}
                </div>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* API服务 */}
      <Card className="border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span>API 服务</span>
          </CardTitle>
          <CardDescription>集成的第三方 API 服务，增强网站功能</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "Minecraft 服务器状态API", url: "api.mcsrvstat.us" },
              { name: "多功能 API", url: "uapis.cn" },
              { name: "GitHub API", url: "api.github.com" },
              { name: "ChmlFrp 状态API", url: "cf-v2.uapis.cn" }
            ].map((api) => (
              <div key={api.url} className="bg-white/50 dark:bg-slate-800/30 rounded-lg p-4 border border-green-200 dark:border-green-800 backdrop-blur-sm">
                <div className="font-medium text-slate-900 dark:text-slate-100">{api.name}</div>
                <code className="text-sm text-green-600 dark:text-green-400 font-mono">{api.url}</code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}