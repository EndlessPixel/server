"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          <Button
            ref={buttonRef}
            className={cn(
              "relative h-14 w-14 rounded-full shadow-md transition-all duration-300",
              "bg-foreground hover:bg-foreground/85 text-background",
              "active:scale-95 focus-visible:ring-2 focus-visible:ring-ring/30",
            )}
            onClick={scrollToTop}
            size="icon"
            aria-label="回到顶部"
          >
            {/* 进度环 */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="3"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="rgba(255,255,255,0.5)"
                strokeWidth="3"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * scrollProgress) / 100}
                strokeLinecap="round"
              />
            </svg>

            <motion.div
              className="relative z-10 flex items-center justify-center"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronUp className="h-6 w-6" />
            </motion.div>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
