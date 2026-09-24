"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Mail,
  MessageCircle,
  Users,
  Clock,
  Star,
  ExternalLink,
  Sparkles,
  Gift,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RunningDuration } from "./running-duration";

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
      icon: () => (
        <img src="https://cdn.simpleicons.org/qq/white" width="18" height="18" alt="QQ" />
      ),
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
      icon: () => (
        <img src="https://cdn.simpleicons.org/discord/white" width="18" height="18" alt="Discord" />
      ),
      onClick: () => window.open("https://discord.gg/k63hRWt3fF", "_blank"),
    },
    {
      name: "GitHub",
      value: "EndlessPixel",
      description: "开源项目和技术交流",
      icon: () => (
        <img src="https://cdn.simpleicons.org/github/white" width="18" height="18" alt="GitHub" />
      ),
      onClick: () => window.open("https://github.com/EndlessPixel", "_blank"),
    },
  ];

  const supportInfo = [
    { title: "在线时间", value: "工作日 18:30–22:00 周末 07:30–22:30", icon: Clock },
  ];

  const getItemKey = (method: (typeof contactMethods)[0]) => `${method.name}-${method.value}`;

  return (
    <div className="space-y-10">
      <MotionCard
        className="relative overflow-hidden bg-card shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <CardHeader className="relative z-10 pb-3">
          <CardTitle className="flex items-center space-x-2">
            <motion.div
              className="rounded-lg bg-secondary p-2"
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
            </motion.div>
            <span>联系我们</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4">
          <motion.div
            className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-1"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-xl bg-secondary/50 p-5 transition-all duration-300 hover:bg-secondary",
                    isHovered ? "shadow-md" : "shadow-sm",
                  )}
                  onClick={method.onClick}
                  onMouseEnter={() => setHoveredItem(key)}
                  onMouseLeave={() => setHoveredItem(null)}
                  whileHover={{
                    y: -5,
                    boxShadow:
                      "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start space-x-3">
                    <motion.div
                      className="mt-0.5 shrink-0 rounded-lg bg-secondary p-2.5"
                      whileHover={{ scale: 1.15 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="relative">
                        <Icon className="h-5.5 w-5.5 text-muted-foreground" />
                      </div>
                    </motion.div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex items-center justify-between">
                        <h4 className="font-medium text-foreground transition-colors">
                          {method.name}
                        </h4>
                      </div>
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {method.description}
                      </p>
                      <div className="items-center justify-between">
                        <motion.span className="rounded-lg bg-muted px-2.5 py-1.5 font-mono text-sm text-foreground">
                          {method.value}
                        </motion.span>
                        <MotionButton
                          size="sm"
                          variant="ghost"
                          className="ml-2 flex items-center gap-1 text-muted-foreground"
                        >
                          <span>访问</span>
                          <ExternalLink className="h-3.5 w-3.5" />
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
        className="relative overflow-hidden bg-card shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <CardHeader className="relative z-10 pb-3">
          <CardTitle className="flex items-center space-x-2">
            <motion.div
              className="rounded-lg bg-secondary p-2"
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
              transition={{ duration: 0.6 }}
            >
              <Users className="h-5 w-5 text-muted-foreground" />
            </motion.div>
            <span>支持信息</span>
          </CardTitle>
          <CardDescription>了解我们的服务时间和服务器信息</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
            }}
            initial="hidden"
            animate="visible"
          >
            {supportInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                >
                  <div className="group flex items-center space-x-3 px-1 py-3">
                    <motion.div
                      className="rounded-lg bg-secondary p-2.5"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                        <span className="text-sm font-medium text-foreground">{info.title}</span>
                        <span className="text-right text-sm text-foreground">{info.value}</span>
                      </div>
                    </div>
                  </div>
                  {index < supportInfo.length - 1 && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
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
        className="relative overflow-hidden bg-card shadow-sm"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <CardContent className="relative z-10 pt-8 pb-6">
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <CardTitle className="flex items-center space-x-2">
              <motion.span
                className="font-bold text-foreground"
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
              >
                我们一岁啦！
              </motion.span>
            </CardTitle>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <MotionBadge className="flex items-center gap-1.5 bg-foreground px-3 py-1.5 text-background hover:bg-foreground/85">
                <Star className="h-4 w-4" />
                <span>周年庆</span>
                <Gift className="h-4 w-4" />
              </MotionBadge>
            </motion.div>
          </div>
          <motion.p
            className="text-lg leading-relaxed text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            EndlessPixel 运营至今已满1周年，
            <span className="mt-2 block">感谢您一直以来的信任与支持。</span>
            <span className="mt-3 block items-center gap-2 font-semibold text-foreground">
              <Heart className="inline h-5 w-5 text-foreground/60" /> 一年坚持，初心不改；
            </span>
            <span className="mt-1 block items-center gap-2 font-semibold text-foreground">
              <Sparkles className="inline h-5 w-5 text-muted-foreground" /> 免费服务，始终无广。
            </span>
            <span className="mt-3 block">因为有您，我们才能走得更远！</span>
          </motion.p>
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <MotionButton
              className="bg-foreground text-background shadow-sm hover:bg-foreground/85"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open("https://qm.qq.com/cgi-bin/qm/qr?k=870594910", "_blank")}
            >
              <Gift className="mr-2 h-4.5 w-4.5" /> 加入我们，共庆周年
            </MotionButton>
          </motion.div>
        </CardContent>
      </MotionCard>
      <MotionCard>
        <section className="flex justify-center">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="mb-2 text-xl font-semibold text-foreground">
                EndlessPixel服务器创立至今
              </h2>
              <RunningDuration />
            </CardContent>
          </Card>
        </section>
      </MotionCard>
    </div>
  );
}
