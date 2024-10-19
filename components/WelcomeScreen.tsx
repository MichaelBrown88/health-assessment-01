'use client'

import React from 'react'
import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  onStart: () => void
  onLogin: () => void
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onLogin }) => (
  <div className="relative z-20 max-w-4xl mx-auto">
    <h1 
      className="text-6xl md:text-8xl font-extrabold mb-6 text-white leading-tight animate-fade-in-up"
      style={{ textShadow: `2px 2px 4px rgba(0,0,0,0.5)` }}
    >
      Unlock Your Health Potential
    </h1>
    <p className="text-base md:text-lg mb-12 text-white max-w-3xl mx-auto opacity-90 shadow-sm">
      Discover your personalized path to peak wellness with our cutting-edge health assessment
    </p>
    <div className="flex justify-center space-x-4">
      <Button 
        onClick={onStart} 
        size="lg" 
        className="welcome-button primary"
      >
        Continue as Guest
      </Button>
      <Button 
        onClick={onLogin} 
        size="lg" 
        className="welcome-button secondary"
      >
        Login / Sign Up
      </Button>
    </div>
  </div>
)
