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
        { title: "服务器玩家命令", id: "server-commands" },
        { title: "如何创建领地", id: "create-claims" },
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
        {
          title: "Minecraft 1.21.8",
          id: "minecraft-1.21.8",
          external: true,
          url: "https://zh.minecraft.wiki/w/1.21.8",
        },
        {
          title: "Minecraft 1.21.6",
          id: "minecraft-1.21.6",
          external: true,
          url: "https://zh.minecraft.wiki/w/1.21.6",
        },
        {
          title: "Minecraft 1.21.4",
          id: "minecraft-1.21.4",
          external: true,
          url: "https://zh.minecraft.wiki/w/1.21.4",
        },
        {
          title: "Minecraft 1.21.3",
          id: "minecraft-1.21.3",
          external: true,
          url: "https://zh.minecraft.wiki/w/1.21.3",
        },
        {
          title: "Minecraft 1.21.2",
          id: "minecraft-1.21.2",
          external: true,
          url: "https://zh.minecraft.wiki/w/1.21.2",
        },
        {
          title: "Minecraft 1.21.1",
          id: "minecraft-1.21.1",
          external: true,
          url: "https://zh.minecraft.wiki/w/1.21.1",
        },
        { title: "Minecraft 1.21", id: "minecraft-1.21", external: true, url: "https://zh.minecraft.wiki/w/1.21" },
        { title: "Minecraft 1.20", id: "minecraft-1.20", external: true, url: "https://zh.minecraft.wiki/w/1.20" },
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
                        className={`w-full justify-start px-4 py-3 h-auto text-sm min-h-[44px] active:bg-accent/80 ${
                          selectedArticle === item.id && !item.external
                            ? "text-primary bg-accent font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-left leading-relaxed">{item.title}</span>
                          {item.external && (
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
