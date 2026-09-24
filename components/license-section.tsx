"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scale, Check, AlertTriangle, Info, ExternalLink, FileText } from "lucide-react";

interface LicenseInfo {
  title: string;
  description: string;
  type: string;
  officialUrl: string;
  repoUrl: string;
}

interface LicenseCategory {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

const LicenseHeaderCard = ({ info }: { info: LicenseInfo }) => (
  <Card>
    <CardHeader>
      <div className="flex items-center gap-4 rounded-2xl bg-foreground p-3 text-background shadow-sm">
        <Scale className="h-6 w-6" />
        <h2 className="text-xl font-bold">EndlessPixel / Server</h2>
      </div>
      <CardTitle className="text-2xl">{info.title}</CardTitle>
      <CardDescription>{info.description}</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-wrap items-center gap-3">
      <Badge variant="secondary">{info.type}</Badge>
      <Button size="sm" variant="ghost" onClick={() => window.open(info.officialUrl, "_blank")}>
        <ExternalLink className="mr-2 h-4 w-4" /> 官方文本
      </Button>
      <Button size="sm" variant="ghost" onClick={() => window.open(info.repoUrl, "_blank")}>
        <FileText className="mr-2 h-4 w-4" /> 源码文件
      </Button>
    </CardContent>
  </Card>
);

const LicenseCategoryCard = ({ category }: { category: LicenseCategory }) => (
  <Card className="bg-card">
    <CardHeader className="pb-3">
      <div className="flex items-center gap-2">
        <div className="text-muted-foreground">{category.icon}</div>
        <CardTitle className="text-base">{category.title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex flex-wrap gap-2">
        {category.items.map((item) => (
          <Badge key={item} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    </CardContent>
  </Card>
);

const LicenseUsageTip = ({ tip, title = "使用提示" }: { tip: string; title?: string }) => (
  <Card>
    <CardHeader className="pb-6">
      <CardTitle className="text-base">{title}</CardTitle>
      <CardDescription>{tip}</CardDescription>
    </CardHeader>
  </Card>
);

export function LicenseSection() {
  const licenseInfo: LicenseInfo = {
    title: "开源许可证",
    description: "本项目采用 GNU Affero General Public License v3.0 开放源代码",
    type: "AGPL-3.0",
    officialUrl: "https://www.gnu.org/licenses/agpl-3.0",
    repoUrl: "https://github.com/EndlessPixel/server/blob/main/LICENSE",
  };
  const licenseCategories: LicenseCategory[] = [
    {
      title: "权限",
      icon: <Check className="h-5 w-5" />,
      items: ["商业使用", "修改", "分发", "专利使用", "私人使用"],
    },
    { title: "限制", icon: <AlertTriangle className="h-5 w-5" />, items: ["责任限制", "无担保"] },
    {
      title: "条件",
      icon: <Info className="h-5 w-5" />,
      items: ["保留版权与许可证", "状态变更需标注", "网络服务=分发", "源码必须同许可证"],
    },
  ];
  return (
    <section className="space-y-6">
      <LicenseHeaderCard info={licenseInfo} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {licenseCategories.map((category, index) => (
          <LicenseCategoryCard key={index} category={category} />
        ))}
      </div>
      <LicenseUsageTip tip="引用或修改本项目时，请保留版权头、许可证文件及相同许可证开源。" />
    </section>
  );
}
