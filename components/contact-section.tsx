"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Mail, MessageCircle, GithubIcon, Users, Clock, MapPin, Phone, Gamepad2, Play, FacebookIcon } from "lucide-react"

export function ContactSection() {
  const contactMethods = [
    {
      name: "QQ 群",
      value: "870594910",
      description: "加入我们的 QQ 群与其他玩家交流",
      icon: MessageCircle,
      color: "text-blue-600",
      action: "加入群聊",
      onClick: () => window.open("https://qm.qq.com/cgi-bin/qm/qr?k=870594910", "_blank"),
    },
        {
      name: "邮箱",
      value: "3319182533@qq.com",
      description: "主官方邮箱，处理重要事务",
      icon: Mail,
      color: "text-green-600",
      action: "发送邮件",
      onClick: () => window.open("mailto:3319182533@qq.com", "_blank"),
    },
    {
      name: "邮箱",
      value: "2267848501@qq.com",
      description: "备用官方邮箱，处理重要事务",
      icon: Mail,
      color: "text-green-600",
      action: "发送邮件",
      onClick: () => window.open("mailto:2267848501@qq.com", "_blank"),
      
    },
    {
      name: "Discord",
      value: "EndlessPixel Server",
      description: "与其他玩家实时交流",
      icon: Gamepad2,
      color: "text-blue-600",
      action: "加入服务器",
      onClick: () => window.open("https://discord.gg/k63hRWt3fF", "_blank"),
    },
    {
      name: "Facebook",
      value: "system_mini",
      description: "与我们在 Facebook 上互动",
      icon: FacebookIcon,
      color: "text-blue-600",
      action: "关注我们",
      onClick: () => window.open("https://t.pineal.cn/system_mini", "_blank"),
    },
    {
      name: "GitHub",
      value: "EndlessPixel",
      description: "开源项目和技术交流",
      icon: GithubIcon,
      color: "text-gray-600 dark:text-gray-400",
      action: "访问仓库",
      onClick: () => window.open("https://github.com/EndlessPixel", "_blank"),
    },
    {
      name: "Gitee",
      value: "system_mini",
      description: "与我们在 Gitee 上互动",
      icon: GithubIcon,
      color: "text-gray-600 dark:text-gray-400",
      action: "关注我们",
      onClick: () => window.open("https://gitee.com/system_mini", "_blank"),
    },
  ]

  const supportInfo = [
    {
      title: "在线时间",
      value: "周一至周五 18:30-22:30 周六至周日 08:00-23:30",
      icon: Clock,
    },
    {
      title: "服务器位置",
      value: "中国江苏宿迁",
      icon: MapPin,
    },
    {
      title: "网站位置",
      value: "香港 （东）",
      icon: MapPin,
    },
    {
      title: "技术支持",
      value: "周六至周日 08:00-23:30",
      icon: Phone,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Contact Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5 text-green-600" />
            <span>联系我们</span>
          </CardTitle>
          <CardDescription>通过以下方式与我们取得联系</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contactMethods.map((method) => {
            const Icon = method.icon
            return (
              <div key={method.name} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <Icon className={`w-5 h-5 ${method.color} mt-0.5 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground mb-1">{method.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-foreground">{method.value}</span>
                      <Button size="sm" variant="outline" onClick={method.onClick}>
                        {method.action}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Support Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>支持信息</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {supportInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <div key={info.title}>
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{info.title}</span>
                      <span className="text-sm text-foreground">{info.value}</span>
                    </div>
                  </div>
                </div>
                {index < supportInfo.length - 1 && <Separator className="mt-4" />}
              </div>
            )
          })}
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <CardTitle className="flex items-center space-x-2">
            <Play className="w-5 h-5 text-blue-600" />
            <span>构建信息</span>
          </CardTitle>
          <br />
          <hr />
          <br />
          <h3>EndlessPixel Website 最新构建信息</h3>
          <h4>版本：<span className="ml-auto text-sm text-muted-foreground">EndlessPixel Website 8.9.1-dev3</span></h4>
          <h4>构建时间：<span className="ml-auto text-sm text-muted-foreground">2025-10-26 11:24</span></h4>
          <h4>许可证：<span className="ml-auto text-sm text-muted-foreground">GPL-3.0</span></h4>
          <br />
          <h3>EndlessPixel Website 上一次构建信息</h3>
          <h4>版本：<span className="ml-auto text-sm text-muted-foreground">EndlessPixel Website 8.9.1-dev2</span></h4>
          <h4>构建时间：<span className="ml-auto text-sm text-muted-foreground">2025-10-25 17:40</span></h4>
          <h4>许可证：<span className="ml-auto text-sm text-muted-foreground">GPL-3.0</span></h4>
        </CardContent>
      </Card>
    </div>
  )
}