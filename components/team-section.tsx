import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Crown, Users, Server, Shield, Globe,
  Sparkles, Wrench, MessageSquare
} from "lucide-react"

export function TeamSection() {
  const teamMembers = [
    {
      name: "system_mini",
      description: "团队创始人，全面负责服务器运维、网站更新、域名管理及对外宣传推广。",
      iconColor: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-l-4 border-l-red-500 dark:border-l-red-600",
      departments: ["创始人", "服务器部", "维护部", "宣传部"],
      responsibilities: ["服务器维护", "网站维护", "域名管理", "宣传推广"],
      qq: ["2267848501", "3319182533", "1343352337"]
    },
    {
      name: "MCL",
      description: "团队副创始人，协助管理团队事务，负责日常协调与监督。",
      iconColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-l-4 border-l-purple-500 dark:border-l-purple-600",
      departments: ["副创始人"],
      responsibilities: ["团队管理", "日常协调"],
      qq: ["3785267350"]
    },
    {
      name: "LANt",
      description: "前核心技术成员，曾负责服务器与域名管理，目前暂时退役。",
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-l-4 border-l-blue-500 dark:border-l-blue-600",
      departments: ["退役成员"],
      responsibilities: ["暂时退役"],
      qq: ["2384269718"]
    },
    {
      name: "灵月",
      description: "社群管理员，维护交流群秩序，管理聊天环境与成员行为。",
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-l-4 border-l-green-500 dark:border-l-green-600",
      departments: ["管理部"],
      responsibilities: ["社群管理", "秩序维护"],
      qq: ["3661651904", "773178847"]
    },
    {
      name: "流浪的小李子",
      description: "后勤支持，负责团队各类杂务、协助处理日常事务。",
      iconColor: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-l-4 border-l-orange-500 dark:border-l-orange-600",
      departments: ["杂务部"],
      responsibilities: ["后勤支持", "事务协助"],
      qq: ["3190386431"]
    },
    {
      name: "Arielle",
      description: "技术支持，负责服务器硬件提供与域名相关管理工作。",
      iconColor: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-50 dark:bg-teal-950/20",
      borderColor: "border-l-4 border-l-teal-500 dark:border-l-teal-600",
      departments: ["服务器部", "网络部"],
      responsibilities: ["服务器提供", "域名管理"],
      qq: ["1876967353", "3810656357"]
    }
  ]

  const getDepartmentIcon = (dept: string) => {
    const iconMap: Record<string, any> = {
      "创始人": Crown,
      "副创始人": Crown,
      "服务器部": Server,
      "维护部": Shield,
      "宣传部": Sparkles,
      "管理部": Shield,
      "杂务部": Wrench,
      "网络部": Globe,
      "退役成员": Users,
    }
    return iconMap[dept] || Users
  }

  return (
    <Card className="border-l-4 border-blue-500 dark:border-blue-600 bg-card/95 dark:bg-card/95">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-9 h-9 bg-blue-50 dark:bg-blue-950/40 rounded-lg">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          团队介绍
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className={`rounded-lg p-6 transition-all duration-300 hover:shadow-md hover:scale-102 ${member.bgColor} ${member.borderColor} group`}
            >
              <h3 className="text-lg font-semibold mb-2 group-hover:text-foreground/80 transition-colors">
                {member.name}
              </h3>

              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {member.description}
              </p>

              {/* 部门 / 职位 */}
              <div className="space-y-2 mb-3">
                <span className="block text-sm font-medium">职位 / 部门</span>
                <div className="flex flex-wrap gap-1.5">
                  {member.departments.map((dept) => {
                    const Icon = getDepartmentIcon(dept)
                    return (
                      <Badge
                        key={dept}
                        variant="outline"
                        className="text-xs bg-background/50 dark:bg-background/80 flex items-center gap-1 px-2 py-1"
                      >
                        <Icon className="w-3 h-3" />
                        {dept}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              {/* 负责内容 */}
              <div className="mb-3">
                <span className="block text-sm font-medium mb-2">负责内容</span>
                <div className="text-sm text-muted-foreground bg-muted/30 dark:bg-muted/20 rounded-md px-3 py-2">
                  {member.responsibilities.join(" · ")}
                </div>
              </div>

              {/* QQ 联系方式 */}
              <div>
                <span className="block text-sm font-medium mb-2 items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />QQ 联系
                </span>
                <div className="text-sm text-muted-foreground bg-muted/30 dark:bg-muted/20 rounded-md px-3 py-2 font-mono">
                  {member.qq.join("  ·  ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}