"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Server,
  Globe,
  Users,
  Cpu,
  MessageSquare,
  AlertTriangle,
  ArrowLeft,
  Wifi,
  WifiOff,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Activity,
  Zap,
  Shield,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

// 类型定义
interface Player {
  name: string;
  uuid: string;
}

interface ServerProtocol {
  name?: string;
  version?: number;
}

interface ServerMotd {
  raw?: string[];
  clean?: string[];
  html?: string[];
}

interface ServerMap {
  raw?: string;
  clean?: string;
  html?: string;
}

interface ServerPlayers {
  online: number;
  max: number;
  list?: Player[];
}

interface ServerPluginMod {
  name?: string;
  version?: string;
}

interface ServerData {
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

interface ServerNode {
  name: string;
  ip: string;
  region: string;
}

// 常量定义
const ACTIVE_NODE = {
  name: "主服务器",
  ip: "epmc.top",
};

const CACHE_DURATION = 30_000;
const FETCH_TIMEOUT = 8000;
const AUTO_REFRESH_INTERVAL = 10 * 60 * 1000; // 10分钟（改为更长的间隔）

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

export default function McServerStatusPage() {
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

  // 防抖函数
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

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
      const data = await fetchServerData(ACTIVE_NODE.ip);

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
  }, []);

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

  // 渲染辅助函数
  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="h-6 bg-linear-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded w-1/2"></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-linear-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-linear-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertTriangle size={20} />
          无法获取服务器状态
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {error || "请检查网络连接或稍后重试"}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                加载中...
              </>
            ) : (
              <>
                <RefreshCw size={16} className="mr-2" />
                重新尝试
              </>
            )}
          </Button>
          <Button
            onClick={toggleAutoRefresh}
            variant={autoRefreshEnabled ? "secondary" : "outline"}
            className={!autoRefreshEnabled ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""}
          >
            {autoRefreshEnabled ? (
              <>
                <Pause size={16} className="mr-2" />
                暂停自动刷新
              </>
            ) : (
              <>
                <Play size={16} className="mr-2" />
                启用自动刷新
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPlayerList = () => {
    if (!serverData?.players?.list || serverData.players.list.length === 0) {
      return <p className="text-slate-500 dark:text-slate-400 text-sm">暂无在线玩家</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {serverData.players.list.map((player, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm truncate">{player.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderPluginsList = () => {
    if (!serverData?.plugins || serverData.plugins.length === 0) {
      return <p className="text-slate-500 dark:text-slate-400 text-sm">暂无插件</p>;
    }

    return (
      <div className="space-y-2">
        {serverData.plugins.map((plugin, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md"
          >
            <span className="text-sm font-medium">{plugin.name}</span>
            <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
              {plugin.version}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderModsList = () => {
    if (!serverData?.mods || serverData.mods.length === 0) {
      return <p className="text-slate-500 dark:text-slate-400 text-sm">暂无模组</p>;
    }

    return (
      <div className="space-y-2">
        {serverData.mods.map((mod, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md"
          >
            <span className="text-sm font-medium">{mod.name}</span>
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 rounded">
              {mod.version}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={18} className="mr-2" />
              返回状态页 v3
            </Button>
          </div>

          <div className="flex flex-col items-end">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Minecraft 服务器状态
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              实时监控服务器状态，获取最新服务器信息
            </p>
          </div>

          <div className="flex items-center gap-2">
            {lastUpdated && (
              <Badge variant="outline" className="text-xs">
                <Clock size={12} className="mr-1" />
                最后更新: {lastUpdated.toLocaleTimeString()}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              <RotateCcw size={12} className="mr-1" />
              刷新次数: {refreshCount}
            </Badge>
            <Button
              onClick={toggleAutoRefresh}
              variant={autoRefreshEnabled ? "secondary" : "outline"}
              size="sm"
              className={!autoRefreshEnabled ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : ""}
            >
              {autoRefreshEnabled ? (
                <Pause size={16} className="mr-2" />
              ) : (
                <Play size={16} className="mr-2" />
              )}
              {autoRefreshEnabled ? "暂停" : "启动"}
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={isLoading}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <>
                  <RefreshCw size={16} className="mr-2" />
                  刷新
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 节点信息 */}
        <Card className="mb-8 shadow-lg border-0 bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server size={20} />
              {ACTIVE_NODE.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800/30 rounded-lg">
                <Cpu size={16} className="text-green-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {ACTIVE_NODE.ip}
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-800/30 rounded-lg">
                <Activity size={16} className="text-yellow-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {autoRefreshEnabled ? "自动刷新开启 (10分钟)" : "自动刷新关闭"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 加载状态 */}
        {isLoading && renderSkeletonLoader()}

        {/* 错误状态 */}
        {!isLoading && error && renderErrorState()}

        {/* 服务器数据展示 */}
        {!isLoading && serverData && (
          <>
            {/* 服务器状态卡片 */}
            <Card className="mb-8 shadow-lg border-0 bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold">
                  {ACTIVE_NODE.name}
                </CardTitle>
                <Badge
                  className={`${serverData.online
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                >
                  {serverData.online ? (
                    <>
                      <Wifi size={14} className="mr-1" />
                      服务器在线
                    </>
                  ) : (
                    <>
                      <WifiOff size={14} className="mr-1" />
                      服务器离线
                    </>
                  )}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="shrink-0">
                    {serverData.icon ? (
                      <div className="mb-4">
                        <img
                          src={serverData.icon}
                          alt="Server Icon"
                          className="w-24 h-24 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 border-4 border-white dark:border-slate-700"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/default-server-icon.png';
                          }}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="mb-4">
                        <img
                          src="/default-server-icon.png"
                          alt="Default Server Icon"
                          className="w-24 h-24 rounded-xl shadow-lg border-4 border-white dark:border-slate-700"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grow">
                    {/* 服务器标语 */}
                    {serverData.motd?.clean && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1">
                          <MessageSquare size={14} />
                          服务器Motd
                        </h3>
                        <div className="bg-white dark:bg-slate-800/30 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                          {serverData.motd.clean.map((line, index) => (
                            <p key={index} className="text-sm text-slate-700 dark:text-slate-300 mb-1 last:mb-0">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 信息卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Zap size={14} />
                    游戏版本
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {serverData.version ?? (serverData.protocol?.name ?? "—")}
                  </p>
                  {serverData.protocol?.version && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      协议版本: {serverData.protocol.version}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Shield size={14} />
                    服务器核心
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {serverData.software || "—"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    服务端软件
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Users size={14} />
                    在线玩家
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {serverData.players ? `${serverData.players.online} / ${serverData.players.max}` : "—"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    当前在线 / 最大玩家数
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 详细信息展开卡片 */}
            <div className="space-y-4">
              {/* 玩家列表 */}
              <Card className="shadow-lg border-0 bg-linear-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50">
                <CardHeader
                  className="cursor-pointer pb-2"
                  onClick={() => toggleSection('players')}
                >
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users size={20} />
                      <span>在线玩家列表</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {serverData.players?.list?.length || 0} 人在线
                      </Badge>
                      {expandedSections.players ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </CardTitle>
                </CardHeader>
                {expandedSections.players && (
                  <CardContent>
                    {renderPlayerList()}
                  </CardContent>
                )}
              </Card>
            </div>
          </>
        )}

        {/* 无数据状态 */}
        {!isLoading && !serverData && !error && renderErrorState()}
      </main>

      <Footer />
    </>
  );
}