'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getHealthGoalAdvice } from '@/utils/healthUtils'

interface GoalsSectionProps {
  goals: string[];
}

export function GoalsSection({ goals }: GoalsSectionProps) {
  if (!goals || goals.length === 0) {
    return (
      <section className="bg-black/30 rounded-lg p-8 deep-space-border">
        <h3 className="text-2xl font-semibold mb-6">Health Goals</h3>
        <p>No health goals specified.</p>
      </section>
    )
  }

  return (
    <section className="bg-black/30 rounded-lg p-8 deep-space-border">
      <h3 className="text-2xl font-semibold mb-6">Health Goals</h3>
      <Tabs defaultValue={goals[0]} className="bg-black/20 p-4 rounded-lg">
        <TabsList className="mb-4 flex space-x-2 bg-transparent p-1 rounded-full">
          {goals.map((goal, index) => (
            <TabsTrigger 
              key={index} 
              value={goal}
              className="px-4 py-2 rounded-full transition-all duration-300 ease-in-out
                         data-[state=active]:deep-space-gradient data-[state=active]:text-white
                         data-[state=inactive]:bg-gray-700/50 data-[state=inactive]:text-gray-300"
            >
              {goal.replace('-', ' ')}
            </TabsTrigger>
          ))}
        </TabsList>
        {goals.map((goal, index) => (
          <TabsContent key={index} value={goal} className="mt-4 p-4 bg-black/10 rounded-lg">
            <p>{getHealthGoalAdvice([goal])[0]}</p>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
} 