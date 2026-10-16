"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function parseGatewayError(html: string): string {
  const rayId = html.match(/Cloudflare Ray ID:.*?<strong[^>]*>([^<]+)<\/strong>/s)?.[1]?.trim() ?? "";
  console.error("[GatewayError]", rayId || "unknown", html.slice(0, 500));
  return rayId
    ? `服务暂时不可用，请稍后重试（错误码: ${rayId}）`
    : "服务暂时不可用，请稍后重试（如持续出现请联系管理员）";
}

export default function LoginContent() {
  const [loginMode, setLoginMode] = useState<"username" | "email">("username");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const redirect = searchParams.get("redirect");
    const provider = document.cookie
      .split("; ")
      .find((c) => c.startsWith("ep_provider="))
      ?.split("=")[1];
    if (provider === "github") {
      router.push(redirect || "/");
      return;
    }
    const ghErr = searchParams.get("error");
    if (ghErr?.startsWith("github_")) {
      setError("GitHub 登录失败，请重试或使用用户名密码登录");
    }
  }, [router, searchParams]);

  function setCookie(name: string, value: string, days = 7) {
    if (typeof window === "undefined") return;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    const encodedValue = encodeURIComponent(value);
    const secure = window.location.protocol === "https:" ? "Secure;" : "";
    document.cookie = `${name}=${encodedValue}; ${expires}; path=/; SameSite=Lax; ${secure}`;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    const loginId = loginMode === "email" ? email.trim() : username.trim();

    if (!loginId) {
      setError(loginMode === "email" ? "请输入邮箱地址" : "请输入用户名");
      return;
    }

    if (loginMode === "username") {
      if (!/^[a-zA-Z0-9_-]{3,16}$/.test(loginId)) {
        setError("用户名应为字母、数字、下划线或连字符，长度 3-16 位");
        return;
      }
    } else {
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(loginId)) {
        setError("请输入有效的邮箱地址");
        return;
      }
    }

    if (!password.trim() || password.length < 6) {
      setError("密码长度不能少于 6 位");
      return;
    }
    if (!agreeTerms) {
      setError("请阅读并同意用户协议与隐私政策");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: loginId, password }),
      });

      if (res.status >= 502 && res.status <= 504) {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("text/html")) {
          const html = await res.text();
          setError(parseGatewayError(html));
        } else {
          setError("服务暂时不可用，请稍后重试");
        }
        return;
      }

      if (res.status === 429) {
        const retryAfter = res.headers.get("retry-after");
        const waitText = retryAfter ? `请 ${retryAfter} 秒后再试` : "请稍后再试";
        setError(`尝试过于频繁，账号已被临时锁定或限流，${waitText}`);
        return;
      }

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await res.json();
      } else {
        setError("服务器返回格式异常，请稍后重试");
        return;
      }

      if (res.ok && data.success === true) {
        const userName =
          data.name && /^[a-zA-Z0-9_-]{3,16}$/.test(data.name)
            ? data.name
            : loginMode === "username"
              ? loginId
              : "";
        if (userName) setCookie("mc_user", userName);
        const redirect = searchParams.get("redirect") || "/";
        router.push(redirect);
        router.refresh();
      } else {
        setError(data.message || data.detail || "登录失败，请检查用户名和密码");
      }
    } catch (err) {
      console.error("登录错误:", err);
      setError("网络请求失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <main className="relative z-10 flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div
          className={`w-full max-w-md rounded-2xl bg-card p-6 shadow-lg backdrop-blur-md transition-all duration-700 sm:p-8 ${
            showForm ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <svg
                className="h-8 w-8 text-foreground/60"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-foreground">欢迎回来</h1>
            <p className="text-sm text-muted-foreground">
              {loginMode === "email" ? "使用邮箱登录你的账号" : "使用用户名登录你的账号"}
            </p>
          </div>

          <div className="mb-6 flex rounded-lg bg-secondary p-1">
            <button
              type="button"
              onClick={() => {
                setLoginMode("username");
                setEmail("");
                setError("");
              }}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                loginMode === "username"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              用户名
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginMode("email");
                setUsername("");
                setError("");
              }}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                loginMode === "email"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              邮箱
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            {error && (
              <div
                className="rounded-lg bg-destructive/10 px-4 py-2.5 text-sm text-destructive/90 shadow-sm"
                role="alert"
              >
                {error}
              </div>
            )}

            {loginMode === "username" ? (
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-foreground">
                  用户名
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg bg-secondary px-4 py-2.5 text-foreground transition-all duration-200 placeholder:text-muted-foreground/50 focus:bg-background focus:ring-2 focus:ring-ring/30 focus:outline-none"
                  placeholder="输入用户名（3-16位）"
                  autoComplete="username"
                  disabled={loading}
                  maxLength={16}
                  aria-invalid={error ? "true" : "false"}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  邮箱
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-secondary px-4 py-2.5 text-foreground transition-all duration-200 placeholder:text-muted-foreground/50 focus:bg-background focus:ring-2 focus:ring-ring/30 focus:outline-none"
                  placeholder="输入邮箱地址"
                  autoComplete="email"
                  disabled={loading}
                  maxLength={254}
                  aria-invalid={error ? "true" : "false"}
                />
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                密码
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-secondary px-4 py-2.5 text-foreground transition-all duration-200 placeholder:text-muted-foreground/50 focus:bg-background focus:ring-2 focus:ring-ring/30 focus:outline-none"
                placeholder="输入密码（至少6位）"
                autoComplete="current-password"
                disabled={loading}
                minLength={6}
              />
            </div>

            <div className="mt-2 flex items-start gap-2.5">
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-foreground focus:ring-2 focus:ring-ring/30"
                disabled={loading}
              />
              <label htmlFor="agreeTerms" className="text-sm text-muted-foreground select-none">
                我已阅读并同意
                <Link
                  href="/terms"
                  target="_blank"
                  className="mx-1 font-medium text-foreground hover:underline"
                >
                  《用户协议》
                </Link>
                与
                <Link
                  href="/privacy"
                  target="_blank"
                  className="mx-1 font-medium text-foreground hover:underline"
                >
                  《隐私政策》
                </Link>
              </label>
            </div>

            <p className="text-sm text-muted-foreground">
              为保障账号与数据安全，暂不支持网页直接注册。请先加入服务器，再使用注册指令完成创建。
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-foreground px-4 py-2.5 font-medium text-background shadow-sm transition-all duration-200 hover:bg-foreground/90 focus:ring-2 focus:ring-ring/30 focus:ring-offset-2 focus:outline-none active:scale-[0.98] disabled:opacity-70"
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="30 10"
                    />
                  </svg>
                  正在登录中...
                </span>
              ) : (
                "立即登录"
              )}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs text-muted-foreground">或使用第三方登录</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <a
            href="/api/auth/github"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 font-medium text-secondary-foreground transition-colors duration-200 hover:bg-secondary/70"
          >
            <img src="https://cdn.simpleicons.org/github/white" width="18" height="18" alt="GitHub" />
            使用 GitHub 登录
          </a>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            GitHub 登录为独立身份，无法查询 Minecraft 游戏资料
          </p>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/" className="font-medium text-foreground transition-all hover:underline">
              ← 返回首页
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
