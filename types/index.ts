export * from './assessment'
export * from './auth'
export * from './results'
export * from './subscription'

export interface AssessmentResult {
  id: string;
  userId: string;
  timestamp: number;
  metrics: {
    bmi?: number | null;
    weight?: number | null;
    height?: number | null;
    bodyFat?: number | null;
    overallScore: number;
  };
  answers: Record<string, string | number | boolean | string[]>;
}

export interface HealthCalculations {
  bmi: number | null;
  bmiCategory: string | null;
  bmr: number | null;
  tdee: number | null;
  bodyFat: number | null;
  isBodyFatEstimated: boolean;
  recommendedCalories: number | null;
  proteinGrams: number | null;
  carbGrams: number | null;
  fatGrams: number | null;
}

export interface DecodedResults {
  answers: Record<string, any>;
  assessmentResults: {
    score: number;
    healthCalculations: HealthCalculations;
    summary: {
      exercise: string;
      nutrition: string;
      wellbeing: string;
    };
  };
}
