// Navigation.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Download, Activity, BookOpen, Users,
  Home, ChevronRight, Search, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils'; // tailwind 合并工具
import { Skeleton } from '@/components/ui/skeleton';

/* ------------------------------------------------------------------ */
/* 锁滚动 hook                                                         */
/* ------------------------------------------------------------------ */
function useLockBody(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    const origin = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = origin; };
  }, [lock]);
}

/* ------------------------------------------------------------------ */
/* 面包屑文字格式化                                                    */
/* ------------------------------------------------------------------ */
const formatLabel = (s: string) =>
  s.replace(/-/g, ' ')
   .replace(/\b\w/g, c => c.toUpperCase());

/* ------------------------------------------------------------------ */
/* MotionLink 组件                                                     */
/* ------------------------------------------------------------------ */
const MotionLink = motion(Link);

/* ================================================================== */
/* ExplorerBar —— 地址栏                                               */
/* ================================================================== */
function ExplorerBar() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  /* 双模式状态 ------------------------------------------------------- */
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(pathname);

  /* 同步路由变化 ----------------------------------------------------- */
  useEffect(() => setInputValue(pathname), [pathname]);

  /* 快捷键聚焦 ------------------------------------------------------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        setEditMode(true);
        setTimeout(() => inputRef.current?.select(), 50);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* 进入编辑模式 ----------------------------------------------------- */
  const enterEdit = () => {
    setEditMode(true);
    setTimeout(() => inputRef.current?.select(), 50);
  };

  /* 退出编辑 --------------------------------------------------------- */
  const exitEdit = () => setEditMode(false);

  /* 回车导航 --------------------------------------------------------- */
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      router.push(inputValue.trim() || '/');
      exitEdit();
    }
    if (e.key === 'Escape') {
      setInputValue(pathname);
      exitEdit();
    }
  };

  /* 面包屑生成 ------------------------------------------------------- */
  const crumbs = pathname
    .split('/')
    .filter(Boolean)
    .reduce<Array<{ href: string; label: string }>>(
      (acc, seg) => {
        const href = `${acc.at(-1)?.href || ''}/${seg}`;
        acc.push({ href, label: formatLabel(seg) });
        return acc;
      },
      [{ href: '/', label: '首页' }]
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-14 flex items-center gap-4">
        {/* 面包屑（跳转模式） */}
        {!editMode && (
          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
            {crumbs.map((c, i) => (
              <motion.div
                key={c.href}
                onClick={() => router.push(c.href)}
                className={cn(
                  'flex items-center gap-1.5 transition-colors',
                  i === crumbs.length - 1
                    ? 'font-medium text-slate-900 dark:text-white'
                    : 'cursor-pointer hover:text-blue-600 dark:hover:text-blue-400'
                )}
                whileHover={{ scale: 1.03 }}
              >
                <span className="truncate max-w-48">{c.label}</span>
                {i !== crumbs.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* 地址栏（编辑模式） */}
        <div className={cn('flex-1 max-w-2xl', editMode && 'max-w-4xl')}>
          {editMode ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={exitEdit}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                autoFocus
              />
            </div>
          ) : (
            <Skeleton className="h-10 w-full rounded-xl" onClick={enterEdit}>
              <div className="h-full flex items-center px-4 text-slate-500 dark:text-slate-400 text-sm">
                单击地址栏或按 Ctrl+L 输入路径
            </div>
            </Skeleton>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* Navigation —— 主导航                                                */
/* ================================================================== */
export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  useLockBody(isMenuOpen);

  const navItems = [
  { href: '/', label: '首页', icon: Home, description: '返回主页' },
  { href: '/downloads', label: '资源下载', icon: Download, description: '模组包下载' },
  { href: '/status', label: '状态查询', icon: Activity, description: '服务器状态' },
  { href: '/wiki', label: 'Wiki', icon: BookOpen, description: '游戏百科' },
  { href: '/about', label: '关于我们', icon: Users, description: '团队介绍' }
];

  return (
    <>
      <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40 shadow-md transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <MotionLink
              href="/"
              className="flex items-center space-x-2 py-2 px-3 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
              whileHover={{ scale: 1.03 }}
            >
              <img src="/EndlessPixel.png" alt="Logo" className="h-8 w-auto" />
            </MotionLink>

            {/* 桌面导航 */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <MotionLink
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex flex-col items-center space-y-1 px-4 py-3 rounded-xl min-w-20 transition-colors',
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50/70 dark:bg-blue-900/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                    )}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className={cn('w-5 h-5', isActive && 'scale-110')} />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="w-5 h-1 rounded-full bg-blue-500"
                        layoutId="underline"
                      />
                    )}
                  </MotionLink>
                );
              })}
              <div className="w-px h-8 bg-slate-200/70 dark:bg-slate-700/70 mx-2" />
              <ThemeToggle />
            </div>

            {/* 移动端按钮 */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen((o) => !o)}
                className="h-11 w-11 p-0 rounded-full"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 地址栏（桌面端） */}
        <div className="hidden md:block border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50">
          <ExplorerBar />
        </div>
      </nav>

      {/* 移动端菜单 + 遮罩 */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* 遮罩 */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* 菜单面板 */}
            <motion.div
              className="fixed top-0 left-0 right-0 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 z-50 md:hidden"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="px-4 pt-20 pb-6 space-y-1">
                {navItems.map((item, i) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <MotionLink
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-4 px-4 py-3 rounded-xl',
                        isActive
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{item.description}</div>
                      </div>
                    </MotionLink>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}