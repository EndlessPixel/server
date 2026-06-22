import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, MessageCircle } from "lucide-react";

interface HelpSectionProps {
  className?: string;
  showGithubIssue?: boolean;
  githubIssueUrl?: string;
  showWiki?: boolean;
  wikiUrl?: string;
}

// 帮助支持部分组件 - 统一"需要帮助"区域
export function HelpSection({
  className = "",
  showGithubIssue = true,
  githubIssueUrl = "https://github.com/EndlessPixel/server/issues",
  showWiki = false,
  wikiUrl = "https://wiki.endlesspixel.cn",
}: HelpSectionProps) {
  return (
    <Card
      className={`bg-white/80 dark:bg-slate-800/50 rounded-xl backdrop-blur-sm border-slate-200 dark:border-slate-700 ${className}`}
    >
      <CardContent className="p-6">
        <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-500" aria-hidden="true" />
          需要帮助？
        </h3>
        <div className="space-y-4 text-slate-600 dark:text-slate-400">
          <p>如果您在下载或安装过程中遇到任何问题：</p>
          <div className="flex flex-wrap gap-3">
            {showGithubIssue && (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={githubIssueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="提交问题到GitHub"
                >
                  <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
                  提交 Issue
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" size="sm">
              <Link
                href="https://qm.qq.com/q/sFrax2Ilxe"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="加入QQ群获取支持"
              >
                加入 QQ 群
              </Link>
            </Button>
            {showWiki && (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="查看Wiki百科"
                >
                  <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
                  Wiki 百科
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 返回按钮组件
interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function BackButton({
  href,
  label = "返回",
  className = "",
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-block bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 px-4 py-2 rounded-md text-gray-800 dark:text-slate-200 no-underline transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
      aria-label={label}
    >
      {label}
    </Link>
  );
}
