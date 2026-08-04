import { PageLayout, PageHeader, ContentContainer } from "@/components/page-layout"
import { HelpSection } from "@/components/help-section"
import type { Metadata } from "next"
import { Grid, Link2, Package, Smartphone } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "资源下载 - EndlessPixel Minecraft 服务器",
    description:
        "下载 EndlessPixel Minecraft 服务器最新客户端整合包。支持 1.21.11 最新版、1.21.9，1.21.8，1.21.4 稳定版，包含 Fabric 模组包和优化配置。提供主分支和 Real 分支两种版本选择。",
    keywords: ["Minecraft下载", "模组包下载", "Fabric", "客户端下载", "1.21.11", "1.21.9", "1.21.8", "EndlessPixel", "整合包"],
    openGraph: {
        title: "资源下载 | EndlessPixel Minecraft 服务器",
        description: "下载 EndlessPixel 的客户端、模组包和下载工具，挑你需要的就行。",
        url: "https://www.endlesspixel.cn/downloads",
        images: [
            {
                url: "/og-downloads.jpg",
                width: 1200,
                height: 630,
                alt: "EndlessPixel 资源下载",
            },
        ],
    },
    robots: {
        index: true,
        follow: true,
    },
    icons: {
        icon: "/favicon.ico"
    }
}

export default function DownloadsPage() {
    const downloadItems = [
        {
            title: "Minecraft Launcher",
            description: "GitHub第三方启动器合集，适配多版本MC",
            href: "/downloads/launcher",
            icon: <Grid className="w-6 h-6" />,
            color: "from-primary to-accent"
        },
        {
            title: "EndlessPixel Modpack",
            description: "由服主开发的模组包，包含大量优化和功能模组",
            href: "/downloads/modpack",
            icon: <Package className="w-6 h-6" />,
            color: "from-primary to-accent"
        },
        {
            title: "EndlessPixel Modpack APP",
            description: "模组包下载工具",
            href: "/downloads/modpack_app",
            icon: <Smartphone className="w-6 h-6" />,
            color: "from-primary to-accent"
        },
        {
            title: '自定义下载',
            description: '输入任意 GitHub Releases 地址，一键生成下载页',
            href: '/downloads/custom_downloads',
            icon: <Link2 className="w-6 h-6" />,
            color: "from-primary to-accent"
        },
    ];
    return (
        <PageLayout>
            <ContentContainer>
                <PageHeader 
                    title="资源下载" 
                    description="客户端、模组包、下载工具都在这里，挑你需要的下载。"
                />
                <div className="grid gap-6 md:grid-cols-2 mb-16">
                    {downloadItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="group block p-6 bg-card rounded-2xl border-foreground/8 backdrop-blur-sm hover:shadow-lg hover-lift transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                            aria-label={`下载 ${item.title}`}
                        >
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-r ${item.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                {item.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {item.description}
                            </p>
                            <div className="mt-4 flex items-center text-sm font-medium text-foreground/60">
                                <span>立即下载</span>
                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Additional Info */}
                <HelpSection />
            </ContentContainer>
        </PageLayout>
    )
}