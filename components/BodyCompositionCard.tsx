import React from 'react'
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"
import { AITriggerButton } from "@/components/AITriggerButton"

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
    recommendedCalories: number | null;
    proteinGrams: number | null;
    carbGrams: number | null;
    fatGrams: number | null;
  };
  answers: Record<string, unknown>;
  score: number;
  footer?: string;
}

export function BodyCompositionCard({ healthCalculations, answers, score, footer }: BodyCompositionCardProps) {
  return (
    <Card className="bg-black/30 backdrop-blur-sm border-gray-800">
      <div className="p-6">
        <div className="flex justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold leading-tight">
            Body Composition
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
        {footer && <p className="text-sm text-gray-400 mt-4">{footer}</p>}
      </div>
    </Card>
  );
}
