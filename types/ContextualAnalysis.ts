export interface ContextualAnalysis {
  severity: 'info' | 'warning';
  title: string;
  feedback: string;
  recommendations: string[];
  warning?: string;
}

export interface SectionFeedback {
  score: number;
  color: string;
  feedback: string;
  recommendations: string;
}
