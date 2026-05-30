"use client";

import { useEffect } from "react";
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

// 设置面板组件 - 独立的全局面板
interface AppearanceSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppearanceSettingsPanel({ isOpen, onClose }: AppearanceSettingsPanelProps) {
  const { settings, updateSettings } = useAppearance();

  // 当面板打开或关闭动画进行时，锁定 body 的横向滚动
  useEffect(() => {
    // 立即添加类以防止溢出
    document.body.classList.add('overflow-x-hidden');
    document.documentElement.classList.add('overflow-x-hidden');
    
    let timer: NodeJS.Timeout | null = null;
    
    if (!isOpen) {
      // 如果面板已关闭，设置定时器移除类
      timer = setTimeout(() => {
        document.body.classList.remove('overflow-x-hidden');
        document.documentElement.classList.remove('overflow-x-hidden');
      }, 350);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* 遮罩层 */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            {/* 设置面板 */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-60 overflow-y-auto"
              style={{ maxWidth: '28rem' }}
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
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "light", label: "浅色", icon: Sun },
                        { value: "dark", label: "深色", icon: Moon },
                        { value: "system", label: "跟随系统", icon: Monitor },
                      ].map((option) => {
                        const Icon = option.icon;
                        const isActive = settings.theme === option.value;
                        return (
                          <button
                            key={option.value}
                            onClick={() => updateSettings({ theme: option.value as any })}
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
                          显示页面导航路径和搜索框
                        </p>
                      </div>
                      <Switch
                        checked={settings.showAddressBar}
                        onCheckedChange={(checked) => updateSettings({ showAddressBar: checked })}
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
                        onCheckedChange={(checked) => updateSettings({ showSaying: checked })}
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
                        onCheckedChange={(checked) => updateSettings({ showAIChat: checked })}
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
                        onCheckedChange={(checked) => updateSettings({ showBackToTop: checked })}
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
                        onCheckedChange={(checked) => updateSettings({ useCustomFont: checked })}
                      />
                    </div>

                    {settings.useCustomFont && (
                      <div className="space-y-2 pl-1">
                        <Label className="text-sm text-slate-600 dark:text-slate-400">选择字体</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { value: "default", label: "系统默认"},
                            { value: "noto-sans", label: "Noto Sans SC"},
                            { value: "songti", label: "宋体"},
                            { value: "chill-reunion", label: "ChillReunion"},
                          ].map((font) => {
                            const isActive = settings.customFont === font.value;
                            return (
                              <button
                                key={font.value}
                                onClick={() => updateSettings({ customFont: font.value as any })}
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
                                  style={{
                                    fontFamily: 
                                      font.value === "noto-sans" ? "'Noto Sans SC', sans-serif" :
                                      font.value === "songti" ? "'SimSun', 'STSong', serif" :
                                      font.value === "chill-reunion" ? "'ChillReunion Round', sans-serif" :
                                      undefined
                                  }}
                                >
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
