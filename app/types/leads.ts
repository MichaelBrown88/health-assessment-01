export interface Lead {
  id?: string;
  name: string;
  email: string;
  answers: Record<string, string | number | boolean | string[]>;
  assessmentResults: {
    score: number;
    healthCalculations: Record<string, string | number | null>;
    summary: Record<string, string>;
  };
  timestamp?: number;
  status?: 'new' | 'contacted' | 'converted' | 'closed';
}
