'use client'

import React, { useMemo } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from "@/contexts/AuthContext";
import { AdminSetup } from './AdminSetup';

interface Star {
  cx: string;
  cy: string;
  opacity: number;
}

export function SpaceTheme() {
  console.log('SpaceTheme rendering');
  const pathname = usePathname()
  const showLogo = pathname !== '/results' && pathname !== '/dashboard'
  const { user } = useAuth();
  
  // Generate stars once and memoize them
  const stars = useMemo(() => {
    return Array.from({ length: 50 }, () => ({
      cx: `${Math.random() * 100}%`,
      cy: `${Math.random() * 100}%`,
      opacity: 0.1 + Math.random() * 0.3
    }));
  }, []); // Empty dependency array means this only runs once

  return (
    <div className="fixed inset-0 z-10">
      {showLogo && (
        <div className="absolute top-18 left-1/2 transform -translate-x-1/2 z-50">
          <Image
            src="/Primary_Logo_White.png"
            alt="Logo"
            width={195}
            height={195}
            priority
            className="mx-auto"
          />
        </div>
      )}
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="mesh-grad-1" cx="20%" cy="20%" r="50%">
            <stop offset="0%" stopColor="#0a0a0f" />
            <stop offset="100%" stopColor="#050508" />
          </radialGradient>
          <radialGradient id="mesh-grad-2" cx="80%" cy="80%" r="50%">
            <stop offset="0%" stopColor="#0d1117" />
            <stop offset="100%" stopColor="#050508" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="#050508" />
        <rect width="100%" height="100%" fill="url(#mesh-grad-1)" />
        <rect width="100%" height="100%" fill="url(#mesh-grad-2)" style={{ mixBlendMode: 'multiply' }} />
        {stars.map((star, index) => (
          <circle
            key={index}
            cx={star.cx}
            cy={star.cy}
            r="0.5"
            fill="white"
            opacity={star.opacity}
          />
        ))}
      </svg>
      <svg className="fixed inset-0 w-full h-full z-10" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="fade-grid" cx="50%" cy="50%" r="70%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0)" />
            <stop offset="80%" stopColor="rgba(255,255,255,0.5)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <mask id="grid-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#fade-grid)" />
          </mask>
        </defs>
        <g stroke="white" strokeWidth="0.5" mask="url(#grid-mask)">
          {generateGridLines()}
        </g>
      </svg>
    </div>
  )
}

const generateGridLines = () => {
  const lines = []
  const numLines = 28
  const horizontalLines = 20

  for (let i = 0; i <= numLines; i++) {
    const pos = (i / numLines) * 100
    lines.push(<line key={`pt${i}`} x1={`${pos}%`} y1="0%" x2="50%" y2="50%" />)
    lines.push(<line key={`pb${i}`} x1={`${pos}%`} y1="100%" x2="50%" y2="50%" />)
  }

  for (let i = 1; i < horizontalLines; i++) {
    const y = (i / horizontalLines) * 100
    const startX = (y <= 50 ? y * 2 : (100 - y) * 2) / 2
    lines.push(<line key={`h${i}`} x1={`${startX}%`} y1={`${y}%`} x2={`${100 - startX}%`} y2={`${y}%`} />)
  }

  return lines
}

