// app/downloads/custom_downloads/page.tsx
"use client";

import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LauncherDownloadPage } from "@/components/LauncherDownloadPage";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    AlertCircle,
    ArrowRight,
    Github,
    Download,
    Sparkles,
    ExternalLink,
    Zap,
    Globe,
    Shield,
    Clock,
    CheckCircle2,
    Share2,
    Rocket,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = 'force-dynamic'

// 修复 variants 类型定义
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const, // 明确指定为字面量类型
            stiffness: 100
        }
    }
};

export default function CustomDownloadsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [inputUrl, setInputUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    /* ---------- 工具函数 ---------- */
    const parseGithubUrl = (url: string) => {
        try {
            const patterns = [
                /github\.com\/([^/]+)\/([^/]+)(?:\/releases)?\/?$/,
                /github\.com\/([^/]+)\/([^/]+)(?:\/tree\/[^/]+)?\/?$/,
                /github\.com\/([^/]+)\/([^/]+)(?:\/blob\/[^/]+)?\/?$/,
            ];
            for (const p of patterns) {
                const m = url.match(p);
                if (m) return { owner: m[1], repo: m[2], isValid: true };
            }
            return { isValid: false };
        } catch {
            return { isValid: false };
        }
    };

    const githubUrl = searchParams.get("url");
    const repoInfo = githubUrl ? parseGithubUrl(githubUrl) : { isValid: false };

    /* ---------- 事件处理 ---------- */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputUrl.trim()) return;
        
        setIsLoading(true);
        const info = parseGithubUrl(inputUrl);
        
        if (info.isValid) {
            startTransition(() => {
                router.push(
                    `/downloads/custom_downloads?url=${encodeURIComponent(inputUrl)}`
                );
            });
        } else {
            setIsLoading(false);
            // 使用更优雅的错误提示
            const event = new CustomEvent('show-toast', {
                detail: {
                    title: "无效的GitHub URL",
                    description: "请输入有效的GitHub仓库链接",
                    type: "error"
                }
            });
            window.dispatchEvent(event);
        }
    };

    const handleShare = async () => {
        const url = typeof window !== "undefined" ? window.location.href : "";
        if (!url) return;
        try {
            if ((navigator as any).share) {
                await (navigator as any).share({ title: document.title, url });
            } else if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                // 优雅的回退方案
                const textArea = document.createElement('textarea');
                textArea.value = url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error("share/copy failed", err);
        }
    };

    /* ---------- 渲染 ---------- */
    if (githubUrl && repoInfo.isValid && repoInfo.owner && repoInfo.repo)
        return (
            <>
                <LauncherDownloadPage
                    owner={repoInfo.owner}
                    repo={repoInfo.repo}
                    repoOwner={repoInfo.owner}
                    repoName={repoInfo.repo}
                    issuesHref={`/downloads/custom_downloads/issues?url=${encodeURIComponent(
                        githubUrl
                    )}`}
                    backHref="/downloads/custom_downloads"
                />
            </>
        );

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-linear-to-r from-slate-50 via-blue-50/30 to-cyan-50/20 dark:from-slate-900 dark:via-blue-950/20 dark:to-cyan-900/10 relative overflow-hidden">
                {/* 背景装饰元素 */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-r from-blue-200 to-cyan-200 dark:from-blue-800/20 dark:to-cyan-800/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-r from-purple-200 to-pink-200 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-green-200 to-emerald-200 dark:from-green-800/10 dark:to-emerald-800/10 rounded-full blur-3xl opacity-30 animate-pulse delay-500"></div>
                </div>

                <div className="container mx-auto px-6 py-12 relative z-10">
                    {/* 头部 */}
                    <motion.div 
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                        >
                            <Badge className="bg-linear-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/50 px-6 py-3 text-base font-semibold backdrop-blur-sm">
                                <Sparkles className="w-5 h-5 mr-2" />
                                自定义GitHub仓库下载
                            </Badge>
                        </motion.div>
                        <motion.h1 
                            className="text-5xl md:text-6xl font-bold bg-linear-to-r from-slate-900 via-blue-800 to-cyan-700 dark:from-slate-100 dark:via-blue-300 dark:to-cyan-400 bg-clip-text text-transparent mb-6 mt-6 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            生成专属下载页面
                        </motion.h1>
                        <motion.p 
                            className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            输入任何GitHub仓库URL，立即生成美观专业的下载页面，支持多镜像加速和实时更新
                        </motion.p>
                    </motion.div>

                    <motion.div 
                        className="max-w-5xl mx-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* 主卡片 */}
                        <motion.div variants={itemVariants}>
                            <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl rounded-3xl overflow-hidden hover:shadow-3xl transition-all duration-500">
                                <CardHeader className="text-center pb-6 pt-12 relative">
                                    {/* 装饰性背景 */}
                                    <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-blue-500 via-cyan-500 to-emerald-500"></div>
                                    
                                    <motion.div 
                                        className="w-20 h-20 bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/25"
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <Github className="w-10 h-10 text-white" />
                                    </motion.div>
                                    <CardTitle className="text-3xl font-bold bg-linear-to-r from-slate-900 to-blue-700 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">
                                        输入GitHub仓库URL
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 dark:text-slate-400 text-xl mt-3">
                                        支持任何公开的GitHub仓库Releases页面
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-8 pb-12">
                                    {/* 表单 */}
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-4">
                                            <label
                                                htmlFor="github-url"
                                                className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"
                                            >
                                                <Zap className="w-5 h-5 text-amber-500" />
                                                GitHub Releases URL
                                            </label>
                                            <div className="flex gap-4">
                                                <motion.div className="flex-1" whileFocus={{ scale: 1.01 }}>
                                                    <Input
                                                        id="github-url"
                                                        type="url"
                                                        placeholder="https://github.com/username/repository/releases"
                                                        value={inputUrl}
                                                        onChange={(e) => setInputUrl(e.target.value)}
                                                        onFocus={() => setIsFocused(true)}
                                                        onBlur={() => setIsFocused(false)}
                                                        className={`text-lg py-4 px-6 border-2 transition-all duration-300 rounded-2xl ${
                                                            isFocused 
                                                                ? 'border-blue-500 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10' 
                                                                : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                                                        } bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm`}
                                                        required
                                                    />
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Button
                                                        type="submit"
                                                        disabled={isLoading || !inputUrl.trim()}
                                                        size="lg"
                                                        className="px-10 py-4 bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300 rounded-2xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isLoading ? (
                                                            <motion.div
                                                                animate={{ rotate: 360 }}
                                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                className="flex items-center gap-3"
                                                            >
                                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                                                                生成中...
                                                            </motion.div>
                                                        ) : (
                                                            <motion.div 
                                                                className="flex items-center gap-3"
                                                                whileHover={{ x: 5 }}
                                                                transition={{ type: "spring", stiffness: 400 }}
                                                            >
                                                                <Rocket className="w-5 h-5" />
                                                                立即生成
                                                                <ArrowRight className="w-4 h-4" />
                                                            </motion.div>
                                                        )}
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </form>

                                    {/* 支持的URL格式 */}
                                    <motion.div 
                                        className="bg-linear-to-r from-slate-50/80 to-blue-50/50 dark:from-slate-800/40 dark:to-blue-900/20 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm"
                                        whileHover={{ y: -2 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-3 text-lg">
                                            <AlertCircle className="w-6 h-6 text-blue-500" />
                                            支持的URL格式
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="space-y-2">
                                                <div className="text-slate-600 dark:text-slate-400 font-medium">基础格式：</div>
                                                <code className="block bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-mono break-all hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                                                    https://github.com/owner/repo/releases
                                                </code>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-slate-600 dark:text-slate-400 font-medium">其他格式：</div>
                                                <code className="block bg-white dark:bg-slate-800 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-mono break-all hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                                                    https://github.com/owner/repo
                                                </code>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* 特性说明 */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            {
                                                icon: Download,
                                                title: "智能解析",
                                                description: "自动识别仓库信息并生成下载页面",
                                                color: "blue",
                                                gradient: "from-blue-500 to-cyan-500"
                                            },
                                            {
                                                icon: Globe,
                                                title: "镜像加速",
                                                description: "全球CDN加速，解决GitHub访问问题",
                                                color: "green",
                                                gradient: "from-green-500 to-emerald-500"
                                            },
                                            {
                                                icon: Clock,
                                                title: "实时更新",
                                                description: "直接从GitHub API获取最新版本",
                                                color: "purple",
                                                gradient: "from-purple-500 to-pink-500"
                                            }
                                        ].map((feature, index) => (
                                            <motion.div
                                                key={index}
                                                variants={itemVariants}
                                                whileHover={{ 
                                                    y: -8,
                                                    scale: 1.02,
                                                    transition: { type: "spring", stiffness: 300 }
                                                }}
                                                className="text-center p-6 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 group cursor-pointer"
                                            >
                                                <div className={`w-16 h-16 bg-linear-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                                                    <feature.icon className="w-8 h-8 text-white" />
                                                </div>
                                                <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-lg group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                                                    {feature.title}
                                                </h4>
                                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                                    {feature.description}
                                                </p>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* 分享按钮 */}
                                    <motion.div 
                                        className="flex justify-center pt-4"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Button
                                            onClick={handleShare}
                                            variant="outline"
                                            className="rounded-xl px-8 py-3 border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 group"
                                        >
                                            <AnimatePresence mode="wait">
                                                {copied ? (
                                                    <motion.div
                                                        key="copied"
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.8, opacity: 0 }}
                                                        className="flex items-center gap-2 text-green-600 dark:text-green-400"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                        已复制!
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="share"
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0.8, opacity: 0 }}
                                                        className="flex items-center gap-2 text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                                    >
                                                        <Share2 className="w-5 h-5" />
                                                        分享此页面
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* 热门项目快捷入口 */}
                        <motion.div 
                            className="mt-12"
                            variants={itemVariants}
                        >
                            <motion.h3 
                                className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                热门项目快捷入口
                            </motion.h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    {
                                        name: "EndlessPixel-Modpack",
                                        url: "https://github.com/EndlessPixel/EndlessPixel-Modpack/releases",
                                        description: "EndlessPixel官方出品的优化整合包",
                                        stars: "⭐ 2.4k",
                                    },
                                    {
                                        name: "Fabric Example Mod",
                                        url: "https://github.com/FabricMC/fabric-example-mod/releases",
                                        description: "Fabric模组开发示例项目",
                                        stars: "⭐ 1.8k",
                                    },
                                    {
                                        name: "Minecraft Forge",
                                        url: "https://github.com/MinecraftForge/MinecraftForge/releases",
                                        description: "Minecraft Forge官方仓库",
                                        stars: "⭐ 5.7k",
                                    },
                                ].map((proj, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ 
                                            y: -6,
                                            scale: 1.02,
                                            transition: { type: "spring", stiffness: 300 }
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Card
                                            className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer hover:shadow-xl rounded-2xl overflow-hidden group"
                                            onClick={() => {
                                                setInputUrl(proj.url);
                                                startTransition(() => {
                                                    router.push(
                                                        `/downloads/custom_downloads?url=${encodeURIComponent(
                                                            proj.url
                                                        )}`
                                                    );
                                                });
                                            }}
                                        >
                                            <CardContent className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                                                        <Github className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                {proj.name}
                                                            </h4>
                                                            <Badge variant="secondary" className="text-xs px-2 py-0">
                                                                {proj.stars}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                                            {proj.description}
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    );
}