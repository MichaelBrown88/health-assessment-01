export interface HealthCalculations {
  bmi: number
  bmiCategory: string
  bmr: number
  tdee: number
  recommendedCalories: number
  proteinGrams: number
  carbGrams: number
  fatGrams: number
  bodyFat: number | null
  isBodyFatEstimated: boolean
  idealWeightLow: number
  idealWeightHigh: number
}
