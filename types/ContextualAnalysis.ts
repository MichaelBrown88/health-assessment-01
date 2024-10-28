export interface ContextualAnalysis {
  warning: boolean;
  severity: 'info' | 'warning' | 'alert';
  title: string;
  feedback: string;
  recommendations: string[];
}

