'use client'

import { Card } from "@/components/core/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/core/tabs"
import { AICoachButton } from '@/components/ai/AICoachButton'
import { getHealthGoalAdvice } from '@/utils/healthUtils'
import type { HealthCalculations } from "@/types/results"

interface HealthGoalsSectionProps {
  answers: Record<string, any>;
  healthCalculations: HealthCalculations;
  score?: number;
}

export function HealthGoalsSection({ answers, healthCalculations, score }: HealthGoalsSectionProps) {
  const goals = answers.goals as string[];

  return (
    <Card>
      <div className="p-6">
        <div className="flex justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold leading-tight">Health Goals</h3>
          <div className="flex-shrink-0 mt-1">
            <AICoachButton assessmentData={{ answers, healthCalculations, score }} />
          </div>
        </div>
        {goals && goals.length > 0 ? (
          <Tabs defaultValue={goals[0]} className="w-full">
            <TabsList className="w-full bg-black/20 p-1 rounded-lg">
              {goals.map((goal) => (
                <TabsTrigger
                  key={goal}
                  value={goal}
                  className="flex-1 data-[state=active]:bg-black/40 data-[state=active]:text-white transition-all duration-200 ease-in-out"
                >
                  {goal.replace('-', ' ')}
                </TabsTrigger>
              ))}
            </TabsList>
            {goals.map((goal) => (
              <TabsContent key={goal} value={goal} className="mt-4 p-4 bg-black/20 rounded-lg">
                <p>{getHealthGoalAdvice([goal])[0]}</p>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <p>No health goals specified.</p>
        )}
      </div>
    </Card>
  );
} 