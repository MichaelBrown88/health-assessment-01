export type HealthPillar = 'bodyComposition' | 'exercise' | 'nutrition' | 'recovery' | 'mentalHealth';

export interface PillarScore {
  score: number;
  label: string;
  description: string;
  color: string;
  recommendations: string[];
}

export interface HealthPillarScores {
  [key in HealthPillar]: PillarScore;
}

// Body composition scoring types
export interface BodyCompositionMetrics {
  bmi: number;
  bodyFat: number | null;
  weight: number;
  height: number;
  gender: string;
  age: number;
}

// Exercise scoring types
export interface ExerciseMetrics {
  activityLevel: string;
  exerciseIntensity: string;
  exerciseDuration: string;
  exerciseFrequency: string;
}

// Nutrition scoring types
export interface NutritionMetrics {
  diet: string;
  mealFrequency: string;
  lastMeal: string;
  waterIntake: string;
}

// Recovery scoring types
export interface RecoveryMetrics {
  sleepDuration: string;
  sleepQuality: string;
  recovery: string;
  restDays: string;
}

// Mental health scoring types
export interface MentalHealthMetrics {
  stress: string;
  mentalHealth: string;
  socializing: string;
  workLifeBalance: string;
} 