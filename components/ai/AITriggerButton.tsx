'use client';

import { Bot } from 'lucide-react';
import { useAICoach } from '@/contexts/AICoachContext';
import { cn } from '@/lib/utils';
import type { AssessmentData } from '@/types/assessment';

interface AITriggerButtonProps {
  assessmentData: AssessmentData;
  variant?: 'icon' | 'full';
  size?: 'small' | 'default';
}

export function AITriggerButton({ assessmentData, variant = 'full', size = 'default' }: AITriggerButtonProps) {
  const { openAICoach } = useAICoach();

  const baseButtonClasses = cn(
    "deep-space-gradient hover:scale-105 transition-all duration-300",
    "rounded-full flex items-center border-0 outline-none ring-0 focus:ring-0 focus:outline-none"
  );

  const buttonConfig = {
    icon: {
      container: cn(
        baseButtonClasses,
        "gap-2 group",
        "shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:shadow-[0_0_20px_rgba(56,189,248,0.5)]",
        size === 'small' ? "px-2.5 py-1.5" : "px-3 py-2"
      ),
      icon: size === 'small' ? "w-3.5 h-3.5" : "w-4 h-4",
      text: cn("font-medium text-white", size === 'small' ? "text-xs" : "text-sm")
    },
    full: {
      container: cn(
        baseButtonClasses,
        "gap-3 px-4 py-2",
        "shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]"
      ),
      icon: "w-5 h-5 text-blue-200",
      text: "text-sm font-medium text-white"
    }
  } as const;

  return (
    <button
      onClick={() => openAICoach(assessmentData)}
      className={buttonConfig[variant].container}
    >
      <Bot className={buttonConfig[variant].icon} />
      {variant === 'icon' ? (
        <span className={buttonConfig[variant].text}>Ask AI Coach</span>
      ) : (
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-white">Ask AI Health Coach</span>
          <span className="text-xs text-blue-200/90">Get personalized insights</span>
        </div>
      )}
    </button>
  );
}
