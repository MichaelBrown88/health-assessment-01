'use client'

import * as React from 'react'
import { HealthMetricsCard } from './HealthMetricsCard'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from 'lucide-react'
import { AITriggerButton } from '@/components/ai/AITriggerButton'
import type { AnswerType, HealthCalculations } from '@/types/results'

interface BodyCompositionSectionProps {
  answers: AnswerType
  healthCalculations: HealthCalculations
  score?: number
  onAICoachOpen?: () => void
}

export function BodyCompositionSection({ 
  answers, 
  healthCalculations,
  score,
  onAICoachOpen 
}: BodyCompositionSectionProps) {
  const getBodyCompositionWarning = () => {
    const { bmiCategory, bodyFat } = healthCalculations
    const goals = answers.goals as string[]
    
    // Case 1: Very low body fat with weight loss goal
    if (bodyFat !== null && 
        ((answers.gender === 'male' && bodyFat < 8) || 
         (answers.gender === 'female' && bodyFat < 15)) &&
        goals.includes('weight-loss')) {
      return {
        title: 'Health Risk Alert',
        message: "Your body fat percentage is already at a very low level. Further reduction could be harmful to your health. Please consider adjusting your goals.",
        shouldRetake: true
      }
    }

    // Case 2: Underweight trying to lose weight
    if (bmiCategory === 'Underweight' && goals.includes('weight-loss')) {
      return {
        title: 'Important Health Notice',
        message: "Weight loss is not recommended at your current BMI. Please consult with a healthcare professional and consider adjusting your goals.",
        shouldRetake: true
      }
    }

    // Case 3: Severe obesity with aggressive goals
    if (bmiCategory === 'Obese' && 
        healthCalculations.bmi && healthCalculations.bmi > 35 && 
        goals.includes('weight-loss') && 
        goals.includes('muscle-gain')) {
      return {
        title: 'Goal Adjustment Needed',
        message: "Focusing on multiple intensive goals may not be optimal for your current health status. Consider prioritizing weight management first.",
        shouldRetake: true
      }
    }

    return null
  }

  if (!answers || !healthCalculations) {
    return (
      <HealthMetricsCard
        title="Body Composition"
        healthCalculations={healthCalculations}
        answers={answers}
        score={score}
      >
        <p>Loading body composition data...</p>
      </HealthMetricsCard>
    )
  }

  return (
    <HealthMetricsCard
      title="Body Composition"
      healthCalculations={healthCalculations}
      answers={answers}
      score={score}
      warning={getBodyCompositionWarning()}
      footer="Note: These metrics are calculated based on your provided information. For the most accurate assessment, consider consulting with a healthcare professional."
      className="h-full flex flex-col"
    >
      <dl className="space-y-2">
        {[
          { label: "BMI", value: `${healthCalculations.bmi?.toFixed(1) ?? 'N/A'} (${healthCalculations.bmiCategory ?? 'N/A'})`, tooltip: "Body Mass Index (BMI) is a measure of body fat based on height and weight." },
          { label: "Body Fat", value: healthCalculations.bodyFat !== null ? `${healthCalculations.bodyFat.toFixed(1)}%${healthCalculations.isBodyFatEstimated ? ' (Estimated)' : ''}` : 'N/A', tooltip: "The percentage of your total body mass that is fat." },
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
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </HealthMetricsCard>
  )
} 