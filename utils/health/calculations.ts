import type { AnswerType } from '@/types/results';
import type { HealthCalculations } from '@/types/results';
import { healthScoring } from '@/utils/health';
import { getBMICategory } from './utils';

export function calculateBMI(weight: number, height: number): number {
  // Convert height to meters if in cm
  const heightInMeters = height > 3 ? height / 100 : height;
  return weight / (heightInMeters * heightInMeters);
}

export function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  // Mifflin-St Jeor Equation
  const heightInCm = height < 3 ? height * 100 : height;
  let bmr = (10 * weight) + (6.25 * heightInCm) - (5 * age);
  bmr = gender.toLowerCase() === 'male' ? bmr + 5 : bmr - 161;
  return Math.round(bmr);
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const activityMultipliers = {
    'sedentary': 1.2,      // Little or no exercise
    'light': 1.375,        // Light exercise/sports 1-3 days/week
    'moderate': 1.55,      // Moderate exercise/sports 3-5 days/week
    'active': 1.725,       // Hard exercise/sports 6-7 days/week
    'very-active': 1.9     // Very hard exercise/sports & physical job or training twice per day
  };

  const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.2;
  return Math.round(bmr * multiplier);
}

export function calculateMacros(tdee: number, goal: string = 'maintain'): {
  protein: number;
  carbs: number;
  fat: number;
} {
  let calories = tdee;
  
  // Adjust calories based on goal
  switch (goal) {
    case 'lose':
      calories *= 0.8; // 20% deficit
      break;
    case 'gain':
      calories *= 1.1; // 10% surplus
      break;
    default:
      // maintain weight
      break;
  }

  // Calculate macros (in grams)
  // Protein: 2g per kg of bodyweight or 30% of calories
  const protein = Math.round((calories * 0.3) / 4);
  // Fat: 25% of calories
  const fat = Math.round((calories * 0.25) / 9);
  // Remaining calories from carbs
  const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);

  return { protein, carbs, fat };
}

export function estimateBodyFat(bmi: number, age: number, gender: string): number {
  // Adult Body Fat % = (1.20 × BMI) + (0.23 × Age) - (10.8 × gender) - 5.4
  // where gender = 1 for males and 0 for females
  const genderFactor = gender.toLowerCase() === 'male' ? 1 : 0;
  const bodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
  return Math.max(0, Math.min(100, Math.round(bodyFat)));
}

export function calculateIdealWeightRange(height: number, gender: string): {
  low: number;
  high: number;
} {
  // Convert height to meters if in cm
  const heightInMeters = height > 3 ? height / 100 : height;
  
  // Calculate BMI range (18.5 - 24.9) weights
  const lowWeight = 18.5 * (heightInMeters * heightInMeters);
  const highWeight = 24.9 * (heightInMeters * heightInMeters);

  return {
    low: Math.round(lowWeight),
    high: Math.round(highWeight)
  };
}

export function calculateHealthMetrics(answers: AnswerType): HealthCalculations {
  const weight = Number(answers.weight) || 0;
  const height = Number(answers.height) || 0;
  const age = Number(answers.age) || 0;
  const gender = String(answers.gender || '');

  // Calculate BMI
  const bmi = weight && height ? calculateBMI(weight, height) : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  // Calculate ideal weight range
  const idealWeight = height ? calculateIdealWeightRange(height, gender) : { low: null, high: null };
  const idealWeightLow = idealWeight.low;
  const idealWeightHigh = idealWeight.high;

  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr = null;
  if (weight && height && age && gender) {
    bmr = calculateBMR(weight, height, age, gender);
  }

  // Calculate TDEE
  let tdee = null;
  if (bmr && answers.activityLevel) {
    tdee = calculateTDEE(bmr, answers.activityLevel as string);
  }

  // Calculate body fat percentage
  let bodyFat = null;
  let isBodyFatEstimated = false;
  if (answers.bodyFat) {
    bodyFat = Number(answers.bodyFat);
  } else if (bmi && age && gender) {
    bodyFat = estimateBodyFat(bmi, age, gender);
    isBodyFatEstimated = true;
  }

  // Calculate recommended calories and macros
  let recommendedCalories = tdee;
  let proteinGrams = null;
  let carbGrams = null;
  let fatGrams = null;

  if (tdee) {
    // Adjust calories based on goal
    const goal = answers.goal || 'maintain';
    const macros = calculateMacros(tdee, goal);
    recommendedCalories = tdee;
    proteinGrams = macros.protein;
    carbGrams = macros.carbs;
    fatGrams = macros.fat;
  }

  // Calculate scores using the health scoring module
  const exerciseScore = healthScoring.calculateExerciseScore(answers);
  const nutritionScore = healthScoring.calculateNutritionScore(answers);
  const wellbeingScore = healthScoring.calculateWellbeingScore(answers);
  const sleepScore = healthScoring.calculateSleepScore(answers);

  return {
    bmi,
    bmiCategory,
    bmr,
    tdee,
    bodyFat,
    isBodyFatEstimated,
    idealWeightLow,
    idealWeightHigh,
    recommendedCalories,
    proteinGrams,
    carbGrams,
    fatGrams,
    exerciseScore,
    nutritionScore,
    wellbeingScore,
    sleepScore
  };
} 