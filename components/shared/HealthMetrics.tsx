import { Card } from "@/components/core/card"
import { TooltipProvider } from "@/components/core/tooltip"
import { AICoachButton } from "@/components/ai/AICoachButton"
import type { HealthCalculations } from "@/types/results"

interface HealthMetricsProps {
  title: string | React.ReactNode
  children: React.ReactNode
  healthCalculations: HealthCalculations
  answers: Record<string, any>
  score?: number
  variant?: 'dashboard' | 'results'
  className?: string
}

export function HealthMetrics({
  title,
  children,
  healthCalculations,
  answers,
  score,
  variant = 'results',
  className
}: HealthMetricsProps) {
  const assessmentData = {
    answers,
    healthCalculations,
    score: score ?? 0
  }

  return (
    <TooltipProvider>
      <Card className={`bg-black/30 backdrop-blur-sm border-gray-800 h-full flex flex-col ${className}`}>
        <div className="p-6 flex flex-col flex-1">
          <div className="flex justify-between gap-4 mb-4">
            <h3 className="text-xl font-semibold leading-tight">
              {title}
            </h3>
            <div className="flex-shrink-0 mt-1">
              <AICoachButton assessmentData={assessmentData} />
            </div>
          </div>
          <div className="flex-1">
            {children}
          </div>
        </div>
      </Card>
    </TooltipProvider>
  )
} 