export function ResultsLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-8">
      <div className="animate-pulse space-y-8 w-full max-w-4xl">
        {/* Score Overview Skeleton */}
        <div className="bg-black/30 rounded-lg p-8 space-y-4">
          <div className="h-16 bg-gray-700/50 rounded-full w-32 mx-auto" />
          <div className="h-4 bg-gray-700/50 rounded-full w-full" />
          <div className="h-4 bg-gray-700/50 rounded-full w-3/4 mx-auto" />
        </div>

        {/* Analysis Tabs Skeleton */}
        <div className="bg-black/30 rounded-lg p-8 space-y-4">
          <div className="flex space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 bg-gray-700/50 rounded-full flex-1" />
            ))}
          </div>
          <div className="h-48 bg-gray-700/50 rounded-lg" />
        </div>

        {/* Goals Section Skeleton */}
        <div className="bg-black/30 rounded-lg p-8 space-y-4">
          <div className="h-8 bg-gray-700/50 rounded-full w-48" />
          <div className="h-32 bg-gray-700/50 rounded-lg" />
        </div>
      </div>
    </div>
  )
} 