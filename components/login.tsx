// components/login.tsx
"use client";
import { LogOutIcon, LogInIcon } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface LoginButtonProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  text = "登录",
  size = "md",
  className = "",
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("/");

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || "";
    return "";
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  useEffect(() => {
    setRedirectUrl(
      encodeURIComponent(window.location.pathname + window.location.search),
    );
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkLoginStatus = () => {
      const user = getCookie("mc_user");
      if (user) {
        setIsLoggedIn(true);
        setUsername(user);
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    // 清除前端显示态
    deleteCookie("mc_user");
    setIsLoggedIn(false);
    setUsername("");
    // 清除服务端 HttpOnly 签名会话 cookie
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // 忽略网络错误，前端态已清理
    }
    window.location.reload();
  };

  const sizeClasses = React.useMemo(
    () => ({
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-2.5 text-base",
    }),
    [],
  );

  const loginBtnClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-xl
    bg-foreground text-background
    hover:bg-foreground/90 shadow-sm
    transition-all duration-200 ease-out
    hover-lift
  `;

  const logoutBtnClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-xl
    bg-secondary text-secondary-foreground
    hover:bg-secondary/70
    transition-colors duration-200
  `;

  if (isLoggedIn) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Link
          href="/profile"
          className={`
          inline-flex items-center gap-2 rounded-xl
          ${sizeClasses[size]}
          bg-secondary
          hover:bg-secondary/70
          text-secondary-foreground
          transition-colors duration-200
          cursor-pointer
        `}
          title="进入个人中心"
        >
          <div className="w-6 h-6 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-semibold shrink-0">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="max-w-25 truncate">{username}</span>
        </Link>

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
      href={`/login?redirect=${redirectUrl}`}
      className={`${loginBtnClasses} ${sizeClasses[size]} ${className}`}
      aria-label="前往登录页面"
    >
      <LogInIcon className="w-4 h-4" />
      {text}
    </Link>
  );
};

export default LoginButton;
