"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/footer';
import {
  UserIcon,
  ShieldIcon,
  LogOutIcon,
  GlobeIcon,
  ActivityIcon,
  Loader2Icon,
  MapPinIcon,
  FingerprintIcon,
  CalendarIcon,
  BanIcon,
  QrCodeIcon,
} from 'lucide-react';

interface UserInfo {
  name: string;
  uuid: string;
  ip: string;
  ipLocation: string;
  createdAt: string;
  lastActive: string;
  ban: boolean;
  qq: {
    uuid: string;
    name: string;
  } | null;
}

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
        setUserInfo(data);
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

  // 格式化时间
  const formatTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      return date.toLocaleString('zh-CN', {
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

  // 获取相对时间
  const getRelativeTime = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return '刚刚';
      if (minutes < 60) return `${minutes} 分钟前`;
      if (hours < 24) return `${hours} 小时前`;
      if (days < 30) return `${days} 天前`;
      if (days < 365) return `${Math.floor(days / 30)} 个月前`;
      return `${Math.floor(days / 365)} 年前`;
    } catch {
      return timeStr;
    }
  };

  // 计算注册天数
  const getDaysSince = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      const now = new Date();
      return Math.floor((now.getTime() - date.getTime()) / 86400000);
    } catch {
      return 0;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl opacity-70"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl opacity-70"></div>
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300/20 dark:bg-indigo-600/10 rounded-full blur-3xl opacity-70"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-3xl opacity-70"></div>
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
              {/* 头像卡片 */}
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-linear-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg shadow-indigo-500/20">
                  {userInfo.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{userInfo.name}</h2>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                    <ShieldIcon className="w-3 h-3" />
                    普通用户
                  </span>
                  {userInfo.ban && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      <BanIcon className="w-3 h-3" />
                      已封禁
                    </span>
                  )}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <CalendarIcon className="w-4 h-4" />
                    <span>注册天数</span>
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
                  <LogOutIcon className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-indigo-500" />
                    基本信息
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50">
                    <span className="text-slate-500 dark:text-slate-400 text-sm">用户名</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{userInfo.name}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50">
                    <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5">
                      <FingerprintIcon className="w-3.5 h-3.5" />
                      UUID
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium font-mono text-sm">{userInfo.uuid}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50">
                    <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5">
                      <GlobeIcon className="w-3.5 h-3.5" />
                      最后登录 IP
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium font-mono text-sm">{userInfo.ip}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50">
                    <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      最后登录地点
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium text-sm">{userInfo.ipLocation}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50">
                    <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      注册时间
                    </span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium text-sm">{formatTime(userInfo.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50">
                    <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5">
                      <ActivityIcon className="w-3.5 h-3.5" />
                      最后登录
                    </span>
                    <div className="text-right">
                      <span className="text-slate-800 dark:text-slate-200 font-medium text-sm">{getRelativeTime(userInfo.lastActive)}</span>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{formatTime(userInfo.lastActive)}</p>
                    </div>
                  </div>
                  {/* === 新增：QQ 绑定信息 === */}
                  {userInfo.qq ? (
                    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700/50">
                      <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5">
                        <QrCodeIcon className="w-3.5 h-3.5" />
                        QQ 绑定
                      </span>
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://q.qlogo.cn/g?b=qq&nk=${userInfo.qq.uuid}&s=640`}
                          alt="QQ头像"
                          className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <div className="text-right">
                          <span className="text-slate-800 dark:text-slate-200 font-medium text-sm">
                            {userInfo.qq.name || userInfo.qq.uuid}
                          </span>
                          <p className="text-xs text-slate-400 dark:text-slate-500">QQ号: {userInfo.qq.uuid}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between py-3">
                      <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5">
                        <QrCodeIcon className="w-3.5 h-3.5" />
                        QQ 绑定
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-sm">未绑定</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5">
                      <BanIcon className="w-3.5 h-3.5" />
                      封禁状态
                    </span>
                    <span className={`text-sm font-medium ${userInfo.ban ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      {userInfo.ban ? '已封禁' : '正常'}
                    </span>
                  </div>
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