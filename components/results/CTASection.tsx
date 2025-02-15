'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { PaywallModal } from "@/components/premium/PaywallModal"
import type { User } from 'firebase/auth'

interface CTASectionProps {
  user: User | null
}

export function CTASection({ user }: CTASectionProps) {
  const router = useRouter()
  const [showPaywall, setShowPaywall] = useState(false)

  return (
    <section className="bg-black/30 rounded-lg p-8 deep-space-border">
      <h3 className="text-2xl font-semibold mb-6">
        {user ? 'View Your Progress' : 'Track Your Progress'}
      </h3>
      <div className="text-center">
        {user ? (
          <div className="space-y-4">
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="primary"
              className="w-full md:w-auto px-6 py-3"
            >
              Go to Dashboard
            </Button>
            <p className="text-sm text-gray-400">
              View your progress, track changes, and get detailed insights
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg mb-6">
              Ready to unlock detailed insights and track your progress over time?
            </p>
            <Button 
              onClick={() => setShowPaywall(true)}
              variant="primary"
              className="w-full md:w-auto px-6 py-3"
            >
              Unlock Full Access
            </Button>
            <p className="text-sm text-gray-400">
              Get access to your personalized dashboard, progress tracking, and AI-powered insights
            </p>
          </div>
        )}
      </div>

      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
      />
    </section>
  )
} 