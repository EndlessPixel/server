"use client";

import { useState } from "react";

import { resolveModelIcon } from "@/lib/model-icons";
import { cn } from "@/lib/utils";

/**
 * 模型品牌图标。
 *
 * 图标来自 LobeHub Icons（https://lobehub.com/zh/icons，MIT），
 * 用的是**单色版** SVG（`fill="currentColor"`），放在 `public/lobehub-icons/`。
 * 单色 + `dark:invert` 让图标在深/浅两种主题下都保持足够对比 ——
 * 彩色品牌版在纯黑（深色主题背景）和近纯白（浅色主题背景）上普遍看不清，
 * 具体数据见 `lib/model-icons.ts` 的注释。
 *
 * 加载是异步的：浏览器按需下载静态 SVG（`loading="lazy"`），不占 JS bundle，
 * 面板没打开时组件根本不渲染，零请求。
 *
 * 无法识别厂商或图片加载失败时返回 null（而不是占位方块）：
 * 调用方用固定尺寸容器排版，少一个方块不会让整行错位。
 */
export function ModelIcon({
  modelId,
  size = 16,
  className,
}: {
  /** 模型 ID，形如 `grok-4.7` 或 `openai/gpt-5` */
  modelId: string;
  /** 边长（px） */
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const icon = resolveModelIcon(modelId);

  if (!icon || failed) return null;

  return (
    // SVG 是本地静态资源，用不着 next/image 的优化管线（对矢量图反而无意义）
    <img
      src={`/lobehub-icons/${icon.slug}.svg`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      draggable={false}
      onError={() => setFailed(true)}
      // 单色 SVG 在 <img> 里拿不到 `currentColor`，会退化成纯黑 ✗
      // 深色模式下整块糊在黑背景上，所以反相成白色；浅色模式保持黑。
      className={cn("shrink-0 object-contain select-none dark:invert", className)}
    />
  );
}
