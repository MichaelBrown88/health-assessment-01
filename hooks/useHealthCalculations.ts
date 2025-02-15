import { useMemo } from 'react'
import type { AnswerType, HealthCalculations } from '@/types/results'
import { calculateHealthMetrics } from '@/utils/healthUtils'

export function useHealthCalculations(answers: AnswerType): HealthCalculations {
  return useMemo(() => {
    const defaultCalculations: HealthCalculations = {
      bmi: null,
      bmiCategory: null,
      bmr: null,
      tdee: null,
      bodyFat: null,
      isBodyFatEstimated: true,
      idealWeightLow: null,
      idealWeightHigh: null,
      recommendedCalories: null,
      proteinGrams: null,
      carbGrams: null,
      fatGrams: null,
      exerciseScore: 0,
      nutritionScore: 0,
      wellbeingScore: 0,
      sleepScore: 0
    };

    if (!Object.keys(answers).length) {
      return defaultCalculations;
    }

    try {
      const metrics = calculateHealthMetrics(answers);
      return {
        ...defaultCalculations,
        ...metrics
      };
    } catch (error) {
      console.error('Error calculating health metrics:', error);
      return defaultCalculations;
    }
  }, [answers]);
}
