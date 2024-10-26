import { useState, useEffect, useRef } from 'react';

// Define an interface for the summary
interface FeedbackItem {
  color: string;
  item: string;
  score: number;
  feedback: string;
  recommendations: string;
}

interface SummarySection {
  title: string;
  score: number;
  feedbackItems: FeedbackItem[];
}

export function useAISummary(summary: SummarySection[]) {
  const [aiSummary, setAISummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prevSummaryRef = useRef<string | null>(null);

  useEffect(() => {
    const summaryString = JSON.stringify(summary);
    if (summaryString === prevSummaryRef.current) return;

    const generateSummary = async () => {
      if (!summary || summary.length === 0) return;

      setIsLoading(true);
      setError(null);

      try {
        console.log('Sending summary:', JSON.stringify(summary, null, 2)); // Add this line

        const response = await fetch('/api/generate-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ summary }),
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('Error response:', text);
          throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
        }

        const data = await response.json();
        setAISummary(data.summary);
      } catch (err) {
        console.error('Error generating summary:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while generating the AI summary');
      } finally {
        setIsLoading(false);
      }
    };

    generateSummary();
    prevSummaryRef.current = summaryString;
  }, [summary]);

  return { aiSummary, isLoading, error };
}
