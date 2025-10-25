"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, BookOpen, Shield, Wrench, HelpCircle, ExternalLink, Trophy } from "lucide-react"

export function WikiSidebar() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["getting-started"])
  const [selectedArticle, setSelectedArticle] = useState<string>("server-commands")

  const wikiSections = [
    {
      id: "getting-started",
      title: "新手入门",
      icon: BookOpen,
      items: [
        { title: "整合包安装指南", id: "launcher-guide" },
        { title: "服务器玩家命令", id: "server-commands" },
        { title: "领地管理", id: "create-claims" },
      ],
    },
    {
      id: "rules",
      title: "规则制度",
      icon: Shield,
      items: [{ title: "服务器规则", id: "server-rules" }],
    },
    {
      id: "technical",
      title: "技术指南",
      icon: Wrench,
      items: [
        { title: "服务器客户端版本说明", id: "client-versions" },
        { title: "服务器FRP节点贡献指南", id: "frp-guide" },
      ],
    },
    {
      id: "special-features",
      title: "特色功能",
      icon: Trophy,
      items: [{ title: "服务器特殊功能指南", id: "special-features" }],
    },
    {
      id: "troubleshooting",
      title: "故障排除",
      icon: HelpCircle,
      items: [{ title: "服务器连接问题及解决方法", id: "connection-issues" }],
    },
    {
      id: "minecraft-guide",
      title: "Minecraft指南",
      icon: ExternalLink,
      items: [
        { title: "Minecraft 1.21.10", id: "minecraft-1.21.10", external: true, url: "https://zh.minecraft.wiki/w/Java版1.21.10" },
        { title: "Minecraft 1.21.9", id: "minecraft-1.21.9", external: true, url: "https://zh.minecraft.wiki/w/Java版1.21.9" },
        { title: "Minecraft 1.21.8", id: "minecraft-1.21.8", external: true, url: "https://zh.minecraft.wiki/w/Java版1.21.8" },
        { title: "Minecraft 1.21.7", id: "minecraft-1.21.7", external: true, url: "https://zh.minecraft.wiki/w/Java版1.21.7" },
        { title: "Minecraft 1.21.6", id: "minecraft-1.21.6", external: true, url: "https://zh.minecraft.wiki/w/Java版1.21.6" },
        { title: "Minecraft 1.21.4", id: "minecraft-1.21.4", external: true, url: "https://zh.minecraft.wiki/w/Java版1.21.4" },
        { title: "Minecraft 1.21.3", id: "minecraft-1.21.3", external: true, url: "https://zh.minecraft.wiki/w/Java版1.21.3" },
        { title: "Minecraft 1.21.2", id: "minecraft-1.21.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.21.2" },
        { title: "Minecraft 1.21.1", id: "minecraft-1.21.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.21.1" },
        { title: "Minecraft 1.21", id: "minecraft-1.21", external: true, url: "https://zh.minecraft.wiki/w/Java版1.21" },
        { title: "Minecraft 1.20.6", id: "minecraft-1.20.6", external: true, url: "https://zh.minecraft.wiki/w/Java版1.20.6" },
        { title: "Minecraft 1.20.5", id: "minecraft-1.20.5", external: true, url: "https://zh.minecraft.wiki/w/Java版1.20.5" },
        { title: "Minecraft 1.20.4", id: "minecraft-1.20.4", external: true, url: "https://zh.minecraft.wiki/w/Java版1.20.4" },
        { title: "Minecraft 1.20.3", id: "minecraft-1.20.3", external: true, url: "https://zh.minecraft.wiki/w/Java版1.20.3" },
        { title: "Minecraft 1.20.2", id: "minecraft-1.20.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.20.2" },
        { title: "Minecraft 1.20.1", id: "minecraft-1.20.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.20.1" },
        { title: "Minecraft 1.20", id: "minecraft-1.20", external: true, url: "https://zh.minecraft.wiki/w/Java版1.20" },
        { title: "Minecraft 1.19.4", id: "minecraft-1.19.4", external: true, url: "https://zh.minecraft.wiki/w/Java版1.19.4" },
        { title: "Minecraft 1.19.3", id: "minecraft-1.19.3", external: true, url: "https://zh.minecraft.wiki/w/Java版1.19.3" },
        { title: "Minecraft 1.19.2", id: "minecraft-1.19.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.19.2" },
        { title: "Minecraft 1.19.1", id: "minecraft-1.19.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.19.1" },
        { title: "Minecraft 1.19", id: "minecraft-1.19", external: true, url: "https://zh.minecraft.wiki/w/Java版1.19" },
        { title: "Minecraft 1.18.2", id: "minecraft-1.18.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.18.2" },
        { title: "Minecraft 1.18.1", id: "minecraft-1.18.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.18.1" },
        { title: "Minecraft 1.18", id: "minecraft-1.18", external: true, url: "https://zh.minecraft.wiki/w/Java版1.18" },
        { title: "Minecraft 1.17.1", id: "minecraft-1.17.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.17.1" },
        { title: "Minecraft 1.17", id: "minecraft-1.17", external: true, url: "https://zh.minecraft.wiki/w/Java版1.17" },
        { title: "Minecraft 1.16.5", id: "minecraft-1.16.5", external: true, url: "https://zh.minecraft.wiki/w/Java版1.16.5" },
        { title: "Minecraft 1.16.4", id: "minecraft-1.16.4", external: true, url: "https://zh.minecraft.wiki/w/Java版1.16.4" },
        { title: "Minecraft 1.16.3", id: "minecraft-1.16.3", external: true, url: "https://zh.minecraft.wiki/w/Java版1.16.3" },
        { title: "Minecraft 1.16.2", id: "minecraft-1.16.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.16.2" },
        { title: "Minecraft 1.16.1", id: "minecraft-1.16.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.16.1" },
        { title: "Minecraft 1.16", id: "minecraft-1.16", external: true, url: "https://zh.minecraft.wiki/w/Java版1.16" },
        { title: "Minecraft 1.15.2", id: "minecraft-1.15.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.15.2" },
        { title: "Minecraft 1.15.1", id: "minecraft-1.15.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.15.1" },
        { title: "Minecraft 1.15", id: "minecraft-1.15", external: true, url: "https://zh.minecraft.wiki/w/Java版1.15" },
        { title: "Minecraft 1.14.4", id: "minecraft-1.14.4", external: true, url: "https://zh.minecraft.wiki/w/Java版1.14.4" },
        { title: "Minecraft 1.14.3", id: "minecraft-1.14.3", external: true, url: "https://zh.minecraft.wiki/w/Java版1.14.3" },
        { title: "Minecraft 1.14.2", id: "minecraft-1.14.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.14.2" },
        { title: "Minecraft 1.14.1", id: "minecraft-1.14.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.14.1" },
        { title: "Minecraft 1.14", id: "minecraft-1.14", external: true, url: "https://zh.minecraft.wiki/w/Java版1.14" },
        { title: "Minecraft 1.13.2", id: "minecraft-1.13.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.13.2" },
        { title: "Minecraft 1.13.1", id: "minecraft-1.13.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.13.1" },
        { title: "Minecraft 1.13", id: "minecraft-1.13", external: true, url: "https://zh.minecraft.wiki/w/Java版1.13" },
        { title: "Minecraft 1.12.2", id: "minecraft-1.12.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.12.2" },
        { title: "Minecraft 1.12.1", id: "minecraft-1.12.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.12.1" },
        { title: "Minecraft 1.12", id: "minecraft-1.12", external: true, url: "https://zh.minecraft.wiki/w/Java版1.12" },
        { title: "Minecraft 1.11.2", id: "minecraft-1.11.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.11.2" },
        { title: "Minecraft 1.11.1", id: "minecraft-1.11.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.11.1" },
        { title: "Minecraft 1.11", id: "minecraft-1.11", external: true, url: "https://zh.minecraft.wiki/w/Java版1.11" },
        { title: "Minecraft 1.10.2", id: "minecraft-1.10.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.10.2" },
        { title: "Minecraft 1.10.1", id: "minecraft-1.10.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.10.1" },
        { title: "Minecraft 1.10", id: "minecraft-1.10", external: true, url: "https://zh.minecraft.wiki/w/Java版1.10" },
        { title: "Minecraft 1.9.4", id: "minecraft-1.9.4", external: true, url: "https://zh.minecraft.wiki/w/Java版1.9.4" },
        { title: "Minecraft 1.9.3", id: "minecraft-1.9.3", external: true, url: "https://zh.minecraft.wiki/w/Java版1.9.3" },
        { title: "Minecraft 1.9.2", id: "minecraft-1.9.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.9.2" },
        { title: "Minecraft 1.9.1", id: "minecraft-1.9.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.9.1" },
        { title: "Minecraft 1.9", id: "minecraft-1.9", external: true, url: "https://zh.minecraft.wiki/w/Java版1.9" },
        { title: "Minecraft 1.8.9", id: "minecraft-1.8.9", external: true, url: "https://zh.minecraft.wiki/w/Java版1.8.9" },
        { title: "Minecraft 1.8.8", id: "minecraft-1.8.8", external: true, url: "https://zh.minecraft.wiki/w/Java版1.8.8" },
        { title: "Minecraft 1.8.7", id: "minecraft-1.8.7", external: true, url: "https://zh.minecraft.wiki/w/Java版1.8.7" },
        { title: "Minecraft 1.8.6", id: "minecraft-1.8.6", external: true, url: "https://zh.minecraft.wiki/w/Java版1.8.6" },
        { title: "Minecraft 1.8.5", id: "minecraft-1.8.5", external: true, url: "https://zh.minecraft.wiki/w/Java版1.8.5" },
        { title: "Minecraft 1.8.4", id: "minecraft-1.8.4", external: true, url: "https://zh.minecraft.wiki/w/Java版1.8.4" },
        { title: "Minecraft 1.8.3", id: "minecraft-1.8.3", external: true, url: "https://zh.minecraft.wiki/w/Java版1.8.3" },
        { title: "Minecraft 1.8.2", id: "minecraft-1.8.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.8.2" },
        { title: "Minecraft 1.8.1", id: "minecraft-1.8.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.8.1" },
        { title: "Minecraft 1.8", id: "minecraft-1.8", external: true, url: "https://zh.minecraft.wiki/w/Java版1.8" },
        { title: "Minecraft 1.7.10", id: "minecraft-1.7.10", external: true, url: "https://zh.minecraft.wiki/w/Java版1.7.10" },
        { title: "Minecraft 1.7.9", id: "minecraft-1.7.9", external: true, url: "https://zh.minecraft.wiki/w/Java版1.7.9" },
        { title: "Minecraft 1.7.8", id: "minecraft-1.7.8", external: true, url: "https://zh.minecraft.wiki/w/Java版1.7.8" },
        { title: "Minecraft 1.7.7", id: "minecraft-1.7.7", external: true, url: "https://zh.minecraft.wiki/w/Java版1.7.7" },
        { title: "Minecraft 1.7.6", id: "minecraft-1.7.6", external: true, url: "https://zh.minecraft.wiki/w/Java版1.7.6" },
        { title: "Minecraft 1.7.5", id: "minecraft-1.7.5", external: true, url: "https://zh.minecraft.wiki/w/Java版1.7.5" },
        { title: "Minecraft 1.7.4", id: "minecraft-1.7.4", external: true, url: "https://zh.minecraft.wiki/w/Java版1.7.4" },
        { title: "Minecraft 1.7.3", id: "minecraft-1.7.3", external: true, url: "https://zh.minecraft.wiki/w/Java版1.7.3" },
        { title: "Minecraft 1.7.2", id: "minecraft-1.7.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.7.2" },
        { title: "Minecraft 1.6.4", id: "minecraft-1.6.4", external: true, url: "https://zh.minecraft.wiki/w/Java版1.6.4" },
        { title: "Minecraft 1.6.3", id: "minecraft-1.6.3", external: true, url: "https://zh.minecraft.wiki/w/Java版1.6.3" },
        { title: "Minecraft 1.6.2", id: "minecraft-1.6.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.6.2" },
        { title: "Minecraft 1.6.1", id: "minecraft-1.6.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.6.1" },
        { title: "Minecraft 1.5.1", id: "minecraft-1.5.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.5.1" },
        { title: "Minecraft 1.5", id: "minecraft-1.5", external: true, url: "https://zh.minecraft.wiki/w/Java版1.5" },
        { title: "Minecraft 1.4.4", id: "minecraft-1.4.4", external: true, url: "https://zh.minecraft.wiki/w/Java版1.4.4" },
        { title: "Minecraft 1.4.3", id: "minecraft-1.4.3", external: true, url: "https://zh.minecraft.wiki/w/Java版1.4.3" },
        { title: "Minecraft 1.4.2", id: "minecraft-1.4.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.4.2" },
        { title: "Minecraft 1.3.2", id: "minecraft-1.3.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.3.2" },
        { title: "Minecraft 1.3.1", id: "minecraft-1.3.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.3.1" },
        { title: "Minecraft 1.2.5", id: "minecraft-1.2.5", external: true, url: "https://zh.minecraft.wiki/w/Java版1.2.5" },
        { title: "Minecraft 1.2.4", id: "minecraft-1.2.4", external: true, url: "https://zh.minecraft.wiki/w/Java版1.2.4" },
        { title: "Minecraft 1.2.3", id: "minecraft-1.2.3", external: true, url: "https://zh.minecraft.wiki/w/Java版1.2.3" },
        { title: "Minecraft 1.2.2", id: "minecraft-1.2.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.2.2" },
        { title: "Minecraft 1.2.1", id: "minecraft-1.2.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.2.1" },
        { title: "Minecraft 1.2", id: "minecraft-1.2", external: true, url: "https://zh.minecraft.wiki/w/Java版1.2" },
        { title: "Minecraft 1.1", id: "minecraft-1.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.1" },
        { title: "Minecraft 1.0.1", id: "minecraft-1.0.1", external: true, url: "https://zh.minecraft.wiki/w/Java版1.0.1" },
        { title: "Minecraft 1.0.0", id: "minecraft-1.0.0", external: true, url: "https://zh.minecraft.wiki/w/Java版1.0.0" },
      ],
    },
  ]

const toggleSection = (sectionId: string) => {
  setExpandedSections((prev) =>
    prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
  )
}

const selectArticle = (articleId: string) => {
  setSelectedArticle(articleId)
  // Trigger content update
  window.dispatchEvent(new CustomEvent("wiki-article-change", { detail: { articleId } }))
}

const handleItemClick = (item: any) => {
  if (item.external && item.url) {
    window.open(item.url, "_blank", "noopener,noreferrer")
  } else {
    selectArticle(item.id)
  }
}

return (
  <Card className="sticky top-24">
    <CardHeader>
      <CardTitle className="text-lg">目录导航</CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="space-y-1">
        {wikiSections.map((section) => {
          const Icon = section.icon
          const isExpanded = expandedSections.includes(section.id)

          return (
            <div key={section.id}>
              <Button
                variant="ghost"
                className="w-full justify-start px-4 py-3 h-auto font-medium min-h-[48px] active:bg-accent/80"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <span className="text-left">{section.title}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </Button>

              {isExpanded && (
                <div className="ml-4 space-y-1">
                  {section.items.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={`w-full justify-start px-4 py-3 h-auto text-sm min-h-[44px] active:bg-accent/80 ${selectedArticle === item.id && (!("external" in item) || !item.external)
                        ? "text-primary bg-accent font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-left leading-relaxed">{item.title}</span>
                        {"external" in item && item.external && (
                          <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </CardContent>
  </Card>
)
}
