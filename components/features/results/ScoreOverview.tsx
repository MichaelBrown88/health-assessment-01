'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/core/button"
import { AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/core/alert"

interface ScoreOverviewProps {
  score: number;
  onRetake: () => void;
  isGoalMisaligned: boolean;
}

export function ScoreOverview({ score, onRetake, isGoalMisaligned }: ScoreOverviewProps) {
  return (
    <section className="bg-black/30 rounded-lg p-8 deep-space-border mb-8">
      <div className="flex items-baseline justify-center gap-4 mb-4">
        <div className="text-6xl font-bold">{score}</div>
        <div className="text-3xl font-semibold">/100</div>
      </div>
      
      <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden mb-6">
        <div 
          className={cn("h-full deep-space-gradient transition-all duration-300 ease-out", 
            score === 0 && "w-0"
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      
      <p className="text-xl mb-4">
        {score >= 80 ? "Excellent! You're on track for optimal health." :
         score >= 60 ? "Good job! There's room for improvement in some areas." :
         "There are several areas where you can improve your health. Let's work on that!"}
      </p>

      {isGoalMisaligned && (
        <Alert variant="destructive" className="mb-6 deep-space-border">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning: Misaligned Goals</AlertTitle>
          <AlertDescription>
            Your current health status and selected goals may not be well-aligned. 
            We recommend reassessing your goals or consulting with a healthcare professional.
          </AlertDescription>
          <Button onClick={onRetake} className="mt-2">Retake Assessment</Button>
        </Alert>
      )}
    </section>
  )
} 