import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

interface RecommendedIntakeCardProps {
  healthCalculations: {
    recommendedCalories: number | null;
    proteinGrams: number | null;
    carbGrams: number | null;
    fatGrams: number | null;
  };
}

export const RecommendedIntakeCard: React.FC<RecommendedIntakeCardProps> = ({ healthCalculations }) => {
  const { recommendedCalories, proteinGrams, carbGrams, fatGrams } = healthCalculations
  
  return (
    <Card className={cn("bg-black/30 rounded-lg deep-space-border", "border-0")}>
      <CardHeader>
        <CardTitle>Recommended Daily Intake</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Based on your goals, current status, and carbohydrate preference, we recommend:</p>
        <dl className="space-y-2">
          {[
            { label: "Calories", value: `${recommendedCalories ?? 'N/A'} kcal`, tooltip: "The total energy intake recommended for your daily needs." },
            { label: "Protein", value: `${proteinGrams ?? 'N/A'}g (${recommendedCalories ? Math.round((proteinGrams ?? 0) * 4 / recommendedCalories * 100) : 'N/A'}%)`, tooltip: "Essential for muscle growth and repair. 1g of protein provides 4 calories." },
            { label: "Carbohydrates", value: `${carbGrams ?? 'N/A'}g (${recommendedCalories ? Math.round((carbGrams ?? 0) * 4 / recommendedCalories * 100) : 'N/A'}%)`, tooltip: "Primary source of energy. 1g of carbohydrates provides 4 calories." },
            { label: "Fat", value: `${fatGrams ?? 'N/A'}g (${recommendedCalories ? Math.round((fatGrams ?? 0) * 9 / recommendedCalories * 100) : 'N/A'}%)`, tooltip: "Important for hormone production and nutrient absorption. 1g of fat provides 9 calories." },
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
      </CardContent>
    </Card>
  )
}
