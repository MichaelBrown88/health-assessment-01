import type { ContextualAnalysis } from '@/types/feedback';

interface ContextualAnalysesProps {
  analyses: ContextualAnalysis[];
}

export function ContextualAnalyses({ analyses }: ContextualAnalysesProps) {
  if (!analyses || analyses.length === 0) return null;

  return (
    <div className="mt-8 space-y-4">
      <h4 className="text-lg font-medium text-gray-300">Additional Insights</h4>
      <div className="space-y-4">
        {analyses.map((analysis, index) => (
          <div key={index} className="bg-black/20 p-4 rounded-lg backdrop-blur-sm">
            <h5 className="text-gray-300 font-medium mb-2">{analysis.title}</h5>
            <p className="text-gray-400 text-sm">{analysis.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 