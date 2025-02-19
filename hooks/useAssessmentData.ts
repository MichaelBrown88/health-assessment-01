import { useMemo } from 'react';
import { Assessment } from '@/types/assessment';
import { getTimestampNumber } from '@/utils/date';

interface AssessmentData {
  firstAssessmentDate: string;
  nextAssessmentDate: string;
  latestAssessment: Assessment | null;
  chartData: Array<{
    date: Date;
    timestamp: number;
    answers: Record<string, string>;
  }>;
}

export function useAssessmentData(assessments?: Assessment[] | null) {
  if (!assessments || assessments.length === 0) {
    return {
      firstAssessmentDate: null,
      nextAssessmentDate: null,
      latestAssessment: null,
      chartData: []
    };
  }

  // Sort assessments by date
  const sortedAssessments = [...assessments].sort((a, b) => {
    return getTimestampNumber(b.createdAt) - getTimestampNumber(a.createdAt);
  });

  const latestAssessment = sortedAssessments[0];
  const firstAssessmentDate = sortedAssessments[sortedAssessments.length - 1].createdAt;
  
  // Calculate next assessment date (3 months from latest)
  const nextAssessmentDate = new Date(getTimestampNumber(latestAssessment.createdAt));
  nextAssessmentDate.setMonth(nextAssessmentDate.getMonth() + 3);

  // Prepare chart data
  const chartData = sortedAssessments.map(assessment => ({
    date: assessment.createdAt,
    score: assessment.metrics.overallScore
  })).reverse();

  return {
    firstAssessmentDate,
    nextAssessmentDate,
    latestAssessment,
    chartData
  };
} 