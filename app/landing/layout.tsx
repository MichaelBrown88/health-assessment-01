'use client'

import { SpaceTheme } from '@/components/layout/SpaceTheme'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed-height-container">
      <SpaceTheme />
      {children}
    </div>
  )
} 