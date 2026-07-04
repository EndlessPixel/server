'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/navigation';
import Footer from '@/components/footer';

// ---------- 常量定义（组件外部，避免重复创建） ----------
const BVID_MAP: Record<string, string> = {
  "3": "BV12XQfBkEZ1",
  "4": "BV1mXQfBkELs",
  "5": "BV1NtBqBVE1b",
  "6": "BV1KxBqByE7m",
  "7": "BV1bQBkBwEbb",
  "8": "BV1QQvUByEB6",
  "9": "BV1xerjBbEiG",
  "10": "BV12BchzDExx",
  "11": "BV1tVAgzNE9U",
  "12": "BV1DBMc6yE6K"
};
const EPISODE_ORDER = ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const DEFAULT_EP = "3";

// ---------- 内部组件 LiveContent ----------
function LiveContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const epFromUrl = searchParams.get('ep');

  const [current, setCurrent] = useState(DEFAULT_EP);
  const [copyTip, setCopyTip] = useState(''); // 复制成功提示

  // 同步 URL 参数与内部状态
  useEffect(() => {
    const target = epFromUrl && EPISODE_ORDER.includes(epFromUrl) ? epFromUrl : DEFAULT_EP;
    if (current !== target) {
      setCurrent(target);
      router.replace(`?ep=${target}`, { scroll: false });
    }
    // 只在 epFromUrl 变化时执行，避免无限循环
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epFromUrl, router]);

  // 切换集数（同时更新 URL）
  const handleChangeEpisode = useCallback((num: string) => {
    setCurrent(num);
    router.replace(`?ep=${num}`, { scroll: false });
  }, [router]);

  // ---------- 复制功能（支持剪贴板 API 与降级方案） ----------
  const copyToClipboard = useCallback((text: string, successMsg: string) => {
    const doCopy = () => {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => showTip(successMsg))
          .catch(() => fallbackCopy(text, successMsg));
      } else {
        fallbackCopy(text, successMsg);
      }
    };

    const fallbackCopy = (text: string, msg: string) => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        showTip(msg);
      } catch {
        alert('复制失败，请手动复制');
      }
      document.body.removeChild(textarea);
    };

    const showTip = (msg: string) => {
      setCopyTip(msg);
      setTimeout(() => setCopyTip(''), 2500);
    };

    doCopy();
  }, []);

  // 生成当前页面分享链接（基于当前路由）
  const getPageShareUrl = useCallback(() => {
    // 在客户端获取 origin 和 pathname
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${window.location.pathname}?ep=${current}`;
  }, [current]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-linear-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden transition-colors duration-300 pt-4">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-[120px] -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[100px] translate-x-1/3 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2260%22%20height%3D%2260%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2060%200%20L%200%200%200%2060%22%20fill%3D%22none%22%20stroke%3D%22rgba(0%2C0%2C0%2C0.05)%22%20stroke-width%3D%221%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22%2F%3E%3C%2Fsvg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cdefs%3E%3Cpattern%20id%3D%22grid%22%20width%3D%2260%22%20height%3D%2260%22%20patternUnits%3D%22userSpaceOnUse%22%3E%3Cpath%20d%3D%22M%2060%200%20L%200%200%200%2060%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%255%2C0.03)%22%20stroke-width%3D%221%22%2F%3E%3C%2Fpattern%3E%3C%2Fdefs%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22url(%23grid)%22%2F%3E%3C%2Fsvg%3E')] opacity-50 dark:opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* 标题 */}
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-blue-600 via-purple-500 to-pink-500 dark:from-white dark:via-blue-100 dark:to-purple-200 bg-clip-text text-transparent tracking-tight">
            EndlessPixel 服务器实况
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ---------- 左侧播放列表 ---------- */}
          <div className="lg:w-80 w-full">
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-5 bg-linear-to-b from-blue-500 to-purple-500 rounded-full" />
                    <h2 className="text-slate-800 dark:text-white font-bold text-lg">播放列表</h2>
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-full">{EPISODE_ORDER.length} 集</span>
                </div>
              </div>
              <div className="max-h-[calc(100vh-280px)] min-h-75 overflow-y-auto scrollbar-custom p-2">
                <div className="flex flex-col gap-1.5">
                  {EPISODE_ORDER.map((num) => {
                    const isActive = current === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleChangeEpisode(num)}
                        className={`group relative w-full text-left transition-all rounded-xl overflow-hidden ${
                          isActive
                            ? "bg-linear-to-r from-blue-600/90 to-blue-700/90 shadow-lg shadow-blue-500/20"
                            : "hover:bg-black/10 dark:hover:bg-white/10 bg-black/5 dark:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3 px-4 py-3">
                          <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono font-bold ${
                            isActive ? "bg-white/20 text-white" : "bg-black/10 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                          }`}>
                            {num}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${
                              isActive ? "text-white" : "text-slate-800 dark:text-slate-300"
                            }`}>
                              第{num}期
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ---------- 右侧视频播放器 ---------- */}
          <div className="flex-1">
            <div className="group relative">
              <div className="relative bg-black/10 dark:bg-black/40 backdrop-blur-sm rounded-2xl p-2 border border-black/15 dark:border-white/20 shadow-2xl">
                <div className="relative overflow-hidden rounded-xl">
                  <iframe
                    src={`//player.bilibili.com/player.html?bvid=${BVID_MAP[current]}&page=1&high_quality=1&muted=0&autoplay=1`}
                    className="w-full aspect-video border-0"
                    allowFullScreen
                    allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                    title="B站视频播放器"
                  />
                </div>
              </div>

              {/* 原始的两个跳转按钮 */}
              <a
                href={`https://www.bilibili.com/video/${BVID_MAP[current]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block w-full text-center bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                🎬 前往 B 站观看 第{current}期
              </a>
              <a
                href="https://space.bilibili.com/3546799478409405"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block w-full text-center bg-pink-600/90 hover:bg-pink-600 text-white py-2 rounded-xl text-sm transition-all"
              >
                🔔 欢迎关注 UP 主：system_mini
              </a>

              {/* ---------- 新增：复制分享链接按钮组 ---------- */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(
                    `https://www.bilibili.com/video/${BVID_MAP[current]}`,
                    '✅ 已复制 B站视频链接'
                  )}
                  className="flex-1 min-w-30 bg-slate-700/80 hover:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  📋 复制B站链接
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const shareUrl = getPageShareUrl();
                    if (shareUrl) {
                      copyToClipboard(shareUrl, '✅ 已复制页面分享链接');
                    }
                  }}
                  className="flex-1 min-w-30 bg-emerald-600/80 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  📋 复制页面链接
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Toast 提示 ---------- */}
      {copyTip && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm shadow-lg transition-all duration-200">
          {copyTip}
        </div>
      )}
    </div>
  );
}

// ---------- 主页面组件（带 Suspense） ----------
export default function LivePage() {
  return (
    <>
      <Navigation />
      <Suspense fallback={
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-white text-lg">
          加载中...
        </div>
      }>
        <LiveContent />
      </Suspense>
      <Footer />

      {/* 自定义滚动条样式（修复颜色） */}
      <style jsx>{`
        .scrollbar-custom::-webkit-scrollbar { width: 4px; }
        .scrollbar-custom::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #3b82f6, #a855f6); border-radius: 10px; }
        .dark .scrollbar-custom::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
      `}</style>
    </>
  );
}