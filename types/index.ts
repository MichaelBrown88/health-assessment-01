// Base types
export type AnswerType = {
  [key: string]: string | number | string[];
}

// Analysis types
export interface AnalysisItem {
  warning: boolean;
  severity: 'info' | 'warning' | 'alert';
  title: string;
  feedback: string;
  recommendations: string[];
}

// Health calculation types
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
  weight: number;
  height: number;
}

// Assessment result type
export interface AssessmentResult {
  id: string;
  userId: string;
  timestamp: number;
  metrics: {
    weight: number;
    height: number;
    bodyFat: number;
    overallScore: number;
    exerciseScore: number;
    wellbeingScore: number;
    nutritionScore: number;
    bmi: number;
  };
  answers: Record<string, string | number>;
}

// Re-export types from other files
export type { Question } from './Question';

// Add these exports to your existing types/index.ts
export interface ContextualAnalysis {
  warning: boolean;
  severity: 'info' | 'warning' | 'alert';
  title: string;
  feedback: string;
  recommendations: string[];
}

export interface Section {
  title: string;
  score: number;
  feedbackItems: Array<{
    item: string;
    score: number;
    color: string;
    feedback: string;
    recommendations: string;
  }>;
  contextualAnalyses?: ContextualAnalysis[];
}
