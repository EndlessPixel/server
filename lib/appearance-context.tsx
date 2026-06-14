"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type FontOption =
  | "default"
  | "noto-sans"
  | "songti"
  | "dengxian"
  | "kaiti"
  | "chill-reunion"
  | "fz-cuyuan"
  | "hy-tangmeiren";

interface AppearanceSettings {
  showAddressBar: boolean;
  showSaying: boolean;
  showAIChat: boolean;
  showBackToTop: boolean;
  theme: "light" | "dark" | "system";
  useCustomFont: boolean;
  customFont: FontOption;
}

interface AppearanceContextType {
  settings: AppearanceSettings;
  updateSettings: (updates: Partial<AppearanceSettings>) => void;
}

const defaultSettings: AppearanceSettings = {
  showAddressBar: true,
  showSaying: true,
  showAIChat: true,
  showBackToTop: true,
  theme: "system",
  useCustomFont: false,
  customFont: "default",
};

const AppearanceContext = createContext<AppearanceContextType | undefined>(
  undefined,
);

export function AppearanceProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // 从 localStorage 加载设置
  useEffect(() => {
    try {
      const saved = localStorage.getItem("appearance-settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error("Failed to load appearance settings:", error);
    }
    setIsLoaded(true);
  }, []);

  // 保存设置到 localStorage
  const updateSettings = (updates: Partial<AppearanceSettings>) => {
    setSettings((prev) => {
      const newSettings = { ...prev, ...updates };
      try {
        localStorage.setItem(
          "appearance-settings",
          JSON.stringify(newSettings),
        );
      } catch (error) {
        console.error("Failed to save appearance settings:", error);
      }
      return newSettings;
    });
  };

  // 应用主题
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;

    if (settings.theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const updateTheme = () => {
        root.classList.toggle("dark", mediaQuery.matches);
      };
      updateTheme();
      mediaQuery.addEventListener("change", updateTheme);
      return () => mediaQuery.removeEventListener("change", updateTheme);
    } else {
      root.classList.toggle("dark", settings.theme === "dark");
    }
  }, [settings.theme, isLoaded]);

  // 应用自定义字体
  useEffect(() => {
    if (!isLoaded) return;

    const body = document.body;

    // 移除所有字体类
    body.classList.remove(
      "font-noto-sans",
      "font-songti",
      "font-dengxian",
      "font-kaiti",
      "font-chill-reunion",
      "font-fz-cuyuan",
      "font-hy-tangmeiren",
    );

    if (settings.useCustomFont) {
      switch (settings.customFont) {
        case "noto-sans":
          // 使用 Next.js 注入的 CSS 变量
          body.style.fontFamily =
            "var(--font-noto-sans-sc), 'Microsoft YaHei', sans-serif";
          body.classList.add("font-noto-sans");
          break;
        case "songti":
          body.style.fontFamily = "'SimSun', 'STSong', '宋体', serif";
          body.classList.add("font-songti");
          break;
        case "dengxian":
          body.style.fontFamily = "'DengXian', 'Microsoft YaHei', sans-serif";
          body.classList.add("font-dengxian");
          break;
        case "kaiti":
          body.style.fontFamily = "'KaiTi', 'STKaiti', '楷体', serif";
          body.classList.add("font-kaiti");
          break;
        case "chill-reunion":
          // ChillReunion 回退到 Noto Sans SC
          body.style.fontFamily =
            "'ChillReunion Round', var(--font-noto-sans-sc), sans-serif";
          body.classList.add("font-chill-reunion");
          break;
        case "fz-cuyuan":
          // 方正粗圆简体
          body.style.fontFamily =
            "'FZCuYuan-M03S', '方正粗圆简体', 'FZCuYuan', sans-serif";
          body.classList.add("font-fz-cuyuan");
          break;
        case "hy-tangmeiren":
          // HYTangMeiRen 55W
          body.style.fontFamily =
            "'HYTangMeiRen-55W', 'HYTangMeiRen', sans-serif";
          body.classList.add("font-hy-tangmeiren");
          break;
        default:
          body.style.fontFamily = "";
      }
    } else {
      body.style.fontFamily = "";
    }
  }, [settings.useCustomFont, settings.customFont, isLoaded]);

  return (
    <AppearanceContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (context === undefined) {
    throw new Error("useAppearance must be used within an AppearanceProvider");
  }
  return context;
}
