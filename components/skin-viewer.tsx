'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface SkinViewerProps {
  /** Minecraft 玩家 UUID（32 位 hex，可带连字符） */
  uuid: string;
  /** 皮肤来源服务，默认 proxy（同源代理，规避 CORS） */
  skinBase?: 'mc-heads' | 'crafatar' | 'proxy';
  width?: number;
  height?: number;
}

function buildSkinUrl(uuid: string, base: 'mc-heads' | 'crafatar' | 'proxy') {
  const clean = uuid.replace(/-/g, '');
  // 走同源代理 /api/skin，由服务端拉取第三方皮肤，规避浏览器 CORS 限制。
  if (base === 'proxy') {
    return `/api/skin?uuid=${clean}`;
  }
  return base === 'mc-heads'
    ? `https://mc-heads.net/skin/${clean}`
    : `https://crafatar.com/skins/${clean}`;
}

export default function SkinViewer({
  uuid,
  skinBase = 'proxy',
  width = 280,
  height = 360,
}: SkinViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<{ dispose: () => void } | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    const canvas = canvasRef.current;
    if (!canvas || !uuid) return;

    const skinUrl = buildSkinUrl(uuid, skinBase);
    setLoading(true);
    setFailed(false);

    (async () => {
      try {
        const skinview3d = await import('skinview3d');
        if (disposed || !canvas) return;

        const viewer = new skinview3d.SkinViewer({
          canvas,
          width,
          height,
        });
        viewer.autoRotate = true;
        viewer.autoRotateSpeed = 0.6;

        viewerRef.current = viewer as unknown as { dispose: () => void };

        // 手动加载皮肤并捕获加载失败（skinview3d 在图片 onerror 时会
        // reject 一个 Event 对象，必须显式 .catch 避免变成全局
        // unhandledRejection，导致页面抛出 [object Event] 运行时错误）。
        try {
          await viewer.loadSkin(skinUrl);
        } catch (skinErr) {
          console.error('[SkinViewer] 皮肤加载失败:', skinErr);
          if (!disposed) setFailed(true);
        }
        if (!disposed) setLoading(false);
      } catch (err) {
        console.error('[SkinViewer] 初始化失败:', err);
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
  }, [uuid, skinBase, width, height]);

  return (
    <div className="relative flex items-center justify-center rounded-xl overflow-hidden bg-gradient-to-b from-secondary/40 to-secondary/10">
      <canvas
        ref={canvasRef}
        style={{ width, height }}
        className="block"
        aria-label="Minecraft 皮肤 3D 预览"
      />
      {loading && !failed && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
          <Loader2 className="w-6 h-6 text-foreground/60 animate-spin" />
        </div>
      )}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          皮肤预览加载失败
        </div>
      )}
    </div>
  );
}
