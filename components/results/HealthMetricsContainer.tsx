'use client'

import { useState } from 'react'
import { BodyCompositionSection } from './BodyCompositionSection'
import { RecommendedIntakeSection } from './RecommendedIntakeSection'
import { AIHealthCoach } from '@/components/ai/AIHealthCoach'
import type { HealthCalculations } from '@/types/results'

interface HealthMetricsContainerProps {
  healthCalculations: HealthCalculations
  answers: Record<string, any>
  score?: number
}

export function HealthMetricsContainer({ 
  healthCalculations, 
  answers, 
  score 
}: HealthMetricsContainerProps) {
  const [isAICoachOpen, setIsAICoachOpen] = useState(false)

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <BodyCompositionSection 
            healthCalculations={healthCalculations}
            answers={answers}
            score={score}
            onAICoachOpen={() => setIsAICoachOpen(true)}
          />
        </div>

        <div>
          <RecommendedIntakeSection 
            healthCalculations={healthCalculations}
            answers={answers}
            score={score}
            onAICoachOpen={() => setIsAICoachOpen(true)}
          />
        </div>
      </div>

      {isAICoachOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="w-full max-w-2xl">
            <AIHealthCoach
              assessmentData={{
                answers,
                healthCalculations,
                score: score ?? 0
              }}
              onClose={() => setIsAICoachOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
} 