'use client'

import { Card } from "@/components/core/card"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

interface HealthScoreDisplayProps {
  currentScore: number;
  previousScore?: number;
}

export function HealthScoreDisplay({ currentScore, previousScore }: HealthScoreDisplayProps) {
  const scoreDiff = previousScore ? currentScore - previousScore : 0;
  const showChange = previousScore !== undefined;

  return (
    <Card className="bg-black/30 backdrop-blur-sm border-gray-800">
      <div className="p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">Overall Health Score</h2>
        <div className="flex items-center justify-center gap-4">
          <div className="text-5xl font-bold text-white">
            {currentScore.toFixed(1)}
          </div>
          {showChange && (
            <div className={`flex items-center ${scoreDiff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {scoreDiff >= 0 ? <ArrowUpIcon className="w-6 h-6" /> : <ArrowDownIcon className="w-6 h-6" />}
              <span className="text-2xl font-bold">{Math.abs(scoreDiff).toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden mt-4">
          <div 
            className="h-full deep-space-gradient"
            style={{ width: `${currentScore}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
