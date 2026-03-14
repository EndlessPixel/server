'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, Activity, BookOpen, Users, Home, ChevronRight, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import LoginButton from '@/components/login';

function useLockBody(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    const origin = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = origin; };
  }, [lock]);
}

const formatLabel = (s: string) =>
  s.replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

const MotionLink = motion.create(Link);
function ExplorerBar() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(pathname);
  const [saying, setSaying] = useState("");
  const [displaySaying, setDisplaySaying] = useState(""); // 用于打字机效果的显示文本
  const [isSayingLoading, setIsSayingLoading] = useState(true);
  const [isFlickering, setIsFlickering] = useState(false); // 闪烁状态
  const clickTimer = useRef<NodeJS.Timeout | null>(null); // 防抖计时器
  const typingTimer = useRef<NodeJS.Timeout | null>(null); // 打字机计时器
  // 修复后的 fetchSaying 核心函数
  const fetchSaying = () => {
    setIsSayingLoading(true);
    setIsFlickering(true);
    // 第一步：请求开始时立即清空显示文本，而不是等异步回调
    setDisplaySaying("");

    fetch("https://uapis.cn/api/v1/saying")
      .then((res) => res.json())
      .then((data) => {
        const newSaying = data?.text || "无法加载";
        setSaying(newSaying);
      })
      .catch(() => {
        const errorSaying = "无法加载";
        setSaying(errorSaying);
      })
      .finally(() => {
        setIsSayingLoading(false);
        // 第二步：闪烁0.3秒后，先停止闪烁，再启动打字机（用最新的saying值）
        setTimeout(() => {
          setIsFlickering(false);
          // 这里用最新的saying，而不是回调里的临时变量，避免状态不一致
          startTypingEffect(saying);
        }, 300);
      });
  };

  // 优化打字机函数：确保每次启动前完全清空
  const startTypingEffect = (text: string) => {
    // 清除旧计时器
    if (typingTimer.current) clearTimeout(typingTimer.current);
    // 强制清空，确保无残留
    setDisplaySaying("");
    let index = 0;

    const typeChar = () => {
      if (index < text.length) {
        setDisplaySaying(prev => prev + text.charAt(index));
        index++;
        typingTimer.current = setTimeout(typeChar, 50 + Math.random() * 50);
      }
    };

    // 加一个极短的延迟，确保清空操作先完成，再开始打字
    setTimeout(typeChar, 10);
  };

  // 初始加载一言
  useEffect(() => {
    fetchSaying();

    // 清理计时器
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

  // 点击切换一言（带防抖）
  const handleSayingClick = () => {
    // 防抖控制：120RPM = 2次/秒，所以防抖间隔设为500ms
    if (clickTimer.current) clearTimeout(clickTimer.current);

    clickTimer.current = setTimeout(() => {
      if (!isSayingLoading) {
        fetchSaying();
      }
    }, 500);
  };

  useEffect(() => setInputValue(pathname), [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "l") {
        e.preventDefault();
        setEditMode(true);
        setTimeout(() => inputRef.current?.select(), 50);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const enterEdit = () => {
    setEditMode(true);
    setTimeout(() => inputRef.current?.select(), 50);
  };

  const exitEdit = () => setEditMode(false);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(inputValue.trim() || "/");
      exitEdit();
    }
    if (e.key === "Escape") {
      setInputValue(pathname);
      exitEdit();
    }
  };

  const crumbs = pathname
    .split("/")
    .filter(Boolean)
    .reduce<Array<{ href: string; label: string }>>(
      (acc, seg) => {
        const parent = acc.at(-1)?.href || "/";
        const href = (parent.endsWith("/") ? parent : parent + "/") + seg;
        acc.push({ href, label: formatLabel(seg) });
        return acc;
      },
      [{ href: "/", label: "首页" }]
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-14 flex items-center gap-4">

        {!editMode && (
          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
            {crumbs.map((c, i) => (
              <motion.div
                key={c.href}
                onClick={() => router.push(c.href)}
                className={cn(
                  "flex items-center gap-1.5 transition-colors",
                  i === crumbs.length - 1
                    ? "font-medium text-slate-900 dark:text-white"
                    : "cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
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

        <div className="flex-1 max-w-2xl relative">
          {editMode ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={exitEdit}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm"
                autoFocus
                placeholder="请输入内容"
                type="text"
              />
            </div>
          ) : (
            <div
              className="relative h-10 w-full rounded-xl bg-slate-100/80 dark:bg-slate-800/80 flex items-center cursor-pointer"
              onClick={enterEdit}
            >
              <div className="absolute left-4 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Search className="w-4 h-4" />
                <span>单击地址栏或按 Ctrl+L 输入路径</span>
              </div>
            </div>
          )}
        </div>
        <div
          onClick={handleSayingClick}
          className={`text-xs text-slate-400 dark:text-slate-500 truncate max-w-[40%] mx-auto py-2 text-center cursor-pointer transition-all hover:text-slate-600 dark:hover:text-slate-300 whitespace-normal
            ${isFlickering ? 'animate-pulse opacity-50' : ''}
          `}
        >
          {isSayingLoading ? (
            <span className="animate-pulse"></span>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {displaySaying || saying}
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExplorerBar;

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  useLockBody(isMenuOpen);
  const navItems = [
    { href: '/', label: '首页', icon: Home, description: '主页' },
    { href: '/downloads', label: '资源下载', icon: Download, description: '模组包/启动器下载' },
    { href: '/status', label: '状态查询', icon: Activity, description: '服务器状态' },
    { href: '/wiki', label: 'Wiki', icon: BookOpen, description: '服务器专属百科' },
    { href: '/about', label: '关于我们', icon: Users, description: '团队介绍' },
  ];

  return (
    <>
      <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40 shadow-md transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <MotionLink
              href="/"
              className="flex items-center space-x-2 py-2 px-3 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
              whileHover={{ scale: 1.03 }}
            >
              <img src="/EndlessPixel.png" alt="Logo" className="h-8 w-auto" />
            </MotionLink>

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
              <LoginButton />
            </div>

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
        <div className="hidden md:block border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50">
          <ExplorerBar />
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
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
                <br/>
                <LoginButton />
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
