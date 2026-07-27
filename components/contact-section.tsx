"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Users, Clock, Star, ExternalLink, Sparkles, Gift, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const MotionCard = motion(Card);
const MotionButton = motion(Button);
const MotionBadge = motion(Badge);

export function ContactSection() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const contactMethods = [
    {
      name: "QQ 群",
      value: "870594910",
      description: "官方 QQ 交流群",
      icon: () => (<img src="https://cdn.simpleicons.org/qq/white" width="18" height="18" alt="QQ" />),
      onClick: () => window.open("https://qm.qq.com/cgi-bin/qm/qr?k=870594910", "_blank"),
    },
    {
      name: "邮箱",
      value: "support@endlesspixel.cn",
      description: "官方邮箱，处理重要事务",
      icon: Mail,
      onClick: () => window.open("mailto:support@endlesspixel.cn", "_blank"),
    },
    {
      name: "Discord",
      value: "EndlessPixel Server",
      description: "官方 Discord 服务器",
      icon: () => (<img src="https://cdn.simpleicons.org/discord/white" width="18" height="18" alt="Discord" />),
      onClick: () => window.open("https://discord.gg/k63hRWt3fF", "_blank"),
    },
    {
      name: "GitHub",
      value: "EndlessPixel",
      description: "开源项目和技术交流",
      icon: () => (<img src="https://cdn.simpleicons.org/github/white" width="18" height="18" alt="GitHub" />),
      onClick: () => window.open("https://github.com/EndlessPixel", "_blank"),
    },
  ];

  const supportInfo = [
    { title: "在线时间", value: "工作日 18:30–22:00 周末 07:30–22:30", icon: Clock },
  ];

  const getItemKey = (method: typeof contactMethods[0]) => `${method.name}-${method.value}`;

  return (
    <div className="space-y-10">
      <MotionCard
        className="bg-card shadow-sm overflow-hidden relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="flex items-center space-x-2">
            <motion.div className="p-2 bg-secondary rounded-lg" whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }} transition={{ duration: 0.6 }}>
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
            </motion.div>
            <span>联系我们</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-5"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
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
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className={cn("rounded-xl p-5 transition-all duration-300 cursor-pointer group overflow-hidden relative bg-secondary/50 hover:bg-secondary", isHovered ? "shadow-md" : "shadow-sm")}
                  onClick={method.onClick}
                  onMouseEnter={() => setHoveredItem(key)}
                  onMouseLeave={() => setHoveredItem(null)}
                  whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-3">
                    <motion.div className="p-2.5 rounded-lg bg-secondary mt-0.5 shrink-0" whileHover={{ scale: 1.15 }} transition={{ duration: 0.3 }}>
                      <div className="relative">
                        <Icon className="w-5.5 h-5.5 text-muted-foreground" />
                      </div>
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="font-medium text-foreground transition-colors">{method.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{method.description}</p>
                      <div className="items-center justify-between">
                        <motion.span className="text-sm font-mono text-foreground bg-muted px-2.5 py-1.5 rounded-lg">
                          {method.value}
                        </motion.span>
                        <MotionButton size="sm" variant="ghost" className="ml-2 text-muted-foreground flex items-center gap-1">
                          <span>访问</span>
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

      <MotionCard
        className="bg-card shadow-sm overflow-hidden relative"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
      >
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="flex items-center space-x-2">
            <motion.div className="p-2 bg-secondary rounded-lg" whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }} transition={{ duration: 0.6 }}>
              <Users className="w-5 h-5 text-muted-foreground" />
            </motion.div>
            <span>支持信息</span>
          </CardTitle>
          <CardDescription>了解我们的服务时间和服务器信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }} initial="hidden" animate="visible">
            {supportInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div key={info.title} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
                  <div className="flex items-center space-x-3 py-3 px-1 group">
                    <motion.div className="p-2.5 rounded-lg bg-secondary" whileHover={{ scale: 1.1 }}>
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                        <span className="text-sm font-medium text-foreground">{info.title}</span>
                        <span className="text-sm text-foreground text-right">{info.value}</span>
                      </div>
                    </div>
                  </div>
                  {index < supportInfo.length - 1 && (
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.3 }}>
                      <Separator className="my-2" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </CardContent>
      </MotionCard>

      <MotionCard
        className="bg-card shadow-sm overflow-hidden relative"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
      >
        <CardContent className="pt-8 pb-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <CardTitle className="flex items-center space-x-2">
              <motion.span className="text-foreground font-bold" animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}>
                我们一岁啦！
              </motion.span>
            </CardTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <MotionBadge className="bg-foreground hover:bg-foreground/85 text-background px-3 py-1.5 flex items-center gap-1.5">
                <Star className="w-4 h-4" />
                <span>周年庆</span>
                <Gift className="w-4 h-4" />
              </MotionBadge>
            </motion.div>
          </div>
          <motion.p className="text-muted-foreground leading-relaxed text-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
            EndlessPixel 运营至今已满1周年，
            <span className="block mt-2">感谢您一直以来的信任与支持。</span>
            <span className="font-semibold text-foreground block mt-3 items-center gap-2">
              <Heart className="w-5 h-5 text-foreground/60 inline" /> 一年坚持，初心不改；
            </span>
            <span className="font-semibold text-foreground block mt-1 items-center gap-2">
              <Sparkles className="w-5 h-5 text-muted-foreground inline" /> 免费服务，始终无广。
            </span>
            <span className="block mt-3">因为有您，我们才能走得更远！</span>
          </motion.p>
          <motion.div className="mt-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}>
            <MotionButton className="bg-foreground hover:bg-foreground/85 text-background shadow-sm" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => window.open("https://qm.qq.com/cgi-bin/qm/qr?k=870594910", "_blank")}>
              <Gift className="w-4.5 h-4.5 mr-2" /> 加入我们，共庆周年
            </MotionButton>
          </motion.div>
        </CardContent>
      </MotionCard>
    </div>
  );
}