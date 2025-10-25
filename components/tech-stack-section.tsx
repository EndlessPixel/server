import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Layers, Database, Globe, Server } from "lucide-react"

export function TechStackSection() {
  const techCategories = [
    {
      title: "开发工具",
      icon: Code,
      color: "text-green-600",
      technologies: ["ESLint", "Prettier", "Git", "GitHub Copilot", "Vercel v0 AI"],
    },
    {
      title: "API服务",
      icon: Database,
      color: "text-orange-600",
      technologies: ["api.mcsrvstat.us", "uapis.cn", "api.github.com", "cf-v2.uapis.cn"],
    },
    {
      title: "依赖",
      icon: Layers,
      color: "text-red-600",
      technologies: [
        "@hookform/resolvers",
        "@radix-ui/react-accordion",
        "@radix-ui/react-alert-dialog",
        "@radix-ui/react-aspect-ratio",
        "@radix-ui/react-avatar",
        "@radix-ui/react-checkbox",
        "@radix-ui/react-collapsible",
        "@radix-ui/react-context-menu",
        "@radix-ui/react-dialog",
        "@radix-ui/react-dropdown-menu",
        "@radix-ui/react-hover-card",
        "@radix-ui/react-label",
        "@radix-ui/react-menubar",
        "@radix-ui/react-navigation-menu",
        "@radix-ui/react-popover",
        "@radix-ui/react-progress",
        "@radix-ui/react-radio-group",
        "@radix-ui/react-scroll-area",
        "@radix-ui/react-select",
        "@radix-ui/react-separator",
        "@radix-ui/react-slider",
        "@radix-ui/react-slot",
        "@radix-ui/react-switch",
        "@radix-ui/react-tabs",
        "@radix-ui/react-toast",
        "@radix-ui/react-toggle",
        "@radix-ui/react-toggle-group",
        "@radix-ui/react-tooltip",
        "autoprefixer",
        "chart.js",
        "class-variance-authority",
        "clsx",
        "cmdk",
        "date-fns",
        "embla-carousel-react",
        "geist",
        "input-otp",
        "lucide-react",
        "next",
        "next-themes",
        "react",
        "react-chartjs-2",
        "react-day-picker",
        "react-dom",
        "react-hook-form",
        "react-markdown",
        "react-resizable-panels",
        "recharts",
        "rehype-raw",
        "remark-gfm",
        "sonner",
        "tailwind-merge",
        "tailwindcss-animate",
        "vaul",
        "zod"
      ]
    },
    {
      title: "开发依赖",
      icon: Layers,
      color: "text-blue-600",
      technologies: [
        "@tailwindcss/postcss",
        "@types/node",
        "@types/react",
        "@types/react-dom",
        "postcss",
        "tailwindcss",
        "tw-animate-css",
        "typescript"
      ],
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techCategories.map((category) => {
              const Icon = category.icon as any;
              const list = Array.isArray(category.technologies) ? category.technologies : [];
              const visible = list.slice(0, 12);
              const hidden = list.length > 12 ? list.slice(12) : [];
              return (
                <div key={category.title} className="border-l-4 border-blue-100 dark:border-blue-900 pl-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon className={`w-5 h-5 ${category.color}`} />
                    <h4 className="text-lg font-medium text-slate-900 dark:text-white">{category.title}</h4>
                    <span className="text-xs text-slate-500">{list.length}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm table-auto border-collapse">
                      <thead>
                        <tr className="text-left text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800">
                          <th className="py-2 pr-4">#</th>
                          <th className="py-2">技术</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visible.map((tech, idx) => (
                          <tr key={tech} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800">
                            <td className="py-2 pr-4 align-top text-slate-600">{idx + 1}</td>
                            <td className="py-2 align-top text-slate-900 dark:text-slate-100">{tech}</td>
                          </tr>
                        ))}
                        {hidden.length > 0 && (
                          <tr>
                            <td colSpan={2} className="py-2">
                              <details className="text-sm">
                                <summary className="text-slate-500 cursor-pointer">显示更多 ({hidden.length})</summary>
                                <div className="mt-2">
                                  <table className="w-full text-sm table-auto">
                                    <tbody>
                                      {hidden.map((tech, i) => (
                                        <tr key={tech} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800">
                                          <td className="py-2 pr-4 text-slate-600">{12 + i + 1}</td>
                                          <td className="py-2 text-slate-900 dark:text-slate-100">{tech}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </details>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
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
