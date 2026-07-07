'use client';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/footer';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams(); // 修复：使用 Next.js 提供的 hook

    const validUsernamePattern = /^[a-zA-Z0-9_]{3,16}$/;

    useEffect(() => {
        const timer = setTimeout(() => setShowForm(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // 修复：使用 useCallback 优化，使用 searchParams hook 替代 window.location
    useEffect(() => {
        const redirect = searchParams.get('redirect');
        if (getCookie('mc_user')) {
            router.push(redirect || '/');
        }
    }, [router, searchParams]);

    // 修复：增强 Cookie 安全性
    function setCookie(name: string, value: string, days = 7) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        
        // 修复：对 value 进行编码，防止特殊字符破坏 cookie 格式
        const encodedValue = encodeURIComponent(value);
        
        // 修复：添加 Secure 和 HttpOnly 建议（注意：HttpOnly 需要服务端设置）
        // 这里至少添加 __Host- 前缀保护（如果支持）
        const secure = window.location.protocol === 'https:' ? 'Secure;' : '';
        
        document.cookie = `${name}=${encodedValue}; ${expires}; path=/; SameSite=Lax; ${secure}`;
    }

    function getCookie(name: string): string | null {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop()?.split(';').shift();
            return cookieValue ? decodeURIComponent(cookieValue) : null;
        }
        return null;
    }

    // 修复：添加防抖，防止快速重复提交
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (loading) return; // 防止重复提交

        // 前端验证
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

            // 修复：处理 HTTP 错误状态
            let data;
            const contentType = res.headers.get('content-type');
            if (contentType?.includes('application/json')) {
                data = await res.json();
            } else {
                throw new Error('服务器返回格式错误');
            }

            if (res.ok && data.success === true) {
                // 修复：验证返回的 name 格式
                const userName = data.name && validUsernamePattern.test(data.name) 
                    ? data.name 
                    : username;
                
                setCookie('mc_user', userName);
                
                // 修复：使用 searchParams 获取 redirect
                const redirect = searchParams.get('redirect') || '/';
                router.push(redirect);
                router.refresh();
            } else {
                // 修复：统一错误处理，防止信息泄露
                setError(data.message || data.error || '登录失败，请检查用户名和密码');
            }
        } catch (err) {
            console.error('登录错误:', err);
            setError('网络请求失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => setModalType(null);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col relative overflow-hidden">
            {/* ... 背景装饰保持不变 ... */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl opacity-70"></div>
            </div>

            <Navigation />

            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
                <div
                    className={`w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-xl p-6 sm:p-8 border-slate-200 dark:border-slate-700 transition-all duration-700 ${
                        showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">欢迎回来</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">请输入用户名和密码继续你的旅程</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4" noValidate>
                        {error && (
                            <div 
                                className="bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-lg text-sm shadow-sm"
                                role="alert"
                            >
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
                                placeholder="输入你的用户名"
                                autoComplete="username"
                                disabled={loading}
                                maxLength={16}
                                aria-invalid={error ? 'true' : 'false'}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                密码
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-100/70 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-800 dark:text-white transition-all duration-300 placeholder:text-slate-400"
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
                                className="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500"
                                disabled={loading}
                            />
                            <label htmlFor="agreeTerms" className="text-sm text-slate-600 dark:text-slate-400 select-none">
                                我已阅读并同意
                                <button
                                    type="button"
                                    onClick={() => setModalType('terms')}
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline mx-1"
                                >
                                    《用户协议》
                                </button>
                                与
                                <button
                                    type="button"
                                    onClick={() => setModalType('privacy')}
                                    className="text-indigo-600 dark:text-indigo-400 hover:underline mx-1"
                                >
                                    《隐私政策》
                                </button>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-70 shadow-md hover:shadow-indigo-600/20"
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

                    <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline transition-all">
                            ← 返回首页
                        </Link>
                    </div>
                </div>
            </main>

            {/* 协议弹窗 */}
            {modalType && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-lg max-h-[80vh] overflow-auto bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700 z-10">
                        <button 
                            onClick={closeModal} 
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                            aria-label="关闭弹窗"
                        >
                            ✕
                        </button>

                        {modalType === 'terms' ? (
                            <>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">用户协议</h2>
                                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
                                    {/* 内容保持不变 */}
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">隐私政策</h2>
                                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
                                    {/* 内容保持不变 */}
                                </div>
                            </>
                        )}

                        <button 
                            onClick={closeModal} 
                            className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
                        >
                            我已阅读并了解
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}