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
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);
    const router = useRouter();

    // SQL 注入检测正则（最常见危险字符）
    const sqlInjectionPattern = /['";<>#*=\/\\\-\(\)]/i;

    useEffect(() => {
        const timer = setTimeout(() => setShowForm(true), 300);
        return () => clearTimeout(timer);
    }, []);

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

    // 登录提交
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!username.trim()) {
            setError('请输入用户名');
            return;
        }

        // 👇 SQL 注入检测
        if (sqlInjectionPattern.test(username)) {
            setError('请不要在用户名输入某些特殊字符，别以为我不知道你要干什么。');
            return;
        }

        if (!agreeTerms) {
            setError('请阅读并同意用户协议与隐私政策');
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

    const closeModal = () => setModalType(null);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl opacity-70"></div>
                <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl opacity-70"></div>
            </div>

            <Navigation />

            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
                <div
                    className={`w-full max-w-md bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-xl p-6 sm:p-8  border-slate-200 dark:border-slate-700 transition-all duration-700 ${
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
                        <p className="text-sm text-slate-500 dark:text-slate-400">请输入用户名继续你的旅程</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-lg text-sm shadow-sm">
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
                                className="w-full px-4 py-2.5 bg-slate-100/70 dark:bg-slate-700/70  border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-800 dark:text-white transition-all duration-300 placeholder:text-slate-400"
                                placeholder="输入任意用户名即可"
                                autoComplete="off"
                                disabled={loading}
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

            {modalType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-lg max-h-[80vh] overflow-auto bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-6  border-slate-200 dark:border-slate-700 z-10">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">✕</button>

                        {modalType === 'terms' ? (
                            <>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">用户协议</h2>
                                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
                                    <p>1. 登录时，您需提供用户名称，但是禁止伪造他人名字。</p>
                                    <p>2. 用户在使用本站服务时，需保证填写信息真实合法，禁止发布违规、违法、低俗内容。</p>
                                    <p>3. 请勿利用本站进行恶意攻击、爬虫、批量访问等非正常操作。</p>
                                    <p>4. 本站不保证服务永久可用，可随时调整、关闭部分功能，无需提前告知。</p>
                                    <p>5. 如违反协议，我们有权利限制或终止您的访问与使用权限。</p>
                                    <p>6. 本协议最终解释权归我们所有。</p>
                                    <p>—— EndlessPixel Studio - 2026/04/25 - 11:07</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">隐私政策</h2>
                                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
                                    <p>1. 我们仅收集您主动填写的用户名等必要体验信息，不会强制收集手机号、地址等敏感隐私。</p>
                                    <p>2. 您的登录信息仅以 Cookie 形式本地存储，我们不会上传、出售或泄露给任何第三方。</p>
                                    <p>3. 本站不会私自获取相册、定位、麦克风等设备权限。</p>
                                    <p>4. 您可随时清空浏览器 Cookie 来注销本地登录状态。</p>
                                    <p>5. 我们会尽力保障数据安全，但不承担外力攻击导致的数据泄露风险。</p>
                                    <p>6. 持续使用本站即代表同意本隐私政策。</p>
                                    <p>7. 本隐私政策最终解释权归我们所有。</p>
                                    <p>—— EndlessPixel Studio - 2026/04/25 - 11:07</p>
                                </div>
                            </>
                        )}

                        <button onClick={closeModal} className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm">
                            我已阅读并了解
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}