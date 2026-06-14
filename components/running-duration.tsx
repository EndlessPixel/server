"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { intervalToDuration } from "date-fns";

// 常量提取到组件外部
const START_DATE = new Date(2024, 9, 16); // 注意：月份从0开始，9表示10月
const UPDATE_INTERVAL = 1000;


// 格式化函数 - 使用 useCallback 避免重复创建
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

// 格式化单个数字（补零）- 可选功能
const formatNumber = (num: number): string => num.toString().padStart(2, "0");

// 紧凑格式化（例：1年2月3天4时5分6秒）
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

// 精确格式化（始终显示所有单位，补零）
const formatDurationPrecise = (): string => {
  const dur = intervalToDuration({ start: START_DATE, end: new Date() });
  return `${dur.years || 0}年 ${dur.months || 0}月 ${dur.days || 0}天 ${formatNumber(dur.hours || 0)}时 ${formatNumber(dur.minutes || 0)}分 ${formatNumber(dur.seconds || 0)}秒`;
};

interface RunningDurationProps {
  /** 格式化方式：'normal' | 'compact' | 'precise' */
  format?: "normal" | "compact" | "precise";
  /** 自定义类名 */
  className?: string;
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 自定义起始日期（默认2024-10-16） */
  startDate?: Date;
  /** 文字大小 */
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
  size = "xl"
}: RunningDurationProps) {
  const [duration, setDuration] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 根据格式选择格式化函数
  const getFormattedDuration = useCallback(() => {
    const formatFns = {
      normal: formatDuration,
      compact: formatDurationCompact,
      precise: () => formatDurationPrecise(),
    };
    
    // 如果传入了自定义起始日期，使用自定义的格式化函数
    if (startDate !== START_DATE) {
      const customFormat = () => {
        const dur = intervalToDuration({ start: startDate, end: new Date() });
        const parts: string[] = [];
        if (dur.years) parts.push(`${dur.years}年`);
        if (dur.months) parts.push(`${dur.months}月`);
        if (dur.days) parts.push(`${dur.days}天`);
        if (dur.hours) parts.push(`${dur.hours}时`);
        if (dur.minutes) parts.push(`${dur.minutes}分`);
        if (dur.seconds) parts.push(`${dur.seconds}秒`);
        return parts.length ? parts.join(" ") : "刚刚创立";
      };
      return customFormat();
    }
    
    return formatFns[format]();
  }, [format, startDate]);

  // 更新时长
  const updateDuration = useCallback(() => {
    setDuration(getFormattedDuration());
  }, [getFormattedDuration]);

  useEffect(() => {
    setIsClient(true);
    updateDuration();
    
    timerRef.current = setInterval(updateDuration, UPDATE_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [updateDuration]);

  // 服务端渲染时显示占位符
  if (!isClient) {
    return (
      <p className={`font-bold bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent ${sizeClasses[size]} ${className}`}>
        加载中...
      </p>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <svg 
          className={`${sizeClasses[size]} text-purple-600 dark:text-purple-400`}
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
      <p className={`font-bold bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent ${sizeClasses[size]}`}>
        {duration}
      </p>
    </div>
  );
}