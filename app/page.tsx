'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push(isAdmin ? '/admin/dashboard' : '/dashboard')
      } else {
        router.push('/landing')
      }
    }
  }, [user, isAdmin, router, loading])

  return (
    <div className="relative z-20 flex items-center justify-center min-h-screen">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        <p className="mt-4">Loading...</p>
      </div>
    </div>
  )
}

