import React from 'react';
import { Card } from '@/components/ui/card';
import { AITriggerButton } from '@/components/AITriggerButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HealthGoalsCardProps {
  goals: string[];
  answers: Record<string, unknown>;
  healthCalculations: {
    bmi: number | null;
    bmr: number | null;
    tdee: number | null;
    bodyFat: number | null;
    isBodyFatEstimated: boolean;
    recommendedCalories: number | null;
    proteinGrams: number | null;
    carbGrams: number | null;
    fatGrams: number | null;
  };
  score: number;
}

export function HealthGoalsCard({ goals, answers, healthCalculations, score }: HealthGoalsCardProps) {
  return (
    <Card className="bg-black/30 backdrop-blur-sm border-gray-800">
      <div className="p-6">
        <div className="flex justify-between gap-4 mb-4">
          <h3 className="text-xl font-semibold leading-tight">Health Goals</h3>
          <div className="flex-shrink-0 mt-1">
            <AITriggerButton 
              assessmentData={{
                answers,
                healthCalculations,
                score
              }}
              variant="icon"
              size="small"
            />
          </div>
        </div>
        {goals && goals.length > 0 ? (
          <Tabs defaultValue={goals[0]} className="w-full">
            <TabsList className="w-full bg-black/20 p-1 rounded-lg">
              {goals.map((goal) => (
                <TabsTrigger
                  key={goal}
                  value={goal}
                  className="flex-1 data-[state=active]:bg-blue-500/20 data-[state=active]:text-white transition-all duration-200 ease-in-out"
                >
                  {goal}
                </TabsTrigger>
              ))}
            </TabsList>
            {goals.map((goal) => (
              <TabsContent key={goal} value={goal} className="mt-4">
                {/* Your goal content here */}
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
