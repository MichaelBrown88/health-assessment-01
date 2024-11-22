'use client'

import * as React from 'react'
import { SpaceTheme } from '@/components/layout/SpaceTheme'
import { Header } from '@/components/layout/Header'

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen bg-black">
      <SpaceTheme />
      <Header />
      <main className="pt-24">
        {children}
      </main>
    </div>
  )
}
