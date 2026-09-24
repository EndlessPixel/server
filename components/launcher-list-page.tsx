"use client";

import { useState, useEffect } from "react";
import { launcherRepos } from "@/lib/launcherMeta";
import {
  ArrowLeft,
  Download,
  Sparkles,
  Rocket,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileQuestion,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 12 },
  },
};

const cardHoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: { type: "spring" as const, stiffness: 400, damping: 25 },
  },
};

function LauncherCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card p-8 shadow-sm">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full" />
        <div className="flex items-center justify-between border-t border-foreground/5 pt-4">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function LauncherListPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [repoStatus, setRepoStatus] = useState<Record<string, boolean | "empty">>({});

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const promises = launcherRepos.map(async (repo) => {
          try {
            const res = await fetch(
              `https://api.github.com/repos/${repo.owner}/${repo.repo}/releases`,
              { signal: AbortSignal.timeout(5000) },
            );
            if (!res.ok) return { key: repo.key, status: false };
            const data = await res.json();
            if (!Array.isArray(data) || data.length === 0) {
              return { key: repo.key, status: "empty" as const };
            }
            const hasAssets = data.some(
              (release: { assets?: unknown[] }) =>
                Array.isArray(release.assets) && release.assets.length > 0,
            );
            return { key: repo.key, status: hasAssets ? true : ("empty" as const) };
          } catch {
            return { key: repo.key, status: false };
          }
        });
        const results = await Promise.all(promises);
        const statusMap: Record<string, boolean | "empty"> = {};
        results.forEach(({ key, status }) => {
          statusMap[key] = status;
        });
        setRepoStatus(statusMap);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchStatuses, 100);
    return () => clearTimeout(timer);
  }, []);

  const getReleaseStatus = (repo: (typeof launcherRepos)[0]) => {
    if (loading) return undefined;
    return repoStatus[repo.key] ?? repo.releases;
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-secondary px-6 py-3 text-base font-semibold shadow-sm"
          >
            <Sparkles className="h-5 w-5 text-foreground/60" />
            <span className="text-foreground/70">最后更新：2025/05/25</span>
          </motion.div>
          <motion.h1
            className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            选择您的启动器
          </motion.h1>
          <motion.p
            className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            下面这些启动器我们自己也用过，挑顺手的就行
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-3 rounded-2xl bg-card px-6 py-3 shadow-sm transition-all duration-300 hover:shadow-md"
            aria-label="返回首页"
          >
            <motion.div whileHover={{ x: -3 }} transition={{ type: "spring", stiffness: 400 }}>
              <ArrowLeft className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
            </motion.div>
            <span className="font-medium text-muted-foreground transition-colors group-hover:text-foreground">
              返回首页
            </span>
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <LauncherCardSkeleton />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.section
              key="content"
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {launcherRepos.map((r) => {
                const status = getReleaseStatus(r);
                return (
                  <motion.div
                    key={r.key}
                    variants={itemVariants}
                    whileHover="hover"
                    onHoverStart={() => setHoveredCard(r.key)}
                    onHoverEnd={() => setHoveredCard(null)}
                  >
                    <Link
                      href={`/downloads/launcher/${r.key}`}
                      className="group relative block"
                      aria-label={`下载 ${r.displayName} 启动器`}
                    >
                      <motion.div
                        variants={cardHoverVariants}
                        className="relative overflow-hidden rounded-2xl bg-card p-8 shadow-sm transition-shadow duration-500 hover:shadow-md"
                      >
                        <div className="relative z-10">
                          {status === true ? (
                            <motion.div
                              className="mb-4 inline-flex items-center gap-2 rounded-full bg-foreground/5 px-4 py-1.5 text-xs font-medium text-foreground/70"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1, type: "spring" }}
                            >
                              <CheckCircle className="h-3.5 w-3.5 text-foreground/50" />
                              已验证 - Releases已存在
                            </motion.div>
                          ) : status === "empty" ? (
                            <motion.div
                              className="mb-4 inline-flex items-center gap-2 rounded-full bg-foreground/5 px-4 py-1.5 text-xs font-medium text-foreground/70"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1, type: "spring" }}
                            >
                              <FileQuestion className="h-3.5 w-3.5 text-foreground/40" />
                              已验证 - Releases存在但无发布文件
                            </motion.div>
                          ) : status === false ? (
                            <motion.div
                              className="mb-4 inline-flex items-center gap-2 rounded-full bg-destructive/5 px-4 py-1.5 text-xs font-medium text-destructive/80"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1, type: "spring" }}
                            >
                              <XCircle className="h-3.5 w-3.5 text-destructive/60" />
                              已验证 - Releases不存在
                            </motion.div>
                          ) : (
                            <motion.div
                              className="mb-4 inline-flex items-center gap-2 rounded-full bg-foreground/5 px-4 py-1.5 text-xs font-medium text-foreground/60"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1, type: "spring" }}
                            >
                              <AlertCircle className="h-3.5 w-3.5 text-foreground/40" />
                              Releases存在性未验证
                            </motion.div>
                          )}
                          <h3 className="mb-3 text-2xl font-bold text-foreground">
                            {r.displayName}
                          </h3>

                          <div className="flex items-center justify-between border-t border-foreground/5 pt-4">
                            <div className="flex items-center text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
                              <span>立即下载</span>
                              <motion.div
                                animate={{ x: hoveredCard === r.key ? 5 : 0 }}
                                transition={{ type: "spring", stiffness: 500 }}
                              >
                                <Download className="ml-2 h-4 w-4" />
                              </motion.div>
                            </div>
                            <motion.div
                              className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background shadow-sm"
                              whileHover={{ scale: 1.1, rotate: 90 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              <Rocket className="h-4 w-4" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.section>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-16 border-t border-foreground/5 pt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-sm text-muted-foreground">
            找不到您需要的启动器？{" "}
            <Link
              href="/downloads/custom_downloads"
              className="font-medium text-foreground hover:underline"
              aria-label="前往自定义下载页面"
            >
              尝试自定义下载
            </Link>
            。或者，您也可以
            <Link
              href="https://github.com/EndlessPixel/server/blob/main/lib/launcherMeta.ts"
              className="font-medium text-foreground hover:underline"
              aria-label="前往 GitHub 贡献新启动器代码"
              target="_blank"
              rel="noopener noreferrer"
            >
              贡献新的启动器代码
            </Link>
            。
          </p>
        </motion.div>
      </div>
    </div>
  );
}
