"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { refreshStatusPage } from "@/app/status/actions";

/**
 * 状态页的手动刷新按钮。
 *
 * 先让服务端清掉 `/status` 的缓存（`refreshStatusPage`），
 * 再 `router.refresh()` 重新拉取当前路由 —— 这样重新跑的是服务端探测，
 * 而不是让浏览器去刷新上游地址。
 */
export function StatusRefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await refreshStatusPage();
          router.refresh();
        })
      }
    >
      <RefreshCw className={`h-4 w-4 ${pending ? "animate-spin" : ""}`} aria-hidden="true" />
      {pending ? "刷新中…" : "刷新"}
    </Button>
  );
}
