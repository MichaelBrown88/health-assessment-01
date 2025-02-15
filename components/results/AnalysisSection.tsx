'use client'

interface AnalysisSectionProps {
  answers: Record<string, any>;
  assessmentResults: {
    score: number;
    healthCalculations: Record<string, string | number | null>;
    summary: {
      exercise: string;
      nutrition: string;
      wellbeing: string;
    };
  };
}

export function AnalysisSection({ answers, assessmentResults }: AnalysisSectionProps) {
  return (
    <div className="space-y-8 relative z-50">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg bg-black/80 backdrop-blur">
          <h2 className="text-2xl font-semibold mb-4 text-white">Exercise</h2>
          <p className="text-lg text-white/80">{assessmentResults.summary.exercise}</p>
        </div>

        <div className="p-6 rounded-lg bg-black/80 backdrop-blur">
          <h2 className="text-2xl font-semibold mb-4 text-white">Nutrition</h2>
          <p className="text-lg text-white/80">{assessmentResults.summary.nutrition}</p>
        </div>

        <div className="p-6 rounded-lg bg-black/80 backdrop-blur">
          <h2 className="text-2xl font-semibold mb-4 text-white">Wellbeing</h2>
          <p className="text-lg text-white/80">{assessmentResults.summary.wellbeing}</p>
        </div>
      </div>
    </div>
  )
} 