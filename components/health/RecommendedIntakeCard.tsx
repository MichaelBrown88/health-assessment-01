import React from 'react'
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { AITriggerButton } from "@/components/AITriggerButton"

interface RecommendedIntakeCardProps {
  healthCalculations: {
    bmi: number | null;
    bmr: number | null;
    tdee: number | null;
    bodyFat: number | null;
    isBodyFatEstimated: boolean;
    recommendedCalories: number | null;
    proteinGrams: number | null;
    carbGrams: number | null;
    fatGrams: number | null;
  };
  answers: Record<string, unknown>;
  score: number;
}

export function RecommendedIntakeCard({ healthCalculations, answers, score }: RecommendedIntakeCardProps) {
  return (
    <Card className="bg-black/30 backdrop-blur-sm border-gray-800">
      <div className="p-6">
        <div className="flex justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold leading-tight">
            Recommended<br />Daily Intake
          </h3>
          <div className="flex-shrink-0 mt-1">
            <AITriggerButton 
              assessmentData={{
                answers,
                healthCalculations,
                score
              }}
              variant="icon"
              size="small"
            />
          </div>
        </div>
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
        <p className="text-sm text-gray-400 mt-4">Note: These recommendations are tailored to your carbohydrate preference. Consult with a nutritionist for a personalized plan.</p>
      </div>
    </Card>
  )
}
