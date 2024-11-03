'use client'

import { Card } from "@/components/ui/card"
import { Activity, Brain, Heart, Utensils } from "lucide-react"
import type { Assessment } from "@/types/assessment"

interface PillarOverviewProps {
  assessment: Assessment | null;
}

const pillars = [
  { name: "Exercise", key: 'exercise', icon: Activity, color: "text-green-400" },
  { name: "Nutrition", key: 'nutrition', icon: Utensils, color: "text-blue-400" },
  { name: "Wellbeing", key: 'wellbeing', icon: Heart, color: "text-purple-400" },
  { name: "Overall", key: 'overall', icon: Brain, color: "text-yellow-400" }
];

export function PillarOverview({ assessment }: PillarOverviewProps) {
  if (!assessment) return null;

  return (
    <Card className="bg-black/30 backdrop-blur-sm border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Health Pillars</h2>
      <div className="grid grid-cols-2 gap-4">
        {pillars.map(({ name, key, icon: Icon, color }) => (
          <div key={name} className="p-4 bg-black/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon className={`h-5 w-5 ${color}`} />
              <h3 className="text-sm text-gray-400">{name}</h3>
            </div>
            <p className="text-2xl font-bold text-white">
              {assessment.metrics[`${key}Score`]}%
            </p>
            <div className="h-1 bg-gray-700 rounded-full mt-2">
              <div 
                className="h-full deep-space-gradient"
                style={{
                  width: `${assessment.metrics[`${key}Score`]}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
