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
    const router = useRouter();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect');
        if (getCookie('mc_user')) {
            router.push(redirect || '/');
        }
    }, [router]);
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
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) {
            setError('请输入用户名');
            return;
        }
        setLoading(true);
        setError('');
        setTimeout(() => {
            setCookie('mc_user', username);
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect') || '/';
            router.push(redirect);
            router.refresh();
            setLoading(false);
        }, 800);
    };
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
            <Navigation />
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 sm:p-8 border border-slate-200 dark:border-slate-700">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">登录</h1>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                用户名
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-800 dark:text-white"
                                placeholder="输入任意用户名即可"
                                autoComplete="off"
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-70"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="15 9" />
                                    </svg>
                                    登录中...
                                </span>
                            ) : (
                                '登录'
                            )}
                        </button>
                    </form>
                    <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                            返回首页
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}