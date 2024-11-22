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