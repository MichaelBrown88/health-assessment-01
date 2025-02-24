import { Bot } from 'lucide-react'
import { useState } from 'react'
import { AIHealthCoach } from './AIHealthCoach'
import type { HealthCalculations } from '@/types/results'

interface AICoachButtonProps {
  onClick?: () => void;
  variant?: 'default' | 'upgrade';
  className?: string;
  assessmentData?: {
    answers: Record<string, unknown>;
    healthCalculations: HealthCalculations;
    score: number;
  };
}

export function AICoachButton({ 
  onClick,
  variant = 'default',
  className = '',
  assessmentData
}: AICoachButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (assessmentData) {
      setIsOpen(true)
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center px-4 py-1.5 deep-space-gradient text-white rounded-lg 
                   shadow-[0_0_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_12px_rgba(255,255,255,0.2)]
                   transition-all duration-300 hover:scale-[1.02] text-sm font-medium ${className}`}
      >
        <Bot className="w-4 h-4 mr-2" />
        {variant === 'upgrade' ? 'Upgrade to Premium' : 'Ask AI Coach'}
      </button>

      {isOpen && assessmentData && (
        <AIHealthCoach
          assessmentData={assessmentData}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
} 