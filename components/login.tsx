// components/login.tsx
'use client';
import { LogOutIcon, UserIcon, LogInIcon } from 'lucide-react';
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
    const [redirectUrl, setRedirectUrl] = useState('/'); // 👈 关键修复

    // Cookie 操作
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
        return '';
    };

    const deleteCookie = (name: string) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    // 👇 关键修复：只在客户端获取真实跳转地址
    useEffect(() => {
        setRedirectUrl(encodeURIComponent(window.location.pathname + window.location.search));
    }, []);

    // 检测登录状态
    useEffect(() => {
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

        checkLoginStatus();
        const interval = setInterval(checkLoginStatus, 1000);
        return () => clearInterval(interval);
    }, []);

    // 退出登录
    const handleLogout = () => {
        deleteCookie('mc_user');
        setIsLoggedIn(false);
        setUsername('');
        window.location.reload();
    };

    // 样式
    const sizeClasses = React.useMemo(() => ({
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-2.5 text-lg',
    }), []);

    const loginBtnClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    bg-gradient-to-r from-indigo-600 to-purple-600
    text-white shadow-lg shadow-indigo-500/20
    hover:from-indigo-700 hover:to-purple-700
    transition-all duration-300 ease-in-out
  `;

    const logoutBtnClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-lg
    bg-slate-200 dark:bg-slate-700
    text-slate-800 dark:text-slate-200
    hover:bg-slate-300 dark:hover:bg-slate-600
    transition-all duration-300
  `;

    const userInfoClasses = `
    inline-flex items-center gap-2
    ${sizeClasses[size]}
    text-slate-700 dark:text-slate-300
  `;

    if (isLoggedIn) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <span className={userInfoClasses}>
                    <UserIcon className="w-4 h-4" />
                    {username}
                </span>
                <button
                    onClick={handleLogout}
                    className={`${logoutBtnClasses} ${sizeClasses[size]}`}
                    aria-label="退出登录"
                    type="button"
                >
                    <LogOutIcon className="w-4 h-4" />
                    退出
                </button>
            </div>
        );
    }

    return (
        <Link
            href={`/login?redirect=${redirectUrl}`} // 👈 关键修复
            className={`${loginBtnClasses} ${sizeClasses[size]} ${className}`}
            aria-label="前往登录页面"
        >
            <LogInIcon className="w-4 h-4" />
            {text}
        </Link>
    );
};

export default LoginButton;