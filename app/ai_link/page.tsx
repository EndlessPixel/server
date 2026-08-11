"use client";

import { useEffect, useState } from "react";
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

      const allowProtocols = ["http:", "https:"];
      if (!allowProtocols.includes(parsedUrl.protocol)) {
        setErrorMsg(`不支持协议：${parsedUrl.protocol}，仅允许 http / https 链接`);
        setPageStatus("error");
        return;
      }

      setUrl(decodedUrl);

      if (TRUSTED_HOSTS.has(parsedUrl.hostname)) {
        window.location.href = decodedUrl;
        return;
      }

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
    window.location.href = url;
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
      <main className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {pageStatus === "loading" ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-foreground/60 animate-spin" />
                </div>
                <h1 className="text-2xl font-semibold text-foreground">
                  正在处理链接...
                </h1>
              </div>
            ) : pageStatus === "error" ? (
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h1 className="text-2xl font-semibold text-foreground">
                  链接处理失败
                </h1>
                <p className="text-muted-foreground">{errorMsg}</p>
                <button
                  onClick={handleCancel}
                  className="mt-4 px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/70 transition-colors duration-200"
                >
                  返回上一页
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-8">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                    外部链接警告
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    您即将离开 EndlessPixel 官方站点，访问外部链接
                  </p>
                </div>

                <div className="w-full bg-secondary rounded-xl p-4 break-all">
                  <p className="text-sm text-muted-foreground mb-1">
                    目标地址：
                  </p>
                  <p className="text-foreground font-mono text-sm">
                    {url}
                  </p>
                </div>

                <div className="w-full bg-secondary/80 rounded-xl p-6 max-w-lg ring-1 ring-foreground/5">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground mb-2">
                        风险提示
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-1.5">
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
                    className="mt-1 w-5 h-5 rounded accent-foreground focus:ring-2 focus:ring-ring/30 cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground text-left">
                    我已完整阅读并同意全部风险提示，自愿访问该外部链接，自行承担访问产生的全部风险与损失，EndlessPixel 不承担任何相关责任。
                  </span>
                </label>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handleRedirect}
                    disabled={!hasConfirmed || hasRedirected}
                    className={`flex items-center gap-2 px-8 py-3 font-medium rounded-xl transition-all duration-200 ${
                      hasConfirmed && !hasRedirected
                        ? "bg-foreground text-background shadow-sm hover:bg-foreground/90 active:scale-[0.97]"
                        : "bg-secondary text-muted-foreground/50 cursor-not-allowed"
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
                    className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/70 transition-colors duration-200"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}