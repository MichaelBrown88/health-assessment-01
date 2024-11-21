'use client'

import { useAuth } from "@/contexts/AuthContext"
import { AdminSetup } from '@/components/AdminSetup'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useEffect } from 'react'
import { SpaceTheme } from '@/components/SpaceTheme'

export function RootCheck({ children }: { children: React.ReactNode }) {
  const { isFirstRun, loading, user, isAdmin } = useAuth()

  useEffect(() => {
    console.log('Auth State:', {
      loading,
      isFirstRun,
      isAuthenticated: !!user,
      isAdmin,
      userId: user?.uid
    })
  }, [loading, isFirstRun, user, isAdmin])

  // Show loading state only during initial load
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <SpaceTheme />
        <div className="relative z-30 flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    )
  }

  // Show admin setup only if it's first run
  if (isFirstRun) {
    return (
      <div className="min-h-screen bg-black">
        <SpaceTheme />
        <div className="relative z-30">
          <ErrorBoundary>
            <AdminSetup />
          </ErrorBoundary>
        </div>
      </div>
    )
  }

  // Otherwise, render the children
  return (
    <div className="min-h-screen bg-black">
      <SpaceTheme />
      <div className="relative z-30">
        {children}
      </div>
    </div>
  )
}
