import type { AnswerType } from '@/types/Question'
import type { HealthCalculations } from '@/types/results'
import type { ActivityLevel } from '@/types/health'
import { healthScoring } from '@/utils/health'
import { getBMICategory } from '@/utils/health/utils'
import { calculateIdealWeightRange } from '@/utils/health/calculations'

export function calculateHealthMetrics(answers: AnswerType): HealthCalculations {
  const weight = Number(answers.weight) || 0
  const height = Number(answers.height) || 0
  const age = Number(answers.age) || 0
  const gender = String(answers.gender || '')

  // Calculate BMI
  const bmi = weight && height ? weight / ((height / 100) * (height / 100)) : null
  const bmiCategory = bmi ? getBMICategory(bmi) : null

  // Calculate ideal weight range
  const idealWeight = height ? calculateIdealWeightRange(height, gender) : { low: null, high: null }
  const idealWeightLow = idealWeight.low
  const idealWeightHigh = idealWeight.high

  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr = null
  if (weight && height && age && gender) {
    const heightInCm = height
    bmr = (10 * weight) + (6.25 * heightInCm) - (5 * age)
    bmr = gender.toLowerCase() === 'male' ? bmr + 5 : bmr - 161
  }

  // Calculate TDEE
  let tdee = null
  if (bmr && answers.activityLevel) {
    const activityMultipliers: Record<ActivityLevel, number> = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    }
    const level = answers.activityLevel as ActivityLevel
    tdee = Math.round(bmr * (activityMultipliers[level] || 1.2))
  }

  // Calculate body fat percentage
  let bodyFat = null
  let isBodyFatEstimated = false
  if (answers.bodyFat) {
    bodyFat = Number(answers.bodyFat)
  } else if (bmi && age && gender) {
    // Estimate body fat using BMI method if not provided
    const genderFactor = gender.toLowerCase() === 'male' ? 1 : 0
    bodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4
    bodyFat = Math.max(0, Math.min(100, Math.round(bodyFat)))
    isBodyFatEstimated = true
  }

  // Calculate recommended calories and macros
  let recommendedCalories = tdee
  let proteinGrams = null
  let carbGrams = null
  let fatGrams = null

  if (tdee) {
    // Adjust calories based on goal
    const goal = answers.goal || 'maintain'
    switch (goal) {
      case 'lose':
        recommendedCalories = Math.round(tdee * 0.8) // 20% deficit
        break
      case 'gain':
        recommendedCalories = Math.round(tdee * 1.1) // 10% surplus
        break
      default:
        recommendedCalories = tdee
    }

    // Calculate macros
    proteinGrams = Math.round((recommendedCalories * 0.3) / 4) // 30% from protein
    fatGrams = Math.round((recommendedCalories * 0.25) / 9)    // 25% from fat
    carbGrams = Math.round((recommendedCalories - (proteinGrams * 4) - (fatGrams * 9)) / 4) // Rest from carbs
  }

  // Calculate scores using the health scoring module
  const exerciseScore = healthScoring.calculateExerciseScore(answers)
  const nutritionScore = healthScoring.calculateNutritionScore(answers)
  const wellbeingScore = healthScoring.calculateWellbeingScore(answers)
  const sleepScore = healthScoring.calculateSleepScore(answers)

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
  }
}

