"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Sparkles } from "lucide-react"

export function LuckTest() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // 基于日期的稳定随机算法
  const calculateLuck = () => {
    const today = new Date()
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`

    // 使用日期字符串创建种子
    let hash = 0
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // 转换为32位整数
    }

    // 获取用户设备信息
    const userAgent = navigator.userAgent
    for (let i = 0; i < userAgent.length; i++) {
      const char = userAgent.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // 转换为32位整数
    }

    // 添加额外的混淆因子，避免规律性
    const mixedHash = Math.abs(hash * 9301 + 49297) % 233280
    const luck = Math.floor((mixedHash / 233280) * 101)

    return Math.min(100, Math.max(0, luck))
  }

  const getLuckMessage = (luck: number) => {
    if (luck >= 90) return "🌟 今日运势爆棚！什么都能成功！"
    if (luck >= 80) return "✨ 运气很不错，适合做重要决定！"
    if (luck >= 70) return "😊 今天心情愉快，运气不错！"
    if (luck >= 60) return "🙂 运势平稳，保持积极心态！"
    if (luck >= 50) return "😐 运势一般，平常心对待！"
    if (luck >= 40) return "😕 运势略低，小心行事！"
    if (luck >= 30) return "😰 今天要格外小心！"
    if (luck >= 20) return "😱 运势较差，建议宅在家！"
    if (luck >= 10) return "💀 今日诸事不宜，早点休息！"
    return "☠️ 运势极差，建议重启今天！"
  }

  const handleLuckTest = () => {
    setIsLoading(true)

    // 添加一点延迟增加仪式感
    setTimeout(() => {
      const luck = calculateLuck()
      const message = getLuckMessage(luck)

      toast({
        title: `今日人品值：${luck}`,
        description: message,
        duration: 5000,
      })

      setIsLoading(false)
    }, 1000)
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          今日人品测试
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">测试一下你今天的运气如何吧！每天只能测试一次哦~</p>
        <Button onClick={handleLuckTest} disabled={isLoading} className="w-full bg-transparent" variant="outline">
          {isLoading ? "正在计算中..." : "测试今日人品"}
        </Button>
      </CardContent>
    </Card>
  )
}
