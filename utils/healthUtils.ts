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

  // Calculate Ideal Weight Range (Hamwi Formula)
  let idealWeightLow = null
  let idealWeightHigh = null
  
  if (height > 0) {
    const heightInInches = height / 2.54
    const baseHeight = 60 // 5 feet in inches
    
    if (gender === 'male') {
      const idealWeight = 48 + 2.7 * (heightInInches - baseHeight)
      idealWeightLow = (idealWeight * 0.9) * 0.453592 // Convert to kg
      idealWeightHigh = (idealWeight * 1.1) * 0.453592
    } else {
      const idealWeight = 45.5 + 2.2 * (heightInInches - baseHeight)
      idealWeightLow = (idealWeight * 0.9) * 0.453592
      idealWeightHigh = (idealWeight * 1.1) * 0.453592
    }
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
  const wellbeingScore = calculateWellbeingScore(answers)
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
    wellbeingScore,
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
  const { exerciseFrequency, exerciseIntensity, exerciseDuration } = answers
  let score = 75 // Base score

  // Exercise Frequency scoring
  switch (exerciseFrequency) {
    case 'never':
      score -= 30
      break
    case 'rarely':
      score -= 20
      break
    case 'sometimes':
      score -= 10
      break
    case 'frequently':
      score += 10
      break
    case 'very-frequently':
      score += 15
      break
  }

  // Exercise Intensity scoring
  switch (exerciseIntensity) {
    case 'light':
      score -= 5
      break
    case 'moderate':
      score += 5
      break
    case 'vigorous':
      score += 10
      break
  }

  // Exercise Duration scoring
  switch (exerciseDuration) {
    case 'less-than-15':
      score -= 10
      break
    case '15-30':
      score -= 5
      break
    case '30-45':
      score += 5
      break
    case '45-60':
      score += 10
      break
    case 'more-than-60':
      score += 15
      break
  }

  return Math.max(0, Math.min(100, score))
}

function calculateNutritionScore(answers: AnswerType): number {
  const { dietQuality, mealFrequency, waterIntake } = answers
  let score = 75 // Base score

  // Diet Quality scoring
  switch (dietQuality) {
    case 'poor':
      score -= 30
      break
    case 'fair':
      score -= 15
      break
    case 'good':
      score += 10
      break
    case 'excellent':
      score += 15
      break
  }

  // Meal Frequency scoring
  switch (mealFrequency) {
    case '1-2':
      score -= 15
      break
    case '2-3':
      score -= 5
      break
    case '3-4':
      score += 5
      break
    case '4-5':
      score += 10
      break
    case '5+':
      score -= 5 // Too frequent might not be optimal
      break
  }

  // Water Intake scoring
  switch (waterIntake) {
    case 'less-than-1L':
      score -= 20
      break
    case '1-2L':
      score -= 10
      break
    case '2-3L':
      score += 10
      break
    case 'more-than-3L':
      score += 15
      break
  }

  return Math.max(0, Math.min(100, score))
}

function calculateWellbeingScore(answers: AnswerType): number {
  const { stressLevel, mentalHealth, workLifeBalance } = answers
  let score = 75 // Base score

  // Stress Level scoring
  switch (stressLevel) {
    case 'very-high':
      score -= 30
      break
    case 'high':
      score -= 20
      break
    case 'moderate':
      score -= 10
      break
    case 'low':
      score += 10
      break
    case 'very-low':
      score += 15
      break
  }

  // Mental Health scoring
  switch (mentalHealth) {
    case 'poor':
      score -= 30
      break
    case 'fair':
      score -= 15
      break
    case 'good':
      score += 10
      break
    case 'excellent':
      score += 15
      break
  }

  // Work-Life Balance scoring
  switch (workLifeBalance) {
    case 'poor':
      score -= 20
      break
    case 'fair':
      score -= 10
      break
    case 'good':
      score += 10
      break
    case 'excellent':
      score += 15
      break
  }

  return Math.max(0, Math.min(100, score))
}

function calculateSleepScore(answers: AnswerType): number {
  const { sleepDuration, sleepQuality } = answers
  let score = 75 // Base score

  // Sleep Duration scoring
  switch (sleepDuration) {
    case 'less-than-5':
      score -= 30
      break
    case '5-6':
      score -= 20
      break
    case '6-7':
      score -= 10
      break
    case '7-8':
      score += 15
      break
    case '8-9':
      score += 10
      break
    case 'more-than-9':
      score -= 5 // Too much sleep might not be optimal
      break
  }

  // Sleep Quality scoring
  switch (sleepQuality) {
    case 'poor':
      score -= 25
      break
    case 'fair':
      score -= 10
      break
    case 'good':
      score += 10
      break
    case 'excellent':
      score += 15
      break
  }

  return Math.max(0, Math.min(100, score))
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

