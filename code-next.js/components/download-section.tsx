"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Package, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import ReactMarkdown from "react-markdown"

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
  isPrerelease: boolean
  isLatest: boolean
  downloadCount: number
  files: Array<{
    name: string
    downloadUrl: string
    downloadCount: number
  }>
  changelog: string
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
        const mcVersionMatch = release.tag_name.match(/^(\d+\.\d+\.\d+)/)
        const mcVersion = mcVersionMatch ? mcVersionMatch[1] : "Unknown"

        const files = release.assets.map((asset) => ({
          name: asset.name,
          downloadUrl: asset.browser_download_url,
          downloadCount: asset.download_count,
        }))

        const downloadCount = files.reduce((total, file) => total + file.downloadCount, 0)

        const releaseDate = new Date(release.published_at).toLocaleDateString("zh-CN")

        return {
          name: release.name || release.tag_name,
          version: release.tag_name,
          mcVersion,
          releaseDate,
          isPrerelease: release.prerelease,
          isLatest: index === 0 && !release.prerelease,
          downloadCount,
          files,
          changelog: release.body || "暂无更新日志。",
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
      {releases.map((release) => (
        <ReleaseCard key={release.version} release={release} />
      ))}
    </div>
  )
}

function ReleaseCard({ release }: { release: ParsedRelease }) {
  const [showChangelog, setShowChangelog] = useState(false)

  return (
    <Card
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
        </div>
        <CardDescription>
          Minecraft {release.mcVersion} • 发布于 {release.releaseDate} • 下载次数：{release.downloadCount}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {release.files.map((file) => (
            <div key={file.name} className="flex items-center justify-between">
              <span className="text-sm">{file.name}</span>
              <Button size="sm" asChild>
                <a href={file.downloadUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-1" />
                  下载
                </a>
              </Button>
            </div>
          ))}
        </div>
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChangelog(!showChangelog)}
            className="flex items-center gap-2"
          >
            {showChangelog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showChangelog ? "隐藏更新日志" : "查看更新日志"}
          </Button>
          {showChangelog && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border text-sm text-gray-700">
              <ReactMarkdown>{release.changelog}</ReactMarkdown>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
