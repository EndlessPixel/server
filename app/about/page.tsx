import { LicenseSection } from "@/components/license-section"
import { TeamSection } from "@/components/team-section"
import { ContactSection } from "@/components/contact-section"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Globe } from "lucide-react"
import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "关于我们 - EndlessPixel Minecraft 服务器",
  description:
    "了解 EndlessPixel 团队和我们的故事。一个玩家自发组织的 Minecraft 社区服务器，不收费、不用正版。",
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
      <main className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

          {/* -------------- Hero -------------- */}
          <section className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">
              关于 EndlessPixel
            </h1>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              EndlessPixel 是几个爱玩游戏的玩家凑一起搭的服务器，不收费，不用正版也能进。
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
                  我们就是一群爱玩游戏的玩家，平时自己也在服里玩，有问题就顺手修。
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
                  群里提的意见我们基本都看，改什么、加什么大多按大家说的来。
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
                  新手老人都行，想肝建筑还是随便逛逛，来了总能找到事干。
                </p>
              </CardContent>
            </Card>
          </section>
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TeamSection />
              <section className="text-center">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-3xl font-bold text-foreground mb-4">想来玩就来吧</h2>
                    <p className="text-muted-foreground max-w-3xl mx-auto">
                      想进服体验、或者只是好奇我们在搞什么，都欢迎加群聊聊。
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
    </div>
  )
}