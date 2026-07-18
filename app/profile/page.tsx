"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/footer';
import {
  UserIcon,
  ShieldIcon,
  LogOutIcon,
  Loader2Icon,
  CalendarIcon,
  BanIcon,
  PackageIcon,
} from 'lucide-react';
import { enchantments } from '../../lib/enchantments';
import { getItemDisplayName } from '../../lib/items';

/* ---------- 类型定义 ---------- */
interface InventoryItem {
  id: string;
  Count?: number;
  count?: number;
  Slot?: number;
  tag?: {
    Damage?: number;
    Enchantments?: Array<{ id: string; lvl: number }>;
    display?: {
      Name?: string;
      Lore?: string[];
    };
  };
  components?: {
    'minecraft:damage'?: number;
    'minecraft:enchantments'?: Record<string, number>;
    'minecraft:lore'?: string[];
    'minecraft:custom_name'?: string;
  };
}

interface UserInfo {
  name: string;
  uuid: string;
  ip: string;
  ipLocation: string;
  createdAt: string;
  lastActive: string;
  ban: boolean;
  qq: { uuid: string; name: string } | null;
  inventory: InventoryItem[];
  nbt?: any;
}

/* ---------- 工具函数 ---------- */
const formatTime = (timeStr: string) => {
  try {
    return new Date(timeStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return timeStr;
  }
};

const getRelativeTime = (timeStr: string) => {
  try {
    const diff = Date.now() - new Date(timeStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return '刚刚';
    if (m < 60) return `${m} 分钟前`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} 小时前`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d} 天前`;
    const mo = Math.floor(d / 30);
    if (mo < 12) return `${mo} 个月前`;
    return `${Math.floor(mo / 12)} 年前`;
  } catch {
    return timeStr;
  }
};

const getDaysSince = (timeStr: string) => {
  try {
    return Math.floor((Date.now() - new Date(timeStr).getTime()) / 86400000);
  } catch {
    return 0;
  }
};

const parseMinecraftText = (text: any): string => {
  if (typeof text === 'string') {
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === 'string') return parsed;
      if (parsed.text) return parsed.text;
      if (parsed.extra) return parsed.extra.map((p: any) => p.text ?? '').join('');
    } catch {
      // not json
    }
    return text.replace(/§./g, '');
  }
  if (typeof text === 'object' && text !== null) {
    if (text.text) return text.text;
    if (text.extra) return text.extra.map((p: any) => p.text ?? '').join('');
    return JSON.stringify(text);
  }
  return String(text);
};

const getDisplayItemName = (item: InventoryItem): string => {
  const rawName = item.tag?.display?.Name ?? item.components?.['minecraft:custom_name'];
  if (rawName) return parseMinecraftText(rawName).replace(/§./g, '');
  return getItemDisplayName(item.id);
};

const getItemImageUrl = (itemId: string): string => {
  const id = itemId.replace('minecraft:', '');
  return `https://assets.mcasset.cloud/26.2/assets/minecraft/textures/item/${id}.png`;
};

/* ---------- 数据标准化 ---------- */
const normalizeInventory = (rawItems: any[]): InventoryItem[] => {
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .filter((item) => item && typeof item === 'object' && item.id)
    .map((item) => {
      // 如果已经是旧版 tag 格式，直接返回
      if (item.tag) return item;

      const comps = item.components || {};
      const enchantmentsObj = comps['minecraft:enchantments'] || {};
      const enchantments = Object.entries(enchantmentsObj).map(([id, lvl]) => ({ id, lvl }));

      const display: { Name?: string; Lore?: string[] } = {};
      if (comps['minecraft:custom_name']) display.Name = comps['minecraft:custom_name'];
      if (comps['minecraft:lore']) display.Lore = comps['minecraft:lore'];

      return {
        id: item.id,
        Count: item.count ?? item.Count ?? 1,
        Slot: item.Slot,
        tag: {
          Damage: comps['minecraft:damage'],
          Enchantments: enchantments.length ? enchantments : undefined,
          display: Object.keys(display).length ? display : undefined,
        },
      };
    });
};

/* ---------- 物品格子组件 ---------- */
const ItemSlot = ({ item }: { item?: InventoryItem }) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (item) setImgSrc(getItemImageUrl(item.id));
    else setImgSrc(undefined);
  }, [item]);

  if (!item) {
    return <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700/50 rounded border border-slate-300 dark:border-slate-600" />;
  }

  const displayName = getDisplayItemName(item);
  const count = item.Count ?? item.count ?? 1;
  const damage = item.tag?.Damage;
  const enchants = item.tag?.Enchantments;
  const lore = item.tag?.display?.Lore;

  // 解析 Lore（如果存在）
  const loreLines = lore?.map(l => parseMinecraftText(l).replace(/§./g, '')).filter(Boolean) || [];

  const handleImageError = () => {
    setImgSrc(getItemImageUrl(item.id).replace('.png', '_00.png'));
  };

  return (
    <div className="relative group w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center">
      {imgSrc && <img src={imgSrc} alt={displayName} className="w-8 h-8 object-contain" onError={handleImageError} />}
      {count > 1 && <span className="absolute bottom-0 right-0 text-[10px] text-white bg-black/60 px-1 rounded leading-none">{count}</span>}

      {/* 优化后的 Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black/90 text-white text-xs p-2.5 rounded-lg shadow-xl z-50 min-w-45 max-w-xs pointer-events-none border border-gray-700/80">
        {/* 物品名称 + 数量 */}
        <div className="font-bold text-yellow-200 mb-1.5">
          {displayName}
          {count > 1 && <span className="text-gray-400 ml-1 font-normal">×{count}</span>}
        </div>

        {/* 附魔 */}
        {enchants && enchants.length > 0 && (
          <div className="text-purple-300 italic space-y-0.5 mb-1">
            {enchants.map(e => (
              <div key={e.id} className="text-[11px]">
                {enchantments[e.id as keyof typeof enchantments] ?? e.id} {e.lvl}
              </div>
            ))}
          </div>
        )}

        {/* 耐久损耗 */}
        {damage !== undefined && (
          <div className="text-gray-400 text-[10px] mt-1">耐久损耗: {damage}</div>
        )}

        {/* Lore（自定义描述） */}
        {loreLines.length > 0 && (
          <div className="text-gray-300 text-[10px] mt-1.5 pt-1.5 border-t border-gray-600/50 space-y-0.5">
            {loreLines.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- 页面组件 ---------- */
export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch('/api/users/info');
        if (res.status === 401) {
          router.push('/login?redirect=/profile');
          return;
        }
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || '获取失败');
        }
        const data = await res.json();

        let inventory: InventoryItem[] = [];

        // 1. 从 nbt.Inventory 获取普通物品
        if (data.nbt?.Inventory && Array.isArray(data.nbt.Inventory)) {
          inventory = normalizeInventory(data.nbt.Inventory);
        }

        // 2. 从 nbt.equipment 获取盔甲
        if (data.nbt?.equipment && typeof data.nbt.equipment === 'object') {
          const equip = data.nbt.equipment;
          const slotMap: Record<string, number> = {
            head: 39,
            chest: 38,
            legs: 37,
            feet: 36,
          };
          for (const [key, item] of Object.entries(equip)) {
            // 修复类型错误：使用 'id' in item 进行类型守卫
            if (item && typeof item === 'object' && 'id' in item && (item as any).id) {
              const converted = normalizeInventory([item as any]);
              if (converted.length > 0) {
                const invItem = converted[0];
                invItem.Slot = slotMap[key]; // 强制设置槽位
                inventory.push(invItem);
              }
            }
          }
        }

        setUserInfo({ ...data, inventory });
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载用户信息失败');
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [router]);

  const handleLogout = () => {
    document.cookie = 'mc_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl opacity-70" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl opacity-70" />
        </div>
        <Navigation />
        <main className="flex-1 flex items-center justify-center relative z-10">
          <div className="flex flex-col items-center gap-4">
            <Loader2Icon className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">加载中...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getItemBySlot = (slot: number) => userInfo?.inventory.find((item) => item.Slot === slot);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl opacity-70" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl opacity-70" />
      </div>

      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl relative z-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">个人中心</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">查看你的账号信息</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50/80 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm shadow-sm">
            {error}
          </div>
        )}

        {userInfo && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* 左侧：用户概览 */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-indigo-500/20">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{userInfo.name}</h2>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                    <ShieldIcon className="w-3 h-3" />普通用户
                  </span>
                  {userInfo.ban && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      <BanIcon className="w-3 h-3" />已封禁
                    </span>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <CalendarIcon className="w-4 h-4" />注册天数
                  </div>
                  <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-white">
                    {getDaysSince(userInfo.createdAt)}
                    <span className="text-sm font-normal text-slate-500 dark:text-slate-400 ml-1">天</span>
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                >
                  <LogOutIcon className="w-4 h-4" />退出登录
                </button>
              </div>
            </div>

            {/* 右侧：详细信息 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 基本信息 */}
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-indigo-500" />基本信息
                  </h3>
                </div>

                <div className="space-y-4">
                  {[
                    ['用户名', userInfo.name],
                    ['UUID', userInfo.uuid],
                    ['最后登录 IP', userInfo.ip],
                    ['最后登录地点', userInfo.ipLocation],
                    ['注册时间', formatTime(userInfo.createdAt)],
                    [
                      '最后登录',
                      <>
                        <span>{getRelativeTime(userInfo.lastActive)}</span>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{formatTime(userInfo.lastActive)}</p>
                      </>,
                    ],
                  ].map(([label, value], idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50">
                      <span className="text-slate-500 dark:text-slate-400 text-sm">{label}</span>
                      <span className="text-slate-800 dark:text-slate-200 font-medium text-sm">{value}</span>
                    </div>
                  ))}

                  {/* QQ */}
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">QQ 绑定</span>
                    {userInfo.qq ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://q.qlogo.cn/g?b=qq&nk=${userInfo.qq.uuid}&s=640`}
                          alt="QQ头像"
                          className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600"
                          onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                        />
                        <div className="text-right">
                          <span className="text-slate-800 dark:text-slate-200 font-medium text-sm">
                            {userInfo.qq.name || userInfo.qq.uuid}
                          </span>
                          <p className="text-xs text-slate-400 dark:text-slate-500">QQ号: {userInfo.qq.uuid}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-500 text-sm">未绑定</span>
                    )}
                  </div>

                  {/* 封禁状态 */}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">封禁状态</span>
                    <span
                      className={`text-sm font-medium ${
                        userInfo.ban ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                      }`}
                    >
                      {userInfo.ban ? '已封禁' : '正常'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ===== 背包 ===== */}
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <PackageIcon className="w-5 h-5 text-indigo-500" />
                    背包物品
                    <span className="text-sm font-normal text-slate-400 ml-2">({userInfo.inventory.length})</span>
                  </h3>
                </div>

                {/* 盔甲 + 副手 */}
                <div className="flex items-center gap-2 mb-4">
                  {[39, 38, 37, 36].map((slot) => (
                    <ItemSlot key={`armor-${slot}`} item={getItemBySlot(slot)} />
                  ))}
                  <div className="w-4" />
                  <ItemSlot key="offhand" item={getItemBySlot(40)} />
                </div>

                {/* 主背包：3×9 */}
                <div className="grid grid-cols-9 gap-1 mb-4">
                  {Array.from({ length: 27 }, (_, i) => {
                    const slot = 9 + i;
                    return <ItemSlot key={`main-${slot}`} item={getItemBySlot(slot)} />;
                  })}
                </div>

                {/* 快捷栏：1×9 */}
                <div className="grid grid-cols-9 gap-1">
                  {Array.from({ length: 9 }, (_, i) => {
                    const slot = i;
                    return <ItemSlot key={`hotbar-${slot}`} item={getItemBySlot(slot)} />;
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}