'use client'

import { useState } from 'react'
import { BodyCompositionSection } from './BodyCompositionSection'
import { RecommendedIntakeSection } from './RecommendedIntakeSection'
import { HealthGoalsSection } from './HealthGoalsSection'
import { HealthPillars } from './HealthPillars'
import { HealthScoreSection } from './HealthScoreSection'
import { AIHealthCoach } from '@/components/ai/AIHealthCoach'
import { healthScoring } from '@/utils/health/scoring'
import type { HealthCalculations } from '@/types/results'
import type { AnswerType } from '@/types/Question'
import { useAuth } from '@/contexts/AuthContext'

interface HealthMetricsContainerProps {
  healthCalculations: HealthCalculations
  answers: AnswerType
  score?: number
}

export function HealthMetricsContainer({ 
  healthCalculations, 
  answers, 
  score 
}: HealthMetricsContainerProps) {
  const [isAICoachOpen, setIsAICoachOpen] = useState(false)
  const { user } = useAuth()

  if (!healthCalculations || !answers) {
    return <div>Loading health metrics...</div>
  }

  const pillarScores = healthScoring.calculateHealthPillars(answers, healthCalculations)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overall Health Score */}
      <HealthScoreSection score={score ?? 0} />

      {/* Body Composition and RDI Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          />
        </div>
      </div>

      {/* Health Goals */}
      <HealthGoalsSection
        answers={answers}
        healthCalculations={healthCalculations}
        score={score}
      />

      {/* Health Pillars */}
      <HealthPillars pillarScores={pillarScores} />

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