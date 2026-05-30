"use client";

import { useState, createContext, useContext } from "react";
import { AppearanceSettingsPanel } from "./appearance-settings";

interface AppearanceSettingsContextType {
  openSettings: () => void;
}

const AppearanceSettingsContext = createContext<AppearanceSettingsContextType | undefined>(undefined);

export function useAppearanceSettings() {
  const context = useContext(AppearanceSettingsContext);
  if (context === undefined) {
    throw new Error("useAppearanceSettings must be used within an AppearanceSettingsManager");
  }
  return context;
}

// 全局外观设置管理器 - 在 layout 中使用
export function AppearanceSettingsManager({ children }: { children?: React.ReactNode }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  return (
    <AppearanceSettingsContext.Provider value={{ openSettings: () => setIsPanelOpen(true) }}>
      {children}
      
      {/* 面板 - 独立于导航栏的全局组件 */}
      <AppearanceSettingsPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </AppearanceSettingsContext.Provider>
  );
}
