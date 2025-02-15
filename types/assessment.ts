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

export interface AssessmentAnswers extends AnswerType {
  // Basic Info
  weight?: number;
  height?: number;
  age?: number;
  gender?: 'male' | 'female';
  bodyFat?: number;

  // Exercise
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  exerciseFrequency?: 'never' | 'rarely' | 'sometimes' | 'frequently' | 'very-frequently';
  exerciseIntensity?: 'light' | 'moderate' | 'vigorous';
  exerciseDuration?: 'less-than-15' | '15-30' | '30-45' | '45-60' | 'more-than-60';

  // Nutrition
  dietQuality?: 'poor' | 'fair' | 'good' | 'excellent';
  mealFrequency?: '1-2' | '2-3' | '3-4' | '4-5' | '5+';
  waterIntake?: 'less-than-1L' | '1-2L' | '2-3L' | 'more-than-3L';
  carbPreference?: 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';

  // Sleep & Recovery
  sleepDuration?: 'less-than-5' | '5-6' | '6-7' | '7-8' | '8-9' | 'more-than-9';
  sleepQuality?: 'poor' | 'fair' | 'good' | 'excellent';

  // Mental Health
  stressLevel?: 'very-high' | 'high' | 'moderate' | 'low' | 'very-low';
  mentalHealth?: 'poor' | 'fair' | 'good' | 'excellent';
  workLifeBalance?: 'poor' | 'fair' | 'good' | 'excellent';

  // Goals
  goals?: string[];

  // Contact Info (optional)
  firstName?: string;
  email?: string;
}
