"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function AiLinkPage() {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const encodedUrl = searchParams.get("url");
    
    if (!encodedUrl) {
      setError("未找到目标链接");
      setIsLoading(false);
      return;
    }

    try {
      const decodedUrl = decodeURIComponent(encodedUrl);
      const parsedUrl = new URL(decodedUrl);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        setError("不支持的协议类型");
        setIsLoading(false);
        return;
      }

      setUrl(decodedUrl);
      setIsLoading(false);
    } catch {
      setError("无效的链接格式");
      setIsLoading(false);
    }
  }, []);

  const handleRedirect = () => {
    if (url && hasConfirmed) {
      setHasRedirected(true);
      window.location.href = url;
    }
  };

  const handleCancel = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  正在处理链接...
                </h1>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  链接处理失败
                </h1>
                <p className="text-slate-600 dark:text-slate-400">{error}</p>
                <button
                  onClick={handleCancel}
                  className="mt-4 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  返回上一页
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    外部链接警告
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    您即将离开本站，访问外部链接
                  </p>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl p-4 break-all border border-slate-200 dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                    目标地址：
                  </p>
                  <p className="text-slate-900 dark:text-white font-mono text-sm">
                    {url}
                  </p>
                </div>

                <div className="w-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-6 max-w-lg">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div className="text-left">
                      <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                        风险提示
                      </h3>
                      <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1.5">
                        <li>• 外部链接的内容不受本站控制</li>
                        <li>• 本站不对外部网站的安全性负责</li>
                        <li>• 请谨慎提供个人信息或进行交易</li>
                        <li>• 如果不确定链接的安全性，请不要访问</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer w-full max-w-lg">
                  <input
                    type="checkbox"
                    checked={hasConfirmed}
                    onChange={(e) => setHasConfirmed(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400 text-left">
                    我已阅读并理解上述风险提示，确认要访问此链接。我明白该链接可能存在安全风险，且本站不对由此产生的任何后果负责。
                  </span>
                </label>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleRedirect}
                    disabled={!hasConfirmed || hasRedirected}
                    className={`flex items-center gap-2 px-8 py-3 font-medium rounded-xl transition-all ${
                      hasConfirmed && !hasRedirected
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {hasRedirected ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        正在跳转...
                      </>
                    ) : (
                      <>
                        确认访问
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    取消
                  </button>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-600">
                  点击"确认访问"即表示您同意承担访问此外部链接的全部风险
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}