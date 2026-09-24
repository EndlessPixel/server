"use client";

import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
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
  Zap,
  Shield,
  RotateCcw,
  Gauge,
  AlertOctagon,
  MapPin,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
  html?: string[];
}

interface ServerPlayers {
  online: number;
  max: number;
  list?: Player[];
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
  info?: ServerMotd;
}

interface PingData {
  min: number;
  avg: number;
  max: number;
  message?: string;
}

interface MyIpData {
  ip: string;
  region: string;
  isp: string;
  llc: string;
  asn: string;
  latitude: number;
  longitude: number;
  beginip?: string;
  endip?: string;
  district?: string;
  time_zone?: string;
}

const ACTIVE_NODE = {
  name: "主服务器",
  ip: "epmc.qzz.io",
};
const CACHE_DURATION = 30000;
const FETCH_TIMEOUT = 8000;

const fetchServerData = async (ip: string, skipCache = false): Promise<ServerData | null> => {
  if (!ip) return null;
  const cacheKey = `mcsrv:${ip}`;

  if (!skipCache) {
    try {
      const raw = sessionStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        const now = Date.now();
        if (parsed._ts && now - parsed._ts < CACHE_DURATION) {
          return parsed.data as ServerData;
        }
      }
    } catch {
      // 缓存读取失败，忽略
    }
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    const response = await fetch(`/api/mcserver/epmc`, {
      signal: controller.signal,
      headers: { Accept: "application/json", "Cache-Control": "no-cache" },
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = (await response.json()) as ServerData;

    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ _ts: Date.now(), data }));
    } catch {
      // 静默失败
    }

    return data;
  } catch {
    return null;
  }
};

const fetchServerPing = async (host: string): Promise<PingData | null> => {
  if (!host) return null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(`/api/ping/epmc`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    clearTimeout(timeout);

    if (!res.ok) return { min: 0, avg: 0, max: 0, message: "获取延迟失败" };
    const data = await res.json();
    if (!data || data.code) return { min: 0, avg: 0, max: 0, message: data?.message || "请求失败" };

    const minVal = isNaN(Number(data.min)) ? 0 : Number(data.min);
    const avgVal = isNaN(Number(data.avg)) ? 0 : Number(data.avg);
    const maxVal = isNaN(Number(data.max)) ? 0 : Number(data.max);

    return {
      min: Number(minVal.toFixed(1)),
      avg: Number(avgVal.toFixed(1)),
      max: Number(maxVal.toFixed(1)),
    };
  } catch {
    return null;
  }
};

const fetchMyIp = async (): Promise<MyIpData | null> => {
  try {
    const res = await fetch(`https://uapis.cn/api/v1/network/myip?source=commercial`);
    const data = await res.json();
    if (data.code) return null;
    return data;
  } catch {
    return null;
  }
};

export default function McServerStatusPage() {
  const [serverData, setServerData] = useState<ServerData | null>(null);
  const [pingData, setPingData] = useState<PingData | null>(null);
  const [myIpData, setMyIpData] = useState<MyIpData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [playersExpanded, setPlayersExpanded] = useState(false);

  const isMountedRef = useRef(true);
  const isLoadingRef = useRef(false);
  const lastRefreshRef = useRef<number>(0);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadServerData = useCallback(async (skipCache = false) => {
    if (isLoadingRef.current) return;
    if (!isMountedRef.current) return;

    const now = Date.now();
    if (!skipCache && now - lastRefreshRef.current < 2000) return;

    lastRefreshRef.current = now;
    isLoadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const [data, ping, ip] = await Promise.all([
        fetchServerData(ACTIVE_NODE.ip, skipCache),
        fetchServerPing(ACTIVE_NODE.ip),
        fetchMyIp(),
      ]);

      if (isMountedRef.current) {
        setServerData(data);
        setPingData(ping);
        setMyIpData(ip);
        if (data) {
          setLastUpdated(new Date());
          setRefreshCount((prev) => prev + 1);
        }
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : "获取服务器数据失败");
      }
    } finally {
      isLoadingRef.current = false;
      if (isMountedRef.current) setIsLoading(false);
    }
  }, []);

  const debouncedLoadServerData = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => loadServerData(false), 1000);
  }, [loadServerData]);

  const handleRefresh = useCallback(() => {
    if (isLoading) return;
    debouncedLoadServerData();
  }, [isLoading, debouncedLoadServerData]);

  const handleForceRefresh = useCallback(() => {
    if (isLoading) return;
    loadServerData(true);
  }, [isLoading, loadServerData]);

  const togglePlayers = useCallback(() => {
    setPlayersExpanded((prev) => !prev);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    const initTimer = setTimeout(() => loadServerData(false), 100);
    return () => {
      isMountedRef.current = false;
      clearTimeout(initTimer);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [loadServerData]);

  const renderPlayerList = () => {
    const players = serverData?.players?.list;
    if (!players || players.length === 0) {
      return <p className="p-4 text-sm text-muted-foreground">暂无在线玩家</p>;
    }
    return (
      <div className="flex flex-wrap gap-2">
        {players.map((player) => (
          <div
            key={player.uuid}
            className="inline-flex items-center gap-1.5 rounded-full bg-muted/30 px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-muted/60"
            title={player.name}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
              {player.name.charAt(0).toUpperCase()}
            </span>
            <span className="max-w-[120px] truncate">{player.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderSkeletonLoader = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-1/2 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-4 w-3/4 rounded" />
            <Skeleton className="h-3 w-1/2 rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderErrorState = () => (
    <Card className="bg-muted/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground/70">
          <AlertTriangle size={20} />
          无法获取服务器状态
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">{error || "请检查网络连接或稍后重试"}</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleRefresh} disabled={isLoading} variant="default">
            {isLoading ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : (
              <RefreshCw size={16} className="mr-2" />
            )}
            {isLoading ? "加载中..." : "重新尝试"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPingCard = () => {
    if (!pingData || pingData.message) {
      return (
        <Card className="bg-secondary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <Gauge size={14} /> 网络延迟
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-muted-foreground">
              {pingData?.message || "获取失败"}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <Gauge size={14} /> 网络延迟
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold text-foreground">{pingData.avg} ms</p>
          <p className="mt-1 text-xs text-muted-foreground">
            最小 {pingData.min} · 平均 {pingData.avg} · 最大 {pingData.max} ms
          </p>
        </CardContent>
      </Card>
    );
  };

  const isInitialLoading = isLoading && !serverData;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4">
          {/* Top row: back button + title */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={18} className="mr-2" /> 返回状态页
            </Button>
            <div className="flex items-center gap-2">
              {lastUpdated && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={12} /> {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <RotateCcw size={12} /> {refreshCount}次
              </span>
            </div>
          </div>

          {/* Bottom row: title + controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                Minecraft 服务器状态
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                实时监控服务器状态，获取最新服务器信息
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <Button onClick={handleRefresh} disabled={isLoading} variant="default" size="sm">
                {isLoading ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} className="mr-1" />
                )}
                {isLoading ? "" : "刷新"}
              </Button>
              <Button
                onClick={handleForceRefresh}
                disabled={isLoading}
                size="sm"
                variant="outline"
                className="text-muted-foreground"
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <AlertOctagon size={16} className="mr-1" />
                )}
                {isLoading ? "" : "强制刷新"}
              </Button>
              {isLoading && !isInitialLoading && (
                <Badge variant="secondary" className="text-xs">
                  <Loader2 size={12} className="mr-1 animate-spin" /> 刷新中
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Info bar */}
        <div className="mb-8 rounded-2xl bg-card p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl bg-secondary/50 p-3">
              <Cpu size={16} className="shrink-0 text-foreground/40" />
              <span className="truncate text-sm text-foreground/70">服务器：{ACTIVE_NODE.ip}</span>
            </div>
            {myIpData ? (
              <>
                <div className="flex items-center gap-2 rounded-xl bg-secondary/50 p-3">
                  <Wifi size={16} className="shrink-0 text-foreground/40" />
                  <span className="truncate text-sm text-foreground/70">你的IP：{myIpData.ip}</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-secondary/50 p-3">
                  <MapPin size={16} className="shrink-0 text-foreground/40" />
                  <span className="truncate text-sm text-foreground/70">
                    位置：{myIpData.region} · {myIpData.llc || myIpData.isp}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 rounded-xl bg-secondary/50 p-3 text-muted-foreground">
                <Loader2 size={16} className="shrink-0 animate-spin" />
                <span className="text-sm">获取IP中…</span>
              </div>
            )}
          </div>
        </div>

        {/* Loading / Error / Content */}
        {isInitialLoading && renderSkeletonLoader()}
        {!isInitialLoading && error && !serverData && renderErrorState()}
        {serverData && (
          <>
            {/* Main server card */}
            <div className="rounded-2xl bg-card shadow-sm">
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">{ACTIVE_NODE.name}</h2>
                  <Badge
                    className={
                      serverData.online
                        ? "bg-emerald-50 text-emerald-700 shadow-none dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "bg-red-50 text-red-700 shadow-none dark:bg-red-950/40 dark:text-red-300"
                    }
                  >
                    {serverData.online ? (
                      <Wifi size={14} className="mr-1" />
                    ) : (
                      <WifiOff size={14} className="mr-1" />
                    )}
                    {serverData.online ? "服务器在线" : "服务器离线"}
                  </Badge>
                </div>

                <div className="flex flex-col gap-6 md:flex-row">
                  <div className="shrink-0">
                    {serverData.icon ? (
                      <img
                        src={serverData.icon}
                        alt="Server Icon"
                        className="h-24 w-24 rounded-xl shadow-sm"
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src = "/default-server-icon.png")
                        }
                      />
                    ) : (
                      <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-secondary">
                        <Image
                          src="/default-server-icon.png"
                          alt="Default Icon"
                          width={96}
                          height={96}
                          className="rounded-xl"
                        />
                      </div>
                    )}
                  </div>
                  <div className="grow">
                    {serverData.motd?.html && serverData.motd.html.some((l) => l.trim()) && (
                      <div>
                        <h3 className="mb-2 flex items-center gap-1 text-sm font-medium text-muted-foreground">
                          <MessageSquare size={14} /> 服务器 Motd
                        </h3>
                        <div className="max-w-full rounded-xl bg-secondary/50 p-4 break-words">
                          {serverData.motd.html.map(
                            (line, index) =>
                              line.trim() && (
                                <p
                                  key={index}
                                  className="mb-1 text-sm text-foreground/80 last:mb-0"
                                  dangerouslySetInnerHTML={{ __html: line }}
                                />
                              ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="mt-8 mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="flex min-h-[112px] flex-col justify-center">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    <Zap size={14} /> 游戏版本
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="truncate text-lg font-semibold text-foreground"
                    title={serverData.protocol?.name}
                  >
                    {serverData.protocol?.name || "—"}
                  </p>
                  {serverData.protocol?.version && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      协议版本: {serverData.protocol.version}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="flex min-h-[112px] flex-col justify-center">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    <Shield size={14} /> 服务器核心
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p
                    className="truncate text-lg font-semibold text-foreground"
                    title={serverData.version}
                  >
                    {serverData.version || "—"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">服务端软件</p>
                </CardContent>
              </Card>

              <Card className="flex min-h-[112px] flex-col justify-center">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    <Users size={14} /> 在线玩家
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-foreground">
                    {serverData.players
                      ? `${serverData.players.online} / ${serverData.players.max}`
                      : "—"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">当前在线 / 最大玩家数</p>
                </CardContent>
              </Card>

              {renderPingCard()}
            </div>

            {/* Players list */}
            <div className="mb-8 rounded-2xl bg-card shadow-sm">
              <button
                className="flex w-full cursor-pointer items-center justify-between rounded-2xl p-6 text-left transition-colors hover:bg-secondary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                onClick={togglePlayers}
                aria-expanded={playersExpanded}
              >
                <div className="flex items-center gap-2">
                  <Users size={20} className="text-foreground/60" />
                  <span className="font-semibold text-foreground">在线玩家列表</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {serverData.players?.list?.length || 0} 人在线
                  </Badge>
                  {playersExpanded ? (
                    <ChevronUp size={16} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={16} className="text-muted-foreground" />
                  )}
                </div>
              </button>
              {playersExpanded && <div className="px-6 pb-6">{renderPlayerList()}</div>}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
