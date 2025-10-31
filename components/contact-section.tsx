"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageCircle, GithubIcon, Users, Clock, MapPin, Phone, Gamepad2, Play, FacebookIcon, Calendar, Award, Star } from "lucide-react"

export function ContactSection() {
  const contactMethods = [
    {
      name: "QQ 群",
      value: "870594910",
      description: "加入我们的 QQ 群与其他玩家交流",
      icon: MessageCircle,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800",
      hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
      action: "加入群聊",
      onClick: () => window.open("https://qm.qq.com/cgi-bin/qm/qr?k=870594910", "_blank"),
    },
    {
      name: "邮箱",
      value: "3319182533@qq.com",
      description: "主官方邮箱，处理重要事务",
      icon: Mail,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800",
      hoverColor: "hover:bg-green-100 dark:hover:bg-green-900/30",
      action: "发送邮件",
      onClick: () => window.open("mailto:3319182533@qq.com", "_blank"),
    },
    {
      name: "邮箱",
      value: "2267848501@qq.com",
      description: "备用官方邮箱，处理重要事务",
      icon: Mail,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800",
      hoverColor: "hover:bg-green-100 dark:hover:bg-green-900/30",
      action: "发送邮件",
      onClick: () => window.open("mailto:2267848501@qq.com", "_blank"),
    },
    {
      name: "Discord",
      value: "EndlessPixel Server",
      description: "与其他玩家实时交流",
      icon: Gamepad2,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-800",
      hoverColor: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
      action: "加入服务器",
      onClick: () => window.open("https://discord.gg/k63hRWt3fF", "_blank"),
    },
    {
      name: "Facebook",
      value: "system_mini",
      description: "与我们在 Facebook 上互动",
      icon: FacebookIcon,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800",
      hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
      action: "关注我们",
      onClick: () => window.open("https://t.pineal.cn/system_mini", "_blank"),
    },
    {
      name: "GitHub",
      value: "EndlessPixel",
      description: "开源项目和技术交流",
      icon: GithubIcon,
      color: "text-gray-600 dark:text-gray-300",
      bgColor: "bg-gray-50 dark:bg-gray-900/30",
      borderColor: "border-gray-200 dark:border-gray-700",
      hoverColor: "hover:bg-gray-100 dark:hover:bg-gray-800/30",
      action: "访问仓库",
      onClick: () => window.open("https://github.com/EndlessPixel", "_blank"),
    },
    {
      name: "Gitee",
      value: "system_mini",
      description: "与我们在 Gitee 上互动",
      icon: GithubIcon,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      borderColor: "border-red-200 dark:border-red-800",
      hoverColor: "hover:bg-red-100 dark:hover:bg-red-900/30",
      action: "关注我们",
      onClick: () => window.open("https://gitee.com/system_mini", "_blank"),
    },
  ]

  const supportInfo = [
    {
      title: "在线时间",
      value: "周一至周五 18:30-22:30 周六至周日 08:00-23:30",
      icon: Clock,
      color: "text-orange-500 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      title: "服务器位置",
      value: "中国江苏宿迁",
      icon: MapPin,
      color: "text-red-500 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
    },
    {
      title: "网站位置",
      value: "香港 （东）",
      icon: MapPin,
      color: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "技术支持",
      value: "周六至周日 08:00-23:30",
      icon: Phone,
      color: "text-green-500 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Contact Methods */}
      <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-600 bg-card dark:bg-card/95">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span>联系我们</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-muted-foreground/80">
            通过以下方式与我们取得联系，我们很乐意听到您的声音
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {contactMethods.map((method) => {
            const Icon = method.icon
            return (
              <div
                key={`${method.name}-${method.value}`}
                className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${method.borderColor} ${method.bgColor} ${method.hoverColor} group`}
                onClick={method.onClick}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${method.bgColor} mt-0.5 flex-shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-5 h-5 ${method.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground dark:text-foreground/90">{method.name}</h4>
                      <Badge variant="outline" className="text-xs bg-background/50 dark:bg-background/80">
                        {method.action}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 mb-2">{method.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-foreground dark:text-foreground/90 bg-muted/50 dark:bg-muted/30 px-2 py-1 rounded">
                        {method.value}
                      </span>
                      <Button size="sm" variant="ghost" className="ml-2 text-muted-foreground dark:text-muted-foreground/70">
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
      <Card className="border-l-4 border-l-green-500 dark:border-l-green-600 bg-card dark:bg-card/95">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <div className="p-2 bg-green-50 dark:bg-green-950/40 rounded-lg">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span>支持信息</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {supportInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <div key={info.title}>
                <div className="flex items-center space-x-3 py-2">
                  <div className={`p-2 rounded-lg ${info.bgColor}`}>
                    <Icon className={`w-4 h-4 ${info.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground dark:text-foreground/90">{info.title}</span>
                      <span className="text-sm text-foreground dark:text-foreground/90 text-right">{info.value}</span>
                    </div>
                  </div>
                </div>
                {index < supportInfo.length - 1 && (
                  <Separator className="my-2 bg-border/50 dark:bg-border/30" />
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Anniversary Card */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-l-4 border-l-yellow-500 dark:border-l-yellow-600">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-3">
            <CardTitle className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                我们一岁啦！🎉
              </span>
            </CardTitle>
            <Badge className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white border-0">
              <Star className="w-3 h-3 mr-1" />
              周年庆
            </Badge>
          </div>
          <p className="text-muted-foreground dark:text-muted-foreground/80 leading-relaxed">
            EndlessPixel运营至今已满1周年，
            感谢您一直以来的信任与支持。
            <span className="font-semibold text-foreground dark:text-foreground/90 block mt-1">一年坚持，初心不改；</span>
            <span className="font-semibold text-foreground dark:text-foreground/90">免费服务，始终无广。</span>
            <span className="block mt-1">因为有您，我们才能走得更远！</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}