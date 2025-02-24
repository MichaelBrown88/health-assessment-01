'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { PaywallModal } from "@/components/premium/PaywallModal"
import { AICoachButton } from '@/components/ai/AICoachButton'
import { Card } from '@/components/core/card'
import type { User } from 'firebase/auth'

interface CTASectionProps {
  user: User | null;
}

export function CTASection({ user }: CTASectionProps) {
  const router = useRouter()
  const [showPaywall, setShowPaywall] = useState(false)

  const handleUpgradeClick = () => {
    if (!user) {
      setShowPaywall(true)
      return
    }
    setShowPaywall(true)
  }

  return (
    <Card>
      <div className="p-8 text-center">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-5 h-5 text-white/70 mr-2" />
          <h2 className="text-xl font-semibold">Unlock Premium Features</h2>
        </div>
        
        <div className="space-y-4 mb-8">
          <p className="text-gray-300">
            AI Health Coach - Get personalized guidance and answers 24/7
          </p>
          <p className="text-gray-300">
            Progress Dashboard - Track your health metrics over time
          </p>
        </div>

        <div className="flex justify-center">
          <AICoachButton variant="upgrade" onClick={handleUpgradeClick} />
        </div>
      </div>

      {showPaywall && (
        <PaywallModal
          isOpen={showPaywall}
          onClose={() => setShowPaywall(false)}
        />
      )}
    </Card>
  )
} 