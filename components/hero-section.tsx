"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Server, Users, Heart, Shield, Gamepad2, Coins, Play, Sparkles, Zap, Crown, Globe, Star, Rocket, Gem, Target, Cloud, Cpu } from "lucide-react"
import Link from "next/link"
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

export function HeroSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <section className="relative bg-linear-to-br from-slate-50 via-blue-50/40 to-emerald-50/60 dark:from-slate-900 dark:via-blue-950/30 dark:to-emerald-950/30 py-24 lg:py-32 overflow-hidden">
      {/* 动态背景装饰元素 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 主背景渐变 */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-50/20 via-transparent to-emerald-50/20 dark:from-blue-950/10 dark:via-transparent dark:to-emerald-950/10" />
        
        {/* 浮动装饰圆 */}
        <motion.div 
          className="absolute -top-24 -right-24 w-96 h-96 bg-linear-to-r from-blue-200 to-cyan-200 dark:from-blue-800/20 dark:to-cyan-800/20 rounded-full blur-3xl opacity-40"
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
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-linear-to-r from-green-200 to-emerald-200 dark:from-green-800/20 dark:to-emerald-800/20 rounded-full blur-3xl opacity-40"
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
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-linear-to-r from-purple-200 to-pink-200 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-3xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />

        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* 徽章 */}
          <motion.div 
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 px-6 py-3 rounded-full text-base font-medium text-slate-700 dark:text-slate-300 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </motion.div>
            <span>欢迎来到 Minecraft 1.21.10 新世界</span>
            <motion.div 
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* 主标题 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="bg-linear-to-r from-slate-900 via-blue-700 to-emerald-600 dark:from-slate-100 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                无尽像素
              </span>
            </h1>
            <motion.p 
              className="text-2xl md:text-3xl lg:text-4xl font-light text-slate-600 dark:text-slate-400 mt-4 mb-8 max-w-4xl mx-auto leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              创造<span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-semibold">无限可能</span>的 Minecraft 世界
            </motion.p>
          </motion.div>

          {/* 副标题 */}
          <motion.p 
            className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            一个充满活力与创意的 Minecraft 社区！支持离线模式，让所有玩家都能轻松加入冒险
          </motion.p>

          {/* 特性标签 */}
          <motion.div 
            className="text-lg text-slate-500 dark:text-slate-500 mb-12 max-w-2xl mx-auto flex flex-wrap justify-center gap-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: Zap, label: "原汁原味体验", color: "text-yellow-500" },
              { icon: Coins, label: "完全免费游玩", color: "text-yellow-500" },
              { icon: Crown, label: "自由探索创造", color: "text-purple-500" },
              { icon: Rocket, label: "极速连接", color: "text-blue-500" }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.span
                  key={feature.label}
                  variants={itemVariants}
                  className="flex items-center gap-2 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 group cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Icon className={`w-4 h-4 ${feature.color} group-hover:scale-110 transition-transform`} />
                  {feature.label}
                </motion.span>
              )
            })}
          </motion.div>

          {/* 行动按钮 */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/status">
                <Button size="lg" className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Server className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">查看服务器状态</span>
                  <motion.div 
                    className="ml-2 w-2 h-2 bg-green-400 rounded-full relative z-10"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/downloads/modpack">
                <Button size="lg" variant="outline" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-blue-50/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Users className="w-5 h-5 mr-2 relative z-10" />
                  <span className="relative z-10">下载官方整合包</span>
                  <Sparkles className="w-4 h-4 ml-2 text-blue-500 relative z-10" />
                </Button>
              </Link>
            </motion.div>

            {/* 一键加入服务器按钮 - 移动端隐藏 */}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block"
            >
              <a
                href="minecraft://cd1.epmc.top?version=1.21.10"
                rel="noopener noreferrer"
                title="需安装Minecraft官方客户端，或支持minecraft://协议的第三方客户端"
              >
                <Button size="lg" variant="outline" className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-2 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-600 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-green-50/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Play className="w-5 h-5 mr-2 text-green-600 dark:text-green-400 relative z-10" />
                  <span className="relative z-10">一键加入服务器</span>
                  <motion.div 
                    className="ml-2 w-2 h-2 bg-green-500 rounded-full relative z-10"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* 服务器特性卡片 */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                icon: Cpu,
                title: "离线模式",
                description: "支持所有客户端",
                color: "text-green-600",
                bgColor: "bg-green-100 dark:bg-green-900/30",
                gradient: "from-green-500 to-emerald-500"
              },
              {
                icon: Coins,
                title: "完全免费",
                description: "无任何付费内容",
                color: "text-yellow-600",
                bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
                gradient: "from-yellow-500 to-amber-500"
              },
              {
                icon: Gamepad2,
                title: "原汁原味",
                description: "保持原始平衡",
                color: "text-blue-600",
                bgColor: "bg-blue-100 dark:bg-blue-900/30",
                gradient: "from-blue-500 to-cyan-500"
              },
              {
                icon: Heart,
                title: "宽松规则",
                description: "自由探索创造",
                color: "text-red-600",
                bgColor: "bg-red-100 dark:bg-red-900/30",
                gradient: "from-red-500 to-pink-500"
              },
              {
                icon: Users,
                title: "活跃社区",
                description: "友好的玩家",
                color: "text-purple-600",
                bgColor: "bg-purple-100 dark:bg-purple-900/30",
                gradient: "from-purple-500 to-violet-500"
              },
              {
                icon: Shield,
                title: "安全保障",
                description: "反作弊系统",
                color: "text-orange-600",
                bgColor: "bg-orange-100 dark:bg-orange-900/30",
                gradient: "from-orange-500 to-red-500"
              }
            ].map((feature, index) => {
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
                    className="group bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer relative"
                  >
                    {/* 悬停光效 */}
                    <div className="absolute inset-0 bg-linear-to-br from-blue-50/30 to-emerald-50/20 dark:from-blue-900/10 dark:to-emerald-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shine" />
                    </div>

                    <CardContent className="p-6 text-center relative z-10">
                      <motion.div 
                        className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -5, 5, 0],
                        }}
                        transition={{ 
                          scale: { type: "spring", stiffness: 300 },
                          rotate: { duration: 0.6 }
                        }}
                      >
                        <div className={`absolute inset-0 bg-linear-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        <Icon className={`w-6 h-6 ${feature.color} group-hover:text-white relative z-10 transition-colors duration-300`} />
                      </motion.div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-2 text-sm group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-500 transition-colors leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>

                    {/* 卡片边缘光效 */}
                    <div className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>

          {/* 底部装饰 */}
          <motion.div 
            className="mt-16 flex items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            {[
              { icon: Globe, text: "全球多个节点", color: "text-blue-500" },
              { icon: Star, text: "99.9% 在线率", color: "text-yellow-500" },
              { icon: Users, text: "活跃玩家社区", color: "text-purple-500" },
              { icon: Cloud, text: "云端备份", color: "text-cyan-500" }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={item.text}
                  className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 cursor-pointer group"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Icon className={`w-4 h-4 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    {item.text}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}