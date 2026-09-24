"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Download,
  Activity,
  Users,
  Home,
  ChevronRight,
  Search,
  Settings,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import LoginButton from "@/components/login";
import { useAppearance } from "@/lib/appearance-context";
import { useAppearanceSettings } from "@/components/appearance-settings-container";

function useLockBody(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    const origin = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = origin;
    };
  }, [lock]);
}

const formatLabel = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const MotionLink = motion.create(Link);

function ExplorerBar() {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState(pathname);
  const [saying, setSaying] = useState("");
  const [displaySaying, setDisplaySaying] = useState("");
  const [isSayingLoading, setIsSayingLoading] = useState(true);
  const [isFlickering, setIsFlickering] = useState(false);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const typingTimer = useRef<NodeJS.Timeout | null>(null);
  const { settings } = useAppearance();

  const startTypingEffect = useCallback((text: string) => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
    setDisplaySaying("");
    let index = 0;
    const typeChar = () => {
      if (index < text.length) {
        setDisplaySaying((prev) => prev + text.charAt(index));
        index++;
        typingTimer.current = setTimeout(typeChar, 50 + Math.random() * 50);
      }
    };
    setTimeout(typeChar, 10);
  }, []);

  const fetchSaying = useCallback(async () => {
    setIsSayingLoading(true);
    setIsFlickering(true);
    setDisplaySaying("");

    let newSaying = "无法加载";
    try {
      const res = await fetch("https://uapis.cn/api/v1/saying");
      const data: { text?: string } = await res.json();
      newSaying = data?.text || "无法加载";
    } catch {
      newSaying = "无法加载";
    }

    setSaying(newSaying);
    setIsSayingLoading(false);
    setTimeout(() => {
      setIsFlickering(false);
      startTypingEffect(newSaying);
    }, 300);
  }, [startTypingEffect]);

  useEffect(() => {
    fetchSaying();
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, [fetchSaying]);

  const handleSayingClick = () => {
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      if (!isSayingLoading) fetchSaying();
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
      [{ href: "/", label: "首页" }],
    );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-12 items-center gap-4">
        {settings.showBreadcrumb && !editMode && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {crumbs.map((c, i) => (
              <motion.div
                key={c.href}
                onClick={() => router.push(c.href)}
                className={cn(
                  "flex items-center gap-1.5 transition-colors",
                  i === crumbs.length - 1
                    ? "font-medium text-foreground"
                    : "cursor-pointer hover:text-foreground",
                )}
                whileHover={{ scale: 1.03 }}
              >
                <span className="max-w-48 truncate">{c.label}</span>
                {i !== crumbs.length - 1 && (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {settings.showAddressBar && (
          <div className="relative max-w-2xl flex-1">
            {editMode ? (
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  onBlur={exitEdit}
                  className="h-9 w-full rounded-lg bg-secondary pr-4 pl-10 text-sm text-foreground shadow-sm transition-colors duration-200 focus:ring-2 focus:ring-ring/30 focus:outline-none"
                  autoFocus
                  placeholder="请输入内容"
                  type="text"
                />
              </div>
            ) : (
              <div
                className="relative flex h-9 w-full cursor-pointer items-center rounded-lg bg-secondary transition-colors duration-200 hover:bg-secondary/70"
                onClick={enterEdit}
              >
                <div className="absolute left-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Search className="h-4 w-4" />
                  <span>单击地址栏或按 Ctrl+L 输入路径</span>
                </div>
              </div>
            )}
          </div>
        )}

        {settings.showSaying && (
          <div
            onClick={handleSayingClick}
            className={`mx-auto max-w-[40%] cursor-pointer truncate py-2 text-center text-xs whitespace-normal text-muted-foreground transition-all hover:text-foreground ${isFlickering ? "animate-pulse opacity-50" : ""} `}
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
        )}
      </div>
    </div>
  );
}

export default ExplorerBar;

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { openSettings } = useAppearanceSettings();
  const { settings } = useAppearance();
  useLockBody(isMenuOpen);
  const navItems = [
    { href: "/", label: "网站首页", icon: Home },
    { href: "/downloads", label: "资源下载", icon: Download },
    { href: "/status", label: "服务状态", icon: Activity },
    { href: "/about", label: "关于我们", icon: Users },
    { href: "/ai", label: "AI客服", icon: Bot },
  ];

  return (
    <>
      <nav className="glass-nav sticky top-0 z-40" role="navigation" aria-label="主导航">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <MotionLink
              href="/"
              className="flex items-center space-x-2 rounded-xl px-3 py-2 hover:bg-secondary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              whileHover={{ scale: 1.03 }}
              aria-label="返回首页"
            >
              <img
                src="/EndlessPixel.png"
                alt="EndlessPixel Logo"
                className="h-8 w-64 object-contain"
              />
            </MotionLink>

            <div className="hidden items-center space-x-1 md:flex" role="menubar">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <MotionLink
                    key={item.href}
                    href={item.href}
                    role="menuitem"
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-w-20 flex-col items-center space-y-1 rounded-xl px-4 py-3 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                    )}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className={cn("h-5 w-5", isActive && "scale-110")} aria-hidden="true" />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="h-1 w-5 rounded-full bg-foreground/30 dark:bg-foreground/20"
                        layoutId="underline"
                        aria-hidden="true"
                      />
                    )}
                  </MotionLink>
                );
              })}
              <div className="mx-2 h-8 w-px bg-foreground/8" aria-hidden="true" />
              <button
                onClick={openSettings}
                className="flex h-11 w-11 items-center justify-center rounded-xl px-0 transition-colors duration-200 hover:bg-secondary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                aria-label="打开外观设置"
                aria-haspopup="dialog"
              >
                <Settings className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </button>
              {settings.showLoginButton && <LoginButton />}
            </div>

            <div className="flex items-center space-x-2 md:hidden">
              <button
                onClick={openSettings}
                className="flex h-11 w-11 items-center justify-center rounded-xl px-0 transition-colors duration-200 hover:bg-secondary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                aria-label="打开外观设置"
                aria-haspopup="dialog"
              >
                <Settings className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen((o) => !o)}
                className="h-11 w-11 rounded-xl p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 text-foreground" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5 text-foreground" aria-hidden="true" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden bg-secondary/50 md:block dark:bg-secondary/30">
          <ExplorerBar />
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              className="fixed top-0 right-0 left-0 z-50 rounded-b-2xl bg-background/90 shadow-lg backdrop-blur-xl md:hidden"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              role="menu"
              aria-label="移动端导航菜单"
            >
              <div className="space-y-1 px-4 pt-20 pb-6">
                {navItems.map((item, i) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <MotionLink
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        "flex items-center space-x-4 rounded-xl px-4 py-3 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/60",
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                      </div>
                    </MotionLink>
                  );
                })}
                {settings.showLoginButton && (
                  <div className="pt-2">
                    <LoginButton />
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
