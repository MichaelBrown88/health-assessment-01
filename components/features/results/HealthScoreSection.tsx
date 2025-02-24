'use client'

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/core/tooltip"

interface HealthScoreSectionProps {
  score: number
}

export function HealthScoreSection({ score }: HealthScoreSectionProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <section className="bg-gray-800/50 rounded-lg p-8 border border-gray-700/50 text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <h2 className="text-3xl font-semibold mb-8">Overall Health Score</h2>
              <div className="flex items-center justify-center mb-10">
                <div className="text-7xl font-bold text-white">{score}</div>
                <div className="text-4xl font-semibold text-gray-400 ml-3">/100</div>
              </div>
              <div className="relative">
                {/* Background glow */}
                <div 
                  className="absolute inset-0 rounded-full blur-[12px] opacity-30 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  style={{ 
                    width: `${score}%`,
                    left: '-8px',
                    right: '-8px',
                    top: '-2px',
                    bottom: '-2px'
                  }}
                />
                {/* Main progress bar container */}
                <div className="h-2 bg-gray-900/70 rounded-full overflow-hidden relative">
                  {/* Progress bar */}
                  <div 
                    className={cn(
                      "h-full deep-space-gradient relative",
                      "transition-all duration-300 ease-out transform-gpu hover:scale-[1.02]",
                      "shadow-[0_0_6px_rgba(255,255,255,0.15)]"
                    )}
                    style={{ width: `${score}%` }}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-transparent" />
                  </div>
                </div>
              </div>
              <p className="text-xl mt-8 text-gray-300">
                {score >= 80 ? "Excellent! You're on track for optimal health." :
                 score >= 60 ? "Good job! There's room for improvement in some areas." :
                 "There are several areas where you can improve your health. Let's work on that!"}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent 
            side="left" 
            align="center"
            className="max-w-[280px] z-50 bg-gray-800/90 border-gray-700"
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