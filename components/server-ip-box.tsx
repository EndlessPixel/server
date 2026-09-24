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
        className="group inline-flex items-center gap-4 rounded-xl bg-secondary px-6 py-3.5 shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <Server className="h-5 w-5 text-muted-foreground transition-colors duration-300 group-hover:text-foreground" />

        <span className="text-base font-medium text-foreground">加入地址：{SERVER_IP}</span>

        <div className="ml-auto rounded-lg bg-secondary/80 p-1.5 transition-colors duration-200 group-hover:bg-foreground/10">
          {copied ? (
            <Check className="h-4 w-4 text-foreground" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          )}
        </div>
      </motion.button>
      <br />
      <br />
    </div>
  );
}
