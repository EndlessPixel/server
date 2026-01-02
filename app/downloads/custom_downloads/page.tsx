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
    Share2,
    Rocket,
    Globe,
    Clock,
    CheckCircle2,
} from "lucide-react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";

// ----------------------------
// 工具函数：智能解析 GitHub URL
// ----------------------------
const parseGithubUrl = (url: string): { isValid: boolean; owner?: string; repo?: string } => {
    try {
        let cleanUrl = url.trim();
        if (!cleanUrl) return { isValid: false };

        if (!/^https?:\/\//i.test(cleanUrl)) {
            cleanUrl = "https://" + cleanUrl;
        }

        const parsed = new URL(cleanUrl);

        if (!["github.com", "www.github.com"].includes(parsed.hostname.toLowerCase())) {
            return { isValid: false };
        }

        const pathParts = parsed.pathname.split("/").filter(Boolean);
        if (pathParts.length < 2) return { isValid: false };

        const [owner, repo] = pathParts;
        if (!owner || !repo) return { isValid: false };

        if (!/^[a-z0-9._-]+$/i.test(owner) || !/^[a-z0-9._-]+$/i.test(repo)) {
            return { isValid: false };
        }

        return { isValid: true, owner, repo };
    } catch {
        return { isValid: false };
    }
};

// ----------------------------
// 主组件
// ----------------------------
export default function CustomDownloadsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [inputUrl, setInputUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const githubUrl = searchParams.get("url");
    const repoInfo = githubUrl ? parseGithubUrl(githubUrl) : { isValid: false };

    // 如果 URL 有效且已传入，直接渲染下载页（由下游处理空 releases）
    if (githubUrl && repoInfo.isValid && repoInfo.owner && repoInfo.repo) {
        return (
            <LauncherDownloadPage
                owner={repoInfo.owner}
                repo={repoInfo.repo}
                repoOwner={repoInfo.owner}
                repoName={repoInfo.repo}
                issuesHref={`/downloads/custom_downloads/issues?url=${encodeURIComponent(githubUrl)}`}
                backHref="/downloads/custom_downloads"
            />
        );
    }

    // ----------------------------
    // 提交处理：含 Release 校验
    // ----------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = inputUrl.trim();
        if (!trimmed) return;

        setIsLoading(true);

        const info = parseGithubUrl(trimmed);
        if (!info.isValid || !info.owner || !info.repo) {
            alert("请输入有效的 GitHub 仓库地址，例如：github.com/owner/repo");
            setIsLoading(false);
            return;
        }

        // ✅ 检查是否有公开 releases
        try {
            const apiUrl = `https://api.github.com/repos/${info.owner}/${info.repo}/releases?per_page=1`;
            const res = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    Accept: "application/vnd.github.v3+json",
                    "User-Agent": "CustomDownloadsPage",
                },
            });

            if (res.ok) {
                const releases = await res.json();
                if (Array.isArray(releases) && releases.length > 0) {
                    // 有 release，跳转
                    startTransition(() => {
                        router.push(`/downloads/custom_downloads?url=${encodeURIComponent(trimmed)}&platform=github&api_limit=60&verify=true&use_mirror=true`);
                    });
                    return;
                }
            }

            // 无 releases 或返回 404（私有/不存在）
            alert(
                "❌ 该仓库暂无公开的 Release 版本，无法生成下载页。\n\n请确认：\n1. 仓库是公开的\n2. 已在 GitHub 上创建至少一个 Release（非 tag）"
            );
        } catch (error) {
            console.warn("GitHub API 调用失败（可能因速率限制），尝试直接跳转...", error);
            // 降级：API 失败时仍跳转，由 LauncherDownloadPage 处理空状态
            startTransition(() => {
                router.push(`/downloads/custom_downloads?url=${encodeURIComponent(trimmed)}`);
            });
        } finally {
            setIsLoading(false);
        }
    };

    // ----------------------------
    // 分享功能
    // ----------------------------
    const handleShare = async () => {
        if (typeof window === "undefined") return;
        const url = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({ title: document.title, url });
            } else if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = url;
                textArea.style.position = "fixed";
                textArea.style.opacity = "0";
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error("分享失败:", err);
        }
    };

    // ----------------------------
    // 渲染
    // ----------------------------
    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-cyan-50/20 dark:from-slate-900 dark:via-blue-950/20 dark:to-cyan-900/10 relative overflow-hidden">
                {/* 静态背景装饰 */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-r from-blue-200 to-cyan-200 dark:from-blue-800/20 dark:to-cyan-800/20 rounded-full blur-3xl opacity-30"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-r from-purple-200 to-pink-200 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 py-12 relative z-10">
                    {/* 标题区 */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge className="bg-linear-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/50 px-5 py-2 text-sm font-medium backdrop-blur-sm mb-6">
                            <Sparkles className="w-4 h-4 mr-1.5" />
                            自定义 GitHub 下载页
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-slate-900 via-blue-800 to-cyan-700 dark:from-white dark:via-blue-300 dark:to-cyan-400 bg-clip-text text-transparent mb-4">
                            生成专属下载页面
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            输入任意 GitHub 仓库地址，一键生成专业、美观、支持镜像加速的下载页面。
                        </p>
                    </motion.div>

                    {/* 主卡片 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl rounded-2xl overflow-hidden">
                            <CardHeader className="text-center pb-6 pt-10 relative">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-cyan-500 to-emerald-500"></div>
                                <div className="w-16 h-16 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                                    <Github className="w-8 h-8 text-white" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                                    输入 GitHub 仓库地址
                                </CardTitle>
                                <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                                    支持任何公开仓库
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="space-y-8 pb-10">
                                {/* 表单 */}
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label htmlFor="github-url" className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">
                                            GitHub 仓库地址
                                        </label>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Input
                                                id="github-url"
                                                type="url"
                                                placeholder="例如：github.com/owner/repo"
                                                value={inputUrl}
                                                onChange={(e) => setInputUrl(e.target.value)}
                                                onFocus={() => setIsFocused(true)}
                                                onBlur={() => setIsFocused(false)}
                                                className={`w-full text-base py-3 px-4 border transition-colors rounded-xl ${isFocused
                                                        ? "border-blue-500 ring-2 ring-blue-500/20 dark:ring-blue-500/10"
                                                        : "border-slate-300 dark:border-slate-600"
                                                    } bg-white/60 dark:bg-slate-800/60`}
                                                required
                                            />
                                            <Button
                                                type="submit"
                                                disabled={isLoading || !inputUrl.trim()}
                                                size="lg"
                                                className="sm:w-auto whitespace-nowrap bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                        检查中...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Rocket className="w-4 h-4 mr-2" />
                                                        立即生成
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </form>

                                {/* 支持格式说明 */}
                                <div className="bg-linear-to-r from-slate-50/80 to-blue-50/50 dark:from-slate-800/40 dark:to-blue-900/20 rounded-xl p-5 border border-slate-200/50 dark:border-slate-700/50">
                                    <h3 className="font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-blue-500" />
                                        支持的格式示例
                                    </h3>
                                    <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1">
                                        <li>github.com/owner/repo</li>
                                        <li>https://github.com/owner/repo/releases</li>
                                        <li>github.com/owner/repo/tree/main</li>
                                        <li>www.github.com/owner/repo</li>
                                    </ul>
                                </div>

                                {/* 核心特性 */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { icon: Download, title: "智能解析", desc: "自动提取仓库信息" },
                                        { icon: Globe, title: "镜像加速", desc: "全球 CDN 加速下载" },
                                        { icon: Clock, title: "实时更新", desc: "同步 GitHub 最新 Release" },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="text-center p-4 bg-white/50 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50"
                                        >
                                            <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                                                <item.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* 分享按钮 */}
                                <div className="flex justify-center pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleShare}
                                        className="rounded-lg px-4 py-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400"
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 mr-1.5 text-green-500" />
                                                已复制链接
                                            </>
                                        ) : (
                                            <>
                                                <Share2 className="w-4 h-4 mr-1.5" />
                                                分享此页面
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* 快捷入口 */}
                    <motion.div
                        className="mt-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-8">
                            热门项目快捷入口
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                            {[
                                {
                                    name: "EndlessPixel Modpack",
                                    url: "https://github.com/EndlessPixel/EndlessPixel-Modpack/releases",
                                    desc: "官方优化整合包",
                                    stars: "⭐ 2.4k",
                                },
                                {
                                    name: "Fabric Example Mod",
                                    url: "https://github.com/FabricMC/fabric-example-mod/releases",
                                    desc: "模组开发模板",
                                    stars: "⭐ 1.8k",
                                },
                                {
                                    name: "Minecraft Forge",
                                    url: "https://github.com/MinecraftForge/MinecraftForge/releases",
                                    desc: "Forge 官方仓库",
                                    stars: "⭐ 5.7k",
                                },
                            ].map((proj, i) => (
                                <Card
                                    key={i}
                                    className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                                    onClick={() => {
                                        setInputUrl(proj.url);
                                        // 注意：这里不校验，因为这些是已知有 releases 的项目
                                        startTransition(() =>
                                            router.push(`/downloads/custom_downloads?url=${encodeURIComponent(proj.url)}`)
                                        );
                                    }}
                                >
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shrink-0">
                                                <Github className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                                                        {proj.name}
                                                    </h4>
                                                    <Badge variant="secondary" className="text-xs px-2 py-0">
                                                        {proj.stars}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                                    {proj.desc}
                                                </p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-slate-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </>
    );
}