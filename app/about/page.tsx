// about/page.tsx
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TeamSection } from "@/components/team-section"
// import { LicenseSection } from "@/components/license-section"   // 暂时迁移
import { ContactSection } from "@/components/contact-section"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Globe } from "lucide-react"
import type { Metadata } from "next"
// 导入我们创建的运行时长组件
import { RunningDuration } from "@/components/RunningDuration"
import Link from "next/link"

export const metadata: Metadata = {
  title: "关于我们 - EndlessPixel Minecraft 服务器",
  description:
    "了解 EndlessPixel 团队和我们的故事。EndlessPixel 是一个由热爱游戏的玩家组成的 Minecraft 社区，致力于提供有趣、自由、开放的游戏世界。",
  keywords: ["EndlessPixel团队", "关于我们", "服务器历史", "联系方式", "Minecraft社区"],
  openGraph: {
    title: "关于我们 | EndlessPixel Minecraft 服务器",
    description: "了解 EndlessPixel 团队和我们的故事。",
    url: "https://www.endlesspixel.fun/about",
    images: [{ url: "/og-about.jpg", width: 1200, height: 630, alt: "EndlessPixel 关于我们" }],
  },
  robots: { index: true, follow: true },
}

/* ---------- 页面 ---------- */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
      <Navigation />

      <main className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* -------------- Hero -------------- */}
          <section className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-slate-900 via-purple-700 to-blue-600 dark:from-slate-100 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
              关于 EndlessPixel
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
              EndlessPixel 是一个由热爱游戏的玩家组成的社区，致力于提供一个有趣、自由、开放的游戏体验。
            </p>
          </section>

          {/* -------------- 价值观卡片 -------------- */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <CardContent className="p-6">
                <div className="mb-4 w-10 h-10 grid place-items-center bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">热爱与激情</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  我们由真正热爱游戏的玩家组成，这份热情驱动着我们不断改进和创新。
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800 bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
              <CardContent className="p-6">
                <div className="mb-4 w-10 h-10 grid place-items-center bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">社区第一</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  玩家的声音对我们至关重要。我们始终倾听社区反馈，确保决策符合大多数玩家的利益。
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 dark:border-purple-800 bg-linear-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/20 dark:to-fuchsia-950/20">
              <CardContent className="p-6">
                <div className="mb-4 w-10 h-10 grid place-items-center bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">开放包容</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  无论来自哪里、水平如何，每一位玩家都能在这里找到属于自己的乐趣。
                </p>
              </CardContent>
            </Card>
          </section>

          {/* -------------- 团队 + 联系 -------------- */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TeamSection />
              <br /><br />
              {/* <LicenseSection /> */}
              {/* -------------- 创立至今 -------------- */}
              <section className="flex justify-center">
                <Card className="w-full border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/40 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">EndlessPixel服务器创立至今</h2>
                    {/* 替换为我们的客户端组件 */}
                    <RunningDuration />
                  </CardContent>
                </Card>
              </section>
              
              <br /><br />

              {/* -------------- CTA -------------- */}
              <section className="text-center">
                <Card className="border-blue-200 dark:border-blue-800 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">准备好加入我们了吗？</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                      无论你是想体验服务器，还是对我们的项目感兴趣，都欢迎加入 EndlessPixel 社区！
                    </p>
                  </CardContent>
                </Card>
              </section>

              <br /><br />

              <section className="text-center">
                <Card className="border-green-200 dark:border-green-800 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">深入了解我们的技术</h2>
                    <Link
                      href="/dev"
                      className="mt-4 inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-600"
                    >
                      前往开发者中心页面
                    </Link>
                  </CardContent>
                </Card>
              </section>
            </div>
            <div className="lg:col-span-1">
              <ContactSection />
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}