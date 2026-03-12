"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
  }
  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-11 h-11 px-0" disabled aria-label="切换主题">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    )
  }
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleThemeChange}
      className="w-11 h-11 px-0 active:bg-accent/80"
      aria-label="切换主题"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">切换主题</span>
    </Button>
  )
}
