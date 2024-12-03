'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { healthScoring, calculateHealthMetrics } from '@/utils/health'
import { HealthMetricsContainer } from '@/components/results/HealthMetricsContainer'
import { SummarySection } from '@/components/results/SummarySection'
import { FeedbackSections } from '@/components/results/FeedbackSections'
import { CTASection } from '@/components/results/CTASection'
import type { AnswerType } from '@/types/results'

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Parse answers from URL
  const answersParam = searchParams.get('answers')
  if (!answersParam) {
    router.push('/questions')
    return null
  }

  try {
    const answers = JSON.parse(decodeURIComponent(answersParam)) as AnswerType
    const healthCalculations = calculateHealthMetrics(answers)
    const pillarScores = healthScoring.calculateHealthPillars(answers, healthCalculations)
    const overallScore = healthScoring.calculateOverallScore(pillarScores, healthCalculations.bmi)

    return (
      <main className="container mx-auto px-4 py-8 space-y-8">
        <HealthMetricsContainer 
          healthCalculations={healthCalculations} 
          answers={answers}
          score={overallScore}
        />
        <FeedbackSections 
          answers={answers}
          healthCalculations={healthCalculations}
        />
        <SummarySection 
          answers={answers}
          healthCalculations={healthCalculations}
        />
        <div className="max-w-4xl mx-auto">
          <CTASection user={null} />
        </div>
      </main>
    )
  } catch (error) {
    console.error('Error parsing results:', error)
    router.push('/questions')
    return null
  }
}