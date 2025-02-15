export const BASE_MONTHLY_PRICE = 9.99;
export const YEARLY_DISCOUNT = 0.2; // 20% discount

export interface CurrencyConfig {
  symbol: string;
  code: string;
  rate: number;
}

export const CURRENCY_CONFIG: Record<string, CurrencyConfig> = {
  USD: { symbol: '$', code: 'USD', rate: 1 },
  EUR: { symbol: '€', code: 'EUR', rate: 0.85 },
  GBP: { symbol: '£', code: 'GBP', rate: 0.73 },
};

export const PRICING_FEATURES = [
  "Personalized AI Health Coach",
  "Advanced Analytics & Progress Tracking",
  "Custom Meal & Exercise Plans",
  "Priority Support",
  "Early Access to New Features"
];

export function detectUserCurrency(): CurrencyConfig {
  if (typeof window === 'undefined') return CURRENCY_CONFIG['USD'];
  
  try {
    const userLocale = navigator.language;
    const currency = new Intl.NumberFormat(userLocale, { 
      style: 'currency', 
      currency: 'USD' 
    }).resolvedOptions().currency;

    return CURRENCY_CONFIG[currency] || CURRENCY_CONFIG['USD'];
  } catch (error) {
    console.warn('Failed to detect user currency:', error);
    return CURRENCY_CONFIG['USD'];
  }
}

export function formatPrice(price: number, currencyCode: string = 'USD'): string {
  const config = CURRENCY_CONFIG[currencyCode] || CURRENCY_CONFIG.USD;
  const convertedPrice = price * config.rate;
  
  return `${config.symbol}${convertedPrice.toFixed(2)}`;
} 