'use client';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    // 页面入场动画
    useEffect(() => {
        const timer = setTimeout(() => setShowForm(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // 已登录自动跳转
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        if (getCookie('mc_user')) {
            router.push(redirect || '/');
        }
    }, [router]);

    // Cookie 工具
    function setCookie(name: string, value: string, days = 7) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
    }

    function getCookie(name: string) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
        return '';
    }

    // 登录提交
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('请输入用户名');
            return;
        }
        setError('');
        setLoading(true);

        setTimeout(() => {
            setCookie('mc_user', username);
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect') || '/';
            router.push(redirect);
            router.refresh();
            setLoading(false);
        }, 900);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col relative overflow-hidden">
            {/* 背景仪式感装饰 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl opacity-70"></div>
            </div>

            <Navigation />

            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
                <div
                    className={`w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 transition-all duration-700 ${
                        showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    {/* 顶部图标 + 标题 */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">欢迎回来</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">请输入用户名继续你的旅程</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-lg text-sm animate-fadeIn shadow-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                用户名
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-100/70 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-800 dark:text-white transition-all duration-300 placeholder:text-slate-400"
                                placeholder="输入任意用户名即可"
                                autoComplete="off"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-70 shadow-md hover:shadow-indigo-600/20"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="30 10" />
                                    </svg>
                                    正在登录中...
                                </span>
                            ) : (
                                '立即登录'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline transition-all">
                            ← 返回首页
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}