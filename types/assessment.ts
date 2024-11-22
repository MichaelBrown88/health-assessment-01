export interface HealthCalculations {
  bmi: number | null;
  bmr: number | null;
  tdee: number | null;
  bodyFat: number | null;
  isBodyFatEstimated: boolean;
  recommendedCalories?: number | null;
  proteinGrams?: number | null;
  carbGrams?: number | null;
  fatGrams?: number | null;
}

export interface AnswerType {
  [key: string]: string | number | boolean | string[] | null;
  goals?: string[];
  healthMetrics?: {
    height?: number;
    weight?: number;
    age?: number;
    gender?: string;
    activityLevel?: string;
  };
}

export interface AssessmentData {
  id?: string;
  userId?: string;
  answers: AnswerType;
  score: number;
  createdAt?: Date;
  metrics: {
    overallScore: number;
    exerciseScore: number;
    nutritionScore: number;
    wellbeingScore: number;
  };
  healthCalculations: HealthCalculations;
}
