"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 监听滚动事件：控制显示/隐藏 + 计算滚动进度
  useEffect(() => {
    const handleScroll = () => {
      // 计算滚动进度（0-100）
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));

      // 控制按钮显示/隐藏
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 平滑滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // 点击时添加脉冲动画
    if (buttonRef.current) {
      buttonRef.current.classList.add("animate-pulse");
      setTimeout(() => {
        buttonRef.current?.classList.remove("animate-pulse");
      }, 600);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-8 right-8 z-50"
        >
          {/* 背景光晕（随滚动进度变化） */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl opacity-30"
            style={{
              background: `linear-gradient(135deg, #3B82F6, #0EA5E9)`,
              width: "100%",
              height: "100%",
            }}
            animate={{
              opacity: scrollProgress > 50 ? 0.4 : 0.2,
              scale: scrollProgress > 70 ? 1.2 : 1,
            }}
            transition={{ duration: 0.5 }}
          />

          {/* 主按钮 */}
          <Button
            ref={buttonRef}
            className={cn(
              "relative h-16 w-16 rounded-full shadow-xl transition-all duration-300 overflow-hidden",
              "bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white",
              "border border-white/20 hover:border-white/40",
              "active:scale-95 focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900"
            )}
            onClick={scrollToTop}
            size="icon"
            aria-label="回到顶部"
          >
            {/* 滚动进度圆环 */}
            <svg className="absolute inset-0 w-full h-full p-1.5" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="3"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="3"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * scrollProgress) / 100}
                strokeLinecap="round"
                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
                transition={{ duration: 0.3, ease: "linear" }}
              />
            </svg>

            {/* 箭头图标（带动画） */}
            <motion.div
              className="relative z-10 flex items-center justify-center"
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChevronUp className="h-7 w-7" />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowUp className="h-6 w-6 opacity-60" />
              </motion.div>
            </motion.div>

            {/* 内部光晕效果 */}
            <motion.div
              className="absolute inset-0 bg-white/10 rounded-full"
              animate={{
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}