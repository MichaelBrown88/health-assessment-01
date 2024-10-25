import { useState, useEffect } from 'react'
import { AnswerType } from '../data/questions'
import { HealthCalculations } from '../types/HealthCalculations'

export const useHealthCalculations = (answers: AnswerType): HealthCalculations => {
  const [healthCalculations, setHealthCalculations] = useState<HealthCalculations>({
    bmi: 0,
    bmiCategory: '',
    bmr: 0,
    tdee: 0,
    recommendedCalories: 0,
    proteinGrams: 0,
    carbGrams: 0,
    fatGrams: 0,
    bodyFat: null,
    isBodyFatEstimated: false,
    idealWeightLow: 0,
    idealWeightHigh: 0
  })

  useEffect(() => {
    // Parse input values from answers
    const weight = parseFloat(answers.weight as string);
    const height = parseFloat(answers.height as string) / 100; // Convert cm to m
    const age = parseInt(answers.age as string);
    const gender = answers.gender as string;
    const activityLevel = answers.activityLevel as string;
    const carbPreference = answers.carbPreference as string;
    const bodyFat = parseFloat(answers.bodyFat as string) || null;

    // Log inputs for debugging
    console.log('Inputs:', { weight, height, age, gender, activityLevel, carbPreference, bodyFat });

    // Calculate BMI and categorize
    const bmi = parseFloat((weight / (height * height)).toFixed(1));
    const bmiCategory = bmi < 18.5 ? "Underweight" :
                        bmi < 25 ? "Normal weight" :
                        bmi < 30 ? "Overweight" : "Obese";

    // Calculate BMR based on gender
    const bmr = gender === "male" ?
      88.362 + (13.397 * weight) + (4.799 * height * 100) - (5.677 * age) :
      447.593 + (9.247 * weight) + (3.098 * height * 100) - (4.330 * age);

    // Calculate TDEE using activity level
    const activityLevels = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };
    const tdee = bmr * activityLevels[activityLevel as keyof typeof activityLevels];

    // Calculate macronutrient distribution
    const recommendedCalories = Math.round(tdee);
    let proteinPercentage = 0.3;
    let carbPercentage = 0.4;
    let fatPercentage = 0.3;

    switch (carbPreference) {
      case "low-carb":
        carbPercentage = 0.2;
        proteinPercentage = 0.35;
        fatPercentage = 0.45;
        break;
      case "high-carb":
        carbPercentage = 0.6;
        proteinPercentage = 0.25;
        fatPercentage = 0.15;
        break;
    }

    const proteinGrams = Math.round((recommendedCalories * proteinPercentage) / 4);
    const carbGrams = Math.round((recommendedCalories * carbPercentage) / 4);
    const fatGrams = Math.round((recommendedCalories * fatPercentage) / 9);

    // Estimate body fat if not provided
    const estimatedBodyFat = bodyFat === null ? (gender === 'male' ? 
      (1.20 * bmi) + (0.23 * age) - 16.2 :
      (1.20 * bmi) + (0.23 * age) - 5.4) : null;

    // Calculate ideal weight range
    const idealWeightLow = 18.5 * (height * height);
    const idealWeightHigh = 24.9 * (height * height);

    // Update health calculations state
    setHealthCalculations({
      bmi,
      bmiCategory,
      bmr,
      tdee,
      recommendedCalories,
      proteinGrams,
      carbGrams,
      fatGrams,
      bodyFat: bodyFat !== null ? bodyFat : estimatedBodyFat,
      isBodyFatEstimated: bodyFat === null,
      idealWeightLow: Math.round(idealWeightLow),
      idealWeightHigh: Math.round(idealWeightHigh)
    });
  }, [answers])

  return healthCalculations
}
