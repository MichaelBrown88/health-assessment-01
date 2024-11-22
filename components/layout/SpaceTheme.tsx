'use client'

import React from 'react'

// Predefined star positions to ensure consistency between server and client
const STATIC_STARS = Array.from({ length: 50 }, (_, i) => ({
  // Use the index to generate deterministic but seemingly random positions
  cx: ((i * 17 + 23) % 100) / 100,
  cy: ((i * 19 + 47) % 100) / 100,
  opacity: 0.1 + (((i * 13 + 37) % 30) / 100)
}));

export function SpaceTheme() {
  return (
    <div className="fixed inset-0 z-10">
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
        {STATIC_STARS.map((star, index) => (
          <circle
            key={index}
            cx={`${star.cx * 100}%`}
            cy={`${star.cy * 100}%`}
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

