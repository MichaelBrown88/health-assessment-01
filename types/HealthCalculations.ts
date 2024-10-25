export interface HealthCalculations {
  bmi: number | null;
  bmiCategory: string | null;
  bmr: number | null;
  tdee: number | null;
  recommendedCalories: number | null;
  proteinGrams: number | null;
  carbGrams: number | null;
  fatGrams: number | null;
  bodyFat: number | null;
  isBodyFatEstimated: boolean;
  idealWeightLow: number | null;
  idealWeightHigh: number | null;
}
