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

export interface AnswerType {
  [key: string]: string | number | boolean | string[];
}

export interface AssessmentResults {
  score: number;
  healthCalculations: HealthCalculations;
  summary: {
    exercise: string;
    nutrition: string;
    mentalHealth: string;
  };
}

export interface ResultsData {
  answers: AnswerType;
  assessmentResults: AssessmentResults;
  timestamp?: number;
}

export interface ResultsViewProps {
  results: ResultsData;
  showActions?: boolean;
  className?: string;
}

export interface ResultsSummaryProps {
  answers: AnswerType;
  healthCalculations: HealthCalculations;
  score: number;
  className?: string;
}

export interface ResultsActionsProps {
  onSave?: () => void;
  onShare?: () => void;
  onPrint?: () => void;
  className?: string;
}

export interface HealthMetric {
  timestamp: number;
  value: number;
  label?: string;
  category?: string;
}

export interface MetricHistory {
  metrics: HealthMetric[];
  startDate: number;
  endDate: number;
} 