import type { AnswerType, HealthCalculations, HealthPillarScores } from '@/types/results';
import type {
  ActivityLevel,
  ExerciseIntensity,
  ExerciseDuration,
  DietQuality,
  MealFrequency,
  StressLevel,
  MentalHealth,
  SocialActivity,
  SleepDuration,
  SleepQuality
} from '@/types/health';

// Score maps for different metrics
const scoreMap = {
  activity: {
    sedentary: 4,
    light: 6,
    moderate: 8,
    active: 10,
    'very-active': 10
  } as Record<ActivityLevel, number>,

  intensity: {
    light: 6,
    moderate: 8,
    vigorous: 10,
    'very-intense': 8
  } as Record<ExerciseIntensity, number>,

  duration: {
    'less-than-30': 6,
    '30-45': 8,
    '45-60': 10,
    '60+': 8
  } as Record<ExerciseDuration, number>,

  diet: {
    poor: 4,
    fair: 6,
    good: 8,
    excellent: 10
  } as Record<DietQuality, number>,

  mealFrequency: {
    '1-2': 4,
    '2-3': 6,
    '3-4': 10,
    '4-5': 8,
    '5+': 6
  } as Record<MealFrequency, number>,

  sleepDuration: {
    'less-than-6': 4,
    '6-7': 6,
    '7-8': 8,
    '8-9': 10,
    'more-than-9': 6
  } as Record<SleepDuration, number>,

  sleepQuality: {
    poor: 4,
    fair: 6,
    good: 8,
    excellent: 10
  } as Record<SleepQuality, number>,

  stress: {
    'very-high': 2,
    high: 4,
    moderate: 6,
    low: 8,
    'very-low': 10
  } as Record<StressLevel, number>,

  mentalHealth: {
    often: 4,
    sometimes: 6,
    rarely: 8,
    never: 10
  } as Record<MentalHealth, number>,

  socializing: {
    rarely: 4,
    occasionally: 6,
    regularly: 8,
    frequently: 10
  } as Record<SocialActivity, number>
};

function calculateExerciseScore(answers: AnswerType): number {
  let totalPoints = 0;
  const maxPoints = 30; // 10 points each for activity, intensity, duration

  // Activity Level scoring
  if (answers.activityLevel && typeof answers.activityLevel === 'string') {
    totalPoints += scoreMap.activity[answers.activityLevel as ActivityLevel] || 0;
  }

  // Exercise Intensity scoring
  if (answers.exerciseIntensity && typeof answers.exerciseIntensity === 'string') {
    totalPoints += scoreMap.intensity[answers.exerciseIntensity as ExerciseIntensity] || 0;
  }

  // Exercise Duration scoring
  if (answers.exerciseDuration && typeof answers.exerciseDuration === 'string') {
    totalPoints += scoreMap.duration[answers.exerciseDuration as ExerciseDuration] || 0;
  }

  return normalizeScore(totalPoints, maxPoints);
}

function calculateNutritionScore(answers: AnswerType): number {
  let totalPoints = 0;
  const maxPoints = 30; // 10 points each for diet quality, meal frequency, timing

  // Diet Quality scoring
  if (answers.dietQuality && typeof answers.dietQuality === 'string') {
    totalPoints += scoreMap.diet[answers.dietQuality as DietQuality] || 0;
  }

  // Meal Frequency scoring
  if (answers.mealFrequency && typeof answers.mealFrequency === 'string') {
    totalPoints += scoreMap.mealFrequency[answers.mealFrequency as MealFrequency] || 0;
  }

  // Last Meal Timing scoring (10 points max)
  if (answers.lastMeal === 'before-6pm' || answers.lastMeal === '6pm-8pm') {
    totalPoints += 10;
  } else if (answers.lastMeal === '8pm-10pm') {
    totalPoints += 6;
  } else if (answers.lastMeal === 'after-10pm') {
    totalPoints += 4;
  }

  return normalizeScore(totalPoints, maxPoints);
}

function calculateWellbeingScore(answers: AnswerType): number {
  let totalPoints = 0;
  const maxPoints = 30; // 10 points each for stress, mental health, social

  // Stress Level scoring
  if (answers.stress && typeof answers.stress === 'string') {
    totalPoints += scoreMap.stress[answers.stress as StressLevel] || 0;
  }

  // Mental Health scoring
  if (answers.mentalHealth && typeof answers.mentalHealth === 'string') {
    totalPoints += scoreMap.mentalHealth[answers.mentalHealth as MentalHealth] || 0;
  }

  // Social Activity scoring
  if (answers.socializing && typeof answers.socializing === 'string') {
    totalPoints += scoreMap.socializing[answers.socializing as SocialActivity] || 0;
  }

  return normalizeScore(totalPoints, maxPoints);
}

function calculateSleepScore(answers: AnswerType): number {
  let totalPoints = 0;
  const maxPoints = 20; // 10 points each for duration and quality

  // Sleep Duration scoring
  if (answers.sleepDuration && typeof answers.sleepDuration === 'string') {
    totalPoints += scoreMap.sleepDuration[answers.sleepDuration as SleepDuration] || 0;
  }

  // Sleep Quality scoring
  if (answers.sleepQuality && typeof answers.sleepQuality === 'string') {
    totalPoints += scoreMap.sleepQuality[answers.sleepQuality as SleepQuality] || 0;
  }

  return normalizeScore(totalPoints, maxPoints);
}

function calculateBMIScore(bmi: number | null): number {
  if (bmi === null) return 0;
  
  if (bmi >= 18.5 && bmi < 25) {
    return 100;  // Normal weight gets full points
  } else if (bmi >= 25 && bmi < 30) {
    return 60;   // Overweight gets partial points
  } else if (bmi >= 30 && bmi < 35) {
    return 40;   // Obese class I gets fewer points
  } else if (bmi >= 35) {
    return 20;   // Severely obese gets minimum points
  } else if (bmi >= 17 && bmi < 18.5) {
    return 60;   // Slightly underweight gets partial points
  } else {
    return 20;   // Severely underweight gets minimum points
  }
}

function normalizeScore(points: number, maxPoints: number): number {
  return Math.min(100, Math.max(0, Math.round((points / maxPoints) * 100)));
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'green';
  if (score >= 60) return 'amber';
  return 'red';
}

function calculateHealthPillars(answers: AnswerType, metrics: Partial<HealthCalculations>): HealthPillarScores {
  const exerciseScore = metrics.exerciseScore || calculateExerciseScore(answers);
  const nutritionScore = metrics.nutritionScore || calculateNutritionScore(answers);
  const mentalHealthScore = metrics.wellbeingScore || calculateWellbeingScore(answers);
  const recoveryScore = metrics.sleepScore || calculateSleepScore(answers);

  return {
    exercise: {
      score: Math.min(100, Math.max(0, exerciseScore)),
      label: "Exercise & Activity",
      color: getScoreColor(exerciseScore),
      description: "Based on activity level, intensity, and duration"
    },
    nutrition: {
      score: Math.min(100, Math.max(0, nutritionScore)),
      label: "Diet & Nutrition",
      color: getScoreColor(nutritionScore),
      description: "Based on diet quality and meal patterns"
    },
    mentalHealth: {
      score: Math.min(100, Math.max(0, mentalHealthScore)),
      label: "Mental Wellbeing",
      color: getScoreColor(mentalHealthScore),
      description: "Based on stress, mental health, and work-life balance"
    },
    recovery: {
      score: Math.min(100, Math.max(0, recoveryScore)),
      label: "Rest & Recovery",
      color: getScoreColor(recoveryScore),
      description: "Based on sleep quality and duration"
    }
  };
}

function calculateOverallScore(pillarScores: HealthPillarScores, bmi: number | null = null): number {
  // Define weights for each pillar (20% each)
  const weights = {
    exercise: 0.2,      // 20%
    nutrition: 0.2,     // 20%
    mentalHealth: 0.2,  // 20%
    recovery: 0.2,      // 20%
    bmi: 0.2           // 20%
  };

  // Calculate weighted score for each pillar
  const weightedScores = {
    exercise: pillarScores.exercise.score * weights.exercise,
    nutrition: pillarScores.nutrition.score * weights.nutrition,
    mentalHealth: pillarScores.mentalHealth.score * weights.mentalHealth,
    recovery: pillarScores.recovery.score * weights.recovery
  };

  // Calculate BMI score and add it to the weighted scores
  const bmiScore = calculateBMIScore(bmi);
  const totalScore = Object.values(weightedScores).reduce((sum, score) => sum + score, 0) + (bmiScore * weights.bmi);

  return Math.round(Math.min(100, Math.max(0, totalScore)));
}

export const healthScoring = {
  calculateExerciseScore,
  calculateNutritionScore,
  calculateWellbeingScore,
  calculateSleepScore,
  calculateBMIScore,
  calculateHealthPillars,
  calculateOverallScore
}; 