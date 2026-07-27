"use client";

import { useState } from "react";
import { Check, Copy, Server } from "lucide-react";
import { motion } from "framer-motion";

const SERVER_IP = "mc.endlesspixel.cn";

export default function ServerIpBox() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.button
        onClick={copy}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="
          group
          inline-flex items-center gap-4
          px-6 py-3.5
          bg-secondary
          rounded-xl
          transition-all duration-300
          shadow-sm
          hover:shadow-md
        "
      >
        <Server className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors duration-300" />

        <span className="text-base font-medium text-foreground">
          加入地址：{SERVER_IP}
        </span>

        <div className="ml-auto p-1.5 rounded-lg bg-secondary/80 group-hover:bg-foreground/10 transition-colors duration-200">
          {copied ? (
            <Check className="w-4 h-4 text-foreground" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </div>
      </motion.button>
      <br />
      <br />
    </div>
  );
}
