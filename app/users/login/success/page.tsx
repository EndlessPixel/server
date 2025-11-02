"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Github, UserCheck, ArrowRight } from "lucide-react";

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
            setError("缺少 code 参数，无法完成登录。");
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
                    setError(data.error || `后端返回错误: ${resp.status}`);
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
                                router.push('/users/home');
            } catch (err: any) {
                setError(err?.message || String(err));
                setLoading(false);
            }
        })();
    }, [router]);

    return (
        <>
            <Navigation />
            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Github className="w-6 h-6" />
                                    GitHub 登录回调
                                </CardTitle>
                                <CardDescription>
                                    处理 GitHub 返回的授权 code，并使用服务器端密钥完成 token 交换。
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading && (
                                    <div className="space-y-2">
                                        <p>正在完成登录……</p>
                                        <p className="text-sm text-gray-500">请稍候，页面会在处理完成后显示结果。</p>
                                    </div>
                                )}

                                {!loading && error && (
                                    <div className="space-y-2">
                                        <p className="text-red-600">发生错误：{error}</p>
                                        <div className="flex gap-2">
                                            <Button onClick={() => window.location.assign('/users/login')}>返回登录</Button>
                                        </div>
                                    </div>
                                )}

                                {!loading && user && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            {user.avatar_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={user.avatar_url} alt="avatar" className="w-16 h-16 rounded-full" />
                                            ) : (
                                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <UserCheck />
                                                </div>
                                            )}

                                            <div>
                                                <div className="text-lg font-medium">{user.name || user.login}</div>
                                                <div className="text-sm text-gray-500">{user.email || '未公开邮箱'}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Badge>provider: {user.provider}</Badge>
                                            <Badge>login: {user.login}</Badge>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button onClick={() => router.push('/')}>
                                                <ArrowRight className="w-4 h-4 mr-2" /> 返回首页
                                            </Button>
                                            <Button variant="ghost" onClick={() => window.location.assign('/users/login')}>
                                                返回登录页
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}