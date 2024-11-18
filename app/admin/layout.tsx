'use client'

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/')
    }
  }, [user, isAdmin, router])

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <nav className="bg-gray-900/50 border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          <div className="text-gray-400 text-sm">
            Logged in as: {user.email}
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
