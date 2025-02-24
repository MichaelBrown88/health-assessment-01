'use client'

import { useAuth } from '@/contexts/AuthContext'
import { SpaceTheme } from '@/components/layout/SpaceTheme'
import { Card } from '@/components/core/card'
import { Button } from '@/components/core/button'
import { Crown, Check } from 'lucide-react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useToast } from '@/components/core/use-toast'

export default function PremiumPage() {
  const { user, isPremium } = useAuth()
  const { toast } = useToast()

  const features = [
    'Unlimited health assessments',
    'Detailed progress tracking',
    'Personalized AI health coach',
    'Advanced analytics and insights',
    'Priority support',
    'Early access to new features'
  ]

  const plans = [
    {
      name: 'Monthly',
      price: '$9.99',
      period: 'per month',
      features: features,
      popular: false
    },
    {
      name: 'Annual',
      price: '$99.99',
      period: 'per year',
      features: features,
      popular: true,
      savings: 'Save 17%'
    }
  ]

  // Development-only function to toggle premium status
  const handleTestUpgrade = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please sign in to upgrade",
        variant: "destructive",
      })
      return
    }

    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        isPremium: !isPremium,
        premiumPlan: !isPremium ? 'annual' : null,
        premiumExpiry: !isPremium ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null
      })

      toast({
        title: !isPremium ? "Premium Activated" : "Premium Deactivated",
        description: !isPremium 
          ? "Test mode: Premium features enabled" 
          : "Test mode: Premium features disabled",
      })

      // Force reload to update UI
      window.location.reload()
    } catch (error) {
      console.error('Error updating premium status:', error)
      toast({
        title: "Error",
        description: "Failed to update premium status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="fixed-height-container">
      <SpaceTheme />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto px-8 py-12 relative z-20">
          {process.env.NODE_ENV === 'development' && (
            <div className="text-center mb-8">
              <Button 
                variant="outline" 
                onClick={handleTestUpgrade}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border-yellow-500/50"
              >
                {isPremium ? 'Disable Test Premium' : 'Enable Test Premium'}
              </Button>
              <p className="text-yellow-300/60 text-sm mt-2">
                Development mode: Use this button to toggle premium status for testing
              </p>
            </div>
          )}

          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">
              Upgrade to Premium
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get unlimited access to advanced features and personalized insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative p-8 bg-black/40 backdrop-blur-[1px] border-none
                  shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.02),inset_2px_2px_4px_rgba(0,0,0,0.3),_-1px_-1px_2px_rgba(255,255,255,0.02),_1px_1px_2px_rgba(0,0,0,0.3)]
                  before:absolute before:inset-0 before:rounded-lg before:p-[0.5px] before:bg-white/[0.03]
                  ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  {plan.savings && (
                    <div className="text-green-400 text-sm mt-2">{plan.savings}</div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full deep-space-gradient shadow-glow"
                  size="lg"
                  disabled={isPremium}
                >
                  {isPremium ? 'Already Premium' : `Get ${plan.name} Plan`}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 