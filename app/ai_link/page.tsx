"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ArrowRight, AlertCircle, Loader2 } from "lucide-react";

type PageStatus = "loading" | "error" | "warn";

// 可信域名白名单
const TRUSTED_HOSTS = new Set([
  "wiki.endlesspixel.cn",
  "www.endlesspixel.cn",
  "pcl2home.endlesspixel.cn",
]);

export default function AiLinkPage() {
  const [pageStatus, setPageStatus] = useState<PageStatus>("loading");
  const [url, setUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const encodedUrl = searchParams.get("url");

    if (!encodedUrl) {
      setErrorMsg("缺少跳转目标链接参数");
      setPageStatus("error");
      return;
    }

    try {
      let decodedUrl = decodeURIComponent(encodedUrl);
      const parsedUrl = new URL(decodedUrl);

      // 协议白名单校验
      const allowProtocols = ["http:", "https:"];
      if (!allowProtocols.includes(parsedUrl.protocol)) {
        setErrorMsg(`不支持协议：${parsedUrl.protocol}，仅允许 http / https 链接`);
        setPageStatus("error");
        return;
      }

      setUrl(decodedUrl);

      // 命中可信域名，直接自动跳转，不弹窗
      if (TRUSTED_HOSTS.has(parsedUrl.hostname)) {
        window.location.href = decodedUrl;
        return;
      }

      // 外部域名，进入风险确认页面
      setPageStatus("warn");
    } catch (e) {
      if (e instanceof URIError) {
        setErrorMsg("链接URI编码格式错误，无法解析");
      } else {
        setErrorMsg("目标链接格式不合法");
      }
      setPageStatus("error");
    }
  }, []);

  const handleRedirect = () => {
    if (!url || !hasConfirmed || hasRedirected) return;
    setHasRedirected(true);
    const newTab = window.open(url, "_blank", "noopener,noreferrer");
    if (!newTab) window.location.href = url;
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
            {pageStatus === "loading" ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  正在处理链接...
                </h1>
              </div>
            ) : pageStatus === "error" ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                  链接处理失败
                </h1>
                <p className="text-slate-600 dark:text-slate-400">{errorMsg}</p>
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
                    您即将离开 EndlessPixel 官方站点，访问外部链接
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
                        <li>• 外部链接内容不受 EndlessPixel 审核与管控</li>
                        <li>• 本站无法保证外部网站账号、资金、设备安全性</li>
                        <li>• 切勿输入游戏账号、手机号、密码、支付信息，谨防钓鱼诈骗</li>
                        <li>• 外部站点可能存在虚假服务器、恶意客户端、捆绑病毒</li>
                        <li>• 无法辨别链接安全性时，建议直接取消访问</li>
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
                    我已完整阅读并同意全部风险提示，自愿访问该外部链接，自行承担访问产生的全部风险与损失，EndlessPixel 不承担任何相关责任。
                  </span>
                </label>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleRedirect}
                    disabled={!hasConfirmed || hasRedirected}
                    className={`flex items-center gap-2 px-8 py-3 font-medium rounded-xl transition-all ${
                      hasConfirmed && !hasRedirected
                        ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-lg shadow-blue-500/25"
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
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}