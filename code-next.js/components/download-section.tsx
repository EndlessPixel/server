import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, Package, Clock } from "lucide-react"

export function DownloadSection() {
  const downloads = [
    {
      name: "EndlessPixel 1.21.8-v7-1.0 (最新版)",
      description: "Minecraft 1.21.8 最新稳定版本，全新优化框架，61个精选模组",
      version: "1.21.8-v7-1.0",
      mcVersion: "1.21.8",
      fabricVersion: "0.17.2",
      releaseDate: "2024-08-14",
      downloadUrl: "https://github.com/EndlessPixel/EndlessPixel-Modpack/releases/tag/1.21.8-v7-1.0",
      isLatest: true,
      highlights: ["使用全新 Remalkably Optimized 优化整合包作为基础", "从100个模组精简至61个", "零禁用模组", "启动速度大幅提升"],
    },
    {
      name: "EndlessPixel 1.21.6-v6-b5 (测试版)",
      description: "Minecraft 1.21.6 测试版本，包含实验性功能",
      version: "1.21.6-v6-b5",
      mcVersion: "1.21.6",
      fabricVersion: "0.17.0",
      releaseDate: "2024-08-10",
      downloadUrl: "https://github.com/EndlessPixel/EndlessPixel-Modpack/releases/tag/1.21.6-v6-b5",
      isLatest: false,
      highlights: ["依然基于 Fabulously Optimized 进行开发", "实验性功能", "可能不稳定", "停止更新"],
    },
    {
      name: "EndlessPixel 1.21.4-v5-1.4 (稳定版)",
      description: "Minecraft 1.21.4 经典稳定版本，适合追求稳定性的玩家",
      version: "1.21.4-v5-1.4",
      mcVersion: "1.21.4",
      fabricVersion: "0.16.14",
      releaseDate: "2024-08-06",
      downloadUrl: "https://github.com/EndlessPixel/EndlessPixel-Modpack/releases/tag/1.21.4-v5-1.4",
      isLatest: false,
      highlights: ["基于 Fabulously Optimized 优化整合包开发", "第2次重构", "经过长期测试", "稳定可靠", "完整功能支持", "停止更新"],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {downloads.map((item) => (
          <Card
            key={item.version}
            className={item.isLatest ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20" : ""}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  {item.isLatest && <Badge className="bg-green-600 text-white">最新</Badge>}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                    <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-1" />
                      下载
                    </a>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      详情
                    </a>
                  </Button>
                </div>
              </div>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">MC版本:</span>
                  <div className="font-medium">{item.mcVersion}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Fabric:</span>
                  <div className="font-medium">{item.fabricVersion}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">版本号:</span>
                  <div className="font-medium">{item.version}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">发布日期:</span>
                  <div className="font-medium">{item.releaseDate}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">版本特色:</h4>
                <div className="flex flex-wrap gap-2">
                  {item.highlights.map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>快速安装</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-medium">下载整合包</h4>
                <p className="text-sm text-muted-foreground">推荐下载最新版 1.21.8-v7-1.0，获得最佳游戏体验</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium">使用启动器</h4>
                <p className="text-sm text-muted-foreground">推荐使用支持 Modrinith 安装方式的启动器导入整合包</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium">开始游戏</h4>
                <p className="text-sm text-muted-foreground">
                  启动游戏并连接服务器（地址经常变化，建议更新整合包到最新版本，servers.dat内置最新的地址）
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">系统要求</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Java 21 或更高版本</li>
              <li>• 建议分配 4GB 以上内存</li>
              <li>• 支持 Fabric Loader 的启动器</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="outline" asChild>
          <a
            href="https://github.com/EndlessPixel/EndlessPixel-Modpack/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            查看所有版本
          </a>
        </Button>
      </div>
    </div>
  )
}
