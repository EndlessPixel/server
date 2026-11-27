"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

interface SkinViewerProps {
  /** Minecraft 玩家 UUID（32 位 hex，可带连字符） */
  uuid?: string;
  /** 角色名，与 uuid 二选一（uuid 优先）。查 LittleSkin 时往往只有名字 */
  name?: string;
  /** 皮肤来源。auto 会按 Mojang → LittleSkin 依次尝试 */
  source?: "auto" | "mojang" | "littleskin";
  width?: number;
  height?: number;
}

/** 拼同源代理地址：浏览器不直连上游，CORS 与混合内容问题一并规避 */
function buildSkinUrl(uuid?: string, name?: string, source?: SkinViewerProps["source"]) {
  const params = new URLSearchParams();
  if (source) params.set("source", source);

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
  width = 280,
  height = 360,
}: SkinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<{ dispose: () => void } | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  /** 既没 uuid 也没角色名 —— 这不是错误，只是还没选择查谁 */
  const [empty, setEmpty] = useState(false);

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

        viewerRef.current = viewer as unknown as { dispose: () => void };

        // `model: "auto-detect"` 会读皮肤纹理判断粗臂（Steve）/ 细臂（Alex），
        // 与 Axolotl 的 determineModelType 思路一致，但由 skinview3d 内部完成，
        // 不用自己取像素。这里显式写出来，避免将来默认值变化时行为漂移。
        //
        // skinview3d 在图片 onerror 时会 reject 一个 Event 对象，
        // 必须显式 catch，否则变成全局 unhandledRejection（页面报 [object Event]）。
        try {
          await viewer.loadSkin(skinUrl, { model: "auto-detect" });
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
        viewerRef.current?.dispose();
      } catch {
        // ignore
      }
      viewerRef.current = null;
    };
  }, [uuid, name, source, width, height]);

  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-secondary/40 to-secondary/10">
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
    </div>
  );
}
