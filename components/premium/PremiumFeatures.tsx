'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/core/button'
import { Lock } from 'lucide-react'
import { 
  detectUserCurrency, 
  BASE_MONTHLY_PRICE,
  YEARLY_DISCOUNT,
  CURRENCY_CONFIG,
  type CurrencyConfig
} from '@/utils/pricing'
import { PricingToggle } from './PricingToggle'
import { PricingDisplay } from './PricingDisplay'
import { FeaturesList } from './FeaturesList'
import type { SubscriptionPlan, SubscriptionFeatures } from '@/types/subscription'
import { useToast } from '@/components/core/use-toast'

interface PremiumFeaturesProps {
  onUnlock: (plan: SubscriptionPlan) => Promise<void>;
  initialCurrency?: string;
  className?: string;
}

export function PremiumFeatures({ 
  onUnlock, 
  initialCurrency = 'USD',
  className 
}: PremiumFeaturesProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [currencyCode, setCurrencyCode] = useState(initialCurrency)
  const [currencyConfig, setCurrencyConfig] = useState<CurrencyConfig>(
    CURRENCY_CONFIG[initialCurrency]
  )
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  useEffect(() => {
    const userCurrencyConfig = detectUserCurrency()
    setCurrencyCode(userCurrencyConfig.code)
    setCurrencyConfig(userCurrencyConfig)
  }, [])

  const handleCurrencyToggle = () => {
    const nextCurrency = 
      currencyCode === 'GBP' ? 'USD' :
      currencyCode === 'USD' ? 'EUR' : 'GBP';
    
    setCurrencyCode(nextCurrency)
    setCurrencyConfig(CURRENCY_CONFIG[nextCurrency])
  }

  const handleUnlock = async () => {
    if (!currencyConfig) return;
    
    setIsLoading(true)
    try {
      const features: SubscriptionFeatures = {
        dashboardAccess: true,
        historyAccess: true,
        progressTracking: true,
        aiInsights: true,
        exportReports: true
      }

      const plan: SubscriptionPlan = {
        id: isYearly ? 'premium-yearly' : 'premium-monthly',
        name: isYearly ? 'Yearly Premium' : 'Monthly Premium',
        description: 'Full access to all premium features',
        price: isYearly ? yearlyPrice : monthlyPrice,
        interval: isYearly ? 'year' : 'month',
        features,
        isPopular: true
      }
      
      await onUnlock(plan)
    } catch (error) {
      console.error('Failed to process subscription:', error)
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!currencyConfig) return null;

  const monthlyPrice = BASE_MONTHLY_PRICE * currencyConfig.rate;
  const yearlyPricePerMonth = monthlyPrice * (1 - YEARLY_DISCOUNT);
  const yearlyPrice = yearlyPricePerMonth * 12;
  const savings = monthlyPrice * 12 - yearlyPrice;
  const savingsPercentage = YEARLY_DISCOUNT * 100;

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Unlock Premium Features</h2>
        <p className="text-gray-400">
          Get access to advanced AI insights and personalized tracking
        </p>
      </div>

      <FeaturesList />

      <div className="space-y-6 pt-4">
        <PricingToggle 
          isYearly={isYearly} 
          onToggle={setIsYearly} 
        />

        <PricingDisplay 
          isYearly={isYearly}
          currencyConfig={currencyConfig}
          monthlyPrice={monthlyPrice}
          yearlyPricePerMonth={yearlyPricePerMonth}
          yearlyPrice={yearlyPrice}
          savings={savings}
          savingsPercentage={savingsPercentage}
        />

        <div className="pt-4">
          <Button 
            onClick={handleUnlock}
            className="w-full deep-space-gradient hover:opacity-90"
            disabled={isLoading}
          >
            <Lock className="w-4 h-4 mr-2" />
            {isLoading ? 'Processing...' : 'Unlock Premium'}
          </Button>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <p>
            By continuing, you agree to our{' '}
            <a href="/terms" className="underline hover:text-white">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="underline hover:text-white">Privacy Policy</a>
          </p>
          <button 
            onClick={handleCurrencyToggle}
            className="text-gray-400 hover:text-white"
          >
            {currencyConfig.code}
          </button>
        </div>
      </div>
    </div>
  )
}