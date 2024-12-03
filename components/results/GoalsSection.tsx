'use client'

import { getHealthGoalAdvice } from '@/utils/health';

interface GoalsSectionProps {
  goals: string[];
}

export function GoalsSection({ goals }: GoalsSectionProps) {
  if (!goals || goals.length === 0) return null;

  const advice = getHealthGoalAdvice(goals);

  return (
    <section className="bg-black/30 rounded-lg p-8 deep-space-border">
      <h3 className="text-2xl font-semibold mb-6">Your Health Goals</h3>
      <div className="space-y-6">
        {goals.map((goal, index) => (
          <div key={goal} className="space-y-3">
            <h4 className="text-lg font-medium capitalize">
              {goal.replace(/-/g, ' ')}
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              {advice[index]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
} 