import type { ReactNode } from "react";
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
  /** 追加的自定义操作按钮（渲染在 QQ 群按钮之后） */
  children?: ReactNode;
}

// 帮助支持部分组件 - 极简灰阶版
export function HelpSection({
  className = "",
  showGithubIssue = true,
  githubIssueUrl = "https://github.com/EndlessPixel/server/issues",
  showWiki = false,
  wikiUrl = "https://wiki.endlesspixel.cn",
  children,
}: HelpSectionProps) {
  return (
    <Card className={`shadow-sm ${className}`}>
      <CardContent className="p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-foreground">
          <MessageCircle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          需要帮助？
        </h3>
        <div className="space-y-4 text-muted-foreground">
          <p>如果您在下载或安装过程中遇到任何问题：</p>
          <div className="flex flex-wrap gap-3">
            {showGithubIssue && (
              <Button asChild variant="secondary" size="sm">
                <Link
                  href={githubIssueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="提交问题到GitHub"
                >
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  提交 Issue
                </Link>
              </Button>
            )}
            <Button asChild variant="secondary" size="sm">
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
              <Button asChild variant="secondary" size="sm">
                <Link
                  href={wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="查看Wiki百科"
                >
                  <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                  Wiki 百科
                </Link>
              </Button>
            )}
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// 返回按钮组件（极简灰阶版）
interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label = "返回", className = "" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-block rounded-lg bg-secondary px-4 py-2 text-secondary-foreground no-underline transition-colors duration-200 hover:bg-secondary/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ${className}`}
      aria-label={label}
    >
      {label}
    </Link>
  );
}
