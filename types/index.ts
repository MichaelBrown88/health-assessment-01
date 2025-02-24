export * from './assessment'
export * from './auth'
export * from './results'
export * from './subscription'

// Core Types
export interface AnswerType {
  [key: string]: string | number | boolean | string[];
}

export interface HealthCalculations {
  bmi: number | null;
  bmiCategory: string | null;
  bmr: number | null;
  tdee: number | null;
  bodyFat: number | null;
  isBodyFatEstimated?: boolean;
  idealWeightLow: number | null;
  idealWeightHigh: number | null;
  recommendedCalories: number | null;
  proteinGrams: number | null;
  carbGrams: number | null;
  fatGrams: number | null;
  exerciseScore: number;
  nutritionScore: number;
  mentalHealthScore: number;
  sleepScore: number;
}

export interface Assessment {
  id: string;
  userId: string;
  timestamp: number;
  createdAt?: Date | number;
  answers: AnswerType;
  metrics: {
    overallScore: number;
    exerciseScore: number;
    nutritionScore: number;
    mentalHealthScore: number;
    sleepScore: number;
  };
}

export interface ContextualAnalysis {
  warning?: boolean;
  severity: 'info' | 'warning' | 'alert';
  title: string;
  feedback: string;
  recommendations: string[];
}

export interface SectionFeedback {
  message: string;
  recommendations: string[];
}

export interface HealthPillarScores {
  [key: string]: {
    label: string;
    score: number;
  };
}

// User Types
export interface UserProfile {
  email: string;
  createdAt: Date | number;
  lastActive: Date | number;
  isAdmin: boolean;
  isPremium: boolean;
  premiumExpiry?: Date | number;
  stats: {
    assessmentsCompleted: number;
    currentStreak: number;
    longestStreak: number;
    lastAssessmentDate: number | null;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    emailUpdates: boolean;
    notifications: boolean;
  };
}

// Results Types
export interface DecodedResults {
  answers: AnswerType;
  assessmentResults: {
    score: number;
    healthCalculations: HealthCalculations;
    summary: {
      exercise: string;
      nutrition: string;
      mentalHealth: string;
    };
  };
}

// Analytics Types
export interface MetricTrends {
  overallScore: number[];
  exerciseScore: number[];
  nutritionScore: number[];
  mentalHealthScore: number[];
  sleepScore: number[];
  dates: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}
