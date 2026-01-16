import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "资源下载 - EndlessPixel Minecraft 服务器",
    description:
        "下载 EndlessPixel Minecraft 服务器最新客户端整合包。支持 1.21.11 最新版、1.21.9，1.21.8，1.21.4 稳定版，包含 Fabric 模组包和优化配置。提供主分支和 Real 分支两种版本选择。",
    keywords: ["Minecraft下载", "模组包下载", "Fabric", "客户端下载", "1.21.11", "1.21.9", "1.21.8", "EndlessPixel", "整合包"],
    openGraph: {
        title: "资源下载 | EndlessPixel Minecraft 服务器",
        description: "下载超多种类的资源，从Minecraft Launcher到EndlessPixel Modpack，应有尽有。",
        url: "https://www.endlesspixel.fun/downloads",
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
        icon: "/icon.ico"
    }
}

export default function DownloadsPage() {
    const downloadItems = [
        {
            title: "Minecraft Launcher",
            description: "官方 Minecraft 启动器，支持最新版本",
            href: "/downloads/launcher",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            ),
            color: "from-green-500 to-emerald-600"
        },
        {
            title: "EndlessPixel Modpack",
            description: "服务器专用模组包，包含优化和功能模组",
            href: "/downloads/modpack",
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: "from-blue-500 to-cyan-600"
        },
        {
            title: '自定义下载',
            description: '输入任意 GitHub Releases 地址，一键生成下载页',
            href: '/downloads/custom_downloads',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            color: 'from-purple-500 to-indigo-600'
        },
    ]

    return (
        <div className="min-h-screen bg-linear-to-r from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-blue-950/30 dark:to-cyan-950/20">
            <Navigation />
            <main className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-slate-900 via-blue-700 to-cyan-600 dark:from-slate-100 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-6">
                            资源下载
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            下载超多种类的资源，从 Minecraft Launcher 到 EndlessPixel Modpack，应有尽有。
                        </p>
                    </div>

                    {/* Download Cards */}
                    <div className="grid gap-6 md:grid-cols-2 mb-16">
                        {downloadItems.map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                className="group block p-6 bg-white/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:scale-105"
                            >
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-r ${item.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {item.description}
                                </p>
                                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                                    <span>立即下载</span>
                                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Additional Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white/80 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-4">需要帮助？</h3>
                            <div className="space-y-4 text-slate-600 dark:text-slate-400">
                                <p>如果您在下载或安装过程中遇到任何问题：</p>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=EmTbLSL3XG_bU20-aDi4o4k_8rgBMdhs&authKey=xnbJ26rO4MI2bAemGcUt3Wj8I0Dw0nY%2Bq5Bx1HHxK1j5MS%2Bh%2FKDCQy6kOVMBl4%2FD&noverify=0&group_code=870594910"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg text-sm font-medium text-blue-700 dark:text-blue-300 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-6h2v6z" />
                                        </svg>
                                        加入 QQ 群
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}