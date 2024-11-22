'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import { 
  detectUserCurrency, 
  BASE_MONTHLY_PRICE,
  YEARLY_DISCOUNT,
  CURRENCY_CONFIG
} from '@/utils/pricing'
import type { CurrencyConfig } from '@/utils/pricing'
import { PricingToggle } from './PricingToggle'
import { PricingDisplay } from './PricingDisplay'
import { FeaturesList } from './FeaturesList'

interface PremiumFeaturesProps {
  onUnlock: () => void;
}

export function PremiumFeatures({ onUnlock }: PremiumFeaturesProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [currency, setCurrency] = useState<CurrencyConfig | null>(null)
  
  useEffect(() => {
    detectUserCurrency().then(setCurrency)
  }, [])

  if (!currency) return null;

  const monthlyPrice = BASE_MONTHLY_PRICE * currency.exchangeRate;
  const yearlyPricePerMonth = monthlyPrice * (1 - YEARLY_DISCOUNT);
  const yearlyPrice = yearlyPricePerMonth * 12;
  const savings = monthlyPrice * 12 - yearlyPrice;
  const savingsPercentage = YEARLY_DISCOUNT * 100;

  return (
    <div className="space-y-8">
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
          currency={currency}
          monthlyPrice={monthlyPrice}
          yearlyPricePerMonth={yearlyPricePerMonth}
          yearlyPrice={yearlyPrice}
          savings={savings}
          savingsPercentage={savingsPercentage}
        />

        <div className="pt-4">
          <Button 
            onClick={onUnlock}
            className="w-full deep-space-gradient hover:opacity-90"
          >
            <Lock className="w-4 h-4 mr-2" />
            Unlock Premium
          </Button>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          <button 
            onClick={() => setCurrency(prev => 
              prev?.code === 'GBP' ? CURRENCY_CONFIG['USD'] :
              prev?.code === 'USD' ? CURRENCY_CONFIG['EUR'] :
              CURRENCY_CONFIG['GBP']
            )}
            className="text-gray-400 hover:text-white"
          >
            {currency.code}
          </button>
        </div>
      </div>
    </div>
  )
}