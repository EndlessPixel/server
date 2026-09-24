"use client";
import { useCallback, useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";

const START_DATE = new Date(2024, 8, 16);
const UPDATE_INTERVAL = 1000;

/**
 * 共享心跳。
 * RunningDuration 在 footer / about / contact / AI 卡片等多处同时挂载，
 * 每个实例各自 setInterval 会产生多个 1s 定时器；这里收敛为全局唯一一个，
 * 最后一个订阅者卸载时自动清理。
 */
const tickListeners = new Set<() => void>();
let tickTimer: ReturnType<typeof setInterval> | null = null;

function subscribeTick(listener: () => void) {
  tickListeners.add(listener);
  if (!tickTimer) {
    tickTimer = setInterval(() => {
      tickListeners.forEach((l) => l());
    }, UPDATE_INTERVAL);
  }
  return () => {
    tickListeners.delete(listener);
    if (tickListeners.size === 0 && tickTimer) {
      clearInterval(tickTimer);
      tickTimer = null;
    }
  };
}

const formatDuration = (): string => {
  const dur = intervalToDuration({ start: START_DATE, end: new Date() });
  const parts: string[] = [];
  if (dur.years) parts.push(`${dur.years}年`);
  if (dur.months) parts.push(`${dur.months}月`);
  if (dur.days) parts.push(`${dur.days}天`);
  if (dur.hours) parts.push(`${dur.hours}时`);
  if (dur.minutes) parts.push(`${dur.minutes}分`);
  if (dur.seconds) parts.push(`${dur.seconds}秒`);
  return parts.length ? parts.join(" ") : "刚刚创立";
};

const formatNumber = (num: number): string => num.toString().padStart(2, "0");

const formatDurationCompact = (): string => {
  const dur = intervalToDuration({ start: START_DATE, end: new Date() });
  const parts: string[] = [];
  if (dur.years) parts.push(`${dur.years}y`);
  if (dur.months) parts.push(`${dur.months}m`);
  if (dur.days) parts.push(`${dur.days}d`);
  if (dur.hours) parts.push(`${dur.hours}h`);
  if (dur.minutes) parts.push(`${dur.minutes}m`);
  if (dur.seconds) parts.push(`${dur.seconds}s`);
  return parts.length ? parts.join(" ") : "刚刚创立";
};

const formatDurationPrecise = (): string => {
  const dur = intervalToDuration({ start: START_DATE, end: new Date() });
  return `${dur.years || 0}年 ${dur.months || 0}月 ${dur.days || 0}天 ${formatNumber(dur.hours || 0)}时 ${formatNumber(dur.minutes || 0)}分 ${formatNumber(dur.seconds || 0)}秒`;
};

const formatFromDate = (start: Date): string => {
  const dur = intervalToDuration({ start, end: new Date() });
  const parts: string[] = [];
  if (dur.years) parts.push(`${dur.years}年`);
  if (dur.months) parts.push(`${dur.months}月`);
  if (dur.days) parts.push(`${dur.days}天`);
  if (dur.hours) parts.push(`${dur.hours}时`);
  if (dur.minutes) parts.push(`${dur.minutes}分`);
  if (dur.seconds) parts.push(`${dur.seconds}秒`);
  return parts.length ? parts.join(" ") : "刚刚创立";
};

interface RunningDurationProps {
  format?: "normal" | "compact" | "precise";
  className?: string;
  showIcon?: boolean;
  startDate?: Date;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-2xl",
};

export function RunningDuration({
  format = "normal",
  className = "",
  showIcon = false,
  startDate = START_DATE,
  size = "xl",
}: RunningDurationProps) {
  /** 仅用于驱动重渲染，实际时间在渲染时实时计算 */
  const [, setTick] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    return subscribeTick(() => setTick((t) => t + 1));
  }, []);

  const getFormattedDuration = useCallback((): string => {
    if (startDate !== START_DATE) return formatFromDate(startDate);
    if (format === "compact") return formatDurationCompact();
    if (format === "precise") return formatDurationPrecise();
    return formatDuration();
  }, [format, startDate]);

  if (!isClient) {
    return (
      <p className={`font-bold text-foreground/60 ${sizeClasses[size]} ${className}`}>加载中...</p>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <svg
          className={`${sizeClasses[size]} text-muted-foreground`}
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )}
      <p className={`font-bold text-foreground ${sizeClasses[size]}`}>{getFormattedDuration()}</p>
    </div>
  );
}
