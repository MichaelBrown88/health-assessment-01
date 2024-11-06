export interface ContextualAnalysis {
  warning: boolean;
  severity: string;
  title: string;
  feedback: string;
  recommendations: string[];
  type?: string;
  analysis?: string;
  recommendation?: string;
}
