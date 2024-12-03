export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const EXAMPLE_QUESTIONS = [
  "Based on my results, how can I improve my exercise routine?",
  "What nutrition changes would help me reach my goals?",
  "How can I better manage my stress levels?"
] as const; 