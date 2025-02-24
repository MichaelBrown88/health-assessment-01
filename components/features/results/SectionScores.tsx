'use client'

import { cn } from "@/lib/utils"

interface SectionScoresProps {
  answers: Record<string, any>
  healthCalculations: Record<string, any>
}

export function SectionScores({ answers, healthCalculations }: SectionScoresProps) {
  const sections = [
    { 
      title: "Exercise",
      score: healthCalculations.exerciseScore || 0,
      description: "Based on your activity level and exercise habits"
    },
    { 
      title: "Nutrition",
      score: healthCalculations.nutritionScore || 0,
      description: "Based on your diet and eating patterns"
    },
    { 
      title: "Wellbeing",
      score: healthCalculations.wellbeingScore || 0,
      description: "Based on stress, mental health, and social factors"
    },
    { 
      title: "Sleep",
      score: healthCalculations.sleepScore || 0,
      description: "Based on sleep duration, quality, and recovery"
    }
  ]

  return (
    <section className="bg-black/30 rounded-lg p-8 deep-space-border">
      <h3 className="text-2xl font-semibold mb-6">Section Scores</h3>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-lg font-medium">{section.title}</span>
                <p className="text-sm text-gray-400">{section.description}</p>
              </div>
              <span className="font-semibold">{section.score}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-300 ease-out rounded-full",
                  section.score >= 80 ? "bg-green-500" :
                  section.score >= 60 ? "bg-yellow-500" :
                  "bg-red-500"
                )}
                style={{ width: `${section.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
} 