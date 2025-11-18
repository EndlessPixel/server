"use client";

import React from "react";
import type { ReactNode, JSX } from "react";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Globe, Users, Cpu, Package, Map, MessageSquare, AlertTriangle, ArrowLeft, Wifi, WifiOff, Download, Clock } from "lucide-react";

/* ---------------- 类型 ---------------- */
interface Player { name: string; uuid: string }
interface ServerData {
  online: boolean;
  ip?: string;
  port?: number;
  hostname?: string;
  version?: string;
  protocol?: { name?: string; version?: number };
  icon?: string;
  software?: string;
  map?: { raw?: string; clean?: string; html?: string };
  gamemode?: string;
  serverid?: string;
  eula_blocked?: boolean;
  motd?: { raw?: string[]; clean?: string[]; html?: string[] };
  players?: { online: number; max: number; list?: Player[] };
  plugins?: { name?: string; version?: string }[];
  mods?: { name?: string; version?: string }[];
  info?: { raw?: string[]; clean?: string[]; html?: string[] };
  debug?: Record<string, any>;
}

/* ---------------- 节点 ---------------- */
const NODES = [
  { name: "四川成都电信", ip: "cd.epmc.top", region: "西南" },
  { name: "江苏宿迁电信", ip: "sq.epmc.top", region: "华东" },
  { name: "上海多线IPV4", ip: "sh.epmc.top", region: "华东" },
  { name: "上海多线IPV6", ip: "ipv6.sh.epmc.top", region: "华东" },
] as const;

/* ---------------- 请求 ---------------- */
async function fetchNode(ip: string): Promise<ServerData | null> {
  if (!ip) return null;
  const cacheKey = `mcsrv:${ip}`;
  try {
    const raw = sessionStorage.getItem(cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      const now = Date.now();
      if (parsed._ts && now - parsed._ts < 30_000) {
        return parsed.data as ServerData;
      }
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(`https://api.mcsrvstat.us/3/${ip}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = (await res.json()) as ServerData;
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ _ts: Date.now(), data }));
    } catch {}
    return data;
  } catch (e) {
    try {
      const raw = sessionStorage.getItem(`mcsrv:${ip}`);
      if (raw) return JSON.parse(raw).data as ServerData;
    } catch {}
    return null;
  }
}

/* ---------------- 信息卡片组件 ---------------- */
function InfoCard({ 
  icon, 
  label, 
  value, 
  description,
  className = ""
}: { 
  icon: JSX.Element; 
  label: string; 
  value?: React.ReactNode;
  description?: string;
  className?: string;
}) {
  return (
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
  );
}

const MemoInfoCard = React.memo(InfoCard);

/* ---------------- 节点选择器 ---------------- */
function NodeSelector({ 
  nodes, 
  active, 
  onSelect 
}: { 
  nodes: typeof NODES; 
  active: number; 
  onSelect: (index: number) => void 
}) {
  return (
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
        >
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs bg-slate-100 dark:bg-slate-700">
              {node.region}
            </Badge>
            <Globe className={`w-4 h-4 ${
              i === active ? "text-blue-500" : "text-slate-400"
            }`} />
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
}

/* ---------------- 玩家列表组件 ---------------- */
function PlayersList({ players }: { players?: Player[] }) {
  if (!players || players.length === 0) return null;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-green-500" />
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
}

/* ---------------- 插件/Mods 列表组件 ---------------- */
function PluginModList({ 
  items, 
  title, 
  icon: Icon 
}: { 
  items?: { name?: string; version?: string }[]; 
  title: string;
  icon: React.ComponentType<any>;
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</span>
        <Badge variant="secondary" className="text-xs">
          {items.length} 个
        </Badge>
      </div>
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {items.slice(0, 10).map((item, i) => (
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
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
            还有 {items.length - 10} 个未显示
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- 主页面 ---------------- */
export default function McServerStatusPage() {
  const [active, setActive] = useState(0);
  const [data, setData] = useState<ServerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    setLoading(true);
    setData(null);
    fetchNode(NODES[active].ip).then((d) => {
      setData(d);
      setLoading(false);
      setLastUpdated(new Date());
    });
  }, [active]);

  const refreshData = () => {
    setLoading(true);
    fetchNode(NODES[active].ip).then((d) => {
      setData(d);
      setLoading(false);
      setLastUpdated(new Date());
    });
  };

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
                    <ArrowLeft className="w-4 h-4" />
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
              <p className="text-slate-600 dark:text-slate-400">
                实时监控服务器状态，获取最新服务器信息
              </p>
            </div>

            <div className="flex items-center gap-3">
              {lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  更新于 {lastUpdated.toLocaleTimeString("zh-CN")}
                </div>
              )}
              <Button 
                onClick={refreshData} 
                variant="outline" 
                size="sm"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                刷新数据
              </Button>
            </div>
          </div>

          {/* 警告信息 */}
          <Card className="mb-8 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
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
          <NodeSelector nodes={NODES} active={active} onSelect={setActive} />

          {/* 加载状态 */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl h-32" />
              ))}
            </div>
          )}

          {/* 服务器状态 */}
          {!loading && data && (
            <div className="space-y-6">
              {/* 服务器状态指示器 */}
              <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${
                        data.online 
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                          : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      }`}>
                        {data.online ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {NODES[active].name}
                        </h3>
                        <p className={`text-sm ${
                          data.online ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        }`}>
                          {data.online ? "服务器在线" : "服务器离线"}
                        </p>
                      </div>
                    </div>
                    {data.icon && (
                      <img 
                        src={data.icon} 
                        alt="服务器图标" 
                        className="w-16 h-16 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 基本信息网格 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <MemoInfoCard 
                  icon={<Globe className="w-5 h-5" />}
                  label="服务器地址"
                  value={data.ip ? `${data.ip}:${data.port ?? 25565}` : undefined}
                  description="IP地址和端口"
                />
                
                <MemoInfoCard 
                  icon={<Cpu className="w-5 h-5" />}
                  label="游戏版本"
                  value={data.version ?? (data.protocol?.name ?? undefined)}
                  description={data.protocol?.version ? `协议版本: ${data.protocol.version}` : undefined}
                />
                
                <MemoInfoCard 
                  icon={<Package className="w-5 h-5" />}
                  label="服务器核心"
                  value={data.software}
                  description="服务端软件"
                />

                <MemoInfoCard 
                  icon={<Users className="w-5 h-5" />}
                  label="在线玩家"
                  value={data.players ? `${data.players.online} / ${data.players.max}` : undefined}
                  description="当前在线 / 最大玩家数"
                />

                <MemoInfoCard 
                  icon={<Map className="w-5 h-5" />}
                  label="当前地图"
                  value={data.map?.clean ?? data.map?.raw}
                  description="服务器运行的地图"
                />

                <MemoInfoCard 
                  icon={<Server className="w-5 h-5" />}
                  label="游戏模式"
                  value={data.gamemode}
                  description="服务器游戏模式"
                />
              </div>

              {/* MOTD 和详细信息 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* MOTD */}
                <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                      服务器消息 (MOTD)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {data.motd?.html ? (
                      <div
                        className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700 font-mono text-sm"
                        dangerouslySetInnerHTML={{
                          __html: (data.motd.html || []).join("<br>").replace(/<[^>]+>/g, (t) => (t === "<br>" ? t : "")),
                        }}
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
                      <Server className="w-5 h-5 text-green-500" />
                      服务器详情
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">主机名:</span>
                        <div className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                          {data.hostname || "—"}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">服务器ID:</span>
                        <div className="font-medium text-slate-900 dark:text-slate-100 mt-1">
                          {data.serverid || "—"}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">EULA状态:</span>
                        <div className="mt-1">
                          <Badge variant={data.eula_blocked ? "destructive" : "outline"}>
                            {data.eula_blocked ? "已阻止" : "正常"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* 玩家列表 */}
                    <PlayersList players={data.players?.list} />

                    {/* 插件列表 */}
                    <PluginModList 
                      items={data.plugins} 
                      title="已加载插件" 
                      icon={Package}
                    />

                    {/* Mods 列表 */}
                    <PluginModList 
                      items={data.mods} 
                      title="已加载 Mods" 
                      icon={Download}
                    />

                    {/* 调试信息 */}
                    {data.debug && (
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                          调试信息
                        </summary>
                        <pre className="mt-2 text-xs overflow-auto text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded border border-slate-200 dark:border-slate-700 max-h-60">
                          {JSON.stringify(data.debug, null, 2)}
                        </pre>
                      </details>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* 无数据状态 */}
          {!loading && !data && (
            <Card className="text-center py-16 border-dashed">
              <CardContent>
                <WifiOff className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">无法获取服务器状态</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  请检查网络连接或稍后重试
                </p>
                <Button onClick={refreshData} variant="outline">
                  重新尝试
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}