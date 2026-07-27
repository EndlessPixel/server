import { LicenseSection } from "@/components/license-section"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TeamSection } from "@/components/team-section"
import { ContactSection } from "@/components/contact-section"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Globe } from "lucide-react"
import type { Metadata } from "next"
import { RunningDuration } from "@/components/running-duration"


export const metadata: Metadata = {
  title: "关于我们 - EndlessPixel Minecraft 服务器",
  description:
    "了解 EndlessPixel 团队和我们的故事。EndlessPixel 是一个由热爱游戏的玩家组成的 Minecraft 社区，致力于提供有趣、自由、开放的游戏世界。",
  keywords: ["EndlessPixel团队", "关于我们", "服务器历史", "联系方式", "Minecraft社区"],
  openGraph: {
    title: "关于我们 | EndlessPixel Minecraft 服务器",
    description: "了解 EndlessPixel 团队和我们的故事。",
    url: "https://www.endlesspixel.cn/about",
    images: [{ url: "/og-about.jpg", width: 1200, height: 630, alt: "EndlessPixel 关于我们" }],
  },
  robots: { index: true, follow: true },
}

/* ---------- 页面 ---------- */
export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* -------------- Hero -------------- */}
          <section className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              关于 EndlessPixel
            </h1>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              EndlessPixel 是一个由热爱游戏的玩家组成的社区，致力于提供一个有趣、自由、开放的游戏体验。
            </p>
          </section>

          {/* -------------- 价值观卡片 -------------- */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 w-10 h-10 grid place-items-center bg-secondary rounded-xl text-foreground/60">
                  <Heart className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">热爱与激情</h3>
                <p className="text-sm text-muted-foreground">
                  我们由真正热爱游戏的玩家组成，这份热情驱动着我们不断改进和创新。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 w-10 h-10 grid place-items-center bg-secondary rounded-xl text-foreground/60">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">社区第一</h3>
                <p className="text-sm text-muted-foreground">
                  玩家的声音对我们至关重要。我们始终倾听社区反馈，确保决策符合大多数玩家的利益。
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 w-10 h-10 grid place-items-center bg-secondary rounded-xl text-foreground/60">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">开放包容</h3>
                <p className="text-sm text-muted-foreground">
                  无论来自哪里、水平如何，每一位玩家都能在这里找到属于自己的乐趣。
                </p>
              </CardContent>
            </Card>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TeamSection />
              <br /><br />
              <section className="flex justify-center">
                <Card>
                  <CardContent className="p-6 text-center">
                    <h2 className="text-xl font-semibold text-foreground mb-2">EndlessPixel服务器创立至今</h2>
                    <RunningDuration />
                  </CardContent>
                </Card>
              </section>
              <br /><br />
              <section className="text-center">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-foreground mb-4">准备好加入我们了吗？</h2>
                    <p className="text-muted-foreground max-w-3xl mx-auto">
                      无论你是想体验服务器，还是对我们的项目感兴趣，都欢迎加入 EndlessPixel 社区！
                    </p>
                  </CardContent>
                </Card>
              </section>
              <br />
              <LicenseSection />
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