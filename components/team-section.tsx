import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Crown, Users, Server, Coffee, Sparkles, Shield, Globe, Wrench } from "lucide-react"

export function TeamSection() {
  const teamMembers = [
    {
      name: "system_mini",
      role: "服主/创始人",
      description: "创始人，负责服务器维护、更新、网站维护、域名提供和宣传工作。",
      roleColor: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200 border-red-200 dark:border-red-800",
      icon: Crown,
      iconColor: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-l-4 border-l-red-500 dark:border-l-red-600",
      departments: ["团队创始人", "服务器创始人", "服主", "服务器", "代码部", "维护部", "网络部", "宣传部"],
      responsibilities: ["团队创始人", "服务器维护", "服务器更新", "网站维护", "网站更新", "域名提供", "宣传"],
    },
    {
      name: "MCL",
      role: "创始人",
      description: "团队副创始人",
      roleColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200 border-purple-200 dark:border-purple-800",
      icon: Crown,
      iconColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-l-4 border-l-purple-500 dark:border-l-purple-600",
      departments: ["创始人", "摸鱼部"],
      responsibilities: ["团队副创始人", "摸鱼"],
    },
    {
      name: "LANt",
      role: "服务器/域名",
      description: "负责服务器提供、维护和域名管理工作。",
      roleColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200 border-blue-200 dark:border-blue-800",
      icon: Server,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-l-4 border-l-blue-500 dark:border-l-blue-600",
      departments: ["服务器", "域名"],
      responsibilities: ["服务器提供", "服务器维护", "域名提供"],
    },
    {
      name: "夜色流觞",
      role: "服务器",
      description: "负责服务器硬件提供和基础设施支持。",
      roleColor: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 border-green-200 dark:border-green-800",
      icon: Server,
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-l-4 border-l-green-500 dark:border-l-green-600",
      departments: ["摸鱼部"],
      responsibilities: ["摸鱼"],
    },
    {
      name: "Alice_Ctoy",
      role: "网络部",
      description: "团队成员，负责提供域名部分解析。",
      roleColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800",
      icon: Globe,
      iconColor: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
      borderColor: "border-l-4 border-l-yellow-500 dark:border-l-yellow-600",
      departments: ["域名"],
      responsibilities: ["域名提供"],
    },
    {
      name: "流浪的小李子",
      role: "杂务",
      description: "团队成员，负责处理各种杂七杂八的事务。",
      roleColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200 border-orange-200 dark:border-orange-800",
      icon: Wrench,
      iconColor: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-l-4 border-l-orange-500 dark:border-l-orange-600",
      departments: ["杂务部"],
      responsibilities: ["杂七杂八的活"],
    },
  ]

  const getDepartmentIcon = (dept: string) => {
    const icons: { [key: string]: any } = {
      "团队创始人": Crown,
      "服务器创始人": Server,
      "服主": Crown,
      "服务器": Server,
      "代码部": Sparkles,
      "维护部": Shield,
      "网络部": Globe,
      "宣传部": Sparkles,
      "创始人": Crown,
      "摸鱼部": Coffee,
      "域名": Globe,
      "杂务部": Wrench,
    }
    return icons[dept] || Users
  }

  return (
    <Card className="border-l-4 border-l-blue-500 dark:border-l-blue-600 bg-card dark:bg-card/95">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span>团队介绍</span>
        </CardTitle>
        <CardDescription className="text-muted-foreground dark:text-muted-foreground/80">
          认识我们的管理团队，他们致力于为玩家提供最好的游戏体验
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map((member) => {
            const Icon = member.icon
            return (
              <div
                key={member.name}
                className={`border rounded-lg p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${member.bgColor} ${member.borderColor} group`}
              >
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16 border-2 border-background dark:border-background/80 shadow-sm group-hover:scale-110 transition-transform">
                    <AvatarFallback className={`${member.roleColor.split(' ')[0]} ${member.roleColor.split(' ')[1]} font-semibold text-base`}>
                      {member.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground dark:text-foreground/90 group-hover:text-foreground/80 transition-colors">
                        {member.name}
                      </h3>
                      <Icon className={`w-4 h-4 ${member.iconColor}`} />
                    </div>

                    <Badge className={`${member.roleColor} border mb-3 font-medium`}>
                      {member.role}
                    </Badge>

                    <p className="text-muted-foreground dark:text-muted-foreground/80 mb-4 text-sm leading-relaxed">
                      {member.description}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center space-x-1 mb-2">
                          <span className="text-sm font-medium text-foreground dark:text-foreground/90">职位/部门</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {member.departments.map((dept) => {
                            const DeptIcon = getDepartmentIcon(dept)
                            return (
                              <Badge
                                key={dept}
                                variant="outline"
                                className="text-xs bg-background/50 dark:bg-background/80 flex items-center space-x-1 px-2 py-1"
                              >
                                <DeptIcon className="w-3 h-3" />
                                <span>{dept}</span>
                              </Badge>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center space-x-1 mb-2">
                          <span className="text-sm font-medium text-foreground dark:text-foreground/90">负责项目</span>
                        </div>
                        <div className="text-sm text-muted-foreground dark:text-muted-foreground/80 bg-muted/30 dark:bg-muted/20 rounded-md px-3 py-2">
                          {member.responsibilities.join(" · ")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Team Stats */}
        <div className="mt-8 pt-6 border-t border-border/50 dark:border-border/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">6</div>
              <div className="text-sm text-muted-foreground dark:text-muted-foreground/80">团队成员</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">8</div>
              <div className="text-sm text-muted-foreground dark:text-muted-foreground/80">核心部门</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">15+</div>
              <div className="text-sm text-muted-foreground dark:text-muted-foreground/80">负责项目</div>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">2</div>
              <div className="text-sm text-muted-foreground dark:text-muted-foreground/80">创始人</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}