'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { AIHealthCoach } from '@/components/ai/AIHealthCoach';
import type { AssessmentData } from '@/types/assessment';

interface AICoachContextType {
  isOpen: boolean;
  assessmentData: AssessmentData | null;
  openAICoach: (data: AssessmentData) => void;
  closeAICoach: () => void;
}

const AICoachContext = createContext<AICoachContextType | undefined>(undefined);

export function AICoachProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  const openAICoach = (data: AssessmentData) => {
    setAssessmentData(data);
    setIsOpen(true);
  };

  const closeAICoach = () => {
    setIsOpen(false);
    setAssessmentData(null);
  };

  return (
    <AICoachContext.Provider value={{ isOpen, assessmentData, openAICoach, closeAICoach }}>
      {children}
      {isOpen && assessmentData && (
        <AIHealthCoach
          assessmentData={assessmentData}
          onClose={closeAICoach}
        />
      )}
    </AICoachContext.Provider>
  );
}

export const useAICoach = () => {
  const context = useContext(AICoachContext);
  if (context === undefined) {
    throw new Error('useAICoach must be used within an AICoachProvider');
  }
  return context;
}; 