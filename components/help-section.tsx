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

// 帮助支持部分组件 - 极简灰阶版
export function HelpSection({
  className = "",
  showGithubIssue = true,
  githubIssueUrl = "https://github.com/EndlessPixel/server/issues",
  showWiki = false,
  wikiUrl = "https://wiki.endlesspixel.cn",
}: HelpSectionProps) {
  return (
    <Card className={`shadow-sm ${className}`}>
      <CardContent className="p-6">
        <h3 className="font-medium text-foreground text-lg mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
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
                  <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
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

// 返回按钮组件（极简灰阶版）
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
      className={`inline-block bg-secondary hover:bg-secondary/70 px-4 py-2 rounded-lg text-secondary-foreground no-underline transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 ${className}`}
      aria-label={label}
    >
      {label}
    </Link>
  );
}
