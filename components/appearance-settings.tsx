"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Palette, Type, Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppearance } from "@/lib/appearance-context";
import { cn } from "@/lib/utils";

// 设置按钮组件 - 只负责触发打开
export function AppearanceSettingsButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="w-11 h-11 px-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
      aria-label="外观设置"
    >
      <Settings className="h-5 w-5 text-slate-700 dark:text-slate-300" />
    </Button>
  );
}

// 主题选项组件
function ThemeOptions({ currentTheme, onThemeChange }: { currentTheme: string; onThemeChange: (theme: string) => void }) {
  const options = [
    { value: "light", label: "浅色", icon: Sun },
    { value: "dark", label: "深色", icon: Moon },
    { value: "system", label: "跟随系统", icon: Monitor },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = currentTheme === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onThemeChange(option.value)}
            className={cn(
              "flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
              isActive
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500"
              )}
            />
            <span
              className={cn(
                "text-sm",
                isActive ? "text-blue-600 dark:text-blue-400 font-medium" : "text-slate-600 dark:text-slate-400"
              )}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// 字体选项组件
function FontOptions({ currentFont, useCustomFont, onFontChange }: { currentFont: string; useCustomFont: boolean; onFontChange: (font: string) => void }) {
  const fonts = [
    { value: "default", label: "系统默认", example: "系统默认字体" },
    { value: "noto-sans", label: "Noto Sans SC", example: "Noto Sans SC 示例", fontFamily: "'Noto Sans SC', sans-serif" },
    { value: "songti", label: "宋体", example: "宋体示例文字", fontFamily: "'SimSun', 'STSong', serif" },
    { value: "dengxian", label: "等线", example: "等线示例文字", fontFamily: "'DengXian', 'Microsoft YaHei', sans-serif" },
    { value: "kaiti", label: "楷体", example: "楷体示例文字", fontFamily: "'KaiTi', 'STKaiti', serif" },
    { value: "chill-reunion", label: "ChillReunion", example: "ChillReunion 示例", fontFamily: "'ChillReunion Round', sans-serif" },
  ];

  if (!useCustomFont) return null;

  return (
    <div className="space-y-2 pl-1">
      <Label className="text-sm text-slate-600 dark:text-slate-400">选择字体</Label>
      <div className="grid grid-cols-2 gap-2">
        {fonts.map((font) => {
          const isActive = currentFont === font.value;
          return (
            <button
              key={font.value}
              onClick={() => onFontChange(font.value)}
              className={cn(
                "flex flex-col items-start gap-1 p-3 rounded-lg border-2 transition-all",
                isActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
              )}
            >
              <span
                className={cn(
                  "text-sm font-medium",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"
                )}
              >
                {font.label}
              </span>
              <span
                className="text-xs text-slate-500 dark:text-slate-400 truncate w-full"
                style={{ fontFamily: font.fontFamily }}
              >
                {font.example}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 设置面板组件
export function AppearanceSettingsPanel({ isOpen, onClose }: AppearanceSettingsPanelProps) {
  const { settings, updateSettings } = useAppearance();

  // 锁定/解锁 body 滚动（仅在面板打开时锁定）
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      document.documentElement.classList.add("overflow-hidden");
      
      const timer = setTimeout(() => {
        document.body.classList.remove("overflow-hidden");
        document.documentElement.classList.remove("overflow-hidden");
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ESC 键关闭面板
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleThemeChange = useCallback((theme: string) => {
    updateSettings({ theme: theme as any });
  }, [updateSettings]);

  const handleFontChange = useCallback((font: string) => {
    updateSettings({ customFont: font as any });
  }, [updateSettings]);

  const toggleSetting = useCallback((key: keyof typeof settings, value: boolean) => {
    updateSettings({ [key]: value });
  }, [updateSettings]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* 设置面板 */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  外观设置
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* 主题设置 */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-slate-900 dark:text-white">
                    主题模式
                  </Label>
                  <ThemeOptions currentTheme={settings.theme} onThemeChange={handleThemeChange} />
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-700" />

                {/* 显示选项 */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold text-slate-900 dark:text-white">
                    显示选项
                  </Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">地址栏和输入框</Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        显示页面导航搜索框
                      </p>
                    </div>
                    <Switch
                      checked={settings.showAddressBar}
                      onCheckedChange={(checked) => toggleSetting("showAddressBar", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">一言</Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        显示随机名言警句
                      </p>
                    </div>
                    <Switch
                      checked={settings.showSaying}
                      onCheckedChange={(checked) => toggleSetting("showSaying", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">AI 客服按钮</Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        显示右下角 AI 客服入口
                      </p>
                    </div>
                    <Switch
                      checked={settings.showAIChat}
                      onCheckedChange={(checked) => toggleSetting("showAIChat", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">返回顶部按钮</Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        显示滚动到顶部的快捷按钮
                      </p>
                    </div>
                    <Switch
                      checked={settings.showBackToTop}
                      onCheckedChange={(checked) => toggleSetting("showBackToTop", checked)}
                    />
                  </div>
                </div>

                <div className="h-px bg-slate-200 dark:bg-slate-700" />

                {/* 字体设置 */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    字体设置
                  </Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">启用自定义字体</Label>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        使用选择的字体显示内容
                      </p>
                    </div>
                    <Switch
                      checked={settings.useCustomFont}
                      onCheckedChange={(checked) => toggleSetting("useCustomFont", checked)}
                    />
                  </div>

                  <FontOptions
                    currentFont={settings.customFont}
                    useCustomFont={settings.useCustomFont}
                    onFontChange={handleFontChange}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface AppearanceSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}