import { cn } from "@/lib/utils"
import type { HealthPillarScores } from "@/types/scoring"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/core/tooltip"
import { AICoachButton } from '@/components/ai/AICoachButton'
import { Bot } from 'lucide-react'

interface HealthPillarsProps {
  pillarScores: HealthPillarScores;
  answers: Record<string, unknown>;
  healthCalculations: any;
  score: number;
}

export function HealthPillars({ pillarScores, answers, healthCalculations, score }: HealthPillarsProps) {
  const getTooltipContent = (key: string, score: number) => {
    switch(key) {
      case 'bodyComposition':
        return "Your score combines your BMI and body fat %. We look at both because BMI alone doesn't tell the whole story.";
      case 'exercise':
        return "This score reflects how active you are daily, how hard you work out, and how long you exercise for.";
      case 'nutrition':
        return "Based on your eating habits: what you eat, how often you eat, and when you eat your meals.";
      case 'recovery':
        return "Shows how well you're recharging: quality of sleep, hours of sleep, and how you manage daily stress.";
      case 'mentalHealth':
        return "Measures your overall wellbeing: stress levels, mental health, social life, and work-life balance.";
      default:
        return "A combined score from several health factors.";
    }
  };

  return (
    <section className="bg-gray-800/50 rounded-lg p-8 border border-gray-700/50">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold">Health Pillars</h2>
        <AICoachButton 
          assessmentData={{
            answers,
            healthCalculations,
            score
          }}
        />
      </div>
      <div className="flex justify-around items-end h-[400px] mb-12 gap-6">
        {Object.entries(pillarScores).map(([key, pillar]) => {
          // Convert from 30-point scale to percentage (30 points = 100%)
          const score = Math.round(pillar.score * 3.33);
          const heightPercentage = Math.min(100, score);
          return (
            <TooltipProvider key={key}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-col items-center group h-full justify-end">
                    <div className="relative w-24 h-[90%]">
                      {/* Background track for 100% */}
                      <div className="absolute inset-0 bottom-0 w-full rounded-xl bg-gray-900/40" />
                      
                      {/* Subtle Glow effect */}
                      <div 
                        className="absolute inset-0 -inset-x-1 rounded-xl blur-[10px] opacity-25 bg-white/10
                                 group-hover:opacity-30 transition-all duration-300"
                        style={{ 
                          height: `${heightPercentage}%`,
                          bottom: '2px'
                        }}
                      />
                      {/* Pillar */}
                      <div 
                        className="absolute bottom-0 w-full rounded-xl deep-space-gradient
                                 transition-all duration-300 ease-out transform-gpu group-hover:scale-[1.02]
                                 shadow-[0_0_6px_rgba(255,255,255,0.1)]"
                        style={{ 
                          height: `${heightPercentage}%`,
                          minHeight: '30px'
                        }}
                      >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 rounded-xl" />
                        {/* Inner shadow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 rounded-xl" />
                      </div>
                      {/* Base */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-2 bg-gradient-to-t from-gray-900 to-gray-800 rounded-b-xl
                                    shadow-[0_2px_6px_rgba(0,0,0,0.2)]
                                    transition-all duration-300" />
                    </div>
                    {/* Label */}
                    <div className="mt-8 text-center">
                      <p className="text-2xl font-bold text-white mb-2">{score}%</p>
                      <p className="text-sm font-medium text-gray-300">{pillar.label}</p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" className="bg-gray-800/90 border-gray-700 shadow-xl">
                  <p className="text-sm max-w-[200px]">{getTooltipContent(key, score)}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </section>
  );
} 