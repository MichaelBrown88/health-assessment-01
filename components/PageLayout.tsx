'use client'

import { usePathname } from 'next/navigation'
import { SpaceTheme } from '@/components/SpaceTheme'

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PageLayout({ children, className = '' }: PageLayoutProps) {
  const pathname = usePathname()
  const isLandingPage = pathname === '/landing' || pathname === '/'

  return (
    <div className="min-h-screen flex flex-col items-center justify-start relative overflow-hidden">
      <SpaceTheme />
      <div className={`relative z-20 w-full max-w-4xl mx-auto px-4 ${isLandingPage ? 'py-0' : 'py-20'} ${className}`}>
        {children}
      </div>
    </div>
  )
}
