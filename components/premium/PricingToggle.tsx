'use client'

interface PricingToggleProps {
  isYearly: boolean;
  onToggle: (value: boolean) => void;
}

export function PricingToggle({ isYearly, onToggle }: PricingToggleProps) {
  return (
    <div className="flex justify-center items-center">
      <button
        onClick={() => onToggle(false)}
        className={`px-4 py-2 rounded-l-full transition-colors ${
          !isYearly ? 'text-white bg-[#1e4d9c]/20' : 'text-gray-400 hover:text-white'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`px-4 py-2 rounded-r-full transition-colors ${
          isYearly ? 'text-white bg-[#1e4d9c]/20' : 'text-gray-400 hover:text-white'
        }`}
      >
        Yearly
      </button>
    </div>
  )
} 