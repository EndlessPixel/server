"use client"

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerStatusSkeleton } from "@/components/server-status-skeleton";
import {
  Server, Users, Clock, Info, MessageSquare, RefreshCw, Timer, Globe
} from "lucide-react";

const NODES = [
  { name: "四川成都联通", ip: "cd1.epmc.top" },
  { name: "四川成都电信", ip: "cd2.epmc.top" },
  { name: "湖南娄底联通", ip: "ld.epmc.top"},
  { name: "湖北十堰电信", ip: "hbdx.epmc.top"},
  { name: "湖北十堰飞讯", ip: "hb.epmc.top" },
  { name: "中国北京阿里", ip: "bj.epmc.top" },
];

interface ServerData {
  online: boolean;
  ip: string;
  port: number;
  players: {
    online: number;
    max: number;
    list?: Array<{ name: string; uuid: string }>;
  };
  motd?: {
    raw?: string[];
    clean?: string[];
    html?: string[];
  };
  version?: string;
  protocol?: number;
  software?: string;
  plugins?: string[];
  mods?: string[];
  hostname?: string;
}

interface PingData {
  code: number;
  host?: string;
  ip?: string;
  location?: string;
  max?: number;
  avg?: number;
  min?: number;
}

function StatusPill({ online }: { online: boolean }) {
  return (
    <span className={`inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold transition-colors
      ${online
        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
      }`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${online ? "bg-green-500" : "bg-red-500"}`}></span>
      {online ? "在线" : "离线"}
    </span>
  );
}

function TopStats({
  online,
  players,
  ping,
  loading,
  pingLoading,
}: {
  online: boolean;
  players: { online: number; max: number };
  ping: PingData;
  loading: boolean;
  pingLoading: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-8 items-center justify-between mb-8">
      <StatusPill online={online} />
      <div className="flex flex-col items-center gap-1 min-w-[120px]">
        <Users className="w-6 h-6 text-green-500 mb-1" />
        <span className="text-lg font-bold">{players.online}</span>
        <span className="text-xs text-muted-foreground">当前在线</span>
        <span className="text-xs text-muted-foreground">最大 {players.max}</span>
      </div>
      <div className="flex flex-col items-center gap-1 min-w-[120px]">
        <Clock className="w-6 h-6 text-purple-500 mb-1" />
        <span className="text-lg font-bold">
          {pingLoading
            ? "测速中"
            : ping.code === 200 && ping.avg
              ? `${Math.round(ping.avg)} ms`
              : "测试失败"}
        </span>
        <span className="text-xs text-muted-foreground">网络延迟</span>
      </div>
    </div>
  );
}

// 优化MOTD渲染，去除多余转义和奇怪格式，支持渐变色和多行
function MotdHtml({ html }: { html?: string[] }) {
  if (!html || html.length === 0) return <span className="text-muted-foreground">未获取到 MOTD</span>;
  // 处理掉多余的转义和奇怪的格式
  return (
    <div className="space-y-2">
      {html.map((line, idx) => (
        <div
          key={idx}
          className="text-base leading-relaxed break-words"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\\n/g, "<br>")
              .replace(/§[0-9a-fklmnor]/gi, "") // 去除Minecraft颜色代码
          }}
        />
      ))}
    </div>
  );
}

export function ServerStatusCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serverIp = searchParams.get("serverip") || NODES[0].ip;
  const pingIp = searchParams.get("pingip") || "ld.frp.one";

  const [serverData, setServerData] = useState<ServerData | null>(null);
  const [pingData, setPingData] = useState<PingData>({ code: 500, host: pingIp, location: "网络测试失败" });
  const [loading, setLoading] = useState(true);
  const [pingLoading, setPingLoading] = useState(true);
  const [serverTime, setServerTime] = useState<string | null>(null);

  // 节点切换
  const handleNodeChange = useCallback((ip: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("serverip", ip);
    router.replace(`?${params.toString()}`);
    setServerData(null);
    setPingData({ code: 500, host: pingIp, location: "网络测试失败" });
    setLoading(true);
    setPingLoading(true);
  }, [searchParams, pingIp, router]);

  // 数据请求
  const fetchServerStatus = useCallback(async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      const response = await fetch(`https://api.mcsrvstat.us/3/${serverIp}`, {
        cache: "no-store",
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      setServerData(await response.json());
    } catch (error) {
      console.error("获取服务器状态失败:", error);
      setServerData(null);
    } finally {
      setLoading(false);
    }
  }, [serverIp]);

  const fetchPingData = useCallback(async () => {
    try {
      setPingLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(`https://uapis.cn/api/v1/network/ping?host=${pingIp}`, {
        cache: "no-store",
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });
      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`Ping API returned ${response.status}`);
      setPingData(await response.json());
    } catch (error) {
      console.error("获取ping数据失败:", error);
      setPingData({ code: 500, host: pingIp, location: "网络测试失败" });
    } finally {
      setPingLoading(false);
    }
  }, [pingIp]);

  // 服务器运行时间
  const updateServerTime = useCallback(() => {
    const startDate = new Date("2024-09-16T15:34:43");
    const now = new Date();
    let diff = now.getTime() - startDate.getTime();
    if (diff < 0) return setServerTime("计算错误!");
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    diff -= years * (1000 * 60 * 60 * 24 * 365.25);
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const minutes = Math.floor(diff / (1000 * 60));
    diff -= minutes * (1000 * 60);
    const seconds = Math.floor(diff / 1000);
    setServerTime(
      `${years}年 ${months}月 ${days}日 ${hours}时 ${minutes}分 ${seconds}秒`
    )
  }, []);

  // 刷新
  const refreshAllData = useCallback(() => {
    fetchServerStatus();
    fetchPingData();
  }, [fetchServerStatus, fetchPingData]);

  useEffect(() => {
    fetchServerStatus();
    fetchPingData();
    updateServerTime();
    const statusInterval = setInterval(fetchServerStatus, 60000);
    const pingInterval = setInterval(fetchPingData, 120000);
    const timeInterval = setInterval(updateServerTime, 1000);
    
    return () => {
      clearInterval(statusInterval);
      clearInterval(pingInterval);
      clearInterval(timeInterval);
    };
  }, [fetchServerStatus, fetchPingData, updateServerTime]);

  if (loading && !serverData) return <ServerStatusSkeleton />

  const safeText = (val: any, fallback = "未知") => {
    if (typeof val === "string" || typeof val === "number") return val;
    return fallback;
  };

  return (
    <Card className="w-full max-w-[1200px] mx-auto shadow-2xl border-0 bg-white/90 dark:bg-zinc-900/90 relative transition-all px-8 py-6">
      {/* 节点切换条 */}
      <div className="flex flex-wrap gap-4 px-2 pt-2 pb-6 justify-center">
        {NODES.map(node => (
          <Button
            key={node.ip}
            variant={serverIp === node.ip ? "default" : "outline"}
            size="lg"
            className={`rounded-full px-7 py-2 font-semibold shadow-sm transition-all border-2 text-base
              ${serverIp === node.ip
                ? "border-blue-500 bg-gradient-to-r from-blue-400 to-purple-400 text-white"
                : "border-transparent bg-muted/60 dark:bg-zinc-800/60 hover:border-blue-400"
              }`}
            onClick={() => handleNodeChange(node.ip)}
            disabled={loading && serverIp === node.ip}
          >
            {node.name}
          </Button>
        ))}
      </div>

      {/* 刷新按钮悬浮右上角 */}
      <Button
        onClick={refreshAllData}
        disabled={loading || pingLoading}
        variant="outline"
        size="icon"
        className="absolute top-6 right-8 z-10 bg-white/80 dark:bg-zinc-800/80 shadow-md hover:bg-white dark:hover:bg-zinc-700 transition-all duration-300"
        aria-label="刷新"
      >
        <RefreshCw className={`h-6 w-6 transition-transform duration-500 ${loading || pingLoading ? "animate-spin" : ""}`} />
      </Button>

      <CardHeader className="pb-4 border-b border-muted dark:border-zinc-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-zinc-900 dark:to-zinc-800 rounded-t-xl mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Server className="h-8 w-8 text-primary" />
          <CardTitle className="text-2xl font-bold tracking-wide">服务器状态</CardTitle>
        </div>
        <TopStats
          online={!!serverData?.online}
          players={serverData?.players || { online: 0, max: 0 }}
          ping={pingData}
          loading={loading}
          pingLoading={pingLoading}
        />
        <div className="text-base text-muted-foreground mt-2">
          地址：<span className="font-mono">{safeText(serverData?.hostname || serverIp)}</span>
          {serverData?.port && <> : <span className="font-mono">{safeText(serverData.port)}</span></>}
        </div>
      </CardHeader>

      <CardContent className="space-y-8 pt-4">
        {/* 详细信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl bg-muted/60 dark:bg-zinc-800/60 p-7 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-6 w-6 text-indigo-500" />
              <span className="font-semibold text-lg">服务器版本</span>
            </div>
            <div className="font-mono text-xl">{safeText(serverData?.version)}</div>
            <div className="text-base text-muted-foreground">
              协议号: {safeText(serverData?.protocol)}
            </div>
          </div>
          <div className="rounded-xl bg-muted/60 dark:bg-zinc-800/60 p-7 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-6 w-6 text-orange-500" />
              <span className="font-semibold text-lg">服务器软件</span>
            </div>
            <div className="font-mono text-xl">{safeText(serverData?.software)}</div>
            <div className="text-base text-muted-foreground">
              {Array.isArray(serverData?.plugins) && <>插件数: {serverData.plugins.length} </>}
              {Array.isArray(serverData?.mods) && <>模组数: {serverData.mods.length}</>}
              {!Array.isArray(serverData?.plugins) && !Array.isArray(serverData?.mods) && "无插件/模组信息"}
            </div>
          </div>
        </div>

        {/* 运行时间 */}
        <div className="rounded-xl bg-gradient-to-r from-blue-100/60 to-purple-100/60 dark:from-zinc-800 dark:to-zinc-900 p-7 flex items-center gap-4 shadow">
          <Timer className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">服务器已运行</span>
          <span className="font-mono text-primary text-xl">
            {serverTime === null ? <span className="text-muted-foreground">加载中...</span> : serverTime}
          </span>
        </div>

        {/* MOTD */}
        <div className="rounded-xl bg-gradient-to-r from-teal-50/80 to-blue-50/80 dark:from-zinc-800 dark:to-zinc-900 p-7 flex items-start gap-4 shadow">
          <MessageSquare className="h-7 w-7 text-teal-600 mt-1 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-lg mb-2">服务器 MOTD</div>
            <MotdHtml html={serverData?.motd?.html} />
          </div>
        </div>

        {/* 玩家列表 */}
        {serverData?.players?.list && serverData.players.list.length > 0 && (
          <div className="rounded-xl bg-muted/60 dark:bg-zinc-800/60 p-7 shadow-sm">
            <div className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Users className="h-6 w-6 text-green-500" />
              在线玩家列表
            </div>
            <div className="overflow-x-auto rounded-lg border dark:border-zinc-700">
              <table className="w-full text-base">
                <thead>
                  <tr className="bg-muted dark:bg-zinc-700">
                    <th className="px-4 py-3 text-left">玩家名称</th>
                    <th className="px-4 py-3 text-left">UUID</th>
                  </tr>
                </thead>
                <tbody>
                  {serverData.players.list.map((player, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 dark:hover:bg-zinc-700/50">
                      <td className="px-4 py-3">{safeText(player.name)}</td>
                      <td className="px-4 py-3 font-mono">{safeText(player.uuid)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 查询说明 */}
        <div className="text-base text-muted-foreground text-center mt-8">
          可通过 <span className="font-mono bg-muted dark:bg-zinc-700 px-2 rounded">?serverip=[serverIp]&pingip=[pingIp]</span> 查询自定义服务器状态和延迟
        </div>
      </CardContent>
    </Card>
  )
}
