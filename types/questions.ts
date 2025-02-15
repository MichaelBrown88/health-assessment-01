export interface Question {
  id: string;
  type: 'radio' | 'checkbox' | 'slider';
  question: string;
  options?: Array<{ value: string; label: string }>;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  subText?: string;
  condition?: (answers: Record<string, any>) => boolean;
} 