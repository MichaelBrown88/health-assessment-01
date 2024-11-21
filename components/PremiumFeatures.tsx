'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Crown, Brain, BarChart, Zap, Lock } from 'lucide-react'
import { 
  detectUserCurrency, 
  formatPrice, 
  BASE_MONTHLY_PRICE,
  YEARLY_DISCOUNT 
} from '@/utils/pricing'
import type { CurrencyConfig } from '@/utils/pricing'

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

      <div className="space-y-4">
        <div className="flex items-start space-x-4 p-4 bg-black/30 rounded-lg">
          <Brain className="w-5 h-5 text-blue-400 mt-1" />
          <div>
            <h3 className="font-semibold">AI Health Coach</h3>
            <p className="text-sm text-gray-400">
              Get personalized recommendations and insights from our advanced AI
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 bg-black/30 rounded-lg">
          <BarChart className="w-5 h-5 text-blue-400 mt-1" />
          <div>
            <h3 className="font-semibold">Advanced Analytics</h3>
            <p className="text-sm text-gray-400">
              Track your progress with detailed charts and trend analysis
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4 p-4 bg-black/30 rounded-lg">
          <Zap className="w-5 h-5 text-blue-400 mt-1" />
          <div>
            <h3 className="font-semibold">Priority Features</h3>
            <p className="text-sm text-gray-400">
              Early access to new features and premium support
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <div className="flex justify-center items-center">
          <button
            onClick={() => setIsYearly(false)}
            className={`px-4 py-2 rounded-l-full transition-colors ${
              !isYearly ? 'text-white bg-[#1e4d9c]/20' : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={`px-4 py-2 rounded-r-full transition-colors ${
              isYearly ? 'text-white bg-[#1e4d9c]/20' : 'text-gray-400 hover:text-white'
            }`}
          >
            Yearly
          </button>
        </div>

        <div className="text-center space-y-2">
          <div className="flex justify-center items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-2xl font-bold">
              {formatPrice(isYearly ? yearlyPricePerMonth : monthlyPrice, currency)}
              <span className="text-sm text-gray-400">/month</span>
            </span>
          </div>
          {isYearly && (
            <div className="text-sm">
              <p className="text-green-400">
                Save {formatPrice(savings, currency)} ({savingsPercentage}% off)
              </p>
              <p className="text-gray-400">
                Billed annually at {formatPrice(yearlyPrice, currency)}
              </p>
            </div>
          )}
          <p className="text-sm text-gray-400">Cancel anytime</p>
        </div>

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