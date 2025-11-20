"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pickaxe, Home, Zap, MapPin, Users, Shield, Sparkles, Target, Clock, Crown, Gem, Award, Rocket, Star, TrendingUp, Heart } from "lucide-react"
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
      title: "坐下功能",
      description: "空手右键点击下半砖或楼梯可以坐下休息，享受悠闲时光",
      icon: Home,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      borderColor: "border-blue-200 dark:border-blue-800",
      gradient: "from-blue-500 to-cyan-500",
      lightGradient: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20"
    },
    {
      title: "连锁挖掘",
      description: "蹲下并使用对应工具可以连锁挖掘最多128个方块，大幅提升采集效率",
      icon: Pickaxe,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      borderColor: "border-green-200 dark:border-green-800",
      gradient: "from-green-500 to-emerald-500",
      lightGradient: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
    },
    {
      title: "农田保护",
      description: "农田踩踏后不会被破坏，保护你的农作物免受意外损坏",
      icon: Shield,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
      borderColor: "border-yellow-200 dark:border-yellow-800",
      gradient: "from-yellow-500 to-amber-500",
      lightGradient: "from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20"
    },
    {
      title: "探险结构",
      description: "新增300多个探险结构，包括各种主题村庄、地下城和神秘遗迹",
      icon: MapPin,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      borderColor: "border-purple-200 dark:border-purple-800",
      gradient: "from-purple-500 to-violet-500",
      lightGradient: "from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20"
    },
    {
      title: "大师切割机",
      description: "切石机新增500多种配方，包括木刻、基石切割等高级工艺",
      icon: Zap,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      borderColor: "border-red-200 dark:border-red-800",
      gradient: "from-red-500 to-pink-500",
      lightGradient: "from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20"
    },
    {
      title: "领地系统",
      description: "创建和管理你的专属领地，保护建筑安全，防止他人破坏",
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      borderColor: "border-indigo-200 dark:border-indigo-800",
      gradient: "from-indigo-500 to-blue-500",
      lightGradient: "from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20"
    },
  ]

  const stats = [
    { icon: Target, label: "特色功能", value: "6+", color: "text-blue-500", description: "精心设计" },
    { icon: Clock, label: "持续更新", value: "24/7", color: "text-green-500", description: "全天候服务" },
    { icon: Crown, label: "优质体验", value: "99.9%", color: "text-yellow-500", description: "稳定运行" },
    { icon: Gem, label: "独特内容", value: "800+", color: "text-purple-500", description: "丰富玩法" },
  ]

  return (
    <section className="relative py-20 bg-linear-to-br from-slate-50 via-blue-50/30 to-cyan-50/40 dark:from-slate-900 dark:via-blue-950/20 dark:to-cyan-950/20 overflow-hidden">
      {/* 动态背景装饰 */}
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
                  href="/community"
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
    </section>
  )
}