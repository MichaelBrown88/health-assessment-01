import React from 'react'
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

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
      <div className="p-6">
        <h3 className="text-lg font-semibold leading-none tracking-tight">Body Composition</h3>
      </div>
      <div className="p-6 pt-0">
        <dl className="space-y-2">
          {[
            { label: "BMI", value: `${bmi?.toFixed(1) ?? 'N/A'} (${bmiCategory ?? 'N/A'})`, tooltip: "Body Mass Index (BMI) is a measure of body fat based on height and weight." },
            { label: "Body Fat", value: bodyFat !== null ? `${bodyFat.toFixed(1)}%${isBodyFatEstimated ? ' (Estimated)' : ''}` : 'N/A', tooltip: "The percentage of your total body mass that is fat." },
            { label: "Weight", value: `${answers.weight ?? 'N/A'} kg`, tooltip: "Your current weight in kilograms." },
            { label: "Height", value: `${answers.height ?? 'N/A'} cm`, tooltip: "Your height in centimeters." },
            { label: "Ideal Weight Range", value: idealWeightLow !== null && idealWeightHigh !== null ? `${idealWeightLow.toFixed(1)} - ${idealWeightHigh.toFixed(1)} kg` : 'N/A', tooltip: "The healthy weight range based on your height and body composition." },
            { label: "BMR", value: bmr ? `${Math.round(bmr)} calories/day` : 'N/A', tooltip: "Basal Metabolic Rate (BMR) is the number of calories your body burns at rest." },
            { label: "TDEE", value: tdee ? `${Math.round(tdee)} calories/day` : 'N/A', tooltip: "Total Daily Energy Expenditure (TDEE) is the total number of calories you burn in a day." },
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
  )
}
