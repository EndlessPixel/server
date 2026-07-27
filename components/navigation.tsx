"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
  Settings
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

const formatLabel = (s: string) =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

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

  const fetchSaying = () => {
    setIsSayingLoading(true);
    setIsFlickering(true);
    setDisplaySaying("");

    fetch("https://uapis.cn/api/v1/saying")
      .then((res) => res.json())
      .then((data) => {
        const newSaying = data?.text || "无法加载";
        setSaying(newSaying);
      })
      .catch(() => {
        setSaying("无法加载");
      })
      .finally(() => {
        setIsSayingLoading(false);
        setTimeout(() => {
          setIsFlickering(false);
          startTypingEffect(saying);
        }, 300);
      });
  };

  const startTypingEffect = (text: string) => {
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
  };

  useEffect(() => {
    fetchSaying();
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      if (typingTimer.current) clearTimeout(typingTimer.current);
    };
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="h-12 flex items-center gap-4">
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
                <span className="truncate max-w-48">{c.label}</span>
                {i !== crumbs.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {settings.showAddressBar && (
          <div className="flex-1 max-w-2xl relative">
            {editMode ? (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  onBlur={exitEdit}
                  className="w-full h-9 pl-10 pr-4 rounded-lg bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30 shadow-sm transition-colors duration-200"
                  autoFocus
                  placeholder="请输入内容"
                  type="text"
                />
              </div>
            ) : (
              <div
                className="relative h-9 w-full rounded-lg bg-secondary flex items-center cursor-pointer transition-colors duration-200 hover:bg-secondary/70"
                onClick={enterEdit}
              >
                <div className="absolute left-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Search className="w-4 h-4" />
                  <span>单击地址栏或按 Ctrl+L 输入路径</span>
                </div>
              </div>
            )}
          </div>
        )}

        {settings.showSaying && (
          <div
            onClick={handleSayingClick}
            className={`text-xs text-muted-foreground truncate max-w-[40%] mx-auto py-2 text-center cursor-pointer transition-all hover:text-foreground whitespace-normal
              ${isFlickering ? "animate-pulse opacity-50" : ""}
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
    { href: "/", label: "首页", icon: Home },
    { href: "/downloads", label: "资源", icon: Download },
    { href: "/status", label: "状态", icon: Activity },
    { href: "/about", label: "关于", icon: Users },
  ];

  return (
    <>
      <nav
        className="glass-nav sticky top-0 z-40"
        role="navigation"
        aria-label="主导航"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <MotionLink
              href="/"
              className="flex items-center space-x-2 py-2 px-3 rounded-xl hover:bg-secondary/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              whileHover={{ scale: 1.03 }}
              aria-label="返回首页"
            >
              <img
                src="/EndlessPixel.png"
                alt="EndlessPixel Logo"
                className="w-64 h-8 object-contain"
              />
            </MotionLink>

            <div
              className="hidden md:flex items-center space-x-1"
              role="menubar"
            >
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
                      "flex flex-col items-center space-y-1 px-4 py-3 rounded-xl min-w-20 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                      isActive
                        ? "text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                    )}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon
                      className={cn("w-5 h-5", isActive && "scale-110")}
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        className="w-5 h-1 rounded-full bg-foreground/30 dark:bg-foreground/20"
                        layoutId="underline"
                        aria-hidden="true"
                      />
                    )}
                  </MotionLink>
                );
              })}
              <div
                className="w-px h-8 bg-foreground/8 mx-2"
                aria-hidden="true"
              />
              <button
                onClick={openSettings}
                className="w-11 h-11 px-0 rounded-xl hover:bg-secondary/60 flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                aria-label="打开外观设置"
                aria-haspopup="dialog"
              >
                <Settings
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </button>
              {settings.showLoginButton && <LoginButton />}
            </div>

            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={openSettings}
                className="w-11 h-11 px-0 rounded-xl hover:bg-secondary/60 flex items-center justify-center transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                aria-label="打开外观设置"
                aria-haspopup="dialog"
              >
                <Settings
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen((o) => !o)}
                className="h-11 w-11 p-0 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMenuOpen ? (
                  <X
                    className="w-5 h-5 text-foreground"
                    aria-hidden="true"
                  />
                ) : (
                  <Menu
                    className="w-5 h-5 text-foreground"
                    aria-hidden="true"
                  />
                )}
              </Button>
            </div>
          </div>
        </div>
        <div className="hidden md:block bg-secondary/50 dark:bg-secondary/30">
          <ExplorerBar />
        </div>
      </nav>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-hidden="true"
            />
            <motion.div
              id="mobile-menu"
              className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-xl z-50 md:hidden rounded-b-2xl shadow-lg"
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              role="menu"
              aria-label="移动端导航菜单"
            >
              <div className="px-4 pt-20 pb-6 space-y-1">
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
                        "flex items-center space-x-4 px-4 py-3 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 transition-colors duration-200",
                        isActive
                          ? "text-foreground bg-secondary"
                          : "text-muted-foreground hover:bg-secondary/60",
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                      <div>
                        <div className="font-medium">{item.label}</div>
                      </div>
                    </MotionLink>
                  );
                })}
                <br />
                {settings.showLoginButton && <LoginButton />}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}