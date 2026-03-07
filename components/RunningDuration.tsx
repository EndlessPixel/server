"use client";

import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";

// 服务器启动日期
const startDate = new Date(2024, 9, 16); // 2024-10-16

// 格式化时长的函数
function formatDuration() {
    const dur = intervalToDuration({ start: startDate, end: new Date() });
    const parts = [
        dur.years && `${dur.years}年`,
        dur.months && `${dur.months}月`,
        dur.days && `${dur.days}天`,
        dur.hours && `${dur.hours}时`,
        dur.minutes && `${dur.minutes}分`,
        dur.seconds && `${dur.seconds}秒`,
    ].filter(Boolean);
    return parts.length ? parts.join(" ") : "刚刚创立";
}

export function RunningDuration() {
    // 关键：用 mounted 状态控制渲染
    const [mounted, setMounted] = useState(false);
    const [duration, setDuration] = useState("");

    useEffect(() => {
        // 组件挂载后，才设置为已挂载状态
        setMounted(true);

        // 立即计算一次
        setDuration(formatDuration());

        // 每秒更新
        const timer = setInterval(() => {
            setDuration(formatDuration());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // 服务端渲染和客户端首次渲染时，显示占位符或静态内容
    // 确保 SSR 和客户端首次渲染完全一致
    if (!mounted) {
        return (
            <p className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                计算中...
            </p>
        );
        // 或者返回 null，或者返回一个静态的初始值
    }

    // 客户端挂载后，显示动态更新的时间
    return (
        <p className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
            {duration}
        </p>
    );
}