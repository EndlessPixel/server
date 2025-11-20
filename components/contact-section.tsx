"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageCircle, GithubIcon, Users, Clock, MapPin, Gamepad2, Star, ExternalLink, Sparkles, Gift, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

// 创建 motion 版本的组件
const MotionCard = motion(Card);
const MotionButton = motion(Button);
const MotionBadge = motion(Badge);

export function ContactSection() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const contactMethods = [
    {
      name: "QQ 群",
      value: "870594910",
      description: "加入我们的 QQ 群与其他玩家交流",
      icon: MessageCircle,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800",
      hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
      action: "加入群聊",
      gradient: "from-blue-500 to-cyan-500",
      onClick: () => window.open("https://qm.qq.com/cgi-bin/qm/qr?k=870594910", "_blank"),
    },
    {
      name: "邮箱",
      value: "3319182533@qq.com",
      description: "主官方邮箱，处理重要事务",
      icon: Mail,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800",
      hoverColor: "hover:bg-green-100 dark:hover:bg-green-900/30",
      action: "发送邮件",
      gradient: "from-green-500 to-emerald-500",
      onClick: () => window.open("mailto:3319182533@qq.com", "_blank"),
    },
    {
      name: "邮箱",
      value: "2267848501@qq.com",
      description: "备用官方邮箱，处理重要事务",
      icon: Mail,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800",
      hoverColor: "hover:bg-green-100 dark:hover:bg-green-900/30",
      action: "发送邮件",
      gradient: "from-green-500 to-emerald-500",
      onClick: () => window.open("mailto:2267848501@qq.com", "_blank"),
    },
    {
      name: "Discord",
      value: "EndlessPixel Server",
      description: "与其他玩家实时交流",
      icon: Gamepad2,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-800",
      hoverColor: "hover:bg-purple-100 dark:hover:bg-purple-900/30",
      action: "加入服务器",
      gradient: "from-purple-500 to-violet-500",
      onClick: () => window.open("https://discord.gg/k63hRWt3fF", "_blank"),
    },
    {
      name: "GitHub",
      value: "EndlessPixel",
      description: "开源项目和技术交流",
      icon: GithubIcon,
      color: "text-gray-600 dark:text-gray-300",
      bgColor: "bg-gray-50 dark:bg-gray-900/30",
      borderColor: "border-gray-200 dark:border-gray-700",
      hoverColor: "hover:bg-gray-100 dark:hover:bg-gray-800/30",
      action: "访问仓库",
      gradient: "from-gray-500 to-slate-500",
      onClick: () => window.open("https://github.com/EndlessPixel", "_blank"),
    },
    {
      name: "Gitee",
      value: "system_mini",
      description: "与我们在 Gitee 上互动",
      icon: GithubIcon,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/30",
      borderColor: "border-red-200 dark:border-red-800",
      hoverColor: "hover:bg-red-100 dark:hover:bg-red-900/30",
      action: "关注我们",
      gradient: "from-red-500 to-pink-500",
      onClick: () => window.open("https://gitee.com/system_mini", "_blank"),
    },
  ];

  const supportInfo = [
    {
      title: "在线时间",
      value: "周一至周五 18:30-22:30 周六至周日 08:00-23:30",
      icon: Clock,
      color: "text-orange-500 dark:text-orange-400",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
    },
    {
      title: "服务器位置",
      value: "中国江苏宿迁",
      icon: MapPin,
      color: "text-red-500 dark:text-red-400",
      bgColor: "bg-red-50 dark:bg-red-950/20",
    }
  ];

  // 生成唯一key
  const getItemKey = (method: typeof contactMethods[0]) => `${method.name}-${method.value}`;

  return (
    <div className="space-y-8">
      {/* 标题区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-4"
      >
        <motion.div
          className="inline-flex items-center gap-2 mb-2"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-5 h-5 text-blue-500" />
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-0">
            联系我们
          </Badge>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-900 via-blue-700 to-cyan-600 dark:from-slate-100 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
          多种方式，随时沟通
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-2 max-w-2xl mx-auto">
          选择你喜欢的方式与我们取得联系，我们会尽快回复你的咨询
        </p>
      </motion.div>

      {/* 联系方法卡片 */}
      <MotionCard
        className="border-l-4 border-l-blue-500 dark:border-l-blue-600 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_70%)]" />
        
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="flex items-center space-x-2">
            <motion.div
              className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg"
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </motion.div>
            <span>联系我们</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-muted-foreground/80">
            通过以下方式与我们取得联系，我们很乐意听到您的声音
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 relative z-10">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {contactMethods.map((method) => {
              const Icon = method.icon;
              const key = getItemKey(method);
              const isHovered = hoveredItem === key;

              return (
                <motion.div
                  key={key}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className={cn(
                    "border rounded-xl p-5 transition-all duration-300 cursor-pointer group overflow-hidden relative",
                    method.borderColor,
                    method.bgColor,
                    method.hoverColor,
                    isHovered ? "shadow-md" : "shadow-sm"
                  )}
                  onClick={method.onClick}
                  onMouseEnter={() => setHoveredItem(key)}
                  onMouseLeave={() => setHoveredItem(null)}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* 渐变光效 */}
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ backgroundImage: `linear-gradient(135deg, rgba(59,130,246,0.05), rgba(14,165,233,0.05))` }}
                  />
                  
                  {/* 边框高亮 */}
                  <motion.div
                    className="absolute inset-0 rounded-xl pointer-events-none"
                    style={{ 
                      boxShadow: `inset 0 0 0 1px ${isHovered ? 'rgba(59,130,246,0.3)' : 'transparent'}`,
                      transition: 'box-shadow 0.3s ease'
                    }}
                  />

                  <div className="flex items-start space-x-3">
                    {/* 图标区域 */}
                    <motion.div
                      className={`p-2.5 rounded-lg ${method.bgColor} mt-0.5 shrink-0`}
                      whileHover={{ 
                        scale: 1.15,
                        boxShadow: `0 0 15px -3px rgba(59,130,246,0.15)`
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative">
                        <Icon className={`w-5.5 h-5.5 ${method.color}`} />
                        {/* 图标光晕 */}
                        <motion.div
                          className="absolute inset-0 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ background: `linear-gradient(135deg, ${method.gradient})` }}
                        />
                      </div>
                    </motion.div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-medium text-foreground dark:text-foreground/90 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {method.name}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className="text-xs bg-background/70 dark:bg-background/90 border-opacity-50 group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-all"
                        >
                          {method.action}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground/80 mb-3 line-clamp-2">
                        {method.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <motion.span
                          className="text-sm font-mono text-foreground dark:text-foreground/90 bg-muted/50 dark:bg-muted/30 px-2.5 py-1.5 rounded-lg"
                          whileHover={{ 
                            backgroundColor: 'rgba(59,130,246,0.08)',
                            transition: { duration: 0.2 }
                          }}
                        >
                          {method.value}
                        </motion.span>
                        
                        <MotionButton 
                          size="sm" 
                          variant="ghost" 
                          className="ml-2 text-muted-foreground dark:text-muted-foreground/70 group-hover:text-blue-600 dark:group-hover:text-blue-400 flex items-center gap-1"
                          whileHover={{ 
                            backgroundColor: 'rgba(59,130,246,0.08)',
                            transition: { duration: 0.2 }
                          }}
                        >
                          <span>{method.action}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </MotionButton>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </CardContent>
      </MotionCard>

      {/* 支持信息卡片 */}
      <MotionCard
        className="border-l-4 border-l-green-500 dark:border-l-green-600 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_70%)]" />
        
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="flex items-center space-x-2">
            <motion.div
              className="p-2 bg-green-50 dark:bg-green-950/40 rounded-lg"
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </motion.div>
            <span>支持信息</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground dark:text-muted-foreground/80">
            了解我们的服务时间和服务器信息
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 relative z-10">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {supportInfo.map((info, index) => {
              const Icon = info.icon;

              return (
                <motion.div key={info.title} variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 }
                }}>
                  <div className="flex items-center space-x-3 py-3 px-1 group">
                    <motion.div
                      className={`p-2.5 rounded-lg ${info.bgColor}`}
                      whileHover={{ scale: 1.1, boxShadow: `0 0 15px -3px rgba(16,185,129,0.15)` }}
                    >
                      <Icon className={`w-5 h-5 ${info.color}`} />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                        <span className="text-sm font-medium text-foreground dark:text-foreground/90 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {info.title}
                        </span>
                        <span className="text-sm text-foreground dark:text-foreground/90 text-right group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {info.value}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < supportInfo.length - 1 && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <Separator className="my-2 bg-border/50 dark:bg-border/30" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </CardContent>
      </MotionCard>

      {/* 周年庆卡片 */}
      <MotionCard
        className="bg-linear-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-l-4 border-l-yellow-500 dark:border-l-yellow-600 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* 动态背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 dark:bg-yellow-900/20 rounded-full blur-3xl opacity-30"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-48 h-48 bg-orange-200 dark:bg-orange-900/20 rounded-full blur-3xl opacity-20"
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
        </div>
        
        <CardContent className="pt-8 pb-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <CardTitle className="flex items-center space-x-2">
              <motion.span
                className="bg-linear-to-r from-yellow-600 to-orange-600 dark:from-yellow-400 dark:to-orange-400 bg-clip-text text-transparent"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              >
                我们一岁啦！🎉
              </motion.span>
            </CardTitle>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MotionBadge className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 px-3 py-1.5 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span>周年庆</span>
                <Gift className="w-4 h-4" />
              </MotionBadge>
            </motion.div>
          </div>
          
          <motion.p
            className="text-muted-foreground dark:text-muted-foreground/80 leading-relaxed text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            EndlessPixel 运营至今已满1周年，
            <span className="block mt-2">感谢您一直以来的信任与支持。</span>
            <span className="font-semibold text-foreground dark:text-foreground/90 block mt-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 animate-pulse" />
              一年坚持，初心不改；
            </span>
            <span className="font-semibold text-foreground dark:text-foreground/90 block mt-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              免费服务，始终无广。
            </span>
            <span className="block mt-3">因为有您，我们才能走得更远！</span>
          </motion.p>
          
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <MotionButton
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open("https://qm.qq.com/cgi-bin/qm/qr?k=870594910", "_blank")}
            >
              <Gift className="w-4.5 h-4.5 mr-2" />
              加入我们，共庆周年
            </MotionButton>
          </motion.div>
        </CardContent>
      </MotionCard>
    </div>
  );
}