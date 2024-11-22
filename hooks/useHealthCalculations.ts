import { useMemo } from 'react'
import type { AnswerType } from '@/types/assessment'

export function useHealthCalculations(answers: AnswerType) {
  const score = useMemo(() => calculateHealthScore(answers), [answers])
  const isGoalMisaligned = useMemo(() => checkGoalMisalignment(answers), [answers])
  const structuredSummary = useMemo(() => generateStructuredSummary(answers), [answers])

  return {
    score,
    isGoalMisaligned,
    structuredSummary
  }
}

function calculateHealthScore(answers: AnswerType): number {
  const metrics = answers.healthMetrics || {}
  let score = 70 // Base score

  // Adjust score based on health metrics
  if (metrics.activityLevel === 'high') score += 10
  if (metrics.activityLevel === 'low') score -= 10

  // Adjust for goals alignment
  if (answers.goals?.length) score += 5

  return Math.min(Math.max(score, 0), 100) // Ensure score is between 0-100
}

function checkGoalMisalignment(answers: AnswerType): boolean {
  const metrics = answers.healthMetrics || {}
  const goals = answers.goals || []

  // Check if goals are realistic based on current metrics
  if (goals.includes('weight-loss') && metrics.activityLevel === 'low') {
    return true
  }

  return false
}

function generateStructuredSummary(answers: AnswerType) {
  const metrics = answers.healthMetrics || {}
  
  return {
    bodyComposition: {
      message: `Based on your ${metrics.height ? 'height and ' : ''}${
        metrics.weight ? 'weight' : 'metrics'
      }, we've analyzed your body composition.`,
      recommendations: [
        metrics.activityLevel === 'low' ? 'Consider increasing your activity level' : 'Maintain your current activity level',
        'Focus on balanced nutrition'
      ]
    },
    lifestyle: {
      message: "Based on your daily habits...",
      recommendations: []
    }
  }
}
