import { useMemo } from 'react'
import { calculateHealthMetrics } from '@/utils/healthUtils'
import type { AnswerType } from '@/types/Question'
import type { HealthCalculations } from '@/types/results'

export function useHealthCalculations(answers: AnswerType): HealthCalculations {
  return useMemo(() => {
    return calculateHealthMetrics(answers)
  }, [answers])
}
