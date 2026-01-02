"use client";
import { launcherRepos } from "@/lib/launcherMeta";
import { getIcon } from "@/components/IconMap";
import { ArrowLeft, Download, Sparkles, Zap, Star, Users, Rocket } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

// 动画配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12
    }
  }
};

// 修复：添加 as const 断言，明确类型为字符串字面量
const cardHoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring" as const, // 关键修复：添加类型断言
      stiffness: 400,
      damping: 25
    }
  }
};

export function LauncherListPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-cyan-50/50 dark:from-slate-900 dark:via-blue-950/20 dark:to-cyan-950/10 relative overflow-hidden">
      {/* 背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-r from-blue-200 to-cyan-200 dark:from-blue-800/20 dark:to-cyan-800/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-r from-purple-200 to-pink-200 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-green-200 to-emerald-200 dark:from-green-800/10 dark:to-emerald-800/10 rounded-full blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* 头部区域 */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 bg-linear-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/50 px-6 py-3 rounded-2xl text-base font-semibold backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-5 h-5" />
            启动器下载中心
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold bg-linear-to-r from-slate-900 via-blue-800 to-cyan-700 dark:from-slate-100 dark:via-blue-300 dark:to-cyan-400 bg-clip-text text-transparent mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            选择您的启动器
          </motion.h1>
          
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            精选优质启动器，为您的游戏体验提供最佳支持
          </motion.p>
        </motion.div>

        {/* 返回按钮 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-12"
        >
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 group bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg"
          >
            <motion.div
              whileHover={{ x: -3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowLeft className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <span className="text-slate-700 dark:text-slate-300 font-medium group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
              返回首页
            </span>
          </Link>
        </motion.div>

        {/* 启动器网格 */}
        <motion.section 
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {launcherRepos.map((r, index) => (
            <motion.div
              key={r.key}
              variants={itemVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredCard(r.key)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Link
                href={`/downloads/launcher/${r.key}`}
                className="group block relative"
              >
                <motion.div
                  variants={cardHoverVariants}
                  className="relative p-8 bg-white/90 dark:bg-slate-800/80 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  {/* 背景装饰 */}
                  <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-cyan-50/30 dark:from-blue-900/10 dark:to-cyan-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* 悬停时的光效 */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine" />
                  </div>

                  {/* 顶部图标区域 */}
                  <div className="relative z-10">

                    {/* 标题和描述 */}
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">
                      {r.displayName}
                    </h3>
                    {/* 底部行动区域 */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                        <span>立即下载</span>
                        <motion.div
                          animate={{ x: hoveredCard === r.key ? 5 : 0 }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <Download className="w-4 h-4 ml-2" />
                        </motion.div>
                      </div>
                      
                      <motion.div
                        className="w-8 h-8 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/25"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Rocket className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>

                  {/* 卡片边缘光效 */}
                  <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.section>

        {/* 底部提示 */}
        <motion.div 
          className="text-center mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            找不到您需要的启动器？{" "}
            <Link 
              href="/downloads/custom_downloads" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              尝试自定义下载
            </Link>
             。或者，您也可以 
              <Link 
              href="https://github.com/EndlessPixel/server/blob/main/lib/launcherMeta.ts" 
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              贡献新启动器
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}