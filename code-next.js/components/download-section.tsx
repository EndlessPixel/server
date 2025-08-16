"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, ExternalLink, Package, Clock, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GitHubRelease {
  id: number
  tag_name: string
  name: string
  body: string
  published_at: string
  html_url: string
  prerelease: boolean
  assets: Array<{
    name: string
    download_count: number
    browser_download_url: string
  }>
}

interface ParsedRelease {
  name: string
  version: string
  mcVersion: string
  releaseDate: string
  downloadUrl: string
  detailsUrl: string
  isPrerelease: boolean
  isLatest: boolean
  downloadCount: number
}

export function DownloadSection() {
  const [releases, setReleases] = useState<ParsedRelease[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchReleases()
  }, [])

  const fetchReleases = async () => {
    try {
      setLoading(true)
      const response = await fetch("https://api.github.com/repos/EndlessPixel/EndlessPixel-Modpack/releases", {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const data: GitHubRelease[] = await response.json()

      const parsedReleases: ParsedRelease[] = data.map((release, index) => {
        // Extract MC version from tag name (e.g., "1.21.8-v7-1.0" -> "1.21.8")
        const mcVersionMatch = release.tag_name.match(/^(\d+\.\d+\.\d+)/)
        const mcVersion = mcVersionMatch ? mcVersionMatch[1] : "Unknown"

        // Get total download count from all assets
        const downloadCount = release.assets.reduce((total, asset) => total + asset.download_count, 0)

        // Format release date
        const releaseDate = new Date(release.published_at).toLocaleDateString("zh-CN")

        return {
          name: release.name || release.tag_name,
          version: release.tag_name,
          mcVersion,
          releaseDate,
          downloadUrl: release.html_url, // Link to GitHub release page for download
          detailsUrl: release.html_url,
          isPrerelease: release.prerelease,
          isLatest: index === 0 && !release.prerelease, // First non-prerelease is latest
          downloadCount,
        }
      })

      setReleases(parsedReleases)
    } catch (error) {
      console.error("Failed to fetch releases:", error)
      toast({
        title: "获取版本信息失败",
        description: "无法从GitHub获取最新版本信息，请稍后重试。",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">正在获取版本信息...</span>
      </div>
    )
  }

  if (releases.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">暂无可用版本</p>
          <Button onClick={fetchReleases} variant="outline">
            重新获取
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {releases.map((release) => (
          <Card
            key={release.version}
            className={
              release.isLatest ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20" : ""
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg">{release.name}</CardTitle>
                  {release.isLatest && <Badge className="bg-green-600 text-white">最新</Badge>}
                  {release.isPrerelease && <Badge variant="secondary">预发布</Badge>}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                    <a href={release.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-1" />
                      下载
                    </a>
                  </Button>
                </div>
              </div>
              <CardDescription>
                Minecraft {release.mcVersion} • 发布于 {release.releaseDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">MC版本:</span>
                  <div className="font-medium">{release.mcVersion}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">版本号:</span>
                  <div className="font-medium">{release.version}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">发布日期:</span>
                  <div className="font-medium">{release.releaseDate}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">更新日志:</span>
                <Button size="sm" variant="link" className="h-auto p-0" asChild>
                  <a href={release.detailsUrl} target="_blank" rel="noopener noreferrer">
                    在GitHub上查看 <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </Button>
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
                <p className="text-sm text-muted-foreground">选择合适的版本下载，推荐使用最新稳定版</p>
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

      <div className="text-center space-y-2">
        <Button onClick={fetchReleases} variant="outline" className="mr-2 bg-transparent">
          刷新版本列表
        </Button>
        <Button variant="outline" asChild>
          <a
            href="https://github.com/EndlessPixel/EndlessPixel-Modpack/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            在GitHub上查看所有版本
          </a>
        </Button>
      </div>
    </div>
  )
}
