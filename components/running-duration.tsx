"use client";
import { useEffect, useState } from "react";
import { intervalToDuration } from "date-fns";
const startDate = new Date(2024, 9, 16);
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
    const [, setMounted] = useState(false);
    const [duration, setDuration] = useState("");
    useEffect(() => {
        setMounted(true);
        setDuration(formatDuration());
        const timer = setInterval(() => {
            setDuration(formatDuration());
        }, 1000);

        return () => clearInterval(timer);
    }, []);
    return (
        <p className="text-2xl font-bold bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
            {duration}
        </p>
    );
}