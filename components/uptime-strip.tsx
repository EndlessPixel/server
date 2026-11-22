"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HISTORY_DAYS, formatRatio, type DailyBar } from "@/lib/status-history";

/**
 * 30 天可用性时间线 + 明细弹层。
 *
 * 早先用的是元素 `title`，桌面勉强能用，但样式无法控制、手机上长按也弹不出来。
 * 这里改成自绘弹层，两种形态：
 * - **有精确指针（鼠标）**：浮层贴着被悬停的格子出现，移开即收；
 * - **触屏 / 粗指针**：居中的模态 + 半透明遮罩，点格子打开、点遮罩关闭。
 *   格子只有十来个像素宽，手指点不精准，居中弹层比跟随定位稳得多。
 */

/** 单格配色：绿 = 全好，黄 = 零星失败，红 = 大面积失败，灰 = 无数据 */
function barClass(ratio: number | null): string {
  if (ratio === null) return "bg-muted-foreground/20";
  if (ratio >= 0.99) return "bg-emerald-500";
  if (ratio >= 0.9) return "bg-amber-500";
  return "bg-red-500";
}

type ActiveSlot = {
  date: string;
  day: DailyBar | null;
  /** 浮层锚点：格子顶部/底部与水平中心 */
  top: number;
  bottom: number;
  centerX: number;
  /** 上方空间不够时改为向下展开 */
  below: boolean;
};

/** 弹层内容：汇总 + 逐条检测记录 */
function SlotPanel({ date, day }: { date: string; day: DailyBar | null }) {
  return (
    <div>
      <p className="text-sm font-medium text-foreground">
        {date}
        <span className="ml-1 text-xs font-normal text-muted-foreground">UTC</span>
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {day && day.samples.length > 0
          ? `可用率 ${formatRatio(day.ratio)} · 共 ${day.total} 次检测`
          : "当天暂无探测数据"}
      </p>

      {day && day.samples.length > 0 && (
        <ul className="mt-2 max-h-56 overflow-y-auto border-t border-border/60">
          {day.samples.map((sample, index) => (
            <li
              key={`${sample.time}-${index}`}
              className="flex items-center justify-between gap-2 border-b border-border/40 py-1 text-xs last:border-0"
            >
              <span className="text-muted-foreground tabular-nums">{sample.time}</span>
              <span
                className={
                  sample.ok
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "font-medium text-red-600 dark:text-red-400"
                }
              >
                {sample.ok ? "正常" : "失败"}
              </span>
              <span className="text-muted-foreground tabular-nums">{sample.ms} ms</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function UptimeStrip({ days }: { days: DailyBar[] }) {
  const [mounted, setMounted] = useState(false);
  /** 是否支持 hover：决定「跟随浮层」还是「居中模态」 */
  const [hoverable, setHoverable] = useState(false);
  const [active, setActive] = useState<ActiveSlot | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
    setHoverable(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const clearTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clearTimer();
    setActive(null);
  }, [clearTimer]);

  /** 延迟关闭：给鼠标留出从格子移到浮层的时间 */
  const scheduleClose = useCallback(() => {
    clearTimer();
    closeTimer.current = setTimeout(() => setActive(null), 200);
  }, [clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  /** 打开时监听 Esc 与「点到自己以外的地方」 */
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-uptime-panel]") || target?.closest("[data-uptime-slot]")) return;
      close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [active, close]);

  const openFor = useCallback(
    (el: HTMLElement, date: string, day: DailyBar | null) => {
      clearTimer();
      const rect = el.getBoundingClientRect();
      setActive({
        date,
        day,
        top: rect.top,
        bottom: rect.bottom,
        centerX: rect.left + rect.width / 2,
        // 弹层约 260px 高，上方放不下就朝下展开
        below: rect.top < 240,
      });
    },
    [clearTimer],
  );

  const byDate = new Map(days.map((d) => [d.date, d]));
  const today = new Date();
  const slots = Array.from({ length: HISTORY_DAYS }, (_, index) => {
    const offset = HISTORY_DAYS - 1 - index;
    const date = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - offset),
    );
    const key = date.toISOString().slice(0, 10);
    return { key, day: byDate.get(key) ?? null };
  });

  return (
    <>
      {/* 窄屏把间距压到 1px、高度加到 28px：30 格挤在一行，每格只有约 9px 宽，
          少一点间隙就能宽一点，手指更容易点中 */}
      <div
        className="flex h-7 items-stretch gap-[1px] sm:h-6 sm:gap-[2px]"
        role="group"
        aria-label="近 30 天可用性时间线"
      >
        {slots.map(({ key, day }) => (
          <button
            key={key}
            type="button"
            data-uptime-slot
            aria-label={`${key}：${day ? formatRatio(day.ratio) : "无数据"}，点击查看检测明细`}
            className={`flex-1 rounded-[2px] transition-transform duration-150 hover:scale-y-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${barClass(
              day?.ratio ?? null,
            )}`}
            onClick={(event) => openFor(event.currentTarget, key, day)}
            onPointerEnter={
              hoverable ? (event) => openFor(event.currentTarget, key, day) : undefined
            }
            onPointerLeave={hoverable ? scheduleClose : undefined}
            onFocus={hoverable ? (event) => openFor(event.currentTarget, key, day) : undefined}
            onBlur={hoverable ? scheduleClose : undefined}
          />
        ))}
      </div>

      {mounted &&
        active &&
        createPortal(
          hoverable ? (
            /* 鼠标：浮层贴着格子 */
            <div
              data-uptime-panel
              role="dialog"
              aria-label={`${active.date} 检测明细`}
              className="fixed z-50 w-64 rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-xl"
              style={{
                top: active.below ? active.bottom + 8 : active.top - 8,
                left: Math.min(Math.max(active.centerX, 136), window.innerWidth - 136),
                transform: `translate(-50%, ${active.below ? "0" : "-100%"})`,
              }}
              onPointerEnter={clearTimer}
              onPointerLeave={scheduleClose}
            >
              <SlotPanel date={active.date} day={active.day} />
            </div>
          ) : (
            /* 触屏：居中模态，点遮罩关闭 */
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={close}
            >
              <div
                data-uptime-panel
                role="dialog"
                aria-modal="true"
                aria-label={`${active.date} 检测明细`}
                className="w-full max-w-xs rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <SlotPanel date={active.date} day={active.day} />
                <button
                  type="button"
                  onClick={close}
                  className="mt-3 w-full rounded-lg border border-border py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  关闭
                </button>
              </div>
            </div>
          ),
          document.body,
        )}
    </>
  );
}
