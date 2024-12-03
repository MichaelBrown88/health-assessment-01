import { useState, useEffect } from 'react'
import { calculateHealthMetrics, healthScoring } from '@/utils/health'
import type { AnswerType } from '@/types/Question'
import type { HealthCalculations } from '@/types/results'

interface Results {
  score: number
  healthCalculations: HealthCalculations
}

export function useResults(answers: AnswerType) {
  const [results, setResults] = useState<Results | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const healthCalculations = calculateHealthMetrics(answers)
      const score = healthScoring(answers, healthCalculations)

      setResults({
        score,
        healthCalculations
      })
    } catch (err) {
      setError('Failed to calculate results')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [answers])

  return { results, loading, error }
} 