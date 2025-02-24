'use client'

import { Crown } from 'lucide-react'
import { formatPrice } from '@/utils/pricing'
import type { CurrencyConfig } from '@/utils/pricing'

interface PricingDisplayProps {
  isYearly: boolean;
  currencyConfig: CurrencyConfig;
  monthlyPrice: number;
  yearlyPricePerMonth: number;
  yearlyPrice: number;
  savings: number;
  savingsPercentage: number;
}

export function PricingDisplay({
  isYearly,
  currencyConfig,
  monthlyPrice,
  yearlyPricePerMonth,
  yearlyPrice,
  savings,
  savingsPercentage
}: PricingDisplayProps) {
  return (
    <div className="text-center space-y-2">
      <div className="flex justify-center items-center space-x-2">
        <Crown className="w-5 h-5 text-yellow-400" />
        <span className="text-2xl font-bold">
          {formatPrice(isYearly ? yearlyPricePerMonth : monthlyPrice, currencyConfig.code)}
          <span className="text-sm text-gray-400">/month</span>
        </span>
      </div>
      {isYearly && (
        <div className="text-sm">
          <p className="text-green-400">
            Save {formatPrice(savings, currencyConfig.code)} ({savingsPercentage}% off)
          </p>
          <p className="text-gray-400">
            Billed annually at {formatPrice(yearlyPrice, currencyConfig.code)}
          </p>
        </div>
      )}
      <p className="text-sm text-gray-400">Cancel anytime</p>
    </div>
  )
} 