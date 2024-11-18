'use client'

import { SpaceTheme } from '@/components/SpaceTheme'

export default function HomePage() {
  return (
    <div className="min-h-screen relative bg-black">
      <SpaceTheme />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    </div>
  )
}

