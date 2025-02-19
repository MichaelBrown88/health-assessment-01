import type { HealthCalculations } from '@/types/results'
import type { AnswerType } from '@/types/Question'

export function calculateHealthMetrics(answers: AnswerType): HealthCalculations {
  const weight = Number(answers.weight) || 0
  const height = Number(answers.height) || 0
  const age = Number(answers.age) || 0
  const gender = String(answers.gender || '')
  const activityLevel = String(answers.activityLevel || '')
  const userProvidedBodyFat = answers.bodyFat ? Number(answers.bodyFat) : null
  const carbPreference = String(answers.carbPreference || 'moderate')

  // Calculate BMI
  const bmi = height > 0 ? weight / ((height / 100) ** 2) : null
  
  // Body Fat handling
  let bodyFat = userProvidedBodyFat
  let isBodyFatEstimated = false

  if (bodyFat === null && bmi) {
    bodyFat = estimateBodyFat(bmi, age, gender)
    isBodyFatEstimated = true
  }

  // Calculate Ideal Weight Range using BMI method
  let idealWeightLow = null
  let idealWeightHigh = null
  
  if (height > 0) {
    const heightInMeters = height / 100
    const minBMI = 18.5
    const maxBMI = 24.9
    
    idealWeightLow = Math.round(minBMI * Math.pow(heightInMeters, 2))
    idealWeightHigh = Math.round(maxBMI * Math.pow(heightInMeters, 2))
  }

  // Calculate BMR using Harris-Benedict Equation
  const bmr = calculateBMR(weight, height, age, gender)

  // Calculate TDEE
  const activityMultiplier = getActivityMultiplier(activityLevel)
  const tdee = bmr * activityMultiplier

  // Calculate macros based on goals and carb preference
  const { recommendedCalories, proteinGrams, carbGrams, fatGrams } = 
    calculateMacronutrients(tdee, weight, bodyFat, answers.goals as string[], carbPreference)

  // Calculate section scores
  const exerciseScore = calculateExerciseScore(answers)
  const nutritionScore = calculateNutritionScore(answers)
  const mentalHealthScore = calculateMentalHealthScore(answers)
  const sleepScore = calculateSleepScore(answers)

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
  }
}

function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  if (gender === 'male') {
    return 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age)
  }
  return 655.1 + (9.563 * weight) + (1.850 * height) - (4.676 * age)
}

function getActivityMultiplier(activityLevel: string): number {
  const multipliers: Record<string, number> = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very-active': 1.9
  }
  return multipliers[activityLevel] || 1.2
}

function calculateMacronutrients(
  tdee: number, 
  weight: number, 
  bodyFat: number | null, 
  goals: string[],
  carbPreference: string
) {
  let recommendedCalories = tdee

  // Adjust calories based on goals
  if (goals.includes('weight-loss')) {
    recommendedCalories = tdee * 0.8 // 20% deficit
  } else if (goals.includes('muscle-gain')) {
    recommendedCalories = tdee * 1.1 // 10% surplus
  }

  // Calculate lean mass for protein calculation
  const leanMass = bodyFat !== null ? weight * (1 - bodyFat / 100) : weight

  // Protein: 1.8-2.2g per kg of lean mass
  const proteinGrams = Math.round(leanMass * 2)
  const proteinCalories = proteinGrams * 4

  // Adjust carb/fat ratio based on preference
  const remainingCalories = recommendedCalories - proteinCalories
  let carbRatio: number

  switch (carbPreference) {
    case 'very-low':
      carbRatio = 0.2  // 20% carbs, 80% fat
      break
    case 'low':
      carbRatio = 0.35 // 35% carbs, 65% fat
      break
    case 'high':
      carbRatio = 0.65 // 65% carbs, 35% fat
      break
    case 'very-high':
      carbRatio = 0.8  // 80% carbs, 20% fat
      break
    default: // moderate
      carbRatio = 0.5  // 50% carbs, 50% fat
  }

  const carbCalories = remainingCalories * carbRatio
  const fatCalories = remainingCalories * (1 - carbRatio)

  const carbGrams = Math.round(carbCalories / 4)
  const fatGrams = Math.round(fatCalories / 9)

  return {
    recommendedCalories: Math.round(recommendedCalories),
    proteinGrams,
    carbGrams,
    fatGrams
  }
}

// Scoring functions
function calculateExerciseScore(answers: AnswerType): number {
  const { activityLevel, exerciseIntensity, exerciseDuration, exerciseType } = answers
  let score = 0

  // Activity Level scoring (max 12 points)
  const activityScores: Record<string, number> = {
    sedentary: 2,
    light: 5,
    moderate: 8,
    active: 10,
    'very-active': 12
  }
  score += activityScores[String(activityLevel)] || 0

  // Exercise Intensity scoring (max 6 points)
  const intensityScores: Record<string, number> = {
    light: 2,
    moderate: 4,
    vigorous: 6,
    'very-intense': 5
  }
  score += intensityScores[String(exerciseIntensity)] || 0

  // Exercise Duration scoring (max 6 points)
  const durationScores: Record<string, number> = {
    'less-than-30': 2,
    '30-45': 4,
    '45-60': 6,
    '60+': 5
  }
  score += durationScores[String(exerciseDuration)] || 0

  // Exercise Type scoring (max 6 points)
  if (Array.isArray(exerciseType)) {
    score += Math.min(6, exerciseType.length * 2)
  }

  return Math.min(30, score)
}

function calculateNutritionScore(answers: AnswerType): number {
  const { diet, mealFrequency, lastMeal, goals } = answers
  let score = 0

  // Diet Quality scoring (max 15 points)
  const dietScores: Record<string, number> = {
    unhealthy: 0,
    average: 8,
    healthy: 12,
    'very-healthy': 15
  }
  score += dietScores[String(diet)] || 0

  // Meal Frequency scoring (max 5 points)
  const frequencyScores: Record<string, number> = {
    '1-2': 2,
    '3-4': 5,
    '5+': 4
  }
  score += frequencyScores[String(mealFrequency)] || 0

  // Last Meal Timing scoring (max 5 points)
  const mealTimingScores: Record<string, number> = {
    'before-6pm': 5,
    '6pm-8pm': 5,
    '8pm-10pm': 3,
    'after-10pm': 1
  }
  score += mealTimingScores[String(lastMeal)] || 0

  // Goals alignment scoring (max 5 points)
  if (Array.isArray(goals)) {
    if (goals.some(goal => ['weight-loss', 'muscle-gain', 'overall-health'].includes(goal))) {
      score += 5
    }
  }

  return Math.min(30, score)
}

function calculateMentalHealthScore(answers: AnswerType): number {
  let score = 0;
  const mentalHealth = answers.mentalHealth;
  const socializing = answers.socializing;
  const stress = answers.stress;

  // Mental Health scoring (max 12 points)
  const mentalHealthScores: Record<string, number> = {
    'never': 12,          // Never or almost never feel down/anxious
    'rarely': 9,          // Rarely (few times a month)
    'sometimes': 6,       // Sometimes (few times a week)
    'often': 3           // Often (most days)
  };
  score += mentalHealthScores[String(mentalHealth)] || 0;

  // Social Activity scoring (max 10 points)
  const socialScores: Record<string, number> = {
    'frequently': 10,     // 3 or more times a week
    'regularly': 8,       // 1-2 times a week
    'occasionally': 5,    // 1-2 times a month
    'rarely': 2          // less than once a month
  };
  score += socialScores[String(socializing)] || 0;

  // Stress Level scoring (max 8 points)
  const stressScores: Record<string, number> = {
    'low': 8,
    'moderate': 6,
    'high': 3,
    'very-high': 1
  };
  score += stressScores[String(stress)] || 0;

  // Convert to 0-100 scale
  return Math.min(100, (score / 30) * 100);
}

function calculateSleepScore(answers: AnswerType): number {
  const { sleepDuration, sleepQuality, recovery } = answers
  let score = 0

  // Sleep Duration scoring (max 10 points)
  const durationScores: Record<string, number> = {
    'less-than-5': 0,
    '5-7': 5,
    '7-9': 10,
    'more-than-9': 7
  }
  score += durationScores[String(sleepDuration)] || 0

  // Sleep Quality scoring (max 10 points)
  const qualityScores: Record<string, number> = {
    poor: 0,
    fair: 4,
    good: 7,
    excellent: 10
  }
  score += qualityScores[String(sleepQuality)] || 0

  // Recovery scoring (max 10 points)
  const recoveryScores: Record<string, number> = {
    poor: 0,
    fair: 3,
    good: 7,
    excellent: 10
  }
  score += recoveryScores[String(recovery)] || 0

  return Math.min(30, score)
}

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight"
  if (bmi < 25) return "Normal"
  if (bmi < 30) return "Overweight"
  return "Obese"
}

function estimateBodyFat(bmi: number, age: number, gender: string): number {
  const baseBodyFat = gender === 'male' ? 20 : 28
  const bmiAdjustment = (bmi - 22) * 1.2
  const ageAdjustment = (age - 30) * 0.1
  
  return Math.max(5, Math.min(50, baseBodyFat + bmiAdjustment + ageAdjustment))
}

