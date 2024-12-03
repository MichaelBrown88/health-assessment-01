'use client'

import { AITriggerButton } from "@/components/ai/AITriggerButton"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { generateStructuredSummary } from '@/utils/summaryUtils'
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react"

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
    healthCalculations,
    answers
  })

  // Determine strengths and areas for improvement
  const strengths = []
  const improvements = []

  if (healthCalculations.exerciseScore >= 70) strengths.push("Regular physical activity habits")
  else improvements.push("Exercise routine optimization")

  if (healthCalculations.nutritionScore >= 70) strengths.push("Balanced nutrition approach")
  else improvements.push("Dietary habits and meal planning")

  if (healthCalculations.sleepScore >= 70) strengths.push("Effective rest and recovery patterns")
  else improvements.push("Sleep and recovery optimization")

  if (healthCalculations.mentalHealthScore >= 70) strengths.push("Strong mental wellbeing practices")
  else improvements.push("Mental wellness and stress management")

  if (healthCalculations.bmi >= 18.5 && healthCalculations.bmi <= 24.9) {
    strengths.push("Balanced body composition")
  } else {
    improvements.push("Body composition goals")
  }

  // Generate personalized next steps
  const nextSteps = improvements.slice(0, 3).map(area => {
    switch(area) {
      case "Exercise routine optimization":
        return "Review your exercise metrics in the Exercise section and implement a structured workout routine that aligns with your goals"
      case "Dietary habits and meal planning":
        return "Check your recommended nutritional targets in the Daily Intake section and focus on developing consistent, balanced eating habits"
      case "Sleep and recovery optimization":
        return "Review your sleep patterns in the Rest & Recovery section and establish a regular sleep schedule that prioritizes quality rest"
      case "Mental wellness and stress management":
        return "Explore the Mental Health section and incorporate regular stress-reduction practices into your daily routine"
      case "Body composition goals":
        return "Reference your body composition metrics and focus on sustainable lifestyle changes that support your health goals"
      default:
        return area
    }
  })

  // Add professional guidance as the final step if not already at max steps
  if (nextSteps.length < 3) {
    nextSteps.push("Track your progress regularly and make adjustments to your routine based on the feedback in each section")
  }

  return (
    <section className="bg-black/30 rounded-lg p-8 deep-space-border max-w-4xl mx-auto">
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
        <div className="space-y-8">
          {/* Overall Summary */}
          <div className="bg-black/20 rounded-lg p-6">
            <p className="text-lg leading-relaxed">
              Based on your assessment responses, we've analyzed your health across multiple dimensions. 
              {score >= 80 ? " Your results indicate strong health practices across several key areas." :
               score >= 60 ? " Your results show good foundations with opportunities for enhancement in specific areas." :
               " Your results highlight several areas where focused attention could significantly improve your overall health."}
            </p>
          </div>

          {/* Strengths & Areas for Improvement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="bg-emerald-950/30 border-emerald-600/30 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <h4 className="text-lg font-semibold text-emerald-300">Areas of Strength</h4>
              </div>
              <ul className="space-y-2">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-center gap-2 text-emerald-100">
                    <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                    {strength}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Areas for Improvement */}
            <Card className="bg-amber-950/30 border-amber-600/30 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <h4 className="text-lg font-semibold text-amber-300">Focus Areas</h4>
              </div>
              <ul className="space-y-2">
                {improvements.map((improvement, index) => (
                  <li key={index} className="flex items-center gap-2 text-amber-100">
                    <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                    {improvement}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-950/30 border border-blue-600/30 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-300 mb-4">Recommended Next Steps</h4>
            <ol className="list-decimal list-inside space-y-3 text-blue-100">
              {nextSteps.map((step, index) => (
                <li key={index} className="leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-blue-200 italic">
              For optimal results, consider working with qualified health professionals who can provide personalized guidance based on your specific needs. Use the detailed feedback in each section above to make informed improvements to your overall health.
            </p>
          </div>
        </div>
      )}
    </section>
  )
} 