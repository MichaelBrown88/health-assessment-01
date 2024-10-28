'use client'

import { SpaceTheme } from './SpaceTheme'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

interface PageLayoutProps {
  children: React.ReactNode
  showLogo?: boolean
  className?: string
}

export function PageLayout({ children, showLogo = true, className = '' }: PageLayoutProps) {
  const pathname = usePathname()
  const isWelcomePage = pathname === '/'

  return (
    <div className="min-h-screen flex flex-col items-center justify-start relative overflow-hidden">
      <SpaceTheme />
      <div className={`relative z-20 w-full max-w-4xl mx-auto px-4 ${isWelcomePage ? 'py-0' : 'py-20'} ${className}`}>
        {showLogo && (
          <Image 
            src="/logo.png"
            alt="Logo"
            width={150}
            height={50}
            priority
            className={`w-auto mx-auto mb-12 ${isWelcomePage ? 'h-32' : 'h-24'}`}
          />
        )}
        {children}
      </div>
    </div>
  )
}
