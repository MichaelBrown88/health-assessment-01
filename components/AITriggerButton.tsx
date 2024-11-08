'use client';

import { useState } from 'react';
import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIHealthCoach } from '@/components/AIHealthCoach';
import { cn } from '@/lib/utils';

interface AITriggerButtonProps {
  assessmentData: {
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
  };
  variant?: 'icon' | 'full';
  size?: 'small' | 'default';
}

export function AITriggerButton({ assessmentData, variant = 'full', size = 'default' }: AITriggerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === 'icon') {
    const buttonClasses = cn(
      "deep-space-gradient hover:scale-105 transition-all duration-300",
      "shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]",
      "rounded-full flex items-center gap-2 group",
      size === 'small' ? "px-2.5 py-1.5" : "px-3 py-2"
    );

    return (
      <div className="relative inline-block">
        <Button
          variant="ghost"
          onClick={() => setIsOpen(true)}
          className={buttonClasses}
        >
          <Bot className={size === 'small' ? "w-3.5 h-3.5" : "w-4 h-4"} />
          <span className={cn("font-medium text-white", size === 'small' ? "text-xs" : "text-sm")}>
            Ask AI Coach
          </span>
        </Button>
        {isOpen && <AIHealthCoach assessmentData={assessmentData} onClose={() => setIsOpen(false)} />}
      </div>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="deep-space-gradient hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] px-4 py-2 rounded-full flex items-center gap-3"
      >
        <Bot className="w-5 h-5 text-blue-200" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-white">Ask AI Health Coach</span>
          <span className="text-xs text-blue-200/90">Get personalized insights</span>
        </div>
      </Button>
      {isOpen && <AIHealthCoach assessmentData={assessmentData} onClose={() => setIsOpen(false)} />}
    </>
  );
}
