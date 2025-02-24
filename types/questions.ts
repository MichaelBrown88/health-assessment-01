export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  type: 'text' | 'number' | 'boolean' | 'single' | 'multiple' | 'scale';
  text: string;
  description?: string;
  placeholder?: string;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  defaultValue?: number;
  optional?: boolean;
  condition?: (answers: Record<string, string | number | boolean | string[]>) => boolean;
} 