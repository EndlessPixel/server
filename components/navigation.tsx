"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Menu, X, Server, Download, Activity, BookOpen, Users, Sparkles, Home } from "lucide-react"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "首页", icon: Home, description: "返回主页" },
    { href: "/downloads", label: "资源下载", icon: Download, description: "模组包下载" },
    { href: "/status", label: "状态查询", icon: Activity, description: "服务器状态" },
    { href: "/wiki", label: "Wiki", icon: BookOpen, description: "游戏百科" },
    { href: "/about", label: "关于我们", icon: Users, description: "团队介绍" },
  ]

  const [user, setUser] = useState<{ login?: string; name?: string; avatar_url?: string } | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ep_user")
      if (raw) setUser(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [])

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 py-2 px-3 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Server className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                EndlessPixel
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 -mt-1">Minecraft Server</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center space-y-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 group relative min-w-[80px]"
                  title={item.description}
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium">{item.label}</span>

                  {/* Active indicator */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-transparent group-hover:bg-blue-500 rounded-full transition-colors duration-200"></div>
                </Link>
              )
            })}
            {/* Separator */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

            {/* 如果检测到已登录用户，显示头像/姓名与登出；否则显示登录按钮 */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/users/home" className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                  {user.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">EP</div>
                  )}
                  <span className="hidden sm:inline">{user.name || user.login}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    try {
                      localStorage.removeItem("ep_user")
                    } catch (e) {}
                    // reload to reflect changes
                    window.location.reload()
                  }}
                  className="text-sm"
                >
                  登出
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 py-2 px-4 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 group relative min-w-[80px]">
                <a href="/users/login" className="flex items-center justify-center h-full w-full">
                  登录
                </a>
              </Button>
            )}

            {/* Separator */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

            {/* Theme Toggle */}
            <div className="pl-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-11 w-11 p-0 relative"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-4 px-4 py-4 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 active:bg-slate-200 dark:active:bg-slate-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <span className="text-base font-medium">{item.label}</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <Sparkles className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                  </Link>
                )
              })}

              {/* Mobile Footer */}
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="text-center text-xs text-slate-500 dark:text-slate-400 px-4">
                  <p>EndlessPixel Minecraft Server</p>
                  <p className="mt-1">由热爱创造，为玩家而生</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}