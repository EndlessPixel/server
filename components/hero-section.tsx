"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      description: "300+ 新结构：雪山村落、地下城、空中遗迹……每次启程都有惊喜。",
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
      description: "突破 30 级上限，20+ 全新魔咒：连锁、时停、吸血……打造神级装备。",
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
    <section ref={heroRef} className="relative overflow-hidden py-12 md:py-24 lg:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* 欢迎标签 */}
          <motion.div
            className="hover-lift mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/80 px-4 py-2 text-sm font-medium text-foreground/70 shadow-sm backdrop-blur-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              className="h-2 w-2 rounded-full bg-foreground/30"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>欢迎来到 Minecraft 26.2 新世界</span>
          </motion.div>

          {/* 主标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              无尽像素 | EndlessPixel
            </h1>
            <motion.p
              className="mx-auto mt-2 mb-6 max-w-4xl text-xl font-light text-muted-foreground sm:text-2xl"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              一个创造
              <span className="font-semibold text-foreground">无限可能</span>的 Minecraft 服务器
            </motion.p>
          </motion.div>

          {/* 描述 */}
          <motion.p
            className="mx-auto mb-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            一个玩家自发组织的 Minecraft 社区。不用正版也能进服，想来随时加，怎么玩都行。
          </motion.p>

          {/* 特色标签 */}
          <motion.div
            className="mx-auto mb-8 flex max-w-2xl flex-wrap justify-center gap-2 text-sm text-muted-foreground sm:text-base"
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
                  className="group hover-lift flex cursor-default items-center gap-1 rounded-full bg-secondary/80 px-3 py-1.5 backdrop-blur-sm transition-all duration-200 hover:bg-secondary"
                >
                  <Icon className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                  {feature.label}
                </motion.span>
              );
            })}
          </motion.div>

          {/* 服务器 IP */}
          <ServerIpBox />

          {/* CTA 按钮组 */}
          <motion.div
            className="mx-auto mt-12 mb-12 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Link
              href="/status"
              className="hover-lift inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-foreground px-5 text-sm font-medium text-background shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              <Server className="h-4.5 w-4.5" />
              <span>服务器状态</span>
              <motion.div
                className="h-2 w-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Link>

            <Link
              href="/live"
              className="hover-lift inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-secondary px-5 text-sm font-medium text-foreground shadow-sm transition-colors duration-200 hover:bg-secondary/70"
            >
              <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>服务器实况</span>
            </Link>

            <Link
              href="/downloads/modpack"
              className="hover-lift inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-secondary/80 px-5 text-sm font-medium text-foreground shadow-sm transition-colors duration-200 hover:bg-secondary"
            >
              <Package className="h-4.5 w-4.5" />
              <span>官方整合包</span>
            </Link>

            <Link
              href="/gallery"
              className="hover-lift inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-secondary/80 px-5 text-sm font-medium text-foreground shadow-sm transition-colors duration-200 hover:bg-secondary"
            >
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <p className="mt-2 mb-12 text-xs text-muted-foreground/60">
            硬件详情：AMD Ryzen 9 9950X + 12GB 真实占用 + 磁盘 / 网络 / 负载全公开。
            <Link
              href="http://sys.epmc.qzz.io"
              className="ml-1 underline underline-offset-2 transition-colors hover:text-foreground"
              target="_blank"
            >
              查看监控 →
            </Link>
          </p>

          {/* 核心特性 */}
          <motion.div
            className="mx-auto grid max-w-6xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {coreFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} variants={itemVariants}>
                  <Card className="group hover-lift relative cursor-pointer overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow duration-300 hover:shadow-md">
                    <CardContent className="relative z-10 p-4 text-center">
                      <motion.div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary transition-colors duration-300 group-hover:bg-foreground/10">
                        <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                      </motion.div>
                      <h3 className="mb-1 text-sm font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-xs leading-relaxed text-muted-foreground">
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
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 text-center md:mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            服务器特色功能
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg">
            下面这些功能，都是我们自己玩的时候一点点加上去的
          </p>
        </motion.div>

        <motion.div
          className="mb-10 grid grid-cols-2 gap-3 md:mb-16 md:gap-6 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div key={stat.label} variants={itemVariants}>
                <div className="hover-lift relative rounded-2xl bg-card p-4 text-center shadow-sm transition-shadow duration-300 hover:shadow-md md:p-8">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary md:h-16 md:w-16">
                    <Icon className="h-6 w-6 text-muted-foreground md:h-8 md:w-8" />
                  </div>
                  <div className="mb-1 text-2xl font-bold text-foreground md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-foreground md:text-lg">
                    {stat.label}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{stat.description}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* 特性卡片 */}
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={itemVariants} className="hover-lift">
                <Card className="group relative cursor-pointer overflow-hidden rounded-2xl bg-card transition-shadow duration-300 hover:shadow-md">
                  <CardHeader className="relative z-10 p-6 text-center md:p-10">
                    <div className="mb-4 flex justify-center md:mb-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[1.75rem] bg-secondary transition-colors duration-300 group-hover:bg-foreground/10 md:h-20 md:w-20">
                        <Icon className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-foreground md:h-10 md:w-10" />
                      </div>
                    </div>
                    <CardTitle className="mb-3 text-xl font-bold text-foreground md:text-2xl">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground md:text-lg">
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
          className="mt-10 text-center md:mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="mx-auto max-w-4xl rounded-[2rem] bg-card p-6 shadow-sm md:p-12">
            <Award className="mx-auto mb-4 h-12 w-12 text-muted-foreground md:h-16 md:w-16" />
            <h3 className="mb-4 text-2xl font-bold text-foreground md:text-3xl">来试试看吧</h3>
            <p className="mb-6 text-base leading-relaxed text-muted-foreground md:text-xl">
              服务器一直开着，下载客户端就能进，想认识人也欢迎加群
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/downloads"
                className="hover-lift inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 font-semibold text-background shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <Rocket className="h-5 w-5" />
                下载客户端
              </Link>
              <Link
                href="/status"
                className="hover-lift inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 font-semibold text-foreground shadow-sm transition-colors duration-200 hover:bg-secondary/70"
              >
                <TrendingUp className="h-5 w-5" />
                查看状态
              </Link>
              <a
                href="https://qm.qq.com/q/sFrax2Ilxe"
                className="hover-lift inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 font-semibold text-foreground shadow-sm transition-colors duration-200 hover:bg-secondary/70"
              >
                <Heart className="h-5 w-5" />
                加入社区
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
