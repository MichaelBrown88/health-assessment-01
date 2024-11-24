export interface ContextualAnalysis {
  warning: boolean;
  severity: 'warning' | 'alert' | 'info';
  title: string;
  feedback: string;
  recommendations: string[];
  type?: string;
  analysis?: string;
  recommendation?: string;
}

export interface SectionFeedback {
  score: number;
  color: string;
  feedback: string;
  recommendations: string;
}
