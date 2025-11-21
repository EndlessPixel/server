"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
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

/* ---------------- 类型定义 ---------------- */
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

/* ---------------- 常量定义 ---------------- */
const NODES: readonly ServerNode[] = [
  { name: "四川成都电信", ip: "cd.epmc.top", region: "西南" },
  { name: "江苏宿迁电信", ip: "sq.epmc.top", region: "华东" },
  { name: "上海多线IPV4", ip: "sh.epmc.top", region: "华东" },
  { name: "上海多线IPV6", ip: "ipv6.sh.epmc.top", region: "华东" },
] as const;

const CACHE_DURATION = 30_000; // 30秒缓存
const FETCH_TIMEOUT = 8000; // 8秒超时

/* ---------------- 工具函数 ---------------- */
const formatMotd = (html?: string[]): string => {
  if (!html) return "";
  return html.join("<br>").replace(/<[^>]+>/g, (t) => (t === "<br>" ? t : ""));
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  
  if (seconds < 60) return `${seconds}秒前`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}分钟前`;
  return date.toLocaleTimeString("zh-CN");
};

/* ---------------- API 请求 ---------------- */
const fetchNode = useCallback(async (ip: string): Promise<ServerData | null> => {
  if (!ip) return null;
  
  const cacheKey = `mcsrv:${ip}`;
  
  // 尝试从缓存获取
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

  // 发起新请求
  try {
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
}, []);

/* ---------------- 组件 ---------------- */
const InfoCard: React.FC<{ 
  icon: JSX.Element; 
  label: string; 
  value?: React.ReactNode;
  description?: string;
  className?: string;
}> = React.memo(({ icon, label, value, description, className = "" }) => (
  <Card className={`bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm backdrop-blur-sm ${className}`}>
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
            {value ?? <span className="text-slate-400 dark:text-slate-500">—</span>}
          </div>
          {description && (
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</div>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
));

const NodeSelector: React.FC<{ 
  nodes: readonly ServerNode[]; 
  active: number; 
  onSelect: (index: number) => void 
}> = ({ nodes, active, onSelect }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
    {nodes.map((node, i) => (
      <button
        key={node.ip}
        onClick={() => onSelect(i)}
        className={`p-4 rounded-xl border-2 transition-all duration-200 text-left backdrop-blur-sm ${
          i === active
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105"
            : "border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/30 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
        }`}
        aria-selected={i === active}
      >
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700">
            {node.region}
          </Badge>
          <Globe className={`w-4 h-4 ${
            i === active ? "text-blue-500" : "text-slate-400"
          }`} aria-hidden="true" />
        </div>
        <div className={`font-semibold ${
          i === active ? "text-blue-700 dark:text-blue-300" : "text-slate-700 dark:text-slate-300"
        }`}>
          {node.name}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono truncate">
          {node.ip}
        </div>
      </button>
    ))}
  </div>
);

const PlayersList: React.FC<{ players?: Player[] }> = ({ players }) => {
  if (!players || players.length === 0) return null;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-green-500" aria-hidden="true" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">在线玩家</span>
        <Badge variant="secondary" className="text-xs">
          {players.length} 人
        </Badge>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {players.map((player) => (
          <div
            key={player.uuid}
            className="bg-slate-100 dark:bg-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-700 dark:text-slate-300 truncate border border-slate-200 dark:border-slate-600"
          >
            {player.name}
          </div>
        ))}
      </div>
    </div>
  );
};

const PluginModList: React.FC<{ 
  items?: ServerPluginMod[]; 
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}> = ({ items, title, icon: Icon }) => {
  if (!items || items.length === 0) return null;

  const displayItems = useMemo(() => items.slice(0, 10), [items]);

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-purple-500" aria-hidden="true" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</span>
        <Badge variant="secondary" className="text-xs">
          {items.length} 个
        </Badge>
      </div>
      <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
        {displayItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800/50 rounded px-2 py-1 border border-slate-200 dark:border-slate-700"
          >
            <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}</span>
            {item.version && (
              <Badge variant="outline" className="text-xs ml-2 shrink-0">
                v{item.version}
              </Badge>
            )}
          </div>
        ))}
        {items.length > 10 && (
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center py-1">
            还有 {items.length - 10} 个未显示
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------------- 主页面组件 ---------------- */
export default function McServerStatusPage() {
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const [serverData, setServerData] = useState<ServerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 获取当前选中的节点
  const activeNode = useMemo(() => NODES[activeNodeIndex], [activeNodeIndex]);

  // 加载服务器数据
  const loadServerData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchNode(activeNode.ip);
      setServerData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取服务器数据失败");
      console.error("加载服务器数据错误:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeNode.ip, fetchNode]);

  // 初始加载和节点切换时重新加载
  useEffect(() => {
    loadServerData();
    
    // 设置自动刷新定时器（可选）
    const intervalId = setInterval(() => {
      if (!isLoading) {
        loadServerData();
      }
    }, 60_000); // 每分钟自动刷新
    
    return () => clearInterval(intervalId);
  }, [loadServerData, isLoading]);

  // 处理节点切换
  const handleNodeChange = useCallback((index: number) => {
    if (index !== activeNodeIndex) {
      setActiveNodeIndex(index);
      setServerData(null); // 清空之前的数据
    }
  }, [activeNodeIndex]);

  // 手动刷新数据
  const handleRefresh = useCallback(() => {
    loadServerData();
  }, [loadServerData]);

  // 渲染骨架屏
  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse bg-slate-200/50 dark:bg-slate-700/50 rounded-xl h-32 border border-slate-200 dark:border-slate-700" />
      ))}
    </div>
  );

  // 渲染错误状态
  const renderErrorState = () => (
    <Card className="text-center py-16 border-dashed">
      <CardContent>
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">无法获取服务器状态</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          {error || "请检查网络连接或稍后重试"}
        </p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
          重新尝试
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-linear-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* 头部 */}
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
                  <span aria-label={`最后更新时间：${lastUpdated.toLocaleString()}`}>
                    {formatTimeAgo(lastUpdated)}
                  </span>
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

          {/* 警告信息 */}
          <Card className="mb-8 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" aria-hidden="true" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">重要提示</h3>
                  <p className="text-amber-700 dark:text-amber-400 text-sm">
                    由于服务器地址经常变更，请以官方群内公告为准，此处更新可能不及时。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 节点选择器 */}
          <NodeSelector 
            nodes={NODES} 
            active={activeNodeIndex} 
            onSelect={handleNodeChange} 
          />

          {/* 加载状态 */}
          {isLoading && renderSkeletonLoader()}

          {/* 错误状态 */}
          {!isLoading && error && renderErrorState()}

          {/* 服务器数据展示 */}
          {!isLoading && serverData && (
            <div className="space-y-6">
              {/* 服务器状态指示器 */}
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

              {/* 基本信息网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoCard 
                  icon={<Globe className="w-5 h-5" aria-hidden="true" />}
                  label="服务器地址"
                  value={serverData.ip ? `${serverData.ip}:${serverData.port ?? 25565}` : undefined}
                  description="IP地址和端口"
                />
                
                <InfoCard 
                  icon={<Cpu className="w-5 h-5" aria-hidden="true" />}
                  label="游戏版本"
                  value={serverData.version ?? (serverData.protocol?.name ?? undefined)}
                  description={serverData.protocol?.version ? `协议版本: ${serverData.protocol.version}` : undefined}
                />
                
                <InfoCard 
                  icon={<Package className="w-5 h-5" aria-hidden="true" />}
                  label="服务器核心"
                  value={serverData.software}
                  description="服务端软件"
                />

                <InfoCard 
                  icon={<Users className="w-5 h-5" aria-hidden="true" />}
                  label="在线玩家"
                  value={serverData.players ? `${serverData.players.online} / ${serverData.players.max}` : undefined}
                  description="当前在线 / 最大玩家数"
                />

                <InfoCard 
                  icon={<Map className="w-5 h-5" aria-hidden="true" />}
                  label="当前地图"
                  value={serverData.map?.clean ?? serverData.map?.raw}
                  description="服务器运行的地图"
                />

                <InfoCard 
                  icon={<Server className="w-5 h-5" aria-hidden="true" />}
                  label="游戏模式"
                  value={serverData.gamemode}
                  description="服务器游戏模式"
                />
              </div>

              {/* MOTD 和详细信息 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* MOTD */}
                <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="w-5 h-5 text-blue-500" aria-hidden="true" />
                      服务器消息 (MOTD)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {serverData.motd?.html ? (
                      <div
                        className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 font-mono text-sm"
                        dangerouslySetInnerHTML={{
                          __html: formatMotd(serverData.motd.html)
                        }}
                        aria-label={serverData.motd.clean?.join(" ")}
                      />
                    ) : (
                      <div className="text-slate-400 dark:text-slate-500 italic text-center py-8">
                        暂无服务器消息
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* 详细信息 */}
                <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Server className="w-5 h-5 text-green-500" aria-hidden="true" />
                      服务器详情
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">主机名:</span>
                        <div className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                          {serverData.hostname || "—"}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">服务器ID:</span>
                        <div className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                          {serverData.serverid || "—"}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">EULA状态:</span>
                        <div className="mt-1">
                          <Badge variant={serverData.eula_blocked ? "destructive" : "outline"}>
                            {serverData.eula_blocked ? "已阻止" : "正常"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* 玩家列表 */}
                    <PlayersList players={serverData.players?.list} />

                    {/* 插件列表 */}
                    <PluginModList 
                      items={serverData.plugins} 
                      title="已加载插件" 
                      icon={Package}
                    />

                    {/* Mods 列表 */}
                    <PluginModList 
                      items={serverData.mods} 
                      title="已加载 Mods" 
                      icon={Download}
                    />

                    {/* 调试信息 */}
                    {serverData.debug && (
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                          调试信息
                        </summary>
                        <pre className="mt-2 text-xs overflow-auto text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700 max-h-60">
                          {JSON.stringify(serverData.debug, null, 2)}
                        </pre>
                      </details>
                    )}
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