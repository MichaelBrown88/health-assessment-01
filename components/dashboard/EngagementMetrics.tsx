'use client'

import { Card } from "@/components/ui/card"
import { Trophy, Award } from "lucide-react"
import { calculateStreak, calculateCompletionRate } from "@/lib/metrics"
import type { Assessment } from "@/types/assessment"

interface EngagementMetricsProps {
  assessments: Assessment[];
}

export function EngagementMetrics({ assessments }: EngagementMetricsProps) {
  const streak = calculateStreak(assessments);
  const completionRate = calculateCompletionRate(assessments);
  
  return (
    <Card className="p-6 bg-black/50 backdrop-blur-sm border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Engagement</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-black/30 rounded-lg">
          <Trophy className="h-8 w-8 mb-2 mx-auto text-yellow-400" />
          <p className="text-2xl font-bold text-white">{streak}</p>
          <p className="text-sm text-gray-400">Day Streak</p>
        </div>
        <div className="text-center p-4 bg-black/30 rounded-lg">
          <Award className="h-8 w-8 mb-2 mx-auto text-purple-400" />
          <p className="text-2xl font-bold text-white">{completionRate}%</p>
          <p className="text-sm text-gray-400">Completion Rate</p>
        </div>
      </div>
    </Card>
  )
}
