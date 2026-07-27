"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import EPBotChat from "./epbot-chat";

export function FloatChatButton() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-4"
          >
            <EPBotChat isOpen={open} onClose={handleClose} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg flex items-center justify-center",
          "bg-foreground hover:bg-foreground/85 text-background",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
        )}
        aria-label={open ? "关闭聊天" : "打开聊天"}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    </div>
  );
}

export default FloatChatButton;
