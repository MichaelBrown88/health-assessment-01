import type { AssessmentResult } from '@/types';

export function transformAssessmentForChart(assessment: AssessmentResult) {
  return {
    timestamp: assessment.timestamp,
    date: new Date(assessment.timestamp),
    score: assessment.metrics.overallScore,
    bmi: assessment.metrics.bmi || calculateBMI(assessment.metrics.weight, assessment.metrics.height),
    bodyFat: assessment.metrics.bodyFat,
    weight: assessment.metrics.weight,
    height: assessment.metrics.height,
    metrics: assessment.metrics,
    answers: assessment.answers
  };
}

function calculateBMI(weight: number, height: number): number {
  // Convert height from cm to meters and calculate BMI
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}
