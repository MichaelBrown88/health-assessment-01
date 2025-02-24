import type { AnswerType } from '@/types/Question'
import type { HealthCalculations, HealthPillarScores } from '@/types/results'

// Core scoring weights
const SCORING_WEIGHTS = {
  exercise: 0.3,    // 30%
  nutrition: 0.3,   // 30%
  mentalHealth: 0.2,   // 20%
  sleep: 0.2        // 20%
} as const;

// Calculate detailed pillar scores
export function calculatePillarScores(answers: AnswerType, healthCalculations: HealthCalculations): HealthPillarScores {
  const scores = {
    bodyComposition: calculateBodyCompositionScore({
      bmi: healthCalculations.bmi || 0,
      bodyFat: healthCalculations.bodyFat,
      weight: Number(answers.weight),
      height: Number(answers.height),
      gender: String(answers.gender),
      age: Number(answers.age)
    }),
    exercise: calculateExerciseScore(answers),
    nutrition: calculateNutritionScore(answers),
    recovery: calculateRecoveryScore(answers),
    mentalHealth: calculateMentalHealthScore(answers)
  };

  // Cap each pillar score at 30
  Object.keys(scores).forEach(key => {
    scores[key as keyof HealthPillarScores].score = Math.min(30, scores[key as keyof HealthPillarScores].score);
  });

  return scores;
}

// Calculate overall health score
export function calculateScore(answers: AnswerType, healthCalculations: HealthCalculations): number {
  // Calculate weighted section scores
  const weightedScore = 
    (healthCalculations.exerciseScore * SCORING_WEIGHTS.exercise) +
    (healthCalculations.nutritionScore * SCORING_WEIGHTS.nutrition) +
    (healthCalculations.mentalHealthScore * SCORING_WEIGHTS.mentalHealth) +
    (healthCalculations.sleepScore * SCORING_WEIGHTS.sleep);

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

// This is now the single source of truth for overall score calculation
export function calculateOverallScore(healthCalculations: HealthCalculations): number {
  return calculateScore({}, healthCalculations);
}

// Re-export for backward compatibility
export const getOverallScore = calculateScore;

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

// ... other scoring-related functions ... 