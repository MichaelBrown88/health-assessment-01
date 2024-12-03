export interface HealthScore {
  overall: number;
  categories: {
    exercise: number;
    nutrition: number;
    wellbeing: number;
  };
}

export interface HealthGoal {
  id: string;
  name: string;
  description: string;
  recommendations: string[];
  difficulty: 'easy' | 'moderate' | 'challenging';
}

export interface AnalysisSection {
  title: string;
  summary: string;
  recommendations: string[];
  score: number;
}

export interface ResultsSummary {
  score: HealthScore;
  goals: HealthGoal[];
  analysis: {
    exercise: AnalysisSection;
    nutrition: AnalysisSection;
    wellbeing: AnalysisSection;
  };
}

export interface HealthCalculations {
  bmi: number | null;
  bmiCategory: string | null;
  bmr: number | null;
  tdee: number | null;
  bodyFat: number | null;
  isBodyFatEstimated: boolean;
  idealWeightLow: number | null;
  idealWeightHigh: number | null;
  recommendedCalories: number | null;
  proteinGrams: number | null;
  carbGrams: number | null;
  fatGrams: number | null;
  exerciseScore: number;
  nutritionScore: number;
  wellbeingScore: number;
  sleepScore: number;
}

export interface AnswerType {
  [key: string]: string | number | string[];
}

export interface SectionFeedback {
  score: number;
  color: string;
  feedback: string;
  recommendations: string;
}

export interface SectionSummary {
  title: string;
  score: number;
  feedbackItems: SectionFeedback[];
}

export interface DecodedResults {
  answers: AnswerType;
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

export interface ResultsPageProps {
  answers: AnswerType;
  results?: DecodedResults;
}

export interface HealthPillarScore {
  score: number;
  color: string;
  label: string;
  description: string;
}

export interface HealthPillarScores {
  exercise: HealthPillarScore;
  nutrition: HealthPillarScore;
  mentalHealth: HealthPillarScore;
  recovery: HealthPillarScore;
} 