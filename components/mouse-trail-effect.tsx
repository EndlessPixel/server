"use client";

import { useEffect, useRef } from 'react';

class TrailPoint {
  x: number;
  y: number;
  time: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.time = Date.now();
  }
}

class Triangle {
  x: number;
  y: number;
  angle: number;
  speed: number;
  scale: number;
  alpha: number;
  size: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = 1.0 + Math.random() * 1.2;
    this.scale = 1;
    this.alpha = 0.75;
    this.size = 12;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    this.scale -= 0.02;
    this.alpha -= 0.022;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = '#cccccc';
    ctx.beginPath();
    ctx.moveTo(0, -this.size / 2);
    ctx.lineTo(-this.size / 2, this.size / 2);
    ctx.lineTo(this.size / 2, this.size / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

class Particle {
  x!: number;
  y!: number;
  vx!: number;
  vy!: number;
  alpha!: number;
  size!: number;
  hue!: number;

  constructor(x: number, y: number) {
    this.reset(x, y);
  }

  reset(x: number, y: number) {
    this.x = x;
    this.y = y;
    const ang = Math.random() * Math.PI * 2;
    const spd = 2 + Math.random() * 4;
    this.vx = Math.cos(ang) * spd;
    this.vy = Math.sin(ang) * spd;
    this.alpha = 1;
    this.size = 2 + Math.random() * 4;
    this.hue = Math.random() * 360;
  }

  update() {
    this.vx *= 0.97;
    this.vy += 0.12;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.035;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = `hsl(${this.hue},85%,65%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const MouseTrailEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    let mouseX = 0;
    let mouseY = 0;
    const trail: TrailPoint[] = [];
    const triangles: Triangle[] = [];
    const particlePool: Particle[] = [];

    // 特效参数
    const TRAIL_DURATION = 550;
    const MAX_TRAIL = 15;
    const CLICK_SPAWN = 24;
    
    // 鼠标移动状态控制
    let isMoving = false;
    let moveTimeout: NodeJS.Timeout | null = null;
    let triangleInterval: NodeJS.Timeout | null = null;

    // 彻底清空所有特效（轨迹点、三角形）
    const clearAllEffects = () => {
      trail.length = 0;
      triangles.length = 0;
      // 注意：不清空粒子池，因为粒子是点击产生的，与鼠标移动无关
    };

    // 停止三角形生成器
    const stopTriangleGenerator = () => {
      if (triangleInterval) {
        clearInterval(triangleInterval);
        triangleInterval = null;
      }
    };

    // 启动三角形生成器（仅在移动时）
    const startTriangleGenerator = () => {
      if (triangleInterval) stopTriangleGenerator();
      triangleInterval = setInterval(() => {
        if (!isMoving) return;
        const ox = (Math.random() - 0.5) * 24;
        const oy = (Math.random() - 0.5) * 24;
        triangles.push(new Triangle(mouseX + ox, mouseY + oy));
      }, 100);
    };

    // 鼠标移动时

    // 鼠标离开整个窗口时立即清除所有特效
    const handleWindowMouseLeave = () => {
      if (moveTimeout) clearTimeout(moveTimeout);
      isMoving = false;
      stopTriangleGenerator();
      clearAllEffects();
    };

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    const handleClick = (e: MouseEvent) => {
      const cx = e.clientX;
      const cy = e.clientY;
      for (let i = 0; i < CLICK_SPAWN; i++) {
        if (particlePool[i]) particlePool[i].reset(cx, cy);
        else particlePool.push(new Particle(cx, cy));
      }
    };

    let rafId: number;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);

      // 仅在鼠标移动时绘制轨迹
      if (isMoving && trail.length > 1) {
        const now = Date.now();
        ctx.shadowBlur = 7;
        ctx.shadowColor = '#00ccff';
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';

        for (let i = 1; i < trail.length; i++) {
          const p = trail[i];
          const age = now - p.time;
          const rate = Math.min(age / TRAIL_DURATION, 1);
          const opacity = 1 - rate;
          const bVal = Math.floor(255 - rate * 160);
          const gVal = Math.floor(110 + rate * 60);
          ctx.strokeStyle = `rgba(0,${gVal},${bVal},${opacity})`;
          ctx.beginPath();
          ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
        ctx.shadowBlur = 0;
      }

      // 绘制三角形（会在移动停止后因 clearAllEffects 而清空，从而消失）
      for (let i = triangles.length - 1; i >= 0; i--) {
        const tri = triangles[i];
        tri.update();
        if (tri.alpha <= 0 || tri.scale <= 0) triangles.splice(i, 1);
        else tri.draw(ctx);
      }

      // 绘制粒子（点击特效，不受移动状态影响）
      for (let i = particlePool.length - 1; i >= 0; i--) {
        const p = particlePool[i];
        p.update();
        if (p.alpha > 0) p.draw(ctx);
        else particlePool.splice(i, 1);
      }

      rafId = requestAnimationFrame(loop);
    };

    // 添加轨迹点必须在移动中才进行，我们在 loop 外单独用一个定时器添加，或者修改逻辑：
    // 更合理的方式：在 mousemove 事件中直接 push 轨迹点，而不是在 loop 中延迟添加
    // 这样可以避免停止移动后最后一个点因 loop 还未清空而被保留。
    // 修改如下：将轨迹点的添加移到 handleMouseMove 中
    // 同时保留 loop 中仅仅用于绘制
    const addTrailPoint = (x: number, y: number) => {
      if (!isMoving) return;
      trail.push(new TrailPoint(x, y));
      if (trail.length > MAX_TRAIL) trail.shift();
    };

    // 重新绑定 mousemove 事件，同时添加轨迹点
    const enhancedMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      mouseX = x;
      mouseY = y;
      
      if (moveTimeout) clearTimeout(moveTimeout);
      
      if (!isMoving) {
        clearAllEffects();
        isMoving = true;
        startTriangleGenerator();
      }
      
      // 立即添加轨迹点，确保没有延迟残留
      addTrailPoint(x, y);
      
      moveTimeout = setTimeout(() => {
        isMoving = false;
        stopTriangleGenerator();
        clearAllEffects();
      }, 100);
    };

    // 覆盖原有事件监听
    window.addEventListener('mousemove', enhancedMouseMove);
    window.addEventListener('mouseleave', handleWindowMouseLeave);
    window.addEventListener('resize', handleResize);
    window.addEventListener('click', handleClick);
    
    loop();

    return () => {
      cancelAnimationFrame(rafId);
      stopTriangleGenerator();
      if (moveTimeout) clearTimeout(moveTimeout);
      window.removeEventListener('mousemove', enhancedMouseMove);
      window.removeEventListener('mouseleave', handleWindowMouseLeave);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        background: 'transparent',
      }}
    />
  );
};

export default MouseTrailEffect;