import type { AnswerType } from '@/types/Question'
import type { HealthCalculations } from '@/types/results'

export function calculateScore(answers: AnswerType, healthCalculations: HealthCalculations): number {
  // Calculate overall score using weighted section scores
  const weights = {
    exercise: 0.3,    // 30%
    nutrition: 0.3,   // 30%
    mentalHealth: 0.2,   // 20%
    sleep: 0.2        // 20%
  };

  const weightedScore = 
    (healthCalculations.exerciseScore * weights.exercise) +
    (healthCalculations.nutritionScore * weights.nutrition) +
    (healthCalculations.mentalHealthScore * weights.mentalHealth) +
    (healthCalculations.sleepScore * weights.sleep);

  // Add BMI adjustment
  let bmiAdjustment = 0;
  if (healthCalculations.bmi !== null) {
    if (healthCalculations.bmi < 18.5 || healthCalculations.bmi >= 30) {
      bmiAdjustment = -10;
    } else if (healthCalculations.bmi >= 25) {
      bmiAdjustment = -5;
    }
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(weightedScore + bmiAdjustment)));
}

export function getTrafficLightColor(score: number): string {
  if (score >= 80) return "green";
  if (score >= 60) return "amber";
  return "red";
}

export function getHealthGoalAdvice(goals: string[]): string[] {
  const advice: Record<string, string> = {
    'weight-loss': 'Focus on creating a caloric deficit through diet and exercise.',
    'muscle-gain': 'Ensure adequate protein intake and progressive resistance training.',
    'endurance': 'Gradually increase cardiovascular exercise duration and intensity.',
    'overall-health': 'Maintain a balanced approach to diet, exercise, and rest.'
  };
  
  return goals.map(goal => advice[goal] || 'Set specific, measurable health goals.');
}

export function calculateOverallScore(healthCalculations: HealthCalculations): number {
  return Math.round(
    (healthCalculations.exerciseScore * weights.exercise) +
    (healthCalculations.nutritionScore * weights.nutrition) +
    (healthCalculations.mentalHealthScore * weights.mentalHealth) +
    (healthCalculations.sleepScore * weights.sleep)
  )
}

// ... other scoring-related functions ... 