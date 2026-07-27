"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Armchair,
  Pickaxe,
  Sprout,
  Target,
  Trophy,
  Gem,
  Flag,
  Lock,
  Sparkles,
  Cpu,
  Coins,
  Gamepad2,
  Heart,
  Users,
  Shield,
  Zap,
  Crown,
  Clock,
  Server,
  Package,
  Award,
  Rocket,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ServerIpBox from "./server-ip-box";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
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

  const features = [
    {
      title: "席地而坐",
      description: "空手右击台阶或楼梯即可坐下，和好友一起赏日落。",
      icon: Armchair,
    },
    {
      title: "连锁采集",
      description: "潜行+工具即可连锁挖掘，最多 128 个方块瞬间收入背包。",
      icon: Pickaxe,
    },
    {
      title: "农田守护",
      description: "踩踏不再破坏耕地，让你的作物安全成长。",
      icon: Sprout,
    },
    {
      title: "千种结构",
      description:
        "300+ 新结构：雪山村落、地下城、空中遗迹……每次启程都有惊喜。",
      icon: Target,
    },
    {
      title: "成就狂潮",
      description: "1000+ 全新成就，从骑马蹦极到击败巨型史莱姆，挑战永无止境。",
      icon: Trophy,
    },
    {
      title: "大师切割",
      description: "切石机新增 500+ 配方，木雕、基石、玻璃浮雕一键完成。",
      icon: Gem,
    },
    {
      title: "领地旗帜",
      description: "右键插旗即可创建领地，建筑与作物全程免疫他人破坏。",
      icon: Flag,
    },
    {
      title: "私人保险箱",
      description: "手持锁右击箱子即可上锁，只有你能查看，安心存放稀有装备。",
      icon: Lock,
    },
    {
      title: "超限附魔",
      description:
        "突破 30 级上限，20+ 全新魔咒：连锁、时停、吸血……打造神级装备。",
      icon: Sparkles,
    },
  ];

  const stats = [
    {
      icon: Target,
      label: "特色功能",
      value: "9+",
      description: "精心设计",
    },
    {
      icon: Clock,
      label: "服务时间",
      value: "18/7",
      description: "长时间服务",
    },
    {
      icon: Crown,
      label: "优质体验",
      value: "96.9%",
      description: "稳定运行",
    },
    {
      icon: Gem,
      label: "独特内容",
      value: "1800+",
      description: "丰富玩法",
    },
  ];

  const coreFeatures = [
    {
      icon: Cpu,
      title: "离线模式",
      description: "支持所有客户端",
    },
    {
      icon: Coins,
      title: "完全免费",
      description: "无任何付费内容",
    },
    {
      icon: Gamepad2,
      title: "原汁原味",
      description: "保持原始平衡",
    },
    {
      icon: Heart,
      title: "宽松规则",
      description: "自由探索创造",
    },
    {
      icon: Users,
      title: "活跃社区",
      description: "友好的玩家",
    },
    {
      icon: Shield,
      title: "安全保障",
      description: "反作弊系统",
    },
  ];

  const tagFeatures = [
    { icon: Zap, label: "原汁原味体验" },
    { icon: Coins, label: "完全免费游玩" },
    { icon: Crown, label: "自由探索创造" },
  ];

  return (
    <section
      ref={heroRef}
      className="relative py-12 md:py-24 lg:py-28 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* 欢迎标签 */}
          <motion.div
            className="inline-flex items-center gap-2 bg-secondary/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-foreground/70 mb-6 shadow-sm hover-lift"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              className="w-2 h-2 bg-foreground/30 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>欢迎来到 Minecraft 1.21.11 新世界</span>
          </motion.div>

          {/* 主标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-foreground tracking-tight">
              无尽像素 | EndlessPixel
            </h1>
            <motion.p
              className="text-xl sm:text-2xl font-light text-muted-foreground mt-2 mb-6 max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              一个创造
              <span className="font-semibold text-foreground">
                无限可能
              </span>
              的 Minecraft 服务器
            </motion.p>
          </motion.div>

          {/* 描述 */}
          <motion.p
            className="text-base sm:text-lg text-muted-foreground mb-6 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            一个充满活力与创意的 Minecraft
            社区！支持无需正版，让所有玩家都能轻松加入冒险之旅，体验愉快、多样、有趣的游戏玩法。
          </motion.p>

          {/* 特色标签 */}
          <motion.div
            className="text-sm sm:text-base text-muted-foreground mb-8 max-w-2xl mx-auto flex flex-wrap justify-center gap-2"
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
                  className="flex items-center gap-1 bg-secondary/80 backdrop-blur-sm px-3 py-1.5 rounded-full hover:bg-secondary transition-all duration-200 group cursor-default hover-lift"
                >
                  <Icon
                    className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors"
                  />
                  {feature.label}
                </motion.span>
              );
            })}
          </motion.div>

          {/* 服务器 IP */}
          <ServerIpBox />

          {/* CTA 按钮组 */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-12 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Link
              href="/status"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-foreground text-background font-medium text-sm shadow-sm hover-lift hover:shadow-md transition-shadow duration-200"
            >
              <Server className="w-4.5 h-4.5" />
              <span>服务器状态</span>
              <motion.div
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Link>

            <Link
              href="/live"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-secondary text-foreground font-medium text-sm shadow-sm hover-lift hover:bg-secondary/70 transition-colors duration-200"
            >
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
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-secondary/80 text-foreground font-medium text-sm shadow-sm hover-lift hover:bg-secondary transition-colors duration-200"
            >
              <Package className="w-4.5 h-4.5" />
              <span>官方整合包</span>
            </Link>

            <Link
              href="/gallery"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-secondary/80 text-foreground font-medium text-sm shadow-sm hover-lift hover:bg-secondary transition-colors duration-200"
            >
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

          {/* 硬件信息 */}
          <p className="mt-2 text-xs text-muted-foreground/60">
            硬件详情：Xeon Gold 6148 16 核 + 24GB 真实占用 + 磁盘 / 网络 / 负载全公开。
            <Link
              href="http://sys.epmc.qzz.io"
              className="ml-1 underline underline-offset-2 hover:text-foreground transition-colors"
              target="_blank"
            >
              查看监控 →
            </Link>
          </p>
          <br />
          <br />

          {/* 核心特性 */}
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
                >
                  <Card className="group bg-card hover-lift transition-shadow duration-300 overflow-hidden cursor-pointer relative rounded-2xl shadow-sm hover:shadow-md">
                    <CardContent className="p-4 text-center relative z-10">
                      <motion.div
                        className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-foreground/10 transition-colors duration-300"
                      >
                        <Icon
                          className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors"
                        />
                      </motion.div>
                      <h3 className="font-semibold text-sm text-foreground mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
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

      {/* 统计数据 */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-foreground tracking-tight">
            服务器特色功能
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
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
                <div className="relative bg-card rounded-2xl p-4 md:p-8 text-center shadow-sm hover-lift hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-lg font-semibold text-foreground">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 特性卡片 */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className="hover-lift"
              >
                <Card className="group bg-card transition-shadow duration-300 hover:shadow-md cursor-pointer overflow-hidden relative rounded-2xl">
                  <CardHeader className="text-center p-6 md:p-10 relative z-10">
                    <div className="flex justify-center mb-4 md:mb-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-secondary rounded-[1.75rem] flex items-center justify-center group-hover:bg-foreground/10 transition-colors duration-300">
                        <Icon className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-bold text-foreground mb-3">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm md:text-lg text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA 底部 */}
        <motion.div
          className="text-center mt-10 md:mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-card rounded-[2rem] p-6 md:p-12 max-w-4xl mx-auto shadow-sm">
            <Award className="w-12 h-12 md:w-16 md:h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              准备好开始冒险了吗？
            </h3>
            <p className="text-base md:text-xl text-muted-foreground mb-6 leading-relaxed">
              加入我们的服务器，体验这些丰富的特色功能，开启你的 Minecraft
              新篇章
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/downloads"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-semibold shadow-sm hover-lift hover:shadow-md transition-shadow duration-200"
              >
                <Rocket className="w-5 h-5" />
                下载客户端
              </Link>
              <Link
                href="/status"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-xl font-semibold shadow-sm hover-lift hover:bg-secondary/70 transition-colors duration-200"
              >
                <TrendingUp className="w-5 h-5" />
                查看状态
              </Link>
              <a
                href="https://qm.qq.com/q/sFrax2Ilxe"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-xl font-semibold shadow-sm hover-lift hover:bg-secondary/70 transition-colors duration-200"
              >
                <Heart className="w-5 h-5" />
                加入社区
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
