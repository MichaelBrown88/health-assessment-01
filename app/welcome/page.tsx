'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { PaywallModal } from '@/components/PaywallModal'
import { useState } from 'react'
import { SpaceTheme } from '@/components/SpaceTheme'

export default function WelcomePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [showPaywall, setShowPaywall] = useState(false)

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <SpaceTheme />
      
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 flex-1 flex items-center justify-center">
        <div className="space-y-12 text-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-center py-6">
              Your Health Journey Starts Here
            </h1>
            
            <p className="text-xl text-gray-300">
              Get personalized insights and track your progress towards better health
            </p>
          </div>

          {user ? (
            // Authenticated user CTAs
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push('/questions')}
                  className="deep-space-gradient px-8 py-6 text-lg"
                >
                  Take Assessment
                </Button>
                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="px-8 py-6 text-lg border-0 deep-space-border bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20"
                >
                  Go to Dashboard
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                Track your progress and view detailed insights in your dashboard
              </p>
            </div>
          ) : (
            // Guest user CTAs
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push('/questions')}
                  className="deep-space-gradient px-8 py-6 text-lg"
                >
                  Take Assessment
                </Button>
                <Button
                  onClick={() => setShowPaywall(true)}
                  variant="outline"
                  className="px-8 py-6 text-lg border-0 deep-space-border bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20"
                >
                  Unlock Premium Features
                </Button>
              </div>
              <p className="text-sm text-gray-400">
                Try our assessment for free or unlock premium features for detailed insights
              </p>
            </div>
          )}

          {/* Feature highlights with space theme */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-black/30 rounded-lg p-8 deep-space-border">
              <h3 className="text-xl font-semibold mb-4">
                Personalized Analysis
              </h3>
              <p className="text-gray-400">
                Get tailored insights based on your health data and goals
              </p>
            </div>
            <div className="bg-black/30 rounded-lg p-8 deep-space-border">
              <h3 className="text-xl font-semibold mb-4">
                Progress Tracking
              </h3>
              <p className="text-gray-400">
                Monitor your health journey with detailed metrics and trends
              </p>
            </div>
            <div className="bg-black/30 rounded-lg p-8 deep-space-border">
              <h3 className="text-xl font-semibold mb-4">
                Expert Recommendations
              </h3>
              <p className="text-gray-400">
                Receive AI-powered suggestions to improve your health
              </p>
            </div>
          </div>
        </div>
      </div>

      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
      />
    </div>
  )
}
