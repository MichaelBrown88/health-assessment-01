export interface FeedbackItem {
  feedback: string;
  recommendations: string;
}

export interface FeedbackMap {
  activityLevel: Record<string, FeedbackItem>;
  exerciseIntensity: Record<string, FeedbackItem>;
  exerciseDuration: Record<string, FeedbackItem>;
  diet: Record<string, FeedbackItem>;
  mealFrequency: Record<string, FeedbackItem>;
  lastMeal: Record<string, FeedbackItem>;
  sleepDuration: Record<string, FeedbackItem>;
  sleepQuality: Record<string, FeedbackItem>;
  recovery: Record<string, FeedbackItem>;
  stress: Record<string, FeedbackItem>;
  mentalHealth: Record<string, FeedbackItem>;
  socializing: Record<string, FeedbackItem>;
}

export interface ContextualAnalysis {
  title: string;
  description: string;
  severity: 'warning' | 'info';
  recommendations: string[];
} 