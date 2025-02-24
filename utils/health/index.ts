import type { 
  AnswerType, 
  HealthCalculations, 
  ContextualAnalysis,
  SectionFeedback
} from '@/types';

// BMI and Body Composition Calculations
export function calculateBMI(weight: number, height: number): number | null {
  return height > 0 ? weight / ((height / 100) ** 2) : null;
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

export function estimateBodyFat(bmi: number, age: number, gender: string): number {
  const baseBodyFat = gender === 'male' ? 20 : 28;
  const bmiAdjustment = (bmi - 22) * 1.2;
  const ageAdjustment = (age - 30) * 0.1;
  return Math.max(5, Math.min(50, baseBodyFat + bmiAdjustment + ageAdjustment));
}

// Metabolic Calculations
export function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  if (gender === 'male') {
    return 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
  }
  return 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age);
}

export function getActivityMultiplier(activityLevel: string): number {
  const multipliers: Record<string, number> = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9
  };
  return multipliers[activityLevel] || 1.2;
}

// Nutrition Calculations
export function calculateMacronutrients(
  tdee: number, 
  weight: number, 
  bodyFat: number | null, 
  goals: string[],
  carbPreference: string
) {
  let recommendedCalories = tdee;

  // Adjust calories based on goals
  if (goals.includes('weight-loss')) {
    recommendedCalories = tdee * 0.8; // 20% deficit
  } else if (goals.includes('muscle-gain')) {
    recommendedCalories = tdee * 1.1; // 10% surplus
  }

  // Calculate lean mass for protein calculation
  const leanMass = bodyFat !== null ? weight * (1 - bodyFat / 100) : weight;

  // Protein: 1.8-2.2g per kg of lean mass
  const proteinGrams = Math.round(leanMass * 2);
  const proteinCalories = proteinGrams * 4;

  // Adjust carb/fat ratio based on preference
  const remainingCalories = recommendedCalories - proteinCalories;
  const carbRatio = getCarbRatio(carbPreference);

  const carbCalories = remainingCalories * carbRatio;
  const fatCalories = remainingCalories * (1 - carbRatio);

  const carbGrams = Math.round(carbCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);

  return {
    recommendedCalories: Math.round(recommendedCalories),
    proteinGrams,
    carbGrams,
    fatGrams
  };
}

function getCarbRatio(preference: string): number {
  switch(preference) {
    case 'very-low': return 0.2;  // 20% carbs, 80% fat
    case 'low': return 0.35;      // 35% carbs, 65% fat
    case 'high': return 0.65;     // 65% carbs, 35% fat
    case 'very-high': return 0.8; // 80% carbs, 20% fat
    default: return 0.5;          // moderate: 50% carbs, 50% fat
  }
}

// Main Health Metrics Calculation
export function calculateHealthMetrics(answers: AnswerType): HealthCalculations {
  const weight = Number(answers.weight) || 0;
  const height = Number(answers.height) || 0;
  const age = Number(answers.age) || 0;
  const gender = String(answers.gender || '');
  const activityLevel = String(answers.activityLevel || '');
  const userProvidedBodyFat = answers.bodyFat ? Number(answers.bodyFat) : null;
  const carbPreference = String(answers.carbPreference || 'moderate');

  // Calculate BMI
  const bmi = calculateBMI(weight, height);
  
  // Body Fat handling
  let bodyFat = userProvidedBodyFat;
  let isBodyFatEstimated = false;

  if (bodyFat === null && bmi) {
    bodyFat = estimateBodyFat(bmi, age, gender);
    isBodyFatEstimated = true;
  }

  // Calculate Ideal Weight Range
  let idealWeightLow = null;
  let idealWeightHigh = null;
  
  if (height > 0) {
    const heightInMeters = height / 100;
    idealWeightLow = Math.round(18.5 * Math.pow(heightInMeters, 2));
    idealWeightHigh = Math.round(24.9 * Math.pow(heightInMeters, 2));
  }

  // Calculate BMR and TDEE
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = bmr * getActivityMultiplier(activityLevel);

  // Calculate macros
  const { recommendedCalories, proteinGrams, carbGrams, fatGrams } = 
    calculateMacronutrients(tdee, weight, bodyFat, answers.goals as string[], carbPreference);

  // Calculate section scores
  const exerciseScore = calculateExerciseScore(answers);
  const nutritionScore = calculateNutritionScore(answers);
  const mentalHealthScore = calculateMentalHealthScore(answers);
  const sleepScore = calculateSleepScore(answers);

  return {
    bmi,
    bmiCategory: bmi ? getBMICategory(bmi) : null,
    bodyFat,
    isBodyFatEstimated,
    idealWeightLow,
    idealWeightHigh,
    bmr,
    tdee,
    recommendedCalories,
    proteinGrams,
    carbGrams,
    fatGrams,
    exerciseScore,
    nutritionScore,
    mentalHealthScore,
    sleepScore
  };
}

// Section Scoring Functions
function calculateExerciseScore(answers: AnswerType): number {
  const { activityLevel, exerciseIntensity, exerciseDuration, exerciseType } = answers;
  let score = 0;

  // Activity Level scoring (max 35 points)
  const activityScores: Record<string, number> = {
    sedentary: 5,
    light: 15,
    moderate: 25,
    active: 35,
    'very-active': 35
  };
  score += activityScores[String(activityLevel)] || 0;

  // Exercise Intensity scoring (max 25 points)
  const intensityScores: Record<string, number> = {
    light: 10,
    moderate: 15,
    vigorous: 25,
    'very-intense': 20
  };
  score += intensityScores[String(exerciseIntensity)] || 0;

  // Exercise Duration scoring (max 25 points)
  const durationScores: Record<string, number> = {
    'less-than-30': 10,
    '30-45': 15,
    '45-60': 25,
    '60+': 20
  };
  score += durationScores[String(exerciseDuration)] || 0;

  // Exercise Type scoring (max 15 points)
  if (Array.isArray(exerciseType)) {
    score += Math.min(15, exerciseType.length * 5);
  }

  return Math.min(100, score);
}

function calculateNutritionScore(answers: AnswerType): number {
  const { diet, mealFrequency, lastMeal, goals } = answers;
  let score = 0;

  // Diet Quality scoring (max 40 points)
  const dietScores: Record<string, number> = {
    unhealthy: 0,
    average: 20,
    healthy: 30,
    'very-healthy': 40
  };
  score += dietScores[String(diet)] || 0;

  // Meal Frequency scoring (max 25 points)
  const frequencyScores: Record<string, number> = {
    '1-2': 10,
    '3-4': 25,
    '5+': 20
  };
  score += frequencyScores[String(mealFrequency)] || 0;

  // Last Meal Timing scoring (max 20 points)
  const mealTimingScores: Record<string, number> = {
    'before-6pm': 20,
    '6pm-8pm': 20,
    '8pm-10pm': 15,
    'after-10pm': 5
  };
  score += mealTimingScores[String(lastMeal)] || 0;

  // Goals alignment scoring (max 15 points)
  if (Array.isArray(goals)) {
    if (goals.some(goal => ['weight-loss', 'muscle-gain', 'overall-health'].includes(goal))) {
      score += 15;
    }
  }

  return Math.min(100, score);
}

function calculateMentalHealthScore(answers: AnswerType): number {
  let score = 0;
  const mentalHealth = answers.mentalHealth;
  const socializing = answers.socializing;
  const stress = answers.stress;

  // Mental Health scoring (max 40 points)
  const mentalHealthScores: Record<string, number> = {
    'never': 40,
    'rarely': 30,
    'sometimes': 20,
    'often': 10
  };
  score += mentalHealthScores[String(mentalHealth)] || 0;

  // Social Activity scoring (max 35 points)
  const socialScores: Record<string, number> = {
    'frequently': 35,
    'regularly': 30,
    'occasionally': 20,
    'rarely': 10
  };
  score += socialScores[String(socializing)] || 0;

  // Stress Level scoring (max 25 points)
  const stressScores: Record<string, number> = {
    'low': 25,
    'moderate': 20,
    'high': 10,
    'very-high': 5
  };
  score += stressScores[String(stress)] || 0;

  return Math.min(100, score);
}

function calculateSleepScore(answers: AnswerType): number {
  const { sleepDuration, sleepQuality, recovery } = answers;
  let score = 0;

  // Sleep Duration scoring (max 35 points)
  const durationScores: Record<string, number> = {
    'less-than-5': 0,
    '5-7': 20,
    '7-9': 35,
    'more-than-9': 25
  };
  score += durationScores[String(sleepDuration)] || 0;

  // Sleep Quality scoring (max 35 points)
  const qualityScores: Record<string, number> = {
    poor: 0,
    fair: 15,
    good: 25,
    excellent: 35
  };
  score += qualityScores[String(sleepQuality)] || 0;

  // Recovery scoring (max 30 points)
  const recoveryScores: Record<string, number> = {
    poor: 0,
    fair: 10,
    good: 20,
    excellent: 30
  };
  score += recoveryScores[String(recovery)] || 0;

  return Math.min(100, score);
}

// Overall Score Calculation
export function calculateOverallScore(healthCalculations: HealthCalculations): number {
  const weightedScore = Math.round(
    (healthCalculations.exerciseScore +
    healthCalculations.nutritionScore +
    healthCalculations.mentalHealthScore +
    healthCalculations.sleepScore) / 4
  );

  return Math.max(0, Math.min(100, weightedScore));
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

export function getTrafficLightColor(score: number): string {
  if (score >= 80) return "green";
  if (score >= 60) return "amber";
  return "red";
} 