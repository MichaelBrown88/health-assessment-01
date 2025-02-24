import type { AnswerType, HealthCalculations } from './results'

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  description?: string;
  placeholder?: string;
  options?: Array<{
    value: string;
    label: string;
  }>;
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  condition?: (answers: AnswerType) => boolean;
}

export type QuestionType = 
  | 'text'
  | 'number'
  | 'boolean'
  | 'single'
  | 'multiple'
  | 'scale';

export interface AssessmentData {
  id: string;
  userId: string;
  answers: AnswerType;
  timestamp: number;
  score: number;
  healthCalculations: HealthCalculations;
  summary: {
    exercise: string;
    nutrition: string;
    mentalHealth: string;
  };
}

export interface AssessmentFormProps {
  questions: Question[];
  onComplete: (answers: AnswerType) => void;
  initialAnswers?: AnswerType;
  showProgress?: boolean;
  className?: string;
}

export interface QuestionRendererProps {
  question: Question;
  onAnswer: (answer: string | number | boolean | string[]) => void;
  currentAnswer?: string | number | boolean | string[];
  isLastQuestion?: boolean;
} 