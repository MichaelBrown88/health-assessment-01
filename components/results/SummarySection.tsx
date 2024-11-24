'use client'

import { AITriggerButton } from "@/components/ai/AITriggerButton"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { generateStructuredSummary } from '@/utils/summaryUtils'

interface SummarySectionProps {
  loading?: boolean
  healthCalculations: Record<string, any>
  score: number
  answers: Record<string, any>
}

export function SummarySection({ 
  loading, 
  healthCalculations, 
  score, 
  answers 
}: SummarySectionProps) {
  const summary = generateStructuredSummary({
    exercise: healthCalculations.exerciseScore || 0,
    nutrition: healthCalculations.nutritionScore || 0,
    sleep: healthCalculations.sleepScore || 0,
    mentalHealth: healthCalculations.mentalHealthScore || 0,
    healthCalculations
  })

  return (
    <section className="bg-black/30 rounded-lg p-8 deep-space-border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold">Health Analysis Summary</h3>
        <AITriggerButton 
          assessmentData={{
            answers,
            healthCalculations,
            score
          }}
          variant="icon"
          size="default"
        />
      </div>
      
      {loading ? (
        <Skeleton className="w-full h-40" />
      ) : (
        <div className="space-y-6">
          {Object.entries(summary).map(([section, feedback]) => (
            feedback && (
              <div key={section} className={cn(
                "bg-black/30 rounded-lg p-6",
                section === 'bodyComposition' && "border-t-4 border-blue-500"
              )}>
                <h3 className="text-xl font-semibold mb-4 capitalize">
                  {section === 'bodyComposition' ? 'Body Composition & Nutrition Plan' : section}
                </h3>
                <p className="mb-4">{feedback.message}</p>
                {feedback.recommendations?.length > 0 && (
                  <>
                    <h4 className="font-medium mb-2">Recommendations:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {feedback.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-gray-300">{rec}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )
          ))}
        </div>
      )}
    </section>
  )
} 