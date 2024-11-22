export interface SectionFeedback {
  message: string;
  recommendations: string[];
}

export interface StructuredSummary {
  [key: string]: SectionFeedback;
} 