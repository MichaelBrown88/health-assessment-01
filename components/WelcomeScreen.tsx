'use client'

import React from 'react'
import { Button } from "@/components/ui/button"

interface WelcomeScreenProps {
  onStart: () => void
  onLogin: () => void
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onLogin }) => {
  return (
    <div className="relative z-20 max-w-4xl mx-auto">
      <h1 className="text-6xl md:text-8xl font-extrabold mb-6 text-white leading-tight animate-fade-in-up">
        Unlock Your Health Potential
      </h1>
      <p className="text-base md:text-lg mb-12 text-white max-w-3xl mx-auto opacity-90 shadow-sm">
        Discover your personalized path to peak wellness with our cutting-edge health assessment
      </p>
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={onStart} 
          size="lg" 
          className="px-8 py-6 text-lg bg-white text-[#0a0a0f] hover:bg-gray-200 shadow-lg hover:scale-105 transition-all duration-300"
        >
          Continue as Guest
        </Button>
        <Button 
          onClick={onLogin} 
          size="lg" 
          className="px-8 py-6 text-lg bg-transparent border border-white text-white hover:bg-white hover:text-[#0a0a0f] shadow-lg hover:scale-105 transition-all duration-300"
        >
          Login / Sign Up
        </Button>
      </div>
    </div>
  )
}
