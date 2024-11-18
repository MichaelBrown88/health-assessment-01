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

  return (
    <div className="min-h-screen bg-black">
      <SpaceTheme />
      <div className="relative z-30">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : isFirstRun ? (
          <ErrorBoundary>
            <AdminSetup />
          </ErrorBoundary>
        ) : (
          children
        )}
      </div>
    </div>
  )
}
