'use client'

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HealthScoreSectionProps {
  score: number
}

export function HealthScoreSection({ score }: HealthScoreSectionProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <section className="bg-black/30 rounded-lg p-8 deep-space-border text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <h2 className="text-3xl font-semibold mb-4">Overall Health Score</h2>
              <div className="flex items-center justify-center mb-6">
                <div className="text-6xl font-bold mr-2">{score}</div>
                <div className="text-3xl font-semibold">/100</div>
              </div>
              <div className="h-4 w-full bg-gray-700 rounded-full overflow-hidden mb-6">
                <div 
                  className={cn(
                    "h-full deep-space-gradient transition-all duration-300 ease-out",
                    score === 0 && "w-0"
                  )}
                  style={{ width: `${score}%` }}
                ></div>
              </div>
              <p className="text-xl mb-4">
                {score >= 80 ? "Excellent! You're on track for optimal health." :
                 score >= 60 ? "Good job! There's room for improvement in some areas." :
                 "There are several areas where you can improve your health. Let's work on that!"}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="left" 
            align="center"
            className="max-w-[280px] z-50"
            sideOffset={5}
          >
            <p className="text-sm">
              This is your complete health picture. We combine scores from all five health pillars: 
              body composition, exercise, nutrition, recovery, and mental health to show you how 
              you're doing overall.
            </p>
          </TooltipContent>
        </Tooltip>
      </section>
    </TooltipProvider>
  );
} 