import { Skeleton } from "./skeleton"
import { Card, CardContent, CardHeader } from "./card"

// 卡片骨架屏
export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <Card className={`bg-white/80 dark:bg-slate-800/50 ${className}`}>
      <CardHeader className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  )
}

// 图标卡片骨架屏
export function IconCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <Card className={`bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl ${className}`}>
      <CardContent className="p-4 text-center">
        <Skeleton className="w-12 h-12 rounded-xl mx-auto mb-3" />
        <Skeleton className="h-4 w-20 mx-auto mb-1" />
        <Skeleton className="h-3 w-28 mx-auto" />
      </CardContent>
    </Card>
  )
}

// 列表项骨架屏
export function ListItemSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${className}`}>
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

// 表格行骨架屏
export function TableRowSkeleton({ columns = 4, className = "" }: { columns?: number; className?: string }) {
  return (
    <tr className={className}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="p-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

// 统计卡片骨架屏
export function StatCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl rounded-xl p-4 md:p-8 text-center ${className}`}>
      <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl mx-auto mb-3" />
      <Skeleton className="h-6 md:h-8 w-16 md:w-20 mx-auto mb-1" />
      <Skeleton className="h-4 w-20 mx-auto" />
    </div>
  )
}

// 下载卡片骨架屏
export function DownloadCardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`group block p-6 bg-white/80 dark:bg-slate-800/50 rounded-2xl backdrop-blur-sm ${className}`}>
      <Skeleton className="w-12 h-12 rounded-xl mb-4" />
      <Skeleton className="h-5 w-32 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3 mb-4" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

// 页面头部骨架屏
export function PageHeaderSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <Skeleton className="h-10 md:h-12 w-48 md:w-64 mx-auto mb-6" />
      <Skeleton className="h-5 w-full max-w-3xl mx-auto mb-2" />
      <Skeleton className="h-5 w-2/3 max-w-3xl mx-auto" />
    </div>
  )
}

// 服务器状态骨架屏
export function ServerStatusSkeleton({ className = "" }: { className?: string }) {
  return (
    <Card className={`bg-white/80 dark:bg-slate-900/70 ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Skeleton className="w-24 h-24 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 rounded-lg" />
          <Skeleton className="h-20 rounded-lg" />
        </div>
        <Skeleton className="h-32 rounded-lg" />
      </CardContent>
    </Card>
  )
}

// 网格骨架屏容器
export function GridSkeleton({
  count = 4,
  columns = 2,
  skeletonComponent = CardSkeleton,
  className = ""
}: {
  count?: number
  columns?: number
  skeletonComponent?: React.ComponentType<{ className?: string }>
  className?: string
}) {
  const SkeletonComp = skeletonComponent
  return (
    <div className={`grid grid-cols-${columns} gap-4 md:gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonComp key={i} />
      ))}
    </div>
  )
}