import { cn } from "@/lib/utils"
import type { HealthPillarScores } from "@/types/scoring"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HealthPillarsProps {
  pillarScores: HealthPillarScores;
}

export function HealthPillars({ pillarScores }: HealthPillarsProps) {
  const getPercentage = (score: number) => Math.round((score / 20) * 100);
  
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
    <TooltipProvider delayDuration={0}>
      <section className="bg-black/30 rounded-lg p-8 deep-space-border">
        <h3 className="text-2xl font-semibold mb-6">Health Pillars</h3>
        <div className="space-y-4">
          {Object.entries(pillarScores).map(([key, pillar]) => {
            const percentage = getPercentage(pillar.score);
            const status = percentage >= 80 ? "Excellent" :
                          percentage >= 60 ? "Good" :
                          percentage >= 40 ? "Fair" : "Needs Focus";
            
            return (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <div className="space-y-2 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-medium">{pillar.label}</h4>
                      <div className="text-right flex items-center gap-2">
                        <span className={cn(
                          "text-sm px-2 py-0.5 rounded",
                          percentage >= 80 ? "bg-emerald-500/20 text-emerald-300" :
                          percentage >= 60 ? "bg-blue-500/20 text-blue-300" :
                          percentage >= 40 ? "bg-yellow-500/20 text-yellow-300" :
                          "bg-red-500/20 text-red-300"
                        )}>
                          {status}
                        </span>
                        <span className="text-xl font-bold">{percentage}%</span>
                      </div>
                    </div>
                    
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full deep-space-gradient transition-all duration-300 ease-out rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="left" 
                  align="center"
                  className="max-w-[280px] z-50"
                  sideOffset={5}
                >
                  <p className="text-sm">{getTooltipContent(key, pillar.score)}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </section>
    </TooltipProvider>
  );
} 