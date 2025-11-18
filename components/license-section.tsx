// components/sections/LicenseSection.tsx
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

export function LicenseSection() {
  // 权限 | 限制 | 条件
  const permissions = [
    "商业使用", "修改", "分发", "专利使用", "私人使用",
  ]
  const limitations = ["责任限制", "无担保"]
  const conditions = [
    "保留版权与许可证",
    "状态变更需标注",
    "网络服务=分发",
    "源码必须同许可证",
  ]

  return (
    <section className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl">开源许可证</CardTitle>
              <CardDescription>
                本项目采用 GNU Affero General Public License v3.0 开放源代码
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Badge variant="outline">AGPL-3.0</Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.open("https://www.gnu.org/licenses/agpl-3.0", "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            官方文本
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.open("https://github.com/EndlessPixel/server/blob/main/LICENSE", "_blank")}
          >
            <FileText className="w-4 h-4 mr-2" />
            源码文件
          </Button>
        </CardContent>
      </Card>

      {/* 权限 / 限制 / 条件 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 权限 */}
        <Card className="border-0 bg-green-50/50 dark:bg-green-950/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              <CardTitle className="text-base">权限</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {permissions.map((p) => (
                <Badge
                  key={p}
                  className="bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300"
                >
                  {p}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 限制 */}
        <Card className="border-0 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <CardTitle className="text-base">限制</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {limitations.map((l) => (
                <Badge
                  key={l}
                  className="bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-300"
                >
                  {l}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 条件 */}
        <Card className="border-0 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-base">条件</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {conditions.map((c) => (
                <Badge
                  key={c}
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
                >
                  {c}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 使用提示 */}
      <Card className="border-0 bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950/10 dark:to-emerald-950/10">
        <CardHeader>
          <CardTitle className="text-base">使用提示</CardTitle>
          <CardDescription>
            引用或修改本项目时，请保留版权头、许可证文件及相同许可证开源。
          </CardDescription>
        </CardHeader>
      </Card>
    </section>
  )
}