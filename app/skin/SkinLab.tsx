"use client";

import { useState } from "react";
import SkinViewer from "@/components/skin-viewer";

type Source = "mojang" | "littleskin";

const SOURCES: { key: Source; label: string; hint: string }[] = [
  { key: "mojang", label: "官服", hint: "输入 Minecraft 正版角色名" },
  { key: "littleskin", label: "LittleSkin", hint: "输入 LittleSkin 角色名" },
];

/**
 * 皮肤预览小工具 —— 不需要登录。
 *
 * profile 页的预览依赖 `/api/users/info`（要登录态），
 * 而这个页面直接按角色名查，用来单独验证皮肤链路：
 * 换来源、换名字、看清粗臂 / 细臂是否识别正确。
 */
export function SkinLab() {
  const [source, setSource] = useState<Source>("mojang");
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");

  const active = SOURCES.find((s) => s.key === source)!;

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_320px]">
      <div className="order-2 md:order-1">
        <div className="rounded-2xl border border-foreground/8 bg-card p-5">
          <label htmlFor="skin-name" className="mb-2 block text-sm font-medium text-foreground">
            角色名
          </label>
          <div className="flex gap-2">
            <input
              id="skin-name"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") setQuery(input.trim());
              }}
              placeholder={active.hint}
              className="min-w-0 flex-1 rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/25 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setQuery(input.trim())}
              className="shrink-0 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-85"
            >
              预览
            </button>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-foreground">皮肤来源</p>
            <div className="flex gap-1 rounded-xl bg-secondary/60 p-1">
              {SOURCES.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSource(option.key)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    source === option.key
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            官服走 Mojang 的 Yggdrasil 接口，LittleSkin 走它自己的同协议接口；
            粗臂（Steve）与细臂（Alex）由皮肤纹理自动识别，无需手动指定。
            查不到时右侧会提示未找到，不会退回默认皮肤混淆结果。
          </p>
        </div>
      </div>

      <div className="order-1 flex justify-center md:order-2 md:justify-start">
        <div className="rounded-xl border border-foreground/8 bg-linear-to-b from-secondary/30 to-transparent p-4">
          <SkinViewer name={query || undefined} source={source} strict width={280} height={360} />
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {query ? `来自 ${active.label}：${query}` : "输入角色名后点击预览"}
          </p>
        </div>
      </div>
    </div>
  );
}
