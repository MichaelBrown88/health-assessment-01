import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
          <div className="flex justify-between">
            <dt className="font-medium">Calories:</dt>
            <dd>{recommendedCalories ?? 'N/A'} kcal</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">Protein:</dt>
            <dd>{proteinGrams ?? 'N/A'}g ({recommendedCalories ? Math.round((proteinGrams ?? 0) * 4 / recommendedCalories * 100) : 'N/A'}%)</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">Carbohydrates:</dt>
            <dd>{carbGrams ?? 'N/A'}g ({recommendedCalories ? Math.round((carbGrams ?? 0) * 4 / recommendedCalories * 100) : 'N/A'}%)</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">Fat:</dt>
            <dd>{fatGrams ?? 'N/A'}g ({recommendedCalories ? Math.round((fatGrams ?? 0) * 9 / recommendedCalories * 100) : 'N/A'}%)</dd>
          </div>
        </dl>
        <p className="text-sm text-gray-400 mt-4">Note: These recommendations are tailored to your carbohydrate preference. Consult with a nutritionist for a personalized plan.</p>
      </CardContent>
    </Card>
  )
}
