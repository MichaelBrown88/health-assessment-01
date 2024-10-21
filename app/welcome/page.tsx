'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { SpaceTheme } from "@/components/SpaceTheme"
import Header from "@/components/Header"
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const router = useRouter()

  const handleStart = () => {
    router.push('/health-assessment')
  }

  const handleLogin = () => {
    console.log("Login clicked!")
    // Add logic here for login (e.g., open login modal or redirect)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center relative">
      <SpaceTheme />
      <Header />
      <div className="relative z-20 max-w-4xl mx-auto px-4 mt-20">
        <h1 
          className="text-5xl md:text-7xl font-extrabold mb-6 text-white leading-tight animate-fade-in-up"
          style={{ textShadow: `2px 2px 4px rgba(0,0,0,0.5)` }}
        >
          Unlock Your Health Potential
        </h1>
        <p className="text-base md:text-lg mb-12 text-white max-w-3xl mx-auto opacity-90 shadow-sm">
          Discover your personalized path to peak wellness with our cutting-edge health assessment.
        </p>
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={handleStart} 
            size="lg" 
            className="welcome-button primary"
          >
            Continue as Guest
          </Button>
          <Button 
            onClick={handleLogin} 
            size="lg" 
            className="welcome-button secondary"
          >
            Login / Sign Up
          </Button>
        </div>
      </div>
    </div>
  )
}
