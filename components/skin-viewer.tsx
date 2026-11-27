"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MousePointerClick } from "lucide-react";
import { SkinClickInteraction, type PatchableViewer } from "@/lib/skin-click-interaction";
import { InteractAnimation } from "@/lib/interact-animation";

interface SkinViewerProps {
  /** Minecraft 玩家 UUID（32 位 hex，可带连字符） */
  uuid?: string;
  /** 角色名，与 uuid 二选一（uuid 优先）。查 LittleSkin 时往往只有名字 */
  name?: string;
  /** 皮肤来源。auto 会按 Mojang → LittleSkin 依次尝试 */
  source?: "auto" | "mojang" | "littleskin";
  /** 严格模式：查不到就报未找到，不退回默认皮肤（预览工具用） */
  strict?: boolean;
  width?: number;
  height?: number;
}

/** 拼同源代理地址：浏览器不直连上游，CORS 与混合内容问题一并规避 */
function buildSkinUrl(
  uuid?: string,
  name?: string,
  source?: SkinViewerProps["source"],
  strict?: boolean,
) {
  const params = new URLSearchParams();
  if (source) params.set("source", source);
  if (strict) params.set("strict", "1");

  const cleanUuid = uuid?.replace(/-/g, "").toLowerCase();
  if (cleanUuid) {
    params.set("uuid", cleanUuid);
  } else if (name) {
    params.set("name", name);
  } else {
    return null;
  }

  return `/api/skin?${params.toString()}`;
}

export default function SkinViewer({
  uuid,
  name,
  source = "auto",
  strict = false,
  width = 280,
  height = 360,
}: SkinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<PatchableViewer | null>(null);
  const interactionRef = useRef<SkinClickInteraction | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  /** 既没 uuid 也没角色名 —— 这不是错误，只是还没选择查谁 */
  const [empty, setEmpty] = useState(false);

  /**
   * 区分「点一下」和「拖着转模型」：
   * OrbitControls 也监听同一 canvas，所以这里只读不拦截，
   * 按下时记坐标，抬起时位移小于阈值才算点击。
   * 用 pointer 事件而不是 click，触屏同样能触发。
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onPointerDown = (event: PointerEvent) => {
      startX = event.clientX;
      startY = event.clientY;
      tracking = true;
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      const moved = Math.hypot(event.clientX - startX, event.clientY - startY);
      // 触屏手指的轻微漂移要放宽一些，避免手机点不中
      const threshold = event.pointerType === "touch" ? 12 : 6;
      if (moved <= threshold) interactionRef.current?.click();
    };

    const onPointerCancel = () => {
      tracking = false;
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const skinUrl = buildSkinUrl(uuid, name, source);
    if (!skinUrl) {
      setLoading(false);
      setFailed(false);
      setEmpty(true);
      return;
    }
    setEmpty(false);

    setLoading(true);
    setFailed(false);

    (async () => {
      try {
        const skinview3d = await import("skinview3d");
        if (disposed || !canvas) return;

        const viewer = new skinview3d.SkinViewer({
          canvas,
          width,
          height,
        });
        viewer.autoRotate = true;
        viewer.autoRotateSpeed = 0.6;
        viewer.animation = new skinview3d.IdleAnimation();

        viewerRef.current = viewer;
        interactionRef.current = new SkinClickInteraction(viewer, {
          idle: () => new skinview3d.IdleAnimation(),
          hit: () => new InteractAnimation(),
        });

        // `model: "auto-detect"` 会读皮肤纹理判断粗臂（Steve）/ 细臂（Alex），
        // 与 Axolotl 的 determineModelType 思路一致，但由 skinview3d 内部完成，
        // 不用自己取像素。这里显式写出来，避免将来默认值变化时行为漂移。
        //
        // skinview3d 在图片 onerror 时会 reject 一个 Event 对象，
        // 必须显式 catch，否则变成全局 unhandledRejection（页面报 [object Event]）。
        try {
          await viewer.loadSkin(skinUrl, { model: "auto-detect" });
          // 皮肤加载后材质才最终确定，此时收集材质并挂上逐帧更新
          if (!disposed) interactionRef.current?.attach();
        } catch (skinErr) {
          console.error("[SkinViewer] 皮肤加载失败:", skinErr);
          if (!disposed) setFailed(true);
        }
        if (!disposed) setLoading(false);
      } catch (err) {
        console.error("[SkinViewer] 初始化失败:", err);
        if (!disposed) {
          setFailed(true);
          setLoading(false);
        }
      }
    })();

    return () => {
      disposed = true;
      try {
        interactionRef.current?.dispose();
      } catch {
        // ignore
      }
      try {
        viewerRef.current?.dispose();
      } catch {
        // ignore
      }
      interactionRef.current = null;
      viewerRef.current = null;
    };
  }, [uuid, name, source, strict, width, height]);

  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-linear-to-b from-secondary/40 to-secondary/10">
      <canvas
        ref={canvasRef}
        style={{ width, height }}
        className="block"
        aria-label="Minecraft 皮肤 3D 预览"
      />
      {loading && !failed && !empty && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
          <Loader2 className="h-6 w-6 animate-spin text-foreground/60" />
        </div>
      )}
      {empty && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs text-muted-foreground">
          输入角色名后点击查看
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs text-muted-foreground">
          未找到该角色的皮肤
        </div>
      )}
      {!loading && !failed && !empty && (
        <div className="pointer-events-none absolute right-0 bottom-2 left-0 flex justify-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-background/70 px-2 py-0.5 text-[10px] text-muted-foreground backdrop-blur-sm">
            <MousePointerClick className="h-3 w-3" />
            点一下角色试试
          </span>
        </div>
      )}
    </div>
  );
}
