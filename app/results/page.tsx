'use client'

import { useSearchParams } from 'next/navigation'
import { useAssessmentResults } from '@/hooks/useAssessmentResults'
import { useHealthCalculations } from '@/hooks/useHealthCalculations'
import { AIHealthCoach } from '@/components/ai/AIHealthCoach'
import { 
  ResultsErrorBoundary,
  ResultsLoading,
  ScoreOverview,
  AnalysisSection,
  GoalsSection,
  SummarySection 
} from '@/components/results'

export default function ResultsPage() {
  const params = useSearchParams()
  const assessmentId = params?.get('id') ?? null
  const answersParam = params?.get('answers') ?? null

  const { answers, loading, error } = useAssessmentResults(assessmentId, answersParam)
  const { score, isGoalMisaligned, structuredSummary } = useHealthCalculations(answers)

  const metrics = {
    overallScore: score,
    exerciseScore: Math.round(score * 0.8),
    nutritionScore: Math.round(score * 0.9),
    wellbeingScore: Math.round(score * 0.85)
  }

  if (error) {
    throw error;
  }

  if (loading) {
    return <ResultsLoading />
  }

  const assessmentData = {
    answers,
    score,
    metrics,
    createdAt: new Date(),
    userId: undefined,
    healthCalculations: {
      bmi: null,
      bmr: null,
      tdee: null,
      bodyFat: null,
      isBodyFatEstimated: false,
      recommendedCalories: null,
      proteinGrams: null,
      carbGrams: null,
      fatGrams: null
    }
  }

  return (
    <div className="scrollable-container">
      <ResultsErrorBoundary>
        <div className="container mx-auto px-4 py-8 space-y-8 max-w-4xl">
          <ScoreOverview 
            score={score} 
            onRetake={() => window.location.href = '/questions'} 
            isGoalMisaligned={isGoalMisaligned} 
          />
          
          <AnalysisSection answers={answers} />
          
          <AIHealthCoach 
            assessmentData={{
              answers,
              healthCalculations: {
                bmi: null,
                bmr: null,
                tdee: null,
                bodyFat: null,
                isBodyFatEstimated: false
              },
              score
            }}
          />
          
          <GoalsSection goals={answers.goals || []} />
          
          <SummarySection 
            loading={loading}
            summary={structuredSummary}
            assessmentData={assessmentData}
          />
        </div>
      </ResultsErrorBoundary>
    </div>
  )
}

