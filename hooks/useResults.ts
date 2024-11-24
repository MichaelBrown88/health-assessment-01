import { useState, useEffect } from 'react'
import { calculateHealthMetrics, calculateScore, generateSummary } from '@/utils/healthUtils'
import type { AnalysisResults } from '@/types/results'

export function useResults(answers: Record<string, any>) {
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const healthCalculations = calculateHealthMetrics(answers)
      const score = calculateScore(answers, healthCalculations)
      const summary = generateSummary(answers)

      setResults({
        score,
        healthCalculations,
        summary
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