"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Globe, Users, Cpu, Package, Map, MessageSquare, AlertTriangle, ArrowLeft, Wifi, WifiOff, Download, Clock, RefreshCw, Info } from "lucide-react";

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
  name: "江苏宿迁电信",
  ip: "sq.epmc.top",
  region: "华东"
};

const CACHE_DURATION = 30_000;
const FETCH_TIMEOUT = 8000;
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5分钟

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

    return data;
  } catch (e) {
    console.error("获取服务器数据失败:", e);

    // 降级使用缓存
    try {
      const raw = sessionStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
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

  // 使用ref避免依赖问题
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // 加载数据函数
  const loadServerData = useCallback(async () => {
    if (!isMountedRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchServerData(ACTIVE_NODE.ip);

      if (isMountedRef.current) {
        setServerData(data);
        setLastUpdated(new Date());
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

  // 手动刷新
  const handleRefresh = useCallback(() => {
    loadServerData();
  }, [loadServerData]);

  // 初始加载和清理
  useEffect(() => {
    isMountedRef.current = true;

    // 初始加载数据
    const timer = setTimeout(() => {
      loadServerData();
    }, 100);

    // 设置自动刷新
    intervalRef.current = setInterval(() => {
      if (!isLoading) {
        loadServerData();
      }
    }, AUTO_REFRESH_INTERVAL);

    // 清理函数
    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loadServerData, isLoading]);

  // 渲染辅助函数
  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <CardTitle className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
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
      </CardContent>
    </Card>
  );

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
                  刷新数据
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 节点信息 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server size={20} />
              {ACTIVE_NODE.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-slate-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {ACTIVE_NODE.region} 区域
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu size={16} className="text-slate-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  {ACTIVE_NODE.ip}
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
            <Card className="mb-8">
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
                {serverData.icon ? (
                  <div className="mb-4">
                    <img
                      src={serverData.icon}
                      alt="Server Icon"
                      className="w-20 h-20 rounded-md shadow-lg hover:shadow-xl transition-shadow duration-200"
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
                      className="w-20 h-20 rounded-md shadow-lg"
                    />
                  </div>
                )}

                {/* 服务器标语 */}
                {serverData.motd?.clean && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                      服务器标语
                    </h3>
                    <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-md">
                      {serverData.motd.clean.map((line, index) => (
                        <p key={index} className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 信息卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    服务器地址
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {serverData.ip ? `${serverData.ip}:${serverData.port ?? 25565}` : "—"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    IP地址和端口
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
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

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
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

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
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

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    主机名
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {serverData.hostname || "—"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    服务器主机名
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    EULA状态
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {serverData.eula_blocked ? "已阻止" : "正常"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    EULA协议状态
                  </p>
                </CardContent>
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