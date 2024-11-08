export interface ChartData {
  date: Date;
  timestamp: number;
  id: string;
  userId?: string;
  metrics: AssessmentMetrics;
  answers: Record<string, string | number | boolean | string[]>;
}

export interface AssessmentMetrics {
  overallScore: number;
  score: number;
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
  goals?: string[];
  [key: string]: string | number | string[] | boolean | undefined;
  // Add more specific types as needed
}

export interface HealthCalculations {
  bmi: number | null;
  bmiCategory: string | null;
  bmr: number | null;
  tdee: number | null;
  bodyFat: number | null;
  isBodyFatEstimated: boolean;
}

export interface Metrics {
  score: number;
  overallScore: number;
  exerciseScore?: number;
  nutritionScore?: number;
  sleepScore?: number;
  mentalHealthScore?: number;
  // Add other specific metrics as needed
}

export interface Assessment {
  id: string;
  userId?: string;
  timestamp: number | Date | { seconds: number; nanoseconds: number };
  answers: Record<string, string | number | boolean | string[]>;
  healthCalculations?: HealthCalculations;
  metrics: AssessmentMetrics;
  score?: number;
}
