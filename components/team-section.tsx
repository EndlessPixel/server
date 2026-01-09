import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Users, Server, Coffee, Sparkles, Shield, Globe, Wrench } from "lucide-react"

export function TeamSection() {
  const teamMembers = [
    {
      name: "system_mini",
      description: "创始人，负责服务器维护、更新、网站维护、域名提供和宣传工作。",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-l-4 border-l-red-500 dark:border-l-red-600",
      departments: ["团队/服务器创始人", "服主", "服务器", "维护部", "网络部", "宣传部"],
      responsibilities: ["创始人", "服务器维护", "网站维护", "域名提供", "宣传"],
    },
    {
      name: "MCL",
      description: "团队副创始人",
      iconColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-l-4 border-l-purple-500 dark:border-l-purple-600",
      departments: ["创始人", "摸鱼部"],
      responsibilities: ["团队副创始人", "摸鱼"],
    },
    {
      name: "LANt",
      description: "负责服务器提供、维护和域名管理工作。",
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-l-4 border-l-blue-500 dark:border-l-blue-600",
      departments: ["服务器", "域名"],
      responsibilities: ["服务器提供", "服务器维护", "域名提供"],
    },
    {
      name: "灵月",
      description: "管理交流群内聊天秩序",
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-l-4 border-l-green-500 dark:border-l-green-600",
      departments: ["管理部"],
      responsibilities: ["管理"],
    },
    {
      name: "流浪的小李子",
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
            return (
              <div
                key={member.name}
                className={`border rounded-lg p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${member.bgColor} ${member.borderColor} group`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground dark:text-foreground/90 group-hover:text-foreground/80 transition-colors">
                        {member.name}
                      </h3>
                    </div>

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
      </CardContent>
    </Card>
  )
}