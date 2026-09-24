import { Skeleton } from "./skeleton";

// 下载卡片骨架屏（launcher-download-page 使用）
export function DownloadCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`group block rounded-2xl bg-white/80 p-6 backdrop-blur-sm dark:bg-slate-800/50 ${className}`}
    >
      <Skeleton className="mb-4 h-12 w-12 rounded-xl" />
      <Skeleton className="mb-2 h-5 w-32" />
      <Skeleton className="mb-1 h-4 w-full" />
      <Skeleton className="mb-4 h-4 w-2/3" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}
