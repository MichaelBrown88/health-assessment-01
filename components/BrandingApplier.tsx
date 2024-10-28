'use client'

import React from 'react'
import { useBranding } from '@/contexts/BrandingContext'
import { SpaceTheme } from './SpaceTheme'
import { ForestTheme } from './ForestTheme'

export const BrandingApplier: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { primaryColor, secondaryColor, buttonGradient, buttonBorderGradient, progressBarGradient, font, theme } = useBranding()

  return (
    <>
      <style jsx global>{`
        :root {
          --primary-color: ${primaryColor};
          --secondary-color: ${secondaryColor};
          --button-gradient: ${buttonGradient};
          --button-border-gradient: ${buttonBorderGradient};
          --progress-bar-gradient: ${progressBarGradient};
          --font-family: ${font};
        }
        body {
          font-family: var(--font-family);
          color: var(--secondary-color);
          background-color: var(--primary-color);
        }
      `}</style>
      {theme === 'forest' && <ForestTheme />}
      {theme === 'space' && <SpaceTheme />}
      {children}
    </>
  )
}
