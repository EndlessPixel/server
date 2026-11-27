"use client";

import { useEffect, useState } from "react";
import { Bot, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

/**
 * AI 读取玩家数据的授权开关。
 *
 * 默认关闭。开启后 AI 客服才能读取本人的基础信息、背包、末影箱、统计和成就，
 * 并且每次对话只注入裁剪后的摘要，不是完整 NBT。
 */
export function AiDataConsent() {
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    fetch("/api/ai/consent")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("读取失败"))))
      .then((data: { granted?: boolean }) => {
        if (alive) setGranted(!!data.granted);
      })
      .catch(() => {
        if (alive) setError("读取授权状态失败，请刷新重试");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  const toggle = async (next: boolean) => {
    setSaving(true);
    setError("");
    setGranted(next);
    try {
      const res = await fetch("/api/ai/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ granted: next }),
      });
      if (!res.ok) throw new Error("保存失败");
      const data = (await res.json()) as { granted?: boolean };
      setGranted(!!data.granted);
    } catch {
      setGranted(!next);
      setError("设置没保存上，请重试");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6 rounded-lg border border-foreground/8 bg-muted/30 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <Bot className="mt-0.5 h-4 w-4 shrink-0 text-foreground/50" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground">允许 AI 读取我的玩家数据</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              开启后，AI
              客服能参考你的基础信息、背包、末影箱、统计信息和成就来回答问题。默认关闭，关闭时 AI
              不会拿到任何玩家数据。
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {loading || saving ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Switch checked={granted} onCheckedChange={toggle} aria-label="允许 AI 读取玩家数据" />
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
