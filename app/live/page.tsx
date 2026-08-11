'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// ---------- 常量定义 ----------
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
  const [copyTip, setCopyTip] = useState('');

  useEffect(() => {
    const target = epFromUrl && EPISODE_ORDER.includes(epFromUrl) ? epFromUrl : DEFAULT_EP;
    if (current !== target) {
      setCurrent(target);
      router.replace(`?ep=${target}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epFromUrl, router]);

  const handleChangeEpisode = useCallback((num: string) => {
    setCurrent(num);
    router.replace(`?ep=${num}`, { scroll: false });
  }, [router]);

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

  const getPageShareUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${window.location.pathname}?ep=${current}`;
  }, [current]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-background transition-colors duration-300 pt-4">
      {/* 移除所有背景装饰（彩色光晕和网格） */}

      <div className="relative max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* 标题 - 纯灰阶 */}
        <div className="mb-6 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            EndlessPixel 服务器实况
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* ---------- 左侧播放列表 ---------- */}
          <div className="lg:w-80 w-full">
            <div className="bg-card rounded-2xl border border-foreground/8 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-foreground/8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* 竖条改为灰色 */}
                    <div className="w-1.5 h-5 bg-foreground/40 rounded-full" />
                    <h2 className="text-foreground font-bold text-lg">播放列表</h2>
                  </div>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    {EPISODE_ORDER.length} 集
                  </span>
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
                            ? "bg-foreground shadow-sm"
                            : "bg-secondary hover:bg-secondary/70"
                        }`}
                      >
                        <div className="flex items-center gap-3 px-4 py-3">
                          <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-mono font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-secondary/70 text-foreground/60"
                          }`}>
                            {num}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium truncate ${
                              isActive ? "text-white" : "text-foreground/70"
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
              <div className="relative bg-black/5 dark:bg-black/20 rounded-2xl p-2 border border-foreground/8 shadow-sm">
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

              {/* 跳转按钮 - 纯灰 */}
              <a
                href={`https://www.bilibili.com/video/${BVID_MAP[current]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block w-full text-center bg-foreground hover:bg-foreground/85 text-background py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all"
              >
                🎬 前往 B 站观看 第{current}期
              </a>
              <a
                href="https://space.bilibili.com/3546799478409405"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block w-full text-center bg-secondary hover:bg-secondary/70 text-foreground/70 py-2 rounded-xl text-sm transition-all"
              >
                🔔 欢迎关注 UP 主：system_mini
              </a>

              {/* 复制按钮组 - 纯灰 */}
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(
                    `https://www.bilibili.com/video/${BVID_MAP[current]}`,
                    '✅ 已复制 B站视频链接'
                  )}
                  className="flex-1 min-w-30 bg-secondary hover:bg-secondary/70 text-foreground/70 py-2.5 rounded-xl text-sm font-medium transition-colors"
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
                  className="flex-1 min-w-30 bg-secondary hover:bg-secondary/70 text-foreground/70 py-2.5 rounded-xl text-sm font-medium transition-colors"
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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-card backdrop-blur-sm text-foreground px-5 py-2.5 rounded-full text-sm shadow-lg border border-foreground/8 transition-all duration-200">
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
      <Suspense fallback={
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center text-muted-foreground text-lg">
          加载中...
        </div>
      }>
        <LiveContent />
      </Suspense>

      {/* 自定义滚动条样式 - 灰阶 */}
      <style jsx>{`
        .scrollbar-custom::-webkit-scrollbar { width: 4px; }
        .scrollbar-custom::-webkit-scrollbar-track { background: rgba(0,0,0,0.05); border-radius: 10px; }
        .scrollbar-custom::-webkit-scrollbar-thumb { background: #9ca3af; border-radius: 10px; } /* gray-400 */
        .dark .scrollbar-custom::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .dark .scrollbar-custom::-webkit-scrollbar-thumb { background: #6b7280; } /* gray-500 */
      `}</style>
    </>
  );
}