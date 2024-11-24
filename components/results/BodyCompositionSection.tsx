'use client'

import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HealthMetricsCard } from "./HealthMetricsCard"
import type { HealthCalculations } from "@/types/results"

interface BodyCompositionSectionProps {
  healthCalculations: HealthCalculations
  answers: Record<string, any>
  score?: number
}

export function BodyCompositionSection({ healthCalculations, answers, score }: BodyCompositionSectionProps) {
  console.log('Body Comp Answers:', answers)
  console.log('Health Calculations:', healthCalculations)
  console.log('User provided body fat:', answers.bodyFat)
  console.log('Calculated body fat:', healthCalculations.bodyFat)
  console.log('Is body fat estimated:', healthCalculations.isBodyFatEstimated)

  const getBodyCompWarning = () => {
    const { bmiCategory, bodyFat } = healthCalculations
    const goals = answers.goals as string[]
    const activityLevel = answers.activityLevel as string
    const exerciseFrequency = answers.exerciseFrequency as string
    
    // Case 1: Underweight trying to lose weight
    if (bmiCategory === 'Underweight' && goals.includes('weight-loss')) {
      return {
        title: 'Goal Adjustment Recommended',
        message: "Based on your current body composition, weight loss may not be the most suitable goal. Consider adjusting your health goals and taking another assessment.",
        shouldRetake: true
      }
    }

    // Case 2: Athletic person with high BMI but healthy body fat
    if (bmiCategory === 'Overweight' && 
        bodyFat !== null && 
        ((answers.gender === 'male' && bodyFat < 15) || 
         (answers.gender === 'female' && bodyFat < 23)) &&
        (activityLevel === 'very-active' || exerciseFrequency === 'frequently')) {
      return {
        title: 'BMI Limitation Notice',
        message: "Your BMI may not accurately reflect your health status due to higher muscle mass. Focus on body fat percentage and performance metrics instead.",
        shouldRetake: false
      }
    }

    // Case 3: Severely underweight
    if (bmiCategory === 'Underweight' && healthCalculations.bmi && healthCalculations.bmi < 16.5) {
      return {
        title: 'Medical Attention Advised',
        message: "Your BMI indicates severe underweight. Please consult a healthcare provider before proceeding with any fitness program.",
        shouldRetake: false
      }
    }

    // Case 4: Severely obese
    if (bmiCategory === 'Obese' && healthCalculations.bmi && healthCalculations.bmi > 35) {
      return {
        title: 'Medical Guidance Recommended',
        message: "Please consult a healthcare provider to create a safe and effective plan for your health goals.",
        shouldRetake: false
      }
    }

    return null
  }

  const showEstimatedLabel = healthCalculations.isBodyFatEstimated && !answers.bodyFat

  return (
    <HealthMetricsCard
      title="Body Composition"
      healthCalculations={healthCalculations}
      answers={answers}
      score={score}
      warning={getBodyCompWarning()}
      footer="These measurements provide insights into your body composition. Remember that factors like muscle mass and body type can affect these numbers."
      className="h-full flex flex-col"
    >
      <div className="flex-1">
        <dl className="space-y-2">
          {[
            { 
              label: "BMI", 
              value: `${healthCalculations.bmi?.toFixed(1) ?? 'N/A'} (${healthCalculations.bmiCategory ?? 'N/A'})`, 
              tooltip: "Body Mass Index (BMI) is a measure of body fat based on height and weight." 
            },
            { 
              label: "Body Fat", 
              value: answers.bodyFat 
                ? `${Number(answers.bodyFat).toFixed(1)}%` 
                : healthCalculations.bodyFat !== null 
                  ? `${healthCalculations.bodyFat.toFixed(1)}%${showEstimatedLabel ? ' (Estimated)' : ''}` 
                  : 'N/A',
              tooltip: "The percentage of your total body mass that is fat.",
              highlight: showEstimatedLabel
            },
            { label: "Weight", value: `${answers.weight ?? 'N/A'} kg`, tooltip: "Your current weight in kilograms." },
            { label: "Height", value: `${answers.height ?? 'N/A'} cm`, tooltip: "Your height in centimeters." },
            { label: "Ideal Weight Range", value: healthCalculations.idealWeightLow !== null && healthCalculations.idealWeightHigh !== null ? `${healthCalculations.idealWeightLow.toFixed(1)} - ${healthCalculations.idealWeightHigh.toFixed(1)} kg` : 'N/A', tooltip: "The healthy weight range based on your height and body composition." },
            { label: "BMR", value: healthCalculations.bmr ? `${Math.round(healthCalculations.bmr)} calories/day` : 'N/A', tooltip: "Basal Metabolic Rate (BMR) is the number of calories your body burns at rest." },
            { label: "TDEE", value: healthCalculations.tdee ? `${Math.round(healthCalculations.tdee)} calories/day` : 'N/A', tooltip: "Total Daily Energy Expenditure (TDEE) is the total number of calories you burn in a day." },
          ].map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <dt className="font-medium flex items-center">
                {item.label}
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="w-3 h-3 ml-1 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span className="max-w-xs">{item.tooltip}</span>
                  </TooltipContent>
                </Tooltip>
              </dt>
              <dd className={item.highlight ? 'text-blue-300/80' : ''}>
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </HealthMetricsCard>
  )
} 