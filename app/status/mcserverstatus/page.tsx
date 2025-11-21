"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import type { ReactNode, JSX } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Server, Globe, Users, Cpu, Package, Map, MessageSquare, 
  AlertTriangle, ArrowLeft, Wifi, WifiOff, Download, Clock,
  RefreshCw
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
const NODES: readonly ServerNode[] = [
  { name: "四川成都电信", ip: "cd.epmc.top", region: "西南" },
  { name: "江苏宿迁电信", ip: "sq.epmc.top", region: "华东" },
  { name: "上海多线IPV4", ip: "sh.epmc.top", region: "华东" },
  { name: "上海多线IPV6", ip: "ipv6.sh.epmc.top", region: "华东" },
] as const;

const CACHE_DURATION = 30_000;
const FETCH_TIMEOUT = 8000;

// 独立的fetch函数（不使用useCallback，避免依赖问题）
const fetchServerData = async (ip: string): Promise<ServerData | null> => {
  if (!ip) return null;
  
  const cacheKey = `mcsrv:${ip}`;
  
  try {
    // 尝试从缓存读取
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
    // 发起新请求
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    
    const response = await fetch(`https://api.mcsrvstat.us/3/${ip}`, { 
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
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [serverData, setServerData] = useState<ServerData | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 初始设为false
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // 使用ref避免依赖问题
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // 获取当前选中的节点
  const activeNode = useMemo(() => NODES[activeNodeIndex], [activeNodeIndex]);

  // 加载数据函数（使用useCallback但依赖项最小化）
  const loadServerData = useCallback(async () => {
    // 防止组件卸载后更新状态
    if (!isMountedRef.current) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchServerData(activeNode.ip);
      
      // 再次检查组件是否已挂载
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
  }, [activeNode.ip]);

  // 处理节点切换
  const handleNodeChange = useCallback((index: number) => {
    if (index !== activeNodeIndex) {
      setActiveNodeIndex(index);
      setServerData(null); // 清空之前的数据
      
      // 立即加载新节点数据
      setTimeout(() => {
        loadServerData();
      }, 0);
    }
  }, [activeNodeIndex, loadServerData]);

  // 手动刷新
  const handleRefresh = useCallback(() => {
    loadServerData();
  }, [loadServerData]);

  // 初始加载和清理
  useEffect(() => {
    // 组件挂载时设置标记
    isMountedRef.current = true;
    
    // 初始加载数据（使用setTimeout避免立即执行导致的问题）
    const timer = setTimeout(() => {
      loadServerData();
    }, 100);
    
    // 设置自动刷新（5分钟一次，减少请求频率）
    intervalRef.current = setInterval(() => {
      if (!isLoading) {
        loadServerData();
      }
    }, 5 * 60 * 1000); // 5分钟
    
    // 清理函数
    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loadServerData]); // 只有loadServerData变化时才重新运行

  // 渲染辅助函数
  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse bg-slate-200/50 dark:bg-slate-700/50 rounded-xl h-32 border border-slate-200 dark:border-slate-700" />
      ))}
    </div>
  );

  const renderErrorState = () => (
    <Card className="text-center py-16 border-dashed">
      <CardContent>
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">无法获取服务器状态</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {error || "请检查网络连接或稍后重试"}
        </p>
        <Button 
          onClick={handleRefresh} 
          variant="outline"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true" />
              加载中...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
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
      <main className="min-h-screen bg-linear-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* 页面头部 */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" asChild className="flex items-center gap-2">
                  <a href="/status">
                    <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
                    返回状态页
                  </a>
                </Button>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  v3
                </Badge>
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-slate-900 to-blue-700 dark:from-slate-100 dark:to-blue-400 bg-clip-text text-transparent">
                Minecraft 服务器状态
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
                实时监控服务器状态，获取最新服务器信息
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  <span>最后更新: {lastUpdated.toLocaleTimeString()}</span>
                </div>
              )}
              <Button 
                onClick={handleRefresh} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                ) : (
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                )}
                {isLoading ? "加载中..." : "刷新数据"}
              </Button>
            </div>
          </div>

          {/* 节点选择器 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {NODES.map((node, i) => (
              <button
                key={node.ip}
                onClick={() => handleNodeChange(i)}
                disabled={isLoading}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left backdrop-blur-sm ${
                  i === activeNodeIndex
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105"
                    : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/30 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
                } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
                aria-selected={i === activeNodeIndex}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700">
                    {node.region}
                  </Badge>
                  <Globe className={`w-4 h-4 ${
                    i === activeNodeIndex ? "text-blue-500" : "text-slate-400"
                  }`} aria-hidden="true" />
                </div>
                <div className={`font-semibold ${
                  i === activeNodeIndex ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"
                }`}>
                  {node.name}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono truncate">
                  {node.ip}
                </div>
              </button>
            ))}
          </div>

          {/* 加载状态 */}
          {isLoading && renderSkeletonLoader()}

          {/* 错误状态 */}
          {!isLoading && error && renderErrorState()}

          {/* 服务器数据展示 */}
          {!isLoading && serverData && (
            <div className="space-y-6">
              {/* 服务器状态卡片 */}
              <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        serverData.online 
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                          : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      }`}>
                        {serverData.online ? (
                          <Wifi className="w-6 h-6" aria-label="服务器在线" />
                        ) : (
                          <WifiOff className="w-6 h-6" aria-label="服务器离线" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {activeNode.name}
                        </h3>
                        <p className={`text-sm ${
                          serverData.online ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}>
                          {serverData.online ? "服务器在线" : "服务器离线"}
                        </p>
                      </div>
                    </div>
                    {serverData.icon && (
                      <img 
                        src={serverData.icon} 
                        alt="服务器图标" 
                        className="w-16 h-16 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                        loading="lazy"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 信息卡片网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Globe className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">服务器地址</div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {serverData.ip ? `${serverData.ip}:${serverData.port ?? 25565}` : <span className="text-slate-400 dark:text-slate-500">—</span>}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">IP地址和端口</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Cpu className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">游戏版本</div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {serverData.version ?? (serverData.protocol?.name ?? <span className="text-slate-400 dark:text-slate-500">—</span>)}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {serverData.protocol?.version ? `协议版本: ${serverData.protocol.version}` : ""}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Package className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">服务器核心</div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {serverData.software || <span className="text-slate-400 dark:text-slate-500">—</span>}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">服务端软件</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Users className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">在线玩家</div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {serverData.players ? `${serverData.players.online} / ${serverData.players.max}` : <span className="text-slate-400 dark:text-slate-500">—</span>}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">当前在线 / 最大玩家数</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Map className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">当前地图</div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {serverData.map?.clean ?? serverData.map?.raw ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">服务器运行的地图</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Server className="w-5 h-5" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">游戏模式</div>
                        <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {serverData.gamemode || <span className="text-slate-400 dark:text-slate-500">—</span>}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">服务器游戏模式</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* 无数据状态 */}
          {!isLoading && !serverData && !error && renderErrorState()}
        </div>
      </main>
      <Footer />
    </>
  );
}