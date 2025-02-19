export type Gender = 'male' | 'female';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export type BodyComposition = 'underweight' | 'normal' | 'overweight' | 'athletic';

export type HealthGoals = Array<'loseWeight' | 'buildMuscle' | 'improveHealth' | 'increaseEnergy'>;

export interface HealthMetrics {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
  bodyFat?: number;
  overallScore: number;
  exerciseScore: number;
  nutritionScore: number;
  wellbeingScore: number;
  sleepScore: number;
}

export interface HealthWarning {
  message: string;
  severity: 'warning' | 'alert';
}

export interface HealthRecommendation {
  category: 'exercise' | 'nutrition' | 'wellbeing' | 'sleep';
  message: string;
  priority: 'high' | 'medium' | 'low';
} 