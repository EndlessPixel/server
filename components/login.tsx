// components/login.tsx
'use client';
import { LogOutIcon, UserIcon, LogInIcon } from 'lucide-react'; // 新增 LogInIcon
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

interface LoginButtonProps {
    text?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({
    text = '登录',
    size = 'md',
    className = '',
}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');

    // Cookie 操作函数
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
        return '';
    };

    const deleteCookie = (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    // 检测登录状态（加防抖，减少重复执行）
    useEffect(() => {
        // 确保在客户端执行，避免 SSR 导致的不一致
        if (typeof window === 'undefined') return;

        const checkLoginStatus = () => {
            const user = getCookie('mc_user');
            if (user) {
                setIsLoggedIn(true);
                setUsername(user);
            } else {
                setIsLoggedIn(false);
                setUsername('');
            }
        };

        // 初始检测 + 监听 cookie 变化（可选）
        checkLoginStatus();
        const interval = setInterval(checkLoginStatus, 1000); // 防止手动改 cookie 不更新
        return () => clearInterval(interval);
    }, []);

    // 退出登录
    const handleLogout = () => {
        deleteCookie('mc_user');
        setIsLoggedIn(false);
        setUsername('');
        // 用 Next.js 路由刷新，替代 window.reload 更丝滑
        if (typeof window !== 'undefined') {
            window.history.replaceState({}, document.title, window.location.href);
            window.location.href = window.location.href; // 软刷新，减少闪烁
        }
    };

    // 尺寸样式（抽成常量，避免重复计算）
    const sizeClasses = React.useMemo(() => ({
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-2.5 text-lg',
    }), []);

    // 登录按钮样式
    const loginBtnClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    bg-gradient-to-r from-indigo-600 to-purple-600
    text-white shadow-lg shadow-indigo-500/20
    hover:from-indigo-700 hover:to-purple-700
    hover:shadow-indigo-500/30
    active:scale-98 active:shadow-indigo-500/10
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
    dark:focus:ring-offset-slate-900
  `;

    // 退出按钮样式
    const logoutBtnClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    bg-slate-200 dark:bg-slate-700
    text-slate-800 dark:text-slate-200
    hover:bg-slate-300 dark:hover:bg-slate-600
    active:scale-98
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-slate-500
    dark:focus:ring-offset-slate-900
  `;

    // 已登录状态的用户信息样式
    const userInfoClasses = `
    inline-flex items-center gap-2
    ${sizeClasses[size]}
    text-slate-700 dark:text-slate-300
  `;

    // 获取当前页面 URL 作为跳转回地址
    const getRedirectUrl = () => {
        if (typeof window !== 'undefined') {
            return encodeURIComponent(window.location.pathname + window.location.search);
        }
        return encodeURIComponent('/');
    };

    if (isLoggedIn) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                {/* 显示用户名 */}
                <span className={userInfoClasses}>
                    <UserIcon className="w-4 h-4" />
                    {username}
                </span>
                {/* 退出按钮 */}
                <button
                    onClick={handleLogout}
                    className={`${logoutBtnClasses} ${sizeClasses[size]}`}
                    aria-label="退出登录"
                    type="button" // 明确按钮类型，避免表单提交
                >
                    <LogOutIcon className="w-4 h-4" />
                    退出
                </button>
            </div>
        );
    }

    return (
        <Link
            href={`/login?redirect=${getRedirectUrl()}`} // 优化：提前 encode
            className={`${loginBtnClasses} ${sizeClasses[size]} ${className}`}
            aria-label="前往登录页面"
            prefetch={false} // 关键：关闭预取，避免提前加载登录页
        >
            <LogInIcon className="w-4 h-4" /> {/* 替换为 lucide 图标，风格统一 */}
            {text}
        </Link>
    );
};

export default LoginButton;