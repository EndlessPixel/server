"use client";

import React from "react";
import type { ReactNode, JSX } from "react";
import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  { name: "四川成都电信", ip: "cd1.epmc.top" },
  { name: "江苏宿迁电信", ip: "sq.epmc.top" },
  { name: "上海多线IPV4", ip: "sh.epmc.top" },
  { name: "上海多线IPV6", ip: "ipv6.sh.epmc.top" },
] as const;

/* ---------------- SVG 图标 ---------------- */
const Icons = {
  ip: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM2 12h20M12 2v20" />
    </svg>
  ),
  port: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  ),
  version: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  software: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  motd: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
};

/* ---------------- 请求 ---------------- */
// Fetch with simple in-memory/session cache and timeout to improve responsiveness
async function fetchNode(ip: string): Promise<ServerData | null> {
  if (!ip) return null;
  const cacheKey = `mcsrv:${ip}`;
  try {
    // Try sessionStorage cache first (short TTL)
    const raw = sessionStorage.getItem(cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      const now = Date.now();
      // cache TTL 30s
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
    // store in session cache with timestamp
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ _ts: Date.now(), data }));
    } catch {}
    return data;
  } catch (e) {
    // fetch aborted or network error: fallback to cached value if exists (even expired)
    try {
      const raw = sessionStorage.getItem(`mcsrv:${ip}`);
      if (raw) return JSON.parse(raw).data as ServerData;
    } catch {}
    return null;
  }
}

function InfoCard({ icon, label, value }: { icon: JSX.Element; label: string; value?: React.ReactNode }) {
  return (
    <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <CardContent className="flex items-center gap-4 p-3">
        <div className="text-cyan-600 dark:text-cyan-400">{icon}</div>
        <div className="flex-1">
          <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">{value ?? "—"}</div>
        </div>
      </CardContent>
    </Card>
  );
}
const MemoInfoCard = React.memo(InfoCard);

/* ---------------- 主页面 ---------------- */
export default function McServerStatusPage() {
  const [active, setActive] = useState(0);
  const [data, setData] = useState<ServerData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    setData(null);
    fetchNode(NODES[active].ip).then((d) => {
      setData(d);
      setLoading(false);
    });
  }, [active]);
  return (
    <>
      <Navigation />
      <main className="p-6">
  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4">Minecraft 服务器状态 v3</h1>
        <button className="px-4 py-2 rounded-full text-sm font-medium transition border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white"><a href="/status">返回</a></button><br /><br />
        <div className="mb-6 text-sm text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 rounded-md p-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Warning: </h2>
          <p className="mt-2">由于服务器地址经常变更，请以官方群内公告为准，此处更新可能不及时。</p>
        </div>
        {/* 6 按钮 */ }
        <div className="flex flex-wrap gap-3 mb-6">
          {NODES.map((n, i) => (
            <button
              key={n.ip}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition border ${
                i === active
                  ? "bg-cyan-500 text-white border-cyan-500"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:border-cyan-400"
              }`}
            >
              {n.name}
            </button>
          ))}
        </div>

        {/* 单选项卡 */ }
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Card key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-24" />
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <MemoInfoCard icon={Icons.ip} label="IP 地址" value={data?.ip} />
            <MemoInfoCard icon={Icons.port} label="端口" value={data?.port ?? 25565} />
            <MemoInfoCard icon={Icons.version} label="版本" value={data?.version ?? (data?.protocol?.name ?? "—")} />
            <MemoInfoCard icon={Icons.software} label="核心/软件" value={data?.software ?? "—"} />
            <MemoInfoCard
              icon={Icons.users}
              label="在线玩家"
              value={data?.players ? `${data.players.online} / ${data.players.max}` : undefined}
            />

            {/* MOTD */}
            <Card className="bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl">
              <CardContent className="p-3">
                <div className="flex items-start gap-4">
                  <div className="text-cyan-600 dark:text-cyan-400">{Icons.motd}</div>
                  <div className="flex-1">
                    <div className="text-xs text-slate-500 dark:text-slate-400">MOTD</div>
                    <div className="text-sm text-slate-900 dark:text-slate-100 mt-1">
                      {data?.motd?.html ? (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: (data.motd.html || []).join("<br>").replace(/<[^>]+>/g, (t) => (t === "<br>" ? t : "")),
                          }}
                        />
                      ) : (
                        "—"
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Server icon */}
            {data?.icon && (
              <Card className="md:col-span-2 bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl">
                <CardContent className="p-3 flex items-center gap-4">
                  <div className="text-cyan-600 dark:text-cyan-400">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">服务器图标</div>
                    <img src={data.icon} alt="" className="w-16 h-16 mt-2 rounded-lg border border-slate-200 dark:border-slate-800" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Extra data: hostname, debug, protocol, map, plugins, mods, info */}
            <Card className="md:col-span-2 bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-100">更多服务器信息</div>
                  <div className="text-xs text-slate-500">实时数据来自 api.mcsrvstat.us</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">Hostname:</span> {data?.hostname ?? "—"}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">Server ID:</span> {data?.serverid ?? "—"}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">EULA Blocked:</span> {data?.eula_blocked ? "Yes" : "No"}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">Map:</span> {data?.map?.clean ?? data?.map?.raw ?? "—"}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">Gamemode:</span> {data?.gamemode ?? "—"}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">Protocol:</span> {data?.protocol ? `${data.protocol.name ?? ""} (${data.protocol.version ?? "-"})` : "—"}</div>
                </div>

                {/* Debug summary */}
                {data?.debug && (
                  <details className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-100 dark:border-slate-700">
                    <summary className="text-sm font-medium cursor-pointer">调试信息（展开查看）</summary>
                    <pre className="mt-2 text-xs overflow-auto text-slate-700 dark:text-slate-300">{JSON.stringify(data.debug, null, 2)}</pre>
                  </details>
                )}

                {/* plugins/mods/info/players */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-slate-500">Players</div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{data?.players ? `${data.players.online} / ${data.players.max}` : "—"}</div>
                    {data?.players?.list && data.players.list.length > 0 && (
                      <details className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        <summary className="cursor-pointer">玩家名单（{data.players.list.length}）</summary>
                        <ul className="mt-2 list-disc list-inside">
                          {data.players.list.map((p) => (
                            <li key={p.uuid} className="text-sm">{p.name}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>

                  <div>
                    <div className="text-xs text-slate-500">Plugins</div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{data?.plugins?.length ?? 0}</div>
                    {data?.plugins && data.plugins.length > 0 && (
                      <details className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        <summary className="cursor-pointer">查看插件</summary>
                        <ul className="mt-2 list-disc list-inside">
                          {data.plugins.map((pl, i) => (
                            <li key={i}>{pl.name} {pl.version ? <span className="text-xs text-slate-500">({pl.version})</span> : null}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>

                  <div>
                    <div className="text-xs text-slate-500">Mods</div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{data?.mods?.length ?? 0}</div>
                    {data?.mods && data.mods.length > 0 && (
                      <details className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        <summary className="cursor-pointer">查看 Mods</summary>
                        <ul className="mt-2 list-disc list-inside">
                          {data.mods.map((m, i) => (
                            <li key={i}>{m.name} {m.version ? <span className="text-xs text-slate-500">({m.version})</span> : null}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
