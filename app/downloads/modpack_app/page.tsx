import { DownloadSection } from "@/components/download-section-launcher"
import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: "资源下载 - EndlessPixel Minecraft 服务器",
    description:
        "下载 EndlessPixel Minecraft Modpack Downloader Tools。支持下载最新版 EndlessPixel 客户端整合包。",
    keywords: ["Minecraft", "模组包下载", "EndlessPixel", "整合包"],
    openGraph: {
        title: "资源下载 | EndlessPixel Minecraft 服务器",
        description: "下载 EndlessPixel Minecraft Modpack Downloader Tools。支持下载最新版 EndlessPixel 客户端整合包。",
        url: "https://www.endlesspixel.cn/downloads/modpack_app/",
        images: [
            {
                url: "/og-downloads.jpg",
                width: 1200,
                height: 630,
                alt: "EndlessPixel 资源下载 - EndlessPixel Modpack APP",
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
    return (
        <div className="min-h-screen bg-background">
            <main className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            下载EndlessPixel Modpack Downloader Tools
                        </h1>
                    </div>

                    {/* Downloads Section */}
                    <div className="bg-card rounded-2xl border-foreground/8 backdrop-blur-sm p-1">
                        <Link
                            href="/downloads"
                            className="inline-block bg-secondary hover:bg-secondary/70 px-4 py-2 rounded-lg text-foreground/70 no-underline"
                        >
                            返回下载页面
                        </Link>
                        {/* 👉 核心修改：用Suspense包裹DownloadSection，props完全不变 */}
                        <Suspense fallback={<div className="p-8 text-center">加载下载区域中...</div>}>
                            <DownloadSection
                                title="EndlessPixel Modpack APP"
                                description="下载 EndlessPixel Minecraft Modpack Downloader Tools。支持下载最新版 EndlessPixel 客户端整合包。"
                                githubApiUrl="https://api.github.com/repos/EndlessPixel/EndlessPixel-ModpackAPP/releases"
                            />
                        </Suspense>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-card rounded-xl p-6 border-foreground/8 backdrop-blur-sm">
                            <h3 className="font-semibold text-foreground text-lg mb-4">需要帮助？</h3>
                            <div className="space-y-4 text-muted-foreground">
                                <p>如果您在下载或安装过程中遇到任何问题：</p>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="https://github.com/EndlessPixel/EndlessPixel-ModpackAPP/issues"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        提交 Issue
                                    </a>
                                    <a
                                        href="https://qm.qq.com/q/sFrax2Ilxe"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-medium text-foreground/70 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6z" />
                                        </svg>
                                        加入 QQ 群
                                    </a>
                                    <a
                                        href="modpack_app/issues/"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/70 rounded-lg text-sm font-medium text-foreground/70 transition-colors"
                                    >
                                        <ArrowUpRight className="w-4 h-4" />
                                        Issue 列表
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}