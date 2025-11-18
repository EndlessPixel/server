import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TeamSection } from "@/components/team-section"
import { LicenseSection } from "@/components/license-section"
import { ContactSection } from "@/components/contact-section"
import { Card, CardContent } from "@/components/ui/card"
import { Server, Heart, Users, Calendar, Zap, Globe, Star, Rocket } from "lucide-react"
import type { Metadata } from "next"
import { differenceInMonths } from "date-fns"

export const metadata: Metadata = {
  title: "关于我们 - EndlessPixel Minecraft 服务器",
  description:
    "了解 EndlessPixel 团队和我们的故事。EndlessPixel 是一个由热爱游戏的玩家组成的 Minecraft 社区，致力于提供有趣、自由、开放的游戏世界。认识我们的团队成员，了解我们的技术栈和运营理念。",
  keywords: ["EndlessPixel团队", "关于我们", "服务器历史", "联系方式", "Minecraft社区", "游戏团队", "服务器运营"],
  openGraph: {
    title: "关于我们 | EndlessPixel Minecraft 服务器",
    description: "了解 EndlessPixel 团队和我们的故事。我们是一个由热爱游戏的玩家组成的 Minecraft 社区，致力于创造最佳的游戏体验。",
    url: "https://ep.endlesspixel.fun/about",
    images: [
      {
        url: "/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "EndlessPixel 关于我们",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const startDate = new Date(2024, 8, 16) // 2024/09/16
const currentDate = new Date()
const operatingMonths = differenceInMonths(currentDate, startDate)

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-blue-950/30">
      <Navigation />
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-purple-700 to-blue-600 dark:from-slate-100 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
              关于 EndlessPixel
            </h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                EndlessPixel 是一个由热爱游戏的玩家组成的社区，我们致力于提供一个有趣、自由、开放的游戏世界。
                在这里，每个像素都蕴含着无限的可能性，每个玩家都能找到属于自己的乐趣和成就感。
              </p>

              {/* Mission Statement */}
              <div className="bg-white/80 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 flex-shrink-0">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-2">我们的使命</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      创造一个友好、包容的游戏环境，让玩家可以在这里结识新朋友，分享游戏经验，探索无尽的可能性。
                      我们相信游戏的魅力在于创造与分享，致力于为每位玩家提供最佳的游戏体验。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-2">热爱与激情</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  我们由真正热爱游戏的玩家组成，这份热情驱动着我们不断改进和创新，为社区提供最好的游戏体验。
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-2">社区第一</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  玩家的声音对我们至关重要。我们始终倾听社区反馈，确保我们的决策符合大多数玩家的利益。
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800 rounded-xl">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-2">开放包容</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  无论你是新手还是老玩家，我们都欢迎你加入我们的社区。这里每个人都能找到属于自己的位置。
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <TeamSection />
              <LicenseSection />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              <ContactSection />
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">准备好加入我们了吗？</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
                  无论你是想体验我们的服务器，还是对我们的项目感兴趣，我们都欢迎你加入 EndlessPixel 社区。
                  让我们一起创造更多精彩的游戏回忆！
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
 
// Add missing Download icon component
function Download({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="7 10 12 15 17 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="12" y1="15" x2="12" y2="3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}