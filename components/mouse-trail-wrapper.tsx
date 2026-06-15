"use client";

import { useAppearance } from "@/lib/appearance-context";
import MouseTrailEffect from "@/components/mouse-trail-effect";

// 鼠标轨迹效果包装组件（根据设置条件渲染）
export function MouseTrailWrapper() {
  const { settings } = useAppearance();
  
  if (!settings.showMouseTrail) return null;
  
  return <MouseTrailEffect />;
}