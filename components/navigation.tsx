"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download, Activity, BookOpen, Users, Sparkles, Home, ChevronRight, LogOut, User, Search } from "lucide-react";

// 工具函数：处理面包屑标签格式化
const formatBreadcrumbLabel = (label: string) => {
  if (label === "") return "首页";
  // 首字母大写，替换连字符为空格
  return label.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
};

// 创建 motion 版本的 Link 组件
const MotionLink = motion(Link);

function ExplorerBar() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  // 兼容 Pages Router 和 App Router
  const asPath = (router as any)?.asPath ?? pathname ?? "/";

  const [value, setValue] = useState(asPath);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setValue(asPath);
  }, [asPath]);

  // 生成面包屑
  const parts = (asPath || "/").split("/").filter(Boolean);
  const crumbs: Array<{ href: string; label: string }> = [
    { href: "/", label: "首页" },
  ];

  let acc = "";
  parts.forEach((p: string) => {
    acc += `/${p}`;
    crumbs.push({ href: acc, label: formatBreadcrumbLabel(p) });
  });

  // 处理回车导航
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = value.trim() || "/";
      router.push(target);
    }
  };

  // 点击面包屑项时聚焦地址栏
  const handleCrumbClick = (href: string) => {
    router.push(href);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-14 flex items-center gap-4">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300 overflow-hidden">
          {crumbs.map((c, i) => (
            <motion.div
              key={c.href}
              onClick={() => handleCrumbClick(c.href)}
              className={`flex items-center gap-1.5 transition-all duration-300 ${i === crumbs.length - 1
                ? "font-medium text-slate-900 dark:text-white cursor-default"
                : "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="truncate max-w-48">{c.label}</span>
              {i !== crumbs.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              )}
            </motion.div>
          ))}
        </div>

        {/* 地址栏 */}
        <motion.div
          className={`ml-2 flex-1 relative transition-all duration-300 ${isFocused ? "scale-[1.01]" : ""
            }`}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            ref={inputRef}
            aria-label="资源地址栏"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`pl-10 pr-4 py-2 w-full max-w-2xl text-sm rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 dark:focus:border-blue-600 shadow-sm transition-all duration-300`}
            title="按 Enter 导航到输入路径"
            placeholder="输入路径导航..."
          />
          {/* 聚焦状态下的渐变光晕 */}
          <motion.div
            className="absolute inset-0 rounded-xl pointer-events-none opacity-0 blur-md"
            style={{
              background: "linear-gradient(90deg, rgba(59,130,246,0.2), rgba(14,165,233,0.2))",
            }}
            animate={{ opacity: isFocused ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // 导航项配置
  const navItems = [
    { href: "/", label: "首页", icon: Home, description: "返回主页" },
    { href: "/downloads", label: "资源下载", icon: Download, description: "模组包下载" },
    { href: "/status", label: "状态查询", icon: Activity, description: "服务器状态" },
    { href: "/wiki", label: "Wiki", icon: BookOpen, description: "游戏百科" },
    { href: "/about", label: "关于我们", icon: Users, description: "团队介绍" },
  ];

  // 点击外部关闭移动端菜单
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node) && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-50 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo 区域 */}
          <MotionLink
            href="/"
            className="flex items-center space-x-2 py-2 px-3 rounded-xl transition-all duration-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 group"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              {/* Logo 背景渐变光晕 */}
              <motion.div
                className="absolute inset-0 rounded-lg bg-linear-to-r from-blue-400/20 to-cyan-400/20 blur-md"
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              {/* Logo 图片 */}
              <img
                src="/EndlessPixel.png"
                alt="EndlessPixel Logo"
                className="h-8 w-auto relative z-10"
              />
            </div>
          </MotionLink>

          {/* 桌面端导航 */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNavItem === item.href;

              return (
                <MotionLink
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center space-y-1 px-4 py-3 rounded-xl transition-all duration-300 min-w-20 ${isActive
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-900/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                    }`}
                  title={item.description}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* 导航图标 */}
                  <motion.div
                    className={`p-1.5 rounded-lg ${isActive ? "bg-blue-100/80 dark:bg-blue-900/30" : ""
                      }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"
                        }`}
                    />
                  </motion.div>
                  {/* 导航文字 */}
                  <span className="text-sm font-medium">{item.label}</span>

                  {/* 活性状态指示器 */}
                  <motion.div
                    className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 h-1 rounded-full bg-blue-500 transition-all duration-300 ${isActive ? "w-6" : "w-0"
                      }`}
                    animate={{
                      width: isActive ? "24px" : "0px",
                      opacity: isActive ? 1 : 0
                    }}
                  />
                </MotionLink>
              );
            })}
            {/* 分隔线 */}
            <div className="w-px h-8 bg-slate-200/70 dark:bg-slate-700/70 mx-2"></div>
            {/* 主题切换按钮 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className="pl-1">
                <ThemeToggle />
              </div>
            </motion.div>
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center space-x-2">
            {/* 主题切换 */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ThemeToggle />
            </motion.div>

            {/* 菜单按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-11 w-11 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
            >
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? (
                  <X className="w-5.5 h-5.5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Menu className="w-5.5 h-5.5 text-slate-700 dark:text-slate-300" />
                )}
              </motion.span>
            </Button>
          </div>
        </div>

        {/* 移动端菜单 */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              className="md:hidden absolute top-17 left-0 right-0 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-xl z-40"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="px-4 pt-3 pb-6 space-y-1">

                {/* 移动端导航项 */}
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = activeNavItem === item.href;

                  return (
                    <MotionLink
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                        : "text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      onClick={() => setIsMenuOpen(false)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`p-2 rounded-lg ${isActive
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-base font-medium">{item.label}</span>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                      <Sparkles className="w-4 h-4 text-slate-300 dark:text-slate-600 ml-auto" />
                    </MotionLink>
                  );
                })}

                {/* 移动端底部信息 */}
                <motion.div
                  className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-center text-xs text-slate-500 dark:text-slate-400 px-4">
                    <p>EndlessPixel Minecraft Server</p>
                    <p className="mt-1">版本 1.21.10 | 由热爱创造，为玩家而生</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 桌面端地址栏（ExplorerBar） */}
      <div className="hidden md:block border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm transition-all duration-300">
        <ExplorerBar />
      </div>
    </nav>
  );
}