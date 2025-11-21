"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Scale,
  Check,
  AlertTriangle,
  Info,
  ExternalLink,
  FileText,
} from "lucide-react"

// 许可证信息类型定义
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
  colorScheme: "green" | "orange" | "blue";
}

// 许可证详情卡片组件
const LicenseHeaderCard = ({ info }: { info: LicenseInfo }) => (
  <Card className="border-0 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
    <CardHeader>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg">
          <Scale className="w-6 h-6" />
        </div>
        <div>
          <CardTitle className="text-2xl">{info.title}</CardTitle>
          <CardDescription>
            {info.description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="flex items-center gap-3 flex-wrap">
      <Badge variant="outline">{info.type}</Badge>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => window.open(info.officialUrl, "_blank")}
      >
        <ExternalLink className="w-4 h-4 mr-2" />
        官方文本
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => window.open(info.repoUrl, "_blank")}
      >
        <FileText className="w-4 h-4 mr-2" />
        源码文件
      </Button>
    </CardContent>
  </Card>
)

// 许可证分类卡片组件
const LicenseCategoryCard = ({ category }: { category: LicenseCategory }) => {
  const getColorClasses = (scheme: string) => {
    const colorMap = {
      green: {
        bg: "bg-green-50/50 dark:bg-green-950/20",
        text: "text-green-600 dark:text-green-400",
        badge: "bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300",
      },
      orange: {
        bg: "bg-orange-50/50 dark:bg-orange-950/20",
        text: "text-orange-600 dark:text-orange-400",
        badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-300",
      },
      blue: {
        bg: "bg-blue-50/50 dark:bg-blue-950/20",
        text: "text-blue-600 dark:text-blue-400",
        badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300",
      },
    };
    return colorMap[scheme as keyof typeof colorMap] || colorMap.blue;
  };

  const colors = getColorClasses(category.colorScheme);

  return (
    <Card className={`border-0 ${colors.bg}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className={colors.text}>{category.icon}</div>
          <CardTitle className="text-base">{category.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {category.items.map((item) => (
            <Badge
              key={item}
              className={colors.badge}
            >
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// 使用提示卡片组件
const LicenseUsageTip = ({ tip, title = "使用提示" }: { tip: string; title?: string }) => (
  <Card className="border-0 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/10 dark:to-emerald-950/10">
    <CardHeader>
      <CardTitle className="text-base">{title}</CardTitle>
      <CardDescription>
        {tip}
      </CardDescription>
    </CardHeader>
  </Card>
);

export function LicenseSection() {
  // 许可证基本信息
  const licenseInfo: LicenseInfo = {
    title: "开源许可证",
    description: "本项目采用 GNU Affero General Public License v3.0 开放源代码",
    type: "AGPL-3.0",
    officialUrl: "https://www.gnu.org/licenses/agpl-3.0",
    repoUrl: "https://github.com/EndlessPixel/server/blob/main/LICENSE"
  };

  // 许可证分类数据
  const licenseCategories: LicenseCategory[] = [
    {
      title: "权限",
      icon: <Check className="w-5 h-5" />,
      items: ["商业使用", "修改", "分发", "专利使用", "私人使用"],
      colorScheme: "green"
    },
    {
      title: "限制",
      icon: <AlertTriangle className="w-5 h-5" />,
      items: ["责任限制", "无担保"],
      colorScheme: "orange"
    },
    {
      title: "条件",
      icon: <Info className="w-5 h-5" />,
      items: [
        "保留版权与许可证",
        "状态变更需标注",
        "网络服务=分发",
        "源码必须同许可证",
      ],
      colorScheme: "blue"
    }
  ];

  // 使用提示文本
  const usageTip = "引用或修改本项目时，请保留版权头、许可证文件及相同许可证开源。";

  return (
    <section className="space-y-6">
      {/* Header Card */}
      <LicenseHeaderCard info={licenseInfo} />

      {/* 权限 / 限制 / 条件 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {licenseCategories.map((category, index) => (
          <LicenseCategoryCard key={index} category={category} />
        ))}
      </div>

      {/* 使用提示 */}
      <LicenseUsageTip tip={usageTip} />
    </section>
  );
}