"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Server,
  Users,
  Heart,
  Shield,
  Gamepad2,
  Coins,
  Sparkles,
  Zap,
  Crown,
  Cpu,
  Package,
  Armchair,
  Clock,
  Flag,
  Gem,
  Pickaxe,
  Sprout,
  Target,
  Trophy,
  Award,
  Rocket,
  TrendingUp,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useState, useRef } from "react";
import ServerIpBox from "./server-ip-box";

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

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { amount: 0.1, once: true });
  const [, setHoveredCard] = useState<string | null>(null);
  const [] = useState<string | null>(null);

  const baseBtnClasses =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium h-11 px-5 rounded-md transition-all duration-300 relative overflow-hidden";

  const features = [
    {
      title: "席地而坐",
      description: "空手右击台阶或楼梯即可坐下，和好友一起赏日落。",
      icon: Armchair,
      color: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-100 dark:bg-sky-900/30",
      borderColor: "border-sky-200 dark:border-sky-800",
      gradient: "from-sky-500 to-cyan-500",
      lightGradient:
        "from-sky-50 to-cyan-50 dark:from-sky-950/20 dark:to-cyan-950/20",
    },
    {
      title: "连锁采集",
      description: "潜行+工具即可连锁挖掘，最多 128 个方块瞬间收入背包。",
      icon: Pickaxe,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      gradient: "from-emerald-500 to-green-500",
      lightGradient:
        "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20",
    },
    {
      title: "农田守护",
      description: "踩踏不再破坏耕地，让你的作物安全成长。",
      icon: Sprout,
      color: "text-lime-600 dark:text-lime-400",
      bgColor: "bg-lime-100 dark:bg-lime-900/30",
      borderColor: "border-lime-200 dark:border-lime-800",
      gradient: "from-lime-500 to-yellow-500",
      lightGradient:
        "from-lime-50 to-yellow-50 dark:from-lime-950/20 dark:to-yellow-950/20",
    },
    {
      title: "千种结构",
      description:
        "300+ 新结构：雪山村落、地下城、空中遗迹……每次启程都有惊喜。",
      icon: Target,
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-100 dark:bg-violet-900/30",
      borderColor: "border-violet-200 dark:border-violet-800",
      gradient: "from-violet-500 to-purple-500",
      lightGradient:
        "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20",
    },
    {
      title: "成就狂潮",
      description: "1000+ 全新成就，从骑马蹦极到击败巨型史莱姆，挑战永无止境。",
      icon: Trophy,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      borderColor: "border-amber-200 dark:border-amber-800",
      gradient: "from-amber-500 to-orange-500",
      lightGradient:
        "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
    },
    {
      title: "大师切割",
      description: "切石机新增 500+ 配方，木雕、基石、玻璃浮雕一键完成。",
      icon: Gem,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-100 dark:bg-rose-900/30",
      borderColor: "border-rose-200 dark:border-rose-800",
      gradient: "from-rose-500 to-pink-500",
      lightGradient:
        "from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20",
    },
    {
      title: "领地旗帜",
      description: "右键插旗即可创建领地，建筑与作物全程免疫他人破坏。",
      icon: Flag,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      gradient: "from-indigo-500 to-blue-500",
      lightGradient:
        "from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20",
    },
    {
      title: "私人保险箱",
      description: "手持锁右击箱子即可上锁，只有你能查看，安心存放稀有装备。",
      icon: Lock,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      borderColor: "border-orange-200 dark:border-orange-800",
      gradient: "from-orange-500 to-amber-500",
      lightGradient:
        "from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20",
    },
    {
      title: "超限附魔",
      description:
        "突破 30 级上限，20+ 全新魔咒：连锁、时停、吸血……打造神级装备。",
      icon: Sparkles,
      color: "text-fuchsia-600 dark:text-fuchsia-400",
      bgColor: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
      borderColor: "border-fuchsia-200 dark:border-fuchsia-800",
      gradient: "from-fuchsia-500 to-purple-500",
      lightGradient:
        "from-fuchsia-50 to-purple-50 dark:from-fuchsia-950/20 dark:to-purple-950/20",
    },
  ];

  const stats = [
    {
      icon: Target,
      label: "特色功能",
      value: "9+",
      color: "text-blue-500",
      description: "精心设计",
    },
    {
      icon: Clock,
      label: "服务时间",
      value: "18/7",
      color: "text-green-500",
      description: "长时间服务",
    },
    {
      icon: Crown,
      label: "优质体验",
      value: "96.9%",
      color: "text-yellow-500",
      description: "稳定运行",
    },
    {
      icon: Gem,
      label: "独特内容",
      value: "1800+",
      color: "text-purple-500",
      description: "丰富玩法",
    },
  ];

  const coreFeatures = [
    {
      icon: Cpu,
      title: "离线模式",
      description: "支持所有客户端",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Coins,
      title: "完全免费",
      description: "无任何付费内容",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      gradient: "from-yellow-500 to-amber-500",
    },
    {
      icon: Gamepad2,
      title: "原汁原味",
      description: "保持原始平衡",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Heart,
      title: "宽松规则",
      description: "自由探索创造",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: Users,
      title: "活跃社区",
      description: "友好的玩家",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      gradient: "from-purple-500 to-violet-500",
    },
    {
      icon: Shield,
      title: "安全保障",
      description: "反作弊系统",
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const tagFeatures = [
    { icon: Zap, label: "原汁原味体验", color: "text-yellow-500" },
    { icon: Coins, label: "完全免费游玩", color: "text-yellow-500" },
    { icon: Crown, label: "自由探索创造", color: "text-purple-500" },
  ];

  return (
    <section
      ref={heroRef}
      className="relative bg-linear-to-br from-slate-50 via-blue-50/40 to-emerald-50/60 dark:from-slate-900 dark:via-blue-950/30 dark:to-emerald-950/30 py-12 md:py-24 lg:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-50/20 via-transparent to-emerald-50/20 dark:from-blue-950/10 dark:via-transparent dark:to-emerald-950/10" />
        <motion.div
          className="absolute -top-24 -right-24 w-96 h-96 bg-linear-to-r from-blue-200 to-cyan-200 dark:from-blue-800/20 dark:to-cyan-800/20 rounded-full blur-3xl opacity-40"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-linear-to-r from-green-200 to-emerald-200 dark:from-green-800/20 rounded-full blur-3xl opacity-40"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.3, 0.4] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-r from-purple-200 to-pink-200 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-3xl opacity-30"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm  border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <Sparkles className="w-4 h-4 text-yellow-500" />
            </motion.div>
            <span>欢迎来到 Minecraft 1.21.11 新世界</span>
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              <span className="bg-linear-to-r from-slate-900 via-blue-700 to-emerald-600 dark:from-slate-100 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                无尽像素 | EndlessPixel
              </span>
            </h1>
            <motion.p
              className="text-xl sm:text-2xl font-light text-slate-600 dark:text-slate-400 mt-2 mb-6 max-w-4xl mx-auto leading-tight"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              一个创造
              <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">
                无限可能
              </span>
              的 Minecraft 服务器
            </motion.p>
          </motion.div>

          <motion.p
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            一个充满活力与创意的 Minecraft
            社区！支持无需正版，让所有玩家都能轻松加入冒险之旅，体验愉快、多样、有趣的游戏玩法。
          </motion.p>

          <motion.div
            className="text-sm sm:text-base text-slate-500 dark:text-slate-500 mb-8 max-w-2xl mx-auto flex flex-wrap justify-center gap-2"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {tagFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.span
                  key={feature.label}
                  variants={itemVariants}
                  className="flex items-center gap-1 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm px-3 py-1.5 rounded-full r-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${feature.color} group-hover:scale-110 transition-transform`}
                  />
                  {feature.label}
                </motion.span>
              );
            })}
          </motion.div>

          <ServerIpBox />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Link
              href="/status"
              className={`${baseBtnClasses} bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl`}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-6 -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              <Server className="w-4.5 h-4.5" />
              <span>服务器状态</span>
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Link>

            <Link
              href="/live"
              className={`${baseBtnClasses} bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl`}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-6 -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              <svg
                className="w-4.5 h-4.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>服务器实况</span>
            </Link>

            <Link
              href="/downloads/modpack"
              className={`${baseBtnClasses} bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm r-slate-200 dark:border-slate-700 hover:border-blue-300 text-slate-800 dark:text-slate-200 shadow-xl`}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-blue-50/30 to-transparent -skew-x-6 -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              <Package className="w-4.5 h-4.5" />
              <span>官方整合包</span>
            </Link>

            <Link
              href="/gallery"
              className={`${baseBtnClasses} bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-xl`}
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-6 -translate-x-full hover:translate-x-full transition-transform duration-700 pointer-events-none" />
              <svg
                className="w-4.5 h-4.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>玩家截图册</span>
            </Link>
          </motion.div>

          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            🧊 别的服务器：吹自己“稳定高性能”，监控藏得比什么都深。
            <br />
            我们：
            <span className="text-cyan-400 font-bold">
              Xeon Gold 6148 16 核 + 24GB 真实占用 + 磁盘 / 网络 / 负载全裸奔
            </span>
            。 想验证？链接就在下面，欢迎随时来对线。
            <Link
              href="http://sys.epmc.qzz.io"
              className="ml-1 underline underline-offset-2 hover:text-cyan-400"
              target="_blank"
            >
              点我公开处刑 →
            </Link>
          </p>
          <br />
          <br />

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {coreFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={itemVariants}
                  whileHover="hover"
                  onHoverStart={() => setHoveredCard(feature.title)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card className="group bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl  border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer relative">
                    <CardContent className="p-4 text-center relative z-10">
                      <motion.div
                        className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:shadow-md transition-all duration-300`}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Icon
                          className={`w-5 h-5 ${feature.color} group-hover:text-white transition-colors`}
                        />
                      </motion.div>
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      <div className="py-10 md:py-16" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-slate-900 via-blue-700 to-cyan-600 dark:from-slate-100 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              服务器特色功能
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            精心设计的游戏功能，全面提升你的 Minecraft 体验
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-10 md:mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={itemVariants}>
                <div className="relative bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl p-4 md:p-8 r-slate-200/60 dark:border-slate-700/60 text-center hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-lg font-semibold text-slate-700 dark:text-slate-300">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card
                  className={`group bg-linear-to-br ${feature.lightGradient} backdrop-blur-xl border-2 ${feature.borderColor} transition-all duration-300 hover:shadow-lg cursor-pointer overflow-hidden relative`}
                >
                  <CardHeader className="text-center p-6 md:p-10 relative z-10">
                    <div className="flex justify-center mb-4 md:mb-6">
                      <div
                        className={`w-16 h-16 md:w-20 md:h-20 ${feature.bgColor} rounded-2xl md:rounded-3xl flex items-center justify-center`}
                      >
                        <Icon
                          className={`w-8 h-8 md:w-10 md:h-10 ${feature.color}`}
                        />
                      </div>
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="text-center mt-10 md:mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 md:p-12 r-slate-200/60 dark:border-slate-700/60 max-w-4xl mx-auto">
            <Award className="w-12 h-12 md:w-16 md:h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
              准备好开始冒险了吗？
            </h3>
            <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              加入我们的服务器，体验这些丰富的特色功能，开启你的 Minecraft
              新篇章
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/downloads"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold shadow-lg"
              >
                <Rocket className="w-5 h-5" />
                下载客户端
              </Link>
              <Link
                href="/status"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-700  border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-semibold shadow-lg"
              >
                <TrendingUp className="w-5 h-5" />
                查看状态
              </Link>
              <a
                href="https://qm.qq.com/q/sFrax2Ilxe"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-700  border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl font-semibold shadow-lg"
              >
                <Heart className="w-5 h-5 text-green-600" />
                加入社区
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
