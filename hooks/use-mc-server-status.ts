"use client";

import { useState, useCallback, useRef, useEffect } from "react";

// 类型定义
export interface Player {
  name: string;
  uuid: string;
}

export interface ServerProtocol {
  name?: string;
  version?: number;
}

export interface ServerMotd {
  raw?: string[];
  clean?: string[];
  html?: string[];
}

export interface ServerMap {
  raw?: string;
  clean?: string;
  html?: string;
}

export interface ServerPlayers {
  online: number;
  max: number;
  list?: Player[];
}

export interface ServerPluginMod {
  name?: string;
  version?: string;
}

export interface ServerData {
  online: boolean;
  ip?: string;
  port?: number;
  hostname?: string;
  version?: string;
  protocol?: ServerProtocol;
  icon?: string;
  software?: string;
  map?: ServerMap;
  gamemode?: string;
  serverid?: string;
  eula_blocked?: boolean;
  motd?: ServerMotd;
  players?: ServerPlayers;
  plugins?: ServerPluginMod[];
  mods?: ServerPluginMod[];
  info?: ServerMotd;
  debug?: Record<string, any>;
}

export interface ServerNode {
  name: string;
  ip: string;
  region: string;
}

// 常量定义
export const ACTIVE_NODE: ServerNode = {
  name: "江苏宿迁电信",
  ip: "sq.epmc.top",
  region: "华东"
};

const CACHE_DURATION = 30_000;
const FETCH_TIMEOUT = 8000;
const AUTO_REFRESH_INTERVAL = 10 * 60 * 1000; // 10分钟

// 独立的fetch函数
const fetchServerData = async (ip: string): Promise<ServerData | null> => {
  if (!ip) return null;

  const cacheKey = `mcsrv:${ip}`;

  // 尝试从缓存读取
  try {
    const raw = sessionStorage.getItem(cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      const now = Date.now();
      if (parsed._ts && now - parsed._ts < CACHE_DURATION) {
        console.log("从缓存读取服务器数据");
        return parsed.data as ServerData;
      }
    }
  } catch (e) {
    console.warn("缓存读取失败:", e);
  }

  try {
    // 发起新请求（使用Next.js API路由代理）
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

    console.log("发起服务器数据请求");
    const response = await fetch(`/api/mcserver?ip=${encodeURIComponent(ip)}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as ServerData;

    // 缓存结果
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({
        _ts: Date.now(),
        data
      }));

      // 缓存图标到localStorage
      if (data.icon) {
        localStorage.setItem(`mcserver:icon:${ip}`, data.icon);
      }
    } catch (e) {
      console.warn("缓存存储失败:", e);
    }

    console.log("成功获取服务器数据", data);
    return data;
  } catch (e) {
    console.error("获取服务器数据失败:", e);

    // 降级使用缓存
    try {
      const raw = sessionStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        console.log("使用降级缓存数据");
        return parsed.data as ServerData;
      }
    } catch (e) {
      console.warn("降级缓存读取失败:", e);
    }

    return null;
  }
};

// 防抖函数
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export function useMcServerStatus(ip: string = ACTIVE_NODE.ip) {
  const [serverData, setServerData] = useState<ServerData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    players: false,
    plugins: false,
    mods: false,
    debug: false
  });

  // 使用ref避免依赖问题
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const lastRefreshRef = useRef<number>(0);

  // 加载数据函数
  const loadServerData = useCallback(async () => {
    if (!isMountedRef.current) return;

    // 防抖：确保至少间隔3秒才可再次请求
    const now = Date.now();
    if (now - lastRefreshRef.current < 3000) {
      console.log("请求过于频繁，跳过本次请求");
      return;
    }

    lastRefreshRef.current = now;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchServerData(ip);

      if (isMountedRef.current) {
        setServerData(data);
        setLastUpdated(new Date());
        if (data) {
          setRefreshCount(prev => prev + 1);
        }
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : "获取服务器数据失败");
        console.error("加载服务器数据错误:", err);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [ip]);

  // 防抖处理的刷新函数
  const debouncedLoadServerData = useCallback(
    debounce(loadServerData, 1000), // 1秒防抖
    [loadServerData]
  );

  // 手动刷新
  const handleRefresh = useCallback(() => {
    if (isLoading) return; // 防止重复点击
    debouncedLoadServerData();
  }, [isLoading, debouncedLoadServerData]);

  // 切换自动刷新
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefreshEnabled(prev => {
      const newState = !prev;
      if (!newState && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log("自动刷新已禁用");
      } else if (newState && !intervalRef.current) {
        // 重新启动自动刷新
        intervalRef.current = setInterval(() => {
          if (!isLoading) {
            debouncedLoadServerData();
          }
        }, AUTO_REFRESH_INTERVAL);
        console.log("自动刷新已启用");
      }
      return newState;
    });
  }, [isLoading, debouncedLoadServerData]);

  // 切换展开状态
  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  // 初始加载和清理
  useEffect(() => {
    isMountedRef.current = true;

    // 初始加载数据
    const timer = setTimeout(() => {
      loadServerData();
    }, 100);

    // 设置自动刷新
    if (autoRefreshEnabled) {
      intervalRef.current = setInterval(() => {
        if (!isLoading) {
          debouncedLoadServerData();
        }
      }, AUTO_REFRESH_INTERVAL);
      console.log("自动刷新已启动，间隔:", AUTO_REFRESH_INTERVAL, "ms");
    }

    // 清理函数
    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log("自动刷新已清理");
      }
    };
  }, [loadServerData, isLoading, autoRefreshEnabled, debouncedLoadServerData]);

  return {
    serverData,
    isLoading,
    lastUpdated,
    error,
    autoRefreshEnabled,
    refreshCount,
    expandedSections,
    handleRefresh,
    toggleAutoRefresh,
    toggleSection,
    loadServerData
  };
}
