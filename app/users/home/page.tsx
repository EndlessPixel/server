"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, LogOut } from "lucide-react";

type UserInfo = {
    provider: string;
    login: string;
    id: number;
    name?: string | null;
    avatar_url?: string | null;
    email?: string | null;
};

export default function UsersHomePage(): JSX.Element {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        try {
            const raw = localStorage.getItem("ep_user");
            if (raw) {
                setUser(JSON.parse(raw));
            }
        } catch (e) {
            // ignore
        } finally {
            setLoading(false);
        }
    }, []);

    function handleLogout() {
        try {
            localStorage.removeItem("ep_user");
        } catch (e) {}
        // Redirect to home page after logout
        router.push("/");
    }

    return (
        <>
            <Navigation />

            <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">用户中心</h1>

                        <Card>
                            <CardHeader>
                                <CardTitle>我的账户</CardTitle>
                                <CardDescription>在此查看你的基本资料与会话状态。</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading && <p className="text-sm text-gray-500">正在加载用户信息…</p>}

                                {!loading && !user && (
                                    <div className="space-y-4">
                                        <p>你尚未登录。</p>
                                        <div className="flex gap-2">
                                            <Button onClick={() => router.push('/users/login')}>去登录</Button>
                                        </div>
                                    </div>
                                )}

                                {!loading && user && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            {user.avatar_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={user.avatar_url} alt="avatar" className="w-20 h-20 rounded-full" />
                                            ) : (
                                                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                                    <UserCheck />
                                                </div>
                                            )}

                                            <div>
                                                <div className="text-xl font-semibold">{user.name || user.login}</div>
                                                <div className="text-sm text-gray-500">{user.login}</div>
                                                <div className="text-sm text-gray-500">{user.email || '未公开邮箱'}</div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <Button variant="destructive" onClick={handleLogout}>
                                                <LogOut className="w-4 h-4 mr-2" /> 登出
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