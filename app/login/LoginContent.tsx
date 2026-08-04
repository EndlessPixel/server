'use client';

import { Navigation } from '@/components/navigation';
import Footer from '@/components/footer';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginContent() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const validUsernamePattern = /^[a-zA-Z0-9_]{3,16}$/;

    useEffect(() => {
        const timer = setTimeout(() => setShowForm(true), 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const redirect = searchParams.get('redirect');
        if (getCookie('mc_user')) {
            router.push(redirect || '/');
        }
    }, [router, searchParams]);

    function setCookie(name: string, value: string, days = 7) {
        if (typeof window === 'undefined') return;
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        const encodedValue = encodeURIComponent(value);
        const secure = window.location.protocol === 'https:' ? 'Secure;' : '';
        document.cookie = `${name}=${encodedValue}; ${expires}; path=/; SameSite=Lax; ${secure}`;
    }

    function getCookie(name: string): string | null {
        if (typeof window === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop()?.split(';').shift();
            return cookieValue ? decodeURIComponent(cookieValue) : null;
        }
        return null;
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        if (!username.trim()) {
            setError('请输入用户名');
            return;
        }
        if (!validUsernamePattern.test(username)) {
            setError('用户名只能包含字母、数字和下划线，长度 3-16 位');
            return;
        }
        if (!password.trim() || password.length < 6) {
            setError('密码长度不能少于 6 位');
            return;
        }
        if (!agreeTerms) {
            setError('请阅读并同意用户协议与隐私政策');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username.trim(), password }),
            });

            let data;
            const contentType = res.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                data = await res.json();
            } else {
                throw new Error('服务器返回格式错误');
            }

            if (res.ok && data.success === true) {
                const userName = data.name && validUsernamePattern.test(data.name)
                    ? data.name
                    : username;
                setCookie('mc_user', userName);
                const redirect = searchParams.get('redirect') || '/';
                router.push(redirect);
                router.refresh();
            } else {
                setError(data.message || data.error || '登录失败，请检查用户名和密码');
            }
        } catch (err) {
            console.error('登录错误:', err);
            setError('网络请求失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            <Navigation />

            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
                <div
                    className={`w-full max-w-md bg-card backdrop-blur-md rounded-2xl shadow-lg p-6 sm:p-8 transition-all duration-700 ${showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                            <svg className="w-8 h-8 text-foreground/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">欢迎回来</h1>
                        <p className="text-sm text-muted-foreground">请输入用户名和密码继续你的旅程</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4" noValidate>
                        {error && (
                            <div
                                className="bg-destructive/10 text-destructive/90 px-4 py-2.5 rounded-lg text-sm shadow-sm"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-foreground">
                                用户名
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2.5 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/30 focus:bg-background text-foreground transition-all duration-200 placeholder:text-muted-foreground/50"
                                placeholder="输入你的用户名"
                                autoComplete="username"
                                disabled={loading}
                                maxLength={16}
                                aria-invalid={error ? 'true' : 'false'}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                密码
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-ring/30 focus:bg-background text-foreground transition-all duration-200 placeholder:text-muted-foreground/50"
                                placeholder="输入密码（至少6位）"
                                autoComplete="current-password"
                                disabled={loading}
                                minLength={6}
                            />
                        </div>

                        <div className="flex items-start gap-2.5 mt-2">
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                className="w-4 h-4 mt-0.5 rounded accent-foreground focus:ring-2 focus:ring-ring/30"
                                disabled={loading}
                            />
                            <label htmlFor="agreeTerms" className="text-sm text-muted-foreground select-none">
                                我已阅读并同意
                                <Link
                                    href="/terms"
                                    target="_blank"
                                    className="text-foreground hover:underline mx-1 font-medium"
                                >
                                    《用户协议》
                                </Link>
                                与
                                <Link
                                    href="/privacy"
                                    target="_blank"
                                    className="text-foreground hover:underline mx-1 font-medium"
                                >
                                    《隐私政策》
                                </Link>
                            </label>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            为保障账号与数据安全，暂不支持网页直接注册。请先加入服务器，再使用注册指令完成创建。
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-foreground hover:bg-foreground/90 active:scale-[0.98] text-background font-medium py-2.5 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/30 focus:ring-offset-2 disabled:opacity-70 shadow-sm"
                            aria-busy={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="30 10" />
                                    </svg>
                                    正在登录中...
                                </span>
                            ) : (
                                '立即登录'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <Link href="/" className="text-foreground hover:underline transition-all font-medium">
                            ← 返回首页
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}