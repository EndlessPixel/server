"use client";

import { useEffect, useRef } from "react";

/**
 * 底栏像素流星 —— 横向右→左掠过，短拖尾，低干扰
 * - 逻辑分辨率 = 屏幕 1/4，放大后是硬边像素块
 * - 页面不可见时暂停，尊重 prefers-reduced-motion
 */
export function PixelFooterSky({ pixel = 4 }: { pixel?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el: HTMLCanvasElement = canvas;
    const ctx: CanvasRenderingContext2D = context;

    const PX = Math.max(2, Math.min(8, pixel));
    let W = 0;
    let H = 0;

    type Star = { x: number; y: number; a: number; sp: number; ph: number };
    type Meteor = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      len: number;
      alpha: number;
      startAt: number;
    };

    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let nextBurst = 0;
    let lastT = 0;
    let raf: number | null = null;
    let running = true;

    // 右→左匀速掠过，并微微下坠（canvas 的 y 轴向下为正，所以 vy 必须 > 0）。
    // 注意别写成 1.06π —— 那样 vy < 0，流星会朝左上飞，看起来是倒着走。
    const BASE_ANGLE = Math.PI * 0.94;

    function initStars() {
      stars = [];
      const count = Math.min(140, Math.floor((W * H) / 55));
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.floor(Math.random() * W),
          y: Math.floor(Math.random() * H),
          a: 0.1 + Math.random() * 0.35,
          sp: 0.4 + Math.random() * 0.8,
          ph: Math.random() * Math.PI * 2,
        });
      }
    }

    function spawn(now: number) {
      const count = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        // 每颗流星角度都不同：sin 给出平滑的主体散布，tan 偶尔叠一点更陡的倾角。
        // 结果夹在 π 以下 —— 保证 vy > 0（向下），不会出现往上飞的那一颗。
        const r = Math.random();
        const angle = Math.min(
          BASE_ANGLE +
            Math.sin(r * Math.PI * 2) * 0.16 +
            Math.tan((r - 0.5) * Math.PI * 0.5) * 0.05,
          Math.PI - 0.02,
        );
        const speed = 0.05 + Math.random() * 0.04;
        meteors.push({
          x: W + Math.random() * 30 + 5,
          y: Math.random() * H,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          len: 8 + Math.floor(Math.random() * 9),
          alpha: 0.5 + Math.random() * 0.35,
          startAt: now + i * 80,
        });
      }
    }

    function resize() {
      const rect = el.getBoundingClientRect();
      W = Math.max(1, Math.floor(rect.width / PX));
      H = Math.max(1, Math.floor(rect.height / PX));
      el.width = W;
      el.height = H;
      ctx.imageSmoothingEnabled = false;
      initStars();
      meteors = [];
      nextBurst = 0;
      lastT = 0;
    }

    function frame(now: number) {
      if (!running) return;
      if (!lastT) lastT = now;
      let dt = now - lastT;
      if (dt > 80) dt = 80;
      lastT = now;

      ctx.clearRect(0, 0, W, H);

      const t = now / 1000;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const tw = 0.6 + 0.4 * Math.sin(t * s.sp + s.ph);
        ctx.fillStyle = `rgba(200,222,255,${(s.a * tw).toFixed(3)})`;
        ctx.fillRect(s.x, s.y, 1, 1);
      }

      if (now >= nextBurst) {
        spawn(now);
        nextBurst = now + 1800 + Math.random() * 2800;
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (now < m.startAt) continue;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        if (m.x < -50) {
          meteors.splice(i, 1);
          continue;
        }
        const sp = Math.hypot(m.vx, m.vy) || 1;
        const ux = m.vx / sp;
        const uy = m.vy / sp;
        for (let j = 0; j < m.len; j++) {
          const px = Math.round(m.x - ux * j);
          const py = Math.round(m.y - uy * j);
          const f = 1 - j / m.len;
          const a = m.alpha * f * f;
          if (a <= 0.03) continue;
          ctx.fillStyle =
            j < 2 ? `rgba(255,255,255,${a.toFixed(3)})` : `rgba(150,195,255,${a.toFixed(3)})`;
          ctx.fillRect(px, py, 1, 1);
        }
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, m.alpha).toFixed(3)})`;
        ctx.fillRect(Math.round(m.x), Math.round(m.y), 2, 1);
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    raf = requestAnimationFrame(frame);

    // 只用 ResizeObserver：页脚高度会随内容/字体加载变化，而 window.resize 不会触发，
    // 那样画布位图会停留在旧尺寸，画面被拉伸。观察元素本身即可覆盖两种情况。
    const ro = new ResizeObserver(() => resize());
    ro.observe(el);
    const onVis = () => {
      if (document.hidden) {
        running = false;
        if (raf !== null) cancelAnimationFrame(raf);
      } else {
        running = true;
        lastT = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      if (raf !== null) cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [pixel]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
