"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Map, Pickaxe, Sparkles, Target, Clock, Crown, Gem, Award, Rocket, TrendingUp, Heart, Armchair, Sprout, Trophy, Flag, Lock } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

// 动画配置
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12
    }
  }
}

const cardHoverVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  }
}

export function ServerFeatures() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [hoveredStat, setHoveredStat] = useState<string | null>(null)

  const features = [
    {
      title: "席地而坐",
      description: "空手右击台阶或楼梯即可坐下，和好友一起赏日落。",
      icon: Armchair,                // lucide-react
      color: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-100 dark:bg-sky-900/30",
      borderColor: "border-sky-200 dark:border-sky-800",
      gradient: "from-sky-500 to-cyan-500",
      lightGradient: "from-sky-50 to-cyan-50 dark:from-sky-950/20 dark:to-cyan-950/20"
    },
    {
      title: "连锁采集",
      description: "潜行+工具即可连锁挖掘，最多 128 个方块瞬间收入背包。",
      icon: Pickaxe,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      gradient: "from-emerald-500 to-green-500",
      lightGradient: "from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20"
    },
    {
      title: "农田守护",
      description: "踩踏不再破坏耕地，让你的作物安全成长。",
      icon: Sprout,
      color: "text-lime-600 dark:text-lime-400",
      bgColor: "bg-lime-100 dark:bg-lime-900/30",
      borderColor: "border-lime-200 dark:border-lime-800",
      gradient: "from-lime-500 to-yellow-500",
      lightGradient: "from-lime-50 to-yellow-50 dark:from-lime-950/20 dark:to-yellow-950/20"
    },
    {
      title: "千种结构",
      description: "300+ 新结构：雪山村落、地下城、空中遗迹……每次启程都有惊喜。",
      icon: Map,
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-100 dark:bg-violet-900/30",
      borderColor: "border-violet-200 dark:border-violet-800",
      gradient: "from-violet-500 to-purple-500",
      lightGradient: "from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20"
    },
    {
      title: "成就狂潮",
      description: "1000+ 全新成就，从骑马蹦极到击败巨型史莱姆，挑战永无止境。",
      icon: Trophy,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
      borderColor: "border-amber-200 dark:border-amber-800",
      gradient: "from-amber-500 to-orange-500",
      lightGradient: "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20"
    },
    {
      title: "大师切割",
      description: "切石机新增 500+ 配方，木雕、基石、玻璃浮雕一键完成。",
      icon: Gem,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-100 dark:bg-rose-900/30",
      borderColor: "border-rose-200 dark:border-rose-800",
      gradient: "from-rose-500 to-pink-500",
      lightGradient: "from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20"
    },
    {
      title: "领地旗帜",
      description: "右键插旗即可创建领地，建筑与作物全程免疫他人破坏。",
      icon: Flag,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      gradient: "from-indigo-500 to-blue-500",
      lightGradient: "from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20"
    },
    {
      title: "私人保险箱",
      description: "手持锁右击箱子即可上锁，只有你能查看，安心存放稀有装备。",
      icon: Lock,
      color: "text-orange-600 dark:text-orange-400",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      borderColor: "border-orange-200 dark:border-orange-800",
      gradient: "from-orange-500 to-amber-500",
      lightGradient: "from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20"
    },
    {
      title: "超限附魔",
      description: "突破 30 级上限，20+ 全新魔咒：连锁、时停、吸血……打造神级装备。",
      icon: Sparkles,
      color: "text-fuchsia-600 dark:text-fuchsia-400",
      bgColor: "bg-fuchsia-100 dark:bg-fuchsia-900/30",
      borderColor: "border-fuchsia-200 dark:border-fuchsia-800",
      gradient: "from-fuchsia-500 to-purple-500",
      lightGradient: "from-fuchsia-50 to-purple-50 dark:from-fuchsia-950/20 dark:to-purple-950/20"
    }
  ];

  const stats = [
    { icon: Target, label: "特色功能", value: "9+", color: "text-blue-500", description: "精心设计" },
    { icon: Clock, label: "服务时间", value: "18/7", color: "text-green-500", description: "长时间服务" },
    { icon: Crown, label: "优质体验", value: "96.9%", color: "text-yellow-500", description: "稳定运行" },
    { icon: Gem, label: "独特内容", value: "1800+", color: "text-purple-500", description: "丰富玩法" },
  ]

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

        {/* 浮动装饰圆 */}
        <motion.div
          className="absolute -top-20 -right-20 w-80 h-80 bg-linear-to-r from-cyan-200 to-blue-200 dark:from-cyan-800/20 dark:to-blue-800/20 rounded-full blur-3xl opacity-40"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-linear-to-r from-emerald-200 to-green-200 dark:from-emerald-800/20 dark:to-green-800/20 rounded-full blur-3xl opacity-40"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.3, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-full text-base font-medium text-slate-700 dark:text-slate-300 mb-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </motion.div>
            <span>丰富功能 • 优质体验</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="bg-linear-to-r from-slate-900 via-blue-700 to-cyan-600 dark:from-slate-100 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              服务器特色功能
            </span>
          </motion.h2>

          <motion.p
            className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            精心设计的游戏功能，全面提升你的 Minecraft 体验
          </motion.p>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover="hover"
                onHoverStart={() => setHoveredStat(stat.label)}
                onHoverEnd={() => setHoveredStat(null)}
              >
                <div
                  className="relative bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 text-center hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer"
                >
                  {/* 悬停光效 */}
                  <div className="absolute inset-0 bg-linear-to-br from-blue-50/30 to-cyan-50/20 dark:from-blue-900/10 dark:to-cyan-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine" />
                  </div>

                  <motion.div
                    className="w-16 h-16 bg-linear-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    whileHover={{
                      scale: 1.1,
                      rotate: [0, -5, 5, 0],
                    }}
                    transition={{
                      scale: { type: "spring", stiffness: 300 },
                      rotate: { duration: 0.6 }
                    }}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Icon className={`w-8 h-8 ${stat.color} group-hover:text-white relative z-10 transition-colors duration-300`} />
                  </motion.div>

                  <motion.div
                    className="text-3xl font-bold text-slate-900 dark:text-white mb-2 relative z-10"
                    animate={{ scale: hoveredStat === stat.label ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {stat.value}
                  </motion.div>

                  <div className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-1 relative z-10">
                    {stat.label}
                  </div>

                  <div className="text-sm text-slate-500 dark:text-slate-400 relative z-10">
                    {stat.description}
                  </div>

                  {/* 卡片边缘光效 */}
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* 功能卡片网格 */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover="hover"
                onHoverStart={() => setHoveredCard(feature.title)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card
                  className={`
                    group bg-linear-to-br ${feature.lightGradient} backdrop-blur-xl border-2 ${feature.borderColor}
                    transition-all duration-500 hover:shadow-2xl cursor-pointer
                    overflow-hidden relative
                  `}
                >
                  {/* 悬停光效 */}
                  <div className="absolute inset-0 bg-linear-to-br from-blue-50/30 to-cyan-50/20 dark:from-blue-900/10 dark:to-cyan-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine" />
                  </div>

                  <CardHeader className="text-center pb-8 pt-10 relative z-10">
                    <motion.div
                      className="flex justify-center mb-6"
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                      }}
                      transition={{
                        scale: { type: "spring", stiffness: 300 },
                        rotate: { duration: 0.6 }
                      }}
                    >
                      <div
                        className={`
                          w-20 h-20 ${feature.bgColor} rounded-3xl flex items-center justify-center
                          group-hover:shadow-2xl transition-all duration-500 relative overflow-hidden
                        `}
                      >
                        <div className={`absolute inset-0 bg-linear-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        <Icon className={`w-10 h-10 ${feature.color} group-hover:text-white relative z-10 transition-colors duration-300`} />
                      </div>
                    </motion.div>

                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                      {feature.title}
                    </CardTitle>

                    <CardDescription className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  {/* 底部装饰线 */}
                  <motion.div
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 ${feature.bgColor} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    animate={{ width: hoveredCard === feature.title ? "80px" : "64px" }}
                    transition={{ type: "spring", stiffness: 400 }}
                  />

                  {/* 卡片边缘光效 */}
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* 底部召唤行动 */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-12 border border-slate-200/60 dark:border-slate-700/60 max-w-4xl mx-auto relative overflow-hidden hover:shadow-2xl transition-all duration-500 group">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-50/30 to-cyan-50/20 dark:from-blue-900/10 dark:to-cyan-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine" />
            </div>

            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="relative z-10"
            >
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            </motion.div>

            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 relative z-10">
              准备好开始冒险了吗？
            </h3>

            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed relative z-10">
              加入我们的服务器，体验这些丰富的特色功能，开启你的 Minecraft 新篇章
            </p>

            <div className="flex flex-wrap gap-6 justify-center relative z-10">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="/downloads"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Rocket className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">下载客户端</span>
                </a>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="/status"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-600 text-slate-700 dark:text-slate-300 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-blue-50/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <TrendingUp className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">查看状态</span>
                </a>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=EmTbLSL3XG_bU20-aDi4o4k_8rgBMdhs&authKey=xnbJ26rO4MI2bAemGcUt3Wj8I0Dw0nY%2Bq5Bx1HHxK1j5MS%2Bh%2FKDCQy6kOVMBl4%2FD&noverify=0&group_code=870594910"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-600 hover:border-green-300 dark:hover:border-green-600 text-slate-700 dark:text-slate-300 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-green-50/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Heart className="w-6 h-6 text-green-600 dark:text-green-400 relative z-10" />
                  <span className="relative z-10">加入社区</span>
                </a>
              </motion.div>
            </div>

            {/* 底部装饰线 */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </motion.div>
      </div>
    </>
  )
}