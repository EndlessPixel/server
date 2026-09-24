"use client";

import { useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette, Type, Monitor, Moon, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppearance, type AppearanceSettings } from "@/lib/appearance-context";
import { cn } from "@/lib/utils";

interface AppearanceSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const THEME_OPTIONS = [
  { value: "light", label: "浅色", icon: Sun },
  { value: "dark", label: "深色", icon: Moon },
  { value: "system", label: "跟随系统", icon: Monitor },
] as const;

const FONT_OPTIONS = [
  { value: "default", label: "系统默认", example: "系统默认字体", fontFamily: undefined },
  {
    value: "noto-sans",
    label: "Noto Sans SC",
    example: "Noto Sans SC 示例",
    fontFamily: "'Noto Sans SC', sans-serif",
  },
  {
    value: "dengxian",
    label: "等线",
    example: "等线示例文字",
    fontFamily: "'DengXian', 'Microsoft YaHei', sans-serif",
  },
  {
    value: "chill-reunion",
    label: "ChillReunion",
    example: "ChillReunion 示例",
    fontFamily: "'ChillReunion Round', sans-serif",
  },
  {
    value: "fz-cuyuan",
    label: "黑糖话梅",
    example: "黑糖话梅示例文字",
    fontFamily: "'Black Sugar Plum Candy', '黑糖话梅', sans-serif",
  },
  {
    value: "hy-tangmeiren",
    label: "小赖字体 SC",
    example: "小赖字体 SC 示例文字",
    fontFamily: "'Xiaolai SC', '小赖字体 SC', sans-serif",
  },
] as const;

const ThemeOptions = memo(function ThemeOptions({
  currentTheme,
  onThemeChange,
}: {
  currentTheme: AppearanceSettings["theme"];
  onThemeChange: (theme: AppearanceSettings["theme"]) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {THEME_OPTIONS.map((option) => {
        const Icon = option.icon;
        const isActive = currentTheme === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onThemeChange(option.value)}
            aria-pressed={isActive}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl p-3 transition-all duration-200",
              isActive
                ? "bg-foreground text-background shadow-sm"
                : "bg-secondary text-muted-foreground hover:bg-secondary/70",
            )}
          >
            <Icon className="h-5 w-5" />
            <span className={cn("text-sm font-medium")}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
});

const FontOptions = memo(function FontOptions({
  currentFont,
  useCustomFont,
  onFontChange,
}: {
  currentFont: AppearanceSettings["customFont"];
  useCustomFont: boolean;
  onFontChange: (font: AppearanceSettings["customFont"]) => void;
}) {
  if (!useCustomFont) return null;
  return (
    <div className="space-y-2 pl-1">
      <Label className="text-sm text-muted-foreground">选择字体</Label>
      <div className="grid grid-cols-2 gap-2">
        {FONT_OPTIONS.map((font) => {
          const isActive = currentFont === font.value;
          return (
            <button
              key={font.value}
              onClick={() => onFontChange(font.value)}
              aria-pressed={isActive}
              className={cn(
                "flex flex-col items-start gap-1 rounded-xl p-3 transition-all duration-200",
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/70",
              )}
            >
              <span className="text-sm font-medium">{font.label}</span>
              <span
                className="w-full truncate text-xs"
                style={font.fontFamily ? { fontFamily: font.fontFamily } : undefined}
              >
                {font.example}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export const AppearanceSettingsPanel = memo(function AppearanceSettingsPanel({
  isOpen,
  onClose,
}: AppearanceSettingsPanelProps) {
  const { settings, updateSettings } = useAppearance();

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      document.documentElement.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleThemeChange = useCallback(
    (theme: AppearanceSettings["theme"]) => updateSettings({ theme }),
    [updateSettings],
  );
  const handleFontChange = useCallback(
    (font: AppearanceSettings["customFont"]) => updateSettings({ customFont: font }),
    [updateSettings],
  );
  const createToggleHandler = useCallback(
    (key: keyof typeof settings) => (checked: boolean) => {
      updateSettings({ [key]: checked });
    },
    [updateSettings],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md overflow-y-auto bg-card shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                  <Palette className="h-5 w-5 text-muted-foreground" /> 外观设置
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-9 w-9 rounded-xl p-0 hover:bg-secondary/60"
                  aria-label="关闭"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-foreground">主题模式</Label>
                  <ThemeOptions currentTheme={settings.theme} onThemeChange={handleThemeChange} />
                </div>

                <div className="h-px bg-foreground/6" />

                <div className="space-y-4">
                  <Label className="text-base font-semibold text-foreground">显示选项</Label>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">地址栏输入框</Label>
                      <p className="text-xs text-muted-foreground">
                        显示地址栏输入框，用于快速导航页面输入
                      </p>
                    </div>
                    <Switch
                      checked={settings.showAddressBar}
                      onCheckedChange={createToggleHandler("showAddressBar")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">面包屑导航</Label>
                      <p className="text-xs text-muted-foreground">
                        显示页面路径导航（首页 / 资源 / ...）
                      </p>
                    </div>
                    <Switch
                      checked={settings.showBreadcrumb}
                      onCheckedChange={createToggleHandler("showBreadcrumb")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">登录按钮</Label>
                      <p className="text-xs text-muted-foreground">显示用户登录/退出按钮</p>
                    </div>
                    <Switch
                      checked={settings.showLoginButton}
                      onCheckedChange={createToggleHandler("showLoginButton")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">一言</Label>
                      <p className="text-xs text-muted-foreground">显示随机名言警句</p>
                    </div>
                    <Switch
                      checked={settings.showSaying}
                      onCheckedChange={createToggleHandler("showSaying")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">AI 客服按钮</Label>
                      <p className="text-xs text-muted-foreground">显示右下角 AI 客服入口</p>
                    </div>
                    <Switch
                      checked={settings.showAIChat}
                      onCheckedChange={createToggleHandler("showAIChat")}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">返回顶部按钮</Label>
                      <p className="text-xs text-muted-foreground">显示滚动到顶部的快捷按钮</p>
                    </div>
                    <Switch
                      checked={settings.showBackToTop}
                      onCheckedChange={createToggleHandler("showBackToTop")}
                    />
                  </div>
                </div>

                <div className="h-px bg-foreground/6" />

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <Sparkles className="h-4 w-4 text-muted-foreground" /> 特效设置
                  </Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">鼠标轨迹效果</Label>
                      <p className="text-xs text-muted-foreground">
                        显示鼠标移动时的彩色轨迹和粒子特效
                      </p>
                    </div>
                    <Switch
                      checked={settings.showMouseTrail}
                      onCheckedChange={createToggleHandler("showMouseTrail")}
                    />
                  </div>
                </div>

                <div className="h-px bg-foreground/6" />

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-base font-semibold text-foreground">
                    <Type className="h-4 w-4 text-muted-foreground" /> 字体设置
                  </Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">启用自定义字体</Label>
                      <p className="text-xs text-muted-foreground">使用选择的字体显示内容</p>
                    </div>
                    <Switch
                      checked={settings.useCustomFont}
                      onCheckedChange={createToggleHandler("useCustomFont")}
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
});
