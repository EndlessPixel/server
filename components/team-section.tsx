import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Server, Shield, Globe, Sparkles, MessageSquare } from "lucide-react";

export function TeamSection() {
  const teamMembers = [
    {
      name: "system_mini",
      description: "团队创始人，全面负责服务器运维、网站更新、域名管理及对外宣传推广。",
      iconColor: "text-foreground/60",
      bgColor: "bg-secondary",
      borderColor: "border-l-2 border-l-foreground/20",
      departments: ["创始人", "服务器部", "维护部", "宣传部", "网络部"],
      responsibilities: ["服务器维护", "网站维护", "域名管理", "宣传推广"],
      qq: ["2267848501", "3319182533", "1343352337"],
    },
    {
      name: "MCL",
      description: "团队副创始人，协助管理团队事务，负责日常协调与监督。",
      iconColor: "text-foreground/60",
      bgColor: "bg-secondary",
      borderColor: "border-l-2 border-l-foreground/15",
      departments: ["副创始人"],
      responsibilities: ["团队管理", "日常协调"],
      qq: ["3785267350"],
    },
    {
      name: "LANt",
      description: "团队成员，负责提供域名服务。",
      iconColor: "text-foreground/60",
      bgColor: "bg-secondary",
      borderColor: "border-l-2 border-l-foreground/10",
      departments: ["网络部"],
      responsibilities: ["域名管理"],
      qq: ["2384269718"],
    },
  ];

  const getDepartmentIcon = (dept: string) => {
    const iconMap: Record<string, any> = {
      创始人: Crown,
      副创始人: Crown,
      服务器部: Server,
      维护部: Shield,
      宣传部: Sparkles,
      网络部: Globe,
    };
    return iconMap[dept] || Users;
  };

  return (
    <Card className="bg-card shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
            <Users className="h-5 w-5 text-foreground/60" />
          </div>
          团队介绍
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className={`hover-lift group rounded-lg border-l-2 border-l-foreground/10 bg-secondary p-6 transition-all duration-300 hover:shadow-md`}
            >
              <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-foreground">
                {member.name}
              </h3>

              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {member.description}
              </p>

              {/* 部门 / 职位 */}
              <div className="mb-3 space-y-2">
                <span className="block text-sm font-medium">职位 / 部门</span>
                <div className="flex flex-wrap gap-1.5">
                  {member.departments.map((dept) => {
                    const Icon = getDepartmentIcon(dept);
                    return (
                      <Badge
                        key={dept}
                        variant="outline"
                        className="flex items-center gap-1 bg-background/50 px-2 py-1 text-xs dark:bg-background/80"
                      >
                        <Icon className="h-3 w-3" />
                        {dept}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* 负责内容 */}
              <div className="mb-3">
                <span className="mb-2 block text-sm font-medium">负责内容</span>
                <div className="rounded-md bg-muted/30 px-3 py-2 text-sm text-muted-foreground dark:bg-muted/20">
                  {member.responsibilities.join(" · ")}
                </div>
              </div>

              {/* QQ 联系方式 */}
              <div className="mb-3 flex flex-col">
                <span className="mb-2 block items-center gap-1 text-sm font-medium">
                  <MessageSquare className="h-3.5 w-3.5" />
                  QQ 联系
                </span>
                <div className="rounded-md bg-muted/30 px-3 py-2 font-mono text-sm text-muted-foreground dark:bg-muted/20">
                  {member.qq.join("  ·  ")}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
