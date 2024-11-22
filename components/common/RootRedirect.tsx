'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'

export function RootRedirect() {
  const { user, isAdmin } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (user && isAdmin && pathname === '/') {
      router.push('/admin/dashboard')
    } else if (user && !isAdmin && pathname === '/') {
      router.push('/dashboard')
    }
  }, [user, isAdmin, router, pathname])

  return null
}