import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BodyCompositionCardProps {
  healthCalculations: {
    bmi: number | null;
    bmiCategory: string | null;
    bmr: number | null;
    tdee: number | null;
    bodyFat: number | null;
    isBodyFatEstimated: boolean;
    idealWeightLow: number | null;
    idealWeightHigh: number | null;
  };
  answers: {
    weight?: string;
    height?: string;
  };
  footer?: string;
}

export const BodyCompositionCard: React.FC<BodyCompositionCardProps> = ({ healthCalculations, answers, footer }) => {
  const { bmi, bmiCategory, bmr, tdee, bodyFat, isBodyFatEstimated, idealWeightLow, idealWeightHigh } = healthCalculations
  
  return (
    <Card className={cn("bg-black/30 rounded-lg deep-space-border", "border-0")}>
      <CardHeader>
        <CardTitle>Body Composition</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="font-medium">BMI:</dt>
            <dd>{bmi?.toFixed(1) ?? 'N/A'} ({bmiCategory ?? 'N/A'})</dd>
          </div>
          {bodyFat !== null && bodyFat !== undefined && (
            <div className="flex justify-between">
              <dt className="font-medium">Body Fat:</dt>
              <dd>
                {bodyFat.toFixed(1)}%
                {isBodyFatEstimated && (
                  <span className="ml-2 text-xs bg-yellow-500 text-black px-2 py-1 rounded">Estimated</span>
                )}
              </dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="font-medium">Weight:</dt>
            <dd>{answers.weight ?? 'N/A'} kg</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">Height:</dt>
            <dd>{answers.height ?? 'N/A'} cm</dd>
          </div>
          {idealWeightLow !== null && idealWeightLow !== undefined && idealWeightHigh !== null && idealWeightHigh !== undefined && (
            <div className="flex justify-between">
              <dt className="font-medium">Ideal Weight Range:</dt>
              <dd>{idealWeightLow.toFixed(1)} - {idealWeightHigh.toFixed(1)} kg</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="font-medium">BMR:</dt>
            <dd>{bmr ? Math.round(bmr) : 'N/A'} calories/day</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">TDEE:</dt>
            <dd>{tdee ? Math.round(tdee) : 'N/A'} calories/day</dd>
          </div>
        </dl>
        {footer && <p className="text-sm text-gray-300">{footer}</p>}
      </CardContent>
    </Card>
  )
}
