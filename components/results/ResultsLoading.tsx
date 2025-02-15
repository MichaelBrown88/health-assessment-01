'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { SpaceTheme } from "@/components/layout/SpaceTheme"

export function ResultsLoading() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <SpaceTheme />
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-8 flex-1">
        <div className="space-y-8">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          
          <Skeleton className="h-48 w-full" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          
          <Skeleton className="h-48" />
          <Skeleton className="h-64" />
          <Skeleton className="h-96" />
        </div>
      </div>
    </div>
  )
} 