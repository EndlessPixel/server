import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Crown, Users, Server, Coffee } from "lucide-react"

export function TeamSection() {
  const teamMembers = [
    {
      name: "system_mini",
      role: "服主/创始人",
      description: "创始人，负责服务器维护、更新、网站维护、域名提供和宣传工作。",
      roleColor: "bg-red-100 text-red-800 dark:bg-red-950/20 dark:text-red-200",
      icon: Crown,
      departments: ["团队创始人", "服务器创始人", "服主", "服务器", "代码部", "维护部", "网络部", "宣传部"],
      responsibilities: ["团队创始人", "服务器维护", "服务器更新", "网站维护", "网站更新", "域名提供", "宣传"],
    },
    {
      name: "MCL",
      role: "创始人",
      description: "团队副创始人",
      roleColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/20 dark:text-purple-200",
      icon: Crown,
      departments: ["创始人", "摸鱼部"],
      responsibilities: ["团队副创始人", "摸鱼"],
    },
    {
      name: "LANt",
      role: "服务器/域名",
      description: "负责服务器提供、维护和域名管理工作。",
      roleColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/20 dark:text-blue-200",
      icon: Server,
      departments: ["服务器", "域名"],
      responsibilities: ["服务器提供", "服务器维护", "域名提供"],
    },
    {
      name: "夜色流觞",
      role: "服务器",
      description: "负责服务器硬件提供和基础设施支持。",
      roleColor: "bg-green-100 text-green-800 dark:bg-green-950/20 dark:text-green-200",
      icon: Server,
      departments: ["摸鱼部"],
      responsibilities: ["摸鱼"],
    },
    {
      name: "Alice_Ctoy",
      role: "网络部",
      description: "团队成员，负责提供域名部分解析。",
      roleColor: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-200",
      icon: Coffee,
      departments: ["域名"],
      responsibilities: ["域名提供"],
    },
    {
      name: "流浪的小李子",
      role: "杂务",
      description: "团队成员，负责处理各种杂七杂八的事务。",
      roleColor: "bg-orange-100 text-orange-800 dark:bg-orange-950/20 dark:text-orange-200",
      icon: Coffee,
      departments: ["杂务部"],
      responsibilities: ["杂七杂八的活"],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-600" />
          <span>团队介绍</span>
        </CardTitle>
        <CardDescription>认识我们的管理团队，他们致力于为玩家提供最好的游戏体验</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map((member) => {
            const Icon = member.icon
            return (
              <div key={member.name} className="border rounded-lg p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 font-semibold">
                      {member.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                      <Icon className="w-4 h-4 text-yellow-600" />
                    </div>

                    <Badge className={member.roleColor + " mb-3"}>{member.role}</Badge>

                    <p className="text-muted-foreground mb-3 text-sm">{member.description}</p>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-foreground block mb-1">职位/部门</span>
                        <div className="flex flex-wrap gap-1">
                          {member.departments.map((dept) => (
                            <Badge key={dept} variant="outline" className="text-xs">
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-foreground block mb-1">负责项目</span>
                        <div className="text-sm text-muted-foreground">{member.responsibilities.join("、")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
