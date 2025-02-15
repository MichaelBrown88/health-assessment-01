'use client'

import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { HealthMetricsCard } from "./HealthMetricsCard"
import type { HealthCalculations } from "@/types/results"

interface RecommendedIntakeSectionProps {
  healthCalculations: HealthCalculations
  answers: Record<string, any>
  score?: number
}

export function RecommendedIntakeSection({ healthCalculations, answers, score }: RecommendedIntakeSectionProps) {
  const getRDIWarning = () => {
    const { bmiCategory, bmi } = healthCalculations
    const goals = answers.goals as string[]
    
    // Case 1: Underweight trying to lose weight
    if (bmiCategory === 'Underweight' && goals.includes('weight-loss')) {
      return {
        title: 'Important Health Notice',
        message: "A caloric deficit is not recommended for your current health status. Please adjust your goals and retake the assessment.",
        shouldRetake: true
      }
    }

    // Case 2: Severe obesity with aggressive goals
    if (bmiCategory === 'Obese' && 
        bmi && bmi > 35 && 
        goals.includes('weight-loss') && 
        goals.includes('muscle-gain')) {
      return {
        title: 'Goal Adjustment Needed',
        message: "Focusing on multiple intensive goals may not be optimal. Consider prioritizing weight management first.",
        shouldRetake: true
      }
    }

    // Case 3: Very low body fat with weight loss goal
    if (healthCalculations.bodyFat !== null && 
        ((answers.gender === 'male' && healthCalculations.bodyFat < 8) || 
         (answers.gender === 'female' && healthCalculations.bodyFat < 15)) &&
        goals.includes('weight-loss')) {
      return {
        title: 'Health Risk Alert',
        message: "Your body fat is already quite low. Further reduction could be harmful to your health.",
        shouldRetake: true
      }
    }

    return null
  }

  return (
    <HealthMetricsCard
      title={
        <>
          Recommended<br />Daily Intake
        </>
      }
      healthCalculations={healthCalculations}
      answers={answers}
      score={score}
      warning={getRDIWarning()}
      footer="These recommendations are tailored to your carbohydrate preference and activity level. Consult with a nutritionist for a personalized plan."
      className="h-full flex flex-col"
    >
      <div className="flex-1">
        <p className="mb-4">Based on your goals, current status, and carbohydrate preference, we recommend:</p>
        <dl className="space-y-2">
          {[
            { label: "Calories", value: `${healthCalculations.recommendedCalories ?? 'N/A'} kcal`, tooltip: "The total energy intake recommended for your daily needs." },
            { label: "Protein", value: `${healthCalculations.proteinGrams ?? 'N/A'}g (${healthCalculations.recommendedCalories ? Math.round((healthCalculations.proteinGrams ?? 0) * 4 / healthCalculations.recommendedCalories * 100) : 'N/A'}%)`, tooltip: "Essential for muscle growth and repair. 1g of protein provides 4 calories." },
            { label: "Carbohydrates", value: `${healthCalculations.carbGrams ?? 'N/A'}g (${healthCalculations.recommendedCalories ? Math.round((healthCalculations.carbGrams ?? 0) * 4 / healthCalculations.recommendedCalories * 100) : 'N/A'}%)`, tooltip: "Primary source of energy. 1g of carbohydrates provides 4 calories." },
            { label: "Fat", value: `${healthCalculations.fatGrams ?? 'N/A'}g (${healthCalculations.recommendedCalories ? Math.round((healthCalculations.fatGrams ?? 0) * 9 / healthCalculations.recommendedCalories * 100) : 'N/A'}%)`, tooltip: "Important for hormone production and nutrient absorption. 1g of fat provides 9 calories." },
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
      </div>
    </HealthMetricsCard>
  )
} 