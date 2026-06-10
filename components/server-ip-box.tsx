"use client"

import { useState } from "react"
import { Check, Copy, Server } from "lucide-react"

const SERVER_IP = "epmc.top"

export default function ServerIpBox() {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(SERVER_IP)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 核心修改：去掉 bg-black，改用 border + backdrop-blur */}
      <button
        onClick={copy}
        className="
          group
          inline-flex items-center gap-4
          px-6 py-3.5
          bg-transparent 
          backdrop-blur-sm
          border border-slate-600/50 
          hover:border-cyan-400/50
          rounded-xl
          transition-all duration-300
          hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]
        "
      >
        {/* 图标部分：稍微淡化，不抢戏 */}
        <Server className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />

        {/* 文字部分：用 slate-200 代替亮绿色，更柔和高级 */}
        <span className="text-base font-medium text-slate-200 group-hover:text-white transition-colors">
          加入地址：epmc.top
        </span>

        {/* 复制按钮：做成边框小图标，而不是实心块 */}
        <div className="
          ml-auto 
          p-1.5 
          border border-slate-500/50 
          rounded-md 
          group-hover:border-cyan-400/50
          group-hover:bg-cyan-400/10
          transition-all
        ">
          {copied ? (
            <Check className="w-4 h-4 text-cyan-400" />
          ) : (
            <Copy className="w-4 h-4 text-slate-400 group-hover:text-cyan-400" />
          )}
        </div>
      </button>
      <br />
      <br />
    </div>
  )
}