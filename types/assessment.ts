export interface ChartData {
  date: Date;
  timestamp: number;
  id: string;
  userId: string;
  metrics: AssessmentMetrics;
  answers: Record<string, string | number | boolean | string[]>;
}

export interface AssessmentMetrics {
  overallScore: number;
  exerciseScore: number;
  wellbeingScore: number;
  nutritionScore: number;
  weight: number;
  height: number;
  bodyFat: number;
  bmi: number;
  [key: string]: number;
}

export interface AssessmentAnswers {
  activityLevel: string;
  exerciseIntensity: string;
  exerciseDuration: string;
  diet: string;
  lastMeal: string;
  mealFrequency: string;
  sleepDuration: string;
  sleepQuality: string;
  recovery: string;
  stress: string;
  mentalHealth: string;
  socializing: string;
  [key: string]: string;
}

export interface Assessment {
  id: string;
  userId: string;
  timestamp: number | Date | { seconds: number; nanoseconds: number };
  metrics: AssessmentMetrics;
  answers: AssessmentAnswers;
  date?: Date;
}
