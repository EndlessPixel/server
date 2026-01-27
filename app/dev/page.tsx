import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { LicenseSection } from "@/components/license-section";

// 定义技术栈数据
const techStack = {
    dependencies: [
        "Next.js ^16.1.1 (React框架)",
        "React 19.2.1 / React DOM 19.2.1",
        "TypeScript 5.6.3 (类型系统)",
        "TailwindCSS 4.1.17 (样式框架)",
        "Radix UI (组件库)",
        "Framer Motion (动画库)",
        "Lucide React (图标库)",
        "React Hook Form (表单处理)",
        "Zod (数据验证)",
        "Chart.js / Recharts (数据可视化)",
        "date-fns (日期处理)",
        "next-themes (暗黑模式)",
        "sonner (通知组件)",
        "react-markdown (Markdown渲染)",
    ],
    devDependencies: [
        "ESLint (代码检查)",
        "PostCSS / Autoprefixer (CSS处理)",
        "TypeScript类型定义 (@types/*)",
        "tw-animate-css (动画扩展)",
    ],
};

// API服务数据
const apiServices = [
    { name: "MCSRVStat API", url: "https://api.mcsrvstat.us/", desc: "Minecraft服务器状态查询", copy: "© 2026 Anders G. Jørgensen" },
    { name: "GitHub API", url: "https://api.github.com/", desc: "GitHub数据接口", copy: "© 2026 GitHub, Inc" },
    { name: "ChmlFrpAPI (现已弃用)", url: "https://cf-v2.uapis.cn/", desc: "节点状态获取", copy: "© 2025 南充市轻爪网络科技有限公司" },
    { name: "UAPIs (现已弃用)", url: "https://uapis.cn/", desc: "免费、稳定、快速的公共 Api", copy: "© 2026 Axt Team" },
    { name: "EndlessPixelAPI", url: "https://www.endlesspixel.fun/api/", desc: "EndlessPixel的开放API接口", copy: "© 2024-2026 EndlessPixel Studio" }
];

// 第三方服务数据
const thirdPartyServices = [
    { name: "gh-proxy.com", url: "https://gh-proxy.com/", desc: "GitHub加速服务" },
    { name: "gh.imixc.top", url: "https://gh.imixc.top/", desc: "GitHub加速服务" },
    { name: "gh.jasonzeng.dev", url: "https://gh.jasonzeng.dev/", desc: "GitHub加速服务" },
    { name: "ChmlFrp", url: "https://www.chmlfrp.net/", desc: "Frp内网穿透"},
];

// 开发工具数据
const devTools = {
    development: ["Git", "Node.js", "VSCode", "PowerShell", "Edge DevTool", "Npm"],
    assistant: [
        "GitHub Copilot (代码辅助)",
        "Kimi AI (功能优化建议)",
        "豆包 AI (功能优化)",
        "DeepSeek (UI美化)",
        "Vercel AI (架构/框架开发)",
    ],
    deployment: ["Vercel (部署平台)","Cloudflare (网站加速)","硅云 (域名提供)"],
};

export default function Dev() {
    return (
        <>
            <Navigation />
            <main className="container mx-auto px-4 py-12 max-w-5xl">
                {/* 页面标题 */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
                        EndlessPixel 开发者中心
                    </h1>
                    <div className="w-24 h-1 bg-linear-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        了解EndlessPixel的开发技术和工具。
                    </p>
                </div>

                {/* 技术信息部分 */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                        技术信息
                    </h2>

                    {/* 技术栈 */}
                    <div className="mb-12 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 dark:shadow-gray-700/20">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">技术栈</h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">核心依赖</h4>
                                <ul className="space-y-2">
                                    {techStack.dependencies.map((item, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-purple-500 dark:text-purple-400 mt-1">•</span>
                                            <span className="text-gray-600 dark:text-gray-400">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">开发依赖</h4>
                                <ul className="space-y-2">
                                    {techStack.devDependencies.map((item, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                                            <span className="text-gray-600 dark:text-gray-400">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* API服务 */}
                    <div className="mb-12 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 dark:shadow-gray-700/20">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">API 服务</h3>
                        <div className="grid gap-4">
                            {apiServices.map((api, index) => (
                                <a
                                    key={index}
                                    href={api.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col md:flex-row md:items-center p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <span className="font-medium text-gray-800 dark:text-white mr-3">{api.name}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{api.desc}</span>
                                    <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">{api.copy}</span>
                                    <span className="ml-auto text-blue-500 dark:text-blue-400 text-sm">→</span> 
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 第三方服务 */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 dark:shadow-gray-700/20">
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">第三方服务</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">GitHub加速由以下服务提供：</p>
                        <div className="flex flex-wrap gap-3 justify-start">
                            {thirdPartyServices.map((service, index) => (
                                <a
                                    key={index}
                                    href={service.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-all hover:shadow-md hover:scale-105"
                                >
                                    {service.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 开发工具部分 */}
                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                        开发工具
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* 开发工具 */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 dark:shadow-gray-700/20">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">核心开发工具</h3>
                            <ul className="space-y-2">
                                {devTools.development.map((tool, index) => (
                                    <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <span className="text-purple-500 dark:text-purple-400">●</span>
                                        {tool}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 辅助工具 */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 dark:shadow-gray-700/20">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">AI辅助工具</h3>
                            <ul className="space-y-2">
                                {devTools.assistant.map((tool, index) => (
                                    <li key={index} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                                        <span className="text-blue-500 dark:text-blue-400 mt-1">●</span>
                                        <span>{tool}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* 部署工具 */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 dark:shadow-gray-700/20">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">部署工具</h3>
                            <ul className="space-y-2">
                                {devTools.deployment.map((tool, index) => (
                                    <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <span className="text-green-500 dark:text-green-400">●</span>
                                        {tool}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                <section className="mb-16">
                    <h2 className="text-3xl font-bold mb-8 bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                        Minecraft服务器
                    </h2>
                    <div className="md:grid-cols-3 gap-6">
                        {/* 服务器技术 */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 dark:shadow-gray-700/20">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">服务器技术</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <span className="text-purple-500 dark:text-purple-400">●</span>
                                    <span className="font-medium">服务端核心</span>
                                    <span className="text-gray-600 dark:text-gray-400">PurpurMC</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <span className="text-purple-500 dark:text-purple-400">●</span>
                                    <span className="font-medium">服务器系统</span>
                                    <span className="text-gray-600 dark:text-gray-400">Windows Server2019 Datacenter</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <span className="text-purple-500 dark:text-purple-400">●</span>
                                    <span className="font-medium">Java运行环境</span>
                                    <span className="text-gray-600 dark:text-gray-400">Java JDK 21</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 开源许可证 */}
                <section>
                    <h2 className="text-3xl font-bold mb-8 bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                        开源许可证
                    </h2>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 dark:shadow-gray-700/20">
                        <LicenseSection />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}