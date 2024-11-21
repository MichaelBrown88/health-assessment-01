type CurrencyConfig = {
  symbol: string;
  code: string;
  position: 'before' | 'after';
  exchangeRate: number;
  roundTo: number;
};

const CURRENCY_CONFIG: { [key: string]: CurrencyConfig } = {
  'GB': {
    symbol: '£',
    code: 'GBP',
    position: 'before',
    exchangeRate: 1,
    roundTo: 1
  },
  'US': {
    symbol: '$',
    code: 'USD',
    position: 'before',
    exchangeRate: 1.27,
    roundTo: 1
  },
  'EU': {
    symbol: '€',
    code: 'EUR',
    position: 'after',
    exchangeRate: 1.17,
    roundTo: 1
  }
};

export const BASE_MONTHLY_PRICE = 5;
export const YEARLY_DISCOUNT = 0.25; // 25% discount

export function roundPrice(price: number, roundTo: number): number {
  return Math.ceil(price / roundTo) * roundTo;
}

export function formatPrice(amount: number, currency: CurrencyConfig): string {
  const roundedAmount = roundPrice(amount, currency.roundTo);
  return currency.position === 'before' 
    ? `${currency.symbol}${roundedAmount}`
    : `${roundedAmount}${currency.symbol}`;
}

export async function detectUserCurrency(): Promise<CurrencyConfig> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code;
    
    // Map country to currency region
    const currencyRegion = 
      countryCode === 'GB' ? 'GB' :
      countryCode === 'US' ? 'US' :
      ['DE', 'FR', 'IT', 'ES', 'NL'].includes(countryCode) ? 'EU' :
      'GB'; // Default to GBP
    
    return CURRENCY_CONFIG[currencyRegion];
  } catch (error) {
    console.error('Error detecting currency:', error);
    return CURRENCY_CONFIG['GB']; // Default to GBP
  }
} 