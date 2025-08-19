"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ServerStatusSkeleton } from "@/components/server-status-skeleton"
import { Server, Users, Clock, Wifi, Info, MessageSquare, RefreshCw, Timer, Globe } from "lucide-react"

interface ServerData {
  online: boolean
  ip: string
  port: number
  players: {
    online: number
    max: number
    list?: Array<{ name: string; uuid: string }>
  }
  motd?: {
    raw?: string[]
    clean?: string[]
    html?: string[]
  }
  version?: string
  protocol?: number
  software?: string
  plugins?: string[]
  mods?: string[]
  hostname?: string
}

interface PingData {
  code: number
  host?: string
  ip?: string
  location?: string
  max?: number
  avg?: number
  min?: number
}

export function ServerStatusCard() {
  const searchParams = useSearchParams()
  const serverIp = searchParams.get("serverip") || "epmc.top" // 默认服务器 IP
  const pingIp = searchParams.get("pingip") || "modrinth.com" // 默认 Ping 测试 IP

  const [serverData, setServerData] = useState<ServerData | null>(null)
  const [pingData, setPingData] = useState<PingData>({
    code: 500,
    host: pingIp,
    location: "网络测试失败",
  })
  const [loading, setLoading] = useState(true)
  const [pingLoading, setPingLoading] = useState(true)
  const [serverTime, setServerTime] = useState("加载中...")

  const fetchServerStatus = async () => {
    try {
      setLoading(true)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒超时

      const response = await fetch(`https://api.mcsrvstat.us/3/${serverIp}`, {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setServerData(data)
    } catch (error) {
      console.warn("Failed to fetch server status:", error)
      setServerData(null)
    } finally {
      setLoading(false)
    }
  }

  const fetchPingData = async () => {
    try {
      setPingLoading(true)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8秒超时

      const response = await fetch(`https://uapis.cn/api/v1/network/ping?host=${pingIp}`, {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Ping API returned ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setPingData(data)
    } catch (error) {
      console.warn("Failed to fetch ping data:", error)
      setPingData({
        code: 500,
        host: pingIp,
        location: "网络测试失败",
      })
    } finally {
      setPingLoading(false)
    }
  }

  const refreshAllData = () => {
    fetchServerStatus()
    fetchPingData()
  }

  useEffect(() => {
    const updateServerTime = () => {
      const startDate = new Date("2024-09-16T15:34:43")
      const now = new Date()
      let diffInMs = now.getTime() - startDate.getTime()

      if (diffInMs < 0) {
        setServerTime("计算错误: 时间有问题!")
        return
      }

      const years = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25))
      diffInMs -= years * (1000 * 60 * 60 * 24 * 365.25)
      const months = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 30.44))
      diffInMs -= months * (1000 * 60 * 60 * 24 * 30.44)
      const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
      diffInMs -= days * (1000 * 60 * 60 * 24)
      const hours = Math.floor(diffInMs / (1000 * 60 * 60))
      diffInMs -= hours * (1000 * 60 * 60)
      const minutes = Math.floor(diffInMs / (1000 * 60))
      diffInMs -= minutes * (1000 * 60)
      const seconds = Math.floor(diffInMs / 1000)

      const pad = (num: number) => num.toString().padStart(2, "0")
      const padYear = (num: number) => num.toString().padStart(4, "0")

      setServerTime(
        `${padYear(years)} 年 ${pad(months)} 月 ${pad(days)} 日 ${pad(hours)} 小时 ${pad(minutes)} 分钟 ${pad(seconds)} 秒`,
      )
    }

    fetchServerStatus()
    fetchPingData()
    updateServerTime()

    const statusInterval = setInterval(fetchServerStatus, 60000) // 60秒更新一次
    const pingInterval = setInterval(fetchPingData, 120000) // 120秒更新一次ping
    const timeInterval = setInterval(updateServerTime, 1000) // 1秒更新一次

    return () => {
      clearInterval(statusInterval)
      clearInterval(pingInterval)
      clearInterval(timeInterval)
    }
  }, [serverIp, pingIp])

  if (loading && !serverData) {
    return <ServerStatusSkeleton />
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Server className="h-6 w-6" />
          服务器状态 【可以使用?serverip=[serverIp]&pingip=[pingIp]来查询自己的服务器状态和延迟】
        </CardTitle>
        <Button onClick={refreshAllData} disabled={loading || pingLoading} variant="outline" size="sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading || pingLoading ? "animate-spin" : ""}`} />
          刷新状态
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* 在线状态 */}
          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Wifi className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-foreground">在线状态</h3>
              <p
                className={`text-lg font-bold ${
                  loading ? "text-yellow-600" : serverData?.online ? "text-green-600" : "text-red-600"
                }`}
              >
                {loading ? "查询中..." : serverData?.online ? "在线" : "离线"}
              </p>
            </div>
          </div>

          {/* 在线玩家 */}
          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-foreground">在线玩家</h3>
              <p className="text-lg font-bold text-foreground">
                {loading ? "..." : `${serverData?.players?.online || 0}/${serverData?.players?.max || 0}`}
              </p>
            </div>
          </div>

          {/* 网络延迟 */}
          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Clock className="h-8 w-8 text-purple-600" />
            <div>
              <h3 className="font-semibold text-foreground">网络延迟</h3>
              <h6 className="text-xs text-muted-foreground mb-1">实时网络延迟测试 ({pingData?.location || ""})</h6>
              <p className="text-lg font-bold text-foreground">
                {pingLoading
                  ? "测试中..."
                  : pingData?.code === 200 && pingData.avg
                    ? `${Math.round(pingData.avg)} ms`
                    : "测试失败"}
              </p>
              {pingData?.code === 200 && pingData.min && pingData.max && (
                <p className="text-xs text-muted-foreground">
                  范围: {Math.round(pingData.min)} - {Math.round(pingData.max)} ms
                </p>
              )}
            </div>
          </div>

          {/* 服务器版本 */}
          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Info className="h-8 w-8 text-indigo-600" />
            <div>
              <h3 className="font-semibold text-foreground">服务器版本</h3>
              <p className="text-lg font-bold text-foreground">
                {loading ? "查询中..." : serverData?.version || "未知"}
              </p>
              <p className="text-xs text-muted-foreground">
                {loading ? "..." : `协议版本: ${serverData?.protocol || "未知"}`}
              </p>
            </div>
          </div>

          {/* 软件信息 */}
          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Globe className="h-8 w-8 text-orange-600" />
            <div>
              <h3 className="font-semibold text-foreground">服务器软件</h3>
              <p className="text-lg font-bold text-foreground">
                {loading ? "查询中..." : serverData?.software || "未知"}
              </p>
              {serverData?.plugins && (
                <p className="text-xs text-muted-foreground">插件数量: {serverData.plugins.length}</p>
              )}
              {serverData?.mods && (
                <p className="text-xs text-muted-foreground">模组数量: {serverData.mods.length}</p>
              )}
            </div>
          </div>
        </div>

        {/* MOTD */}
        <div className="mb-8">
          <div className="flex items-start space-x-3 p-6 bg-muted/50 rounded-lg">
            <MessageSquare className="h-8 w-8 text-teal-600 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-3">服务器 MOTD</h3>
              <div className="text-sm text-foreground leading-relaxed">
                {loading ? (
                  "查询中..."
                ) : (
                  <div
                    className="whitespace-pre-wrap break-words"
                    dangerouslySetInnerHTML={{
                      __html: serverData?.motd?.html?.join("<br>") || "未获取到服务器公告信息",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 玩家列表 */}
        {serverData?.players?.list && serverData.players.list.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">在线玩家列表</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-4 py-2 text-left">玩家名称</th>
                    <th className="border border-border px-4 py-2 text-left">UUID</th>
                  </tr>
                </thead>
                <tbody>
                  {serverData.players.list.map((player, index) => (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="border border-border px-4 py-2">{player.name || "未知"}</td>
                      <td className="border border-border px-4 py-2 font-mono text-sm">{player.uuid || "未知"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 服务器运行时间 */}
        <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Timer className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">服务器创建至今</h3>
          </div>
          <div className="text-2xl font-bold text-primary font-mono">{serverTime}</div>
        </div>
      </CardContent>
    </Card>
  )
}
