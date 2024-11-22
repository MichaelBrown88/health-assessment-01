import { useState, useEffect } from 'react'
import { detectUserCurrency, CurrencyConfig, CURRENCY_CONFIG } from '@/utils/pricing'

export function usePricing() {
  const [isYearly, setIsYearly] = useState(false)
  const [currency, setCurrency] = useState<CurrencyConfig | null>(null)

  useEffect(() => {
    detectUserCurrency().then(setCurrency)
  }, [])

  const toggleCurrency = () => {
    setCurrency(prev => 
      prev?.code === 'GBP' ? CURRENCY_CONFIG['USD'] :
      prev?.code === 'USD' ? CURRENCY_CONFIG['EUR'] :
      CURRENCY_CONFIG['GBP']
    )
  }

  return {
    isYearly,
    setIsYearly,
    currency,
    toggleCurrency
  }
} 