import { Skeleton } from "@/components/ui/skeleton"

export function WikiSkeleton() {
  return (
    <div className="space-y-8">
      {/* Article header skeleton */}
      <div className="flex items-center space-x-4 p-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-80" />
          <div className="flex flex-wrap items-center gap-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>

      {/* Introduction section skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center mb-6">
          <Skeleton className="w-2 h-10 rounded-full mr-4" />
          <Skeleton className="h-7 w-48" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>

      {/* Content sections skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Feature cards skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <Skeleton className="w-2 h-10 rounded-full mr-4" />
              <Skeleton className="h-7 w-40" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-3">
                    <Skeleton className="h-10 w-10 rounded-lg mr-3" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <Skeleton className="w-2 h-10 rounded-full mr-4" />
              <Skeleton className="h-7 w-36" />
            </div>
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Command list skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <Skeleton className="w-2 h-10 rounded-full mr-4" />
              <Skeleton className="h-7 w-44" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Table skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center mb-6">
              <Skeleton className="w-2 h-10 rounded-full mr-4" />
              <Skeleton className="h-7 w-36" />
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-28" />
              </div>
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ section skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center mb-6">
          <Skeleton className="w-2 h-10 rounded-full mr-4" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-3">
                <Skeleton className="h-8 w-8 rounded-lg mr-3" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer section skeleton */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-start space-x-4">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation skeleton */}
      <div className="flex items-center justify-between pt-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    </div>
  )
}