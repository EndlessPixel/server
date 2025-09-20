import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Server, Users, Heart, Shield, Gamepad2, Coins } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-green-50 to-background dark:from-green-950/20 dark:to-background py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            欢迎来到 <span className="text-green-600">无尽像素</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            一个充满无限可能的 Minecraft 社区！支持离线模式，允许所有类型的玩家加入
          </p>
          <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl mx-auto">
            原汁原味的游戏体验 • 完全免费 • 宽松规则 • 自由探索
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/status">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Server className="w-5 h-5 mr-2" />
                立即加入服务器
              </Button>
            </Link>
            <Link href="/downloads">
              <Button size="lg" variant="outline">
                <Users className="w-5 h-5 mr-2" />
                下载客户端
              </Button>
            </Link>
          </div>

          {/* Server Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4 text-center">
                <Server className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-foreground mb-1 text-sm">离线模式</h3>
                <p className="text-xs text-muted-foreground">支持所有客户端</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4 text-center">
                <Coins className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <h3 className="font-semibold text-foreground mb-1 text-sm">完全免费</h3>
                <p className="text-xs text-muted-foreground">无任何付费内容</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4 text-center">
                <Gamepad2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-foreground mb-1 text-sm">原汁原味</h3>
                <p className="text-xs text-muted-foreground">保持原始平衡</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4 text-center">
                <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-foreground mb-1 text-sm">宽松规则</h3>
                <p className="text-xs text-muted-foreground">自由探索创造</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-foreground mb-1 text-sm">活跃社区</h3>
                <p className="text-xs text-muted-foreground">友好的玩家</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4 text-center">
                <Shield className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-foreground mb-1 text-sm">安全保障</h3>
                <p className="text-xs text-muted-foreground">反作弊系统</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
