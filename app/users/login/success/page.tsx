"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, UserCheck, ArrowRight, CheckCircle, AlertCircle, RefreshCw, Sparkles, Home, LogIn } from "lucide-react";

type UserInfo = {
    provider: string;
    login: string;
    id: number;
    name: string | null;
    avatar_url?: string | null;
    email?: string | null;
};

export default function LoginSuccessPage(): JSX.Element {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserInfo | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Parse query params
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");

        if (!code) {
            setError("缺少授权码参数，无法完成登录流程");
            setLoading(false);
            return;
        }

        // POST to our server-side exchange endpoint
        (async () => {
            try {
                setLoading(true);
                setError(null);

                const resp = await fetch("/api/auth/github", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code, state }),
                });

                const data = await resp.json();

                if (!resp.ok || data.error) {
                    setError(data.error || `服务器返回错误: ${resp.status}`);
                    setLoading(false);
                    return;
                }

                setUser(data.user || null);
                // 持久化到 localStorage，供导航栏读取
                try {
                    if (data?.user) {
                        localStorage.setItem("ep_user", JSON.stringify(data.user));
                    }
                } catch (e) {
                    // ignore
                }
                setLoading(false);

                // 在登录成功后导航到用户页或主页
                setTimeout(() => {
                    router.push('/users/home');
                }, 2000); // 延迟2秒让用户看到成功信息
            } catch (err: any) {
                setError(err?.message || String(err));
                setLoading(false);
            }
        })();
    }, [router]);

    const handleRetry = () => {
        window.location.href = '/users/login';
    };

    return (
        <>
            <Navigation />
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-xl mx-auto">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl shadow-lg mb-4">
                                <Sparkles className="w-10 h-10 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 dark:from-gray-100 dark:to-blue-300 bg-clip-text text-transparent mb-2">
                                登录处理中
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                正在完成 GitHub 身份验证流程
                            </p>
                        </div>

                        <Card className="border-2 border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 pb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                                        <Github className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            GitHub 身份验证
                                        </CardTitle>
                                        <CardDescription className="text-gray-600 dark:text-gray-400">
                                            处理 GitHub OAuth 回调并交换访问令牌
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="p-6">
                                {/* Loading State */}
                                {loading && (
                                    <div className="text-center py-8">
                                        <div className="flex justify-center mb-4">
                                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            正在验证身份...
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            正在与 GitHub 服务器通信，请稍候片刻
                                        </p>
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800">
                                            <p className="text-sm text-blue-700 dark:text-blue-300">
                                                这个过程通常只需要几秒钟时间
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Error State */}
                                {!loading && error && (
                                    <div className="text-center py-6">
                                        <div className="flex justify-center mb-4">
                                            <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-2xl">
                                                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">
                                            登录失败
                                        </h3>
                                        <p className="text-red-700 dark:text-red-300 mb-6">
                                            {error}
                                        </p>
                                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border-2 border-red-200 dark:border-red-800 mb-6">
                                            <p className="text-sm text-red-700 dark:text-red-300">
                                                请检查网络连接或稍后重试。如果问题持续存在，请联系管理员。
                                            </p>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <Button 
                                                onClick={handleRetry}
                                                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg"
                                            >
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                重新登录
                                            </Button>
                                            <Button 
                                                variant="outline"
                                                onClick={() => router.push('/')}
                                                className="border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                                            >
                                                <Home className="w-4 h-4 mr-2" />
                                                返回首页
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Success State */}
                                {!loading && user && (
                                    <div className="text-center py-6">
                                        <div className="flex justify-center mb-4">
                                            <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-2xl">
                                                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-6">
                                            登录成功！
                                        </h3>

                                        {/* User Info Card */}
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/10 dark:to-emerald-950/10 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800 mb-6">
                                            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                                                {user.avatar_url ? (
                                                    <img 
                                                        src={user.avatar_url} 
                                                        alt="avatar" 
                                                        className="w-20 h-20 rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 rounded-2xl bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
                                                        <UserCheck className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="text-center sm:text-left">
                                                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                                        {user.name || user.login}
                                                    </div>
                                                    <div className="text-gray-600 dark:text-gray-400 mb-3">
                                                        {user.email || '未公开邮箱'}
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                                                            来源: {user.provider}
                                                        </Badge>
                                                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-0">
                                                            ID: {user.id}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Auto Redirect Notice */}
                                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/10 dark:to-cyan-950/10 p-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 mb-6">
                                            <div className="flex items-center justify-center space-x-2 text-blue-700 dark:text-blue-300">
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                <span className="text-sm font-medium">
                                                    正在自动跳转到用户主页...
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                            <Button 
                                                onClick={() => router.push('/users/home')}
                                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                                            >
                                                <ArrowRight className="w-4 h-4 mr-2" />
                                                立即跳转
                                            </Button>
                                            <Button 
                                                variant="outline"
                                                onClick={() => router.push('/')}
                                                className="border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300"
                                            >
                                                <Home className="w-4 h-4 mr-2" />
                                                返回首页
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Additional Help */}
                        <div className="mt-6 text-center">
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 border-2 border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
                                    <LogIn className="w-4 h-4" />
                                    <span>遇到问题？请联系管理员或查看文档</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}