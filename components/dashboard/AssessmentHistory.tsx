'use client'

import { Card } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { formatDate } from "@/lib/utils"
import type { Assessment } from "@/types/assessment"
import { getTimestampNumber } from '@/utils/date'

interface AssessmentHistoryProps {
  assessments: Assessment[];
}

export function AssessmentHistory({ assessments }: AssessmentHistoryProps) {
  const router = useRouter();

  const sortedAssessments = [...assessments].sort((a, b) => {
    const dateA = getTimestampNumber(a.createdAt);
    const dateB = getTimestampNumber(b.createdAt);
    return dateB - dateA;
  });

  return (
    <Card className="bg-black/30 backdrop-blur-sm border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Assessment History</h2>
      <div className="space-y-3">
        {sortedAssessments.map((assessment) => (
          <div 
            key={assessment.id}
            onClick={() => router.push(`/results?id=${assessment.id}`)}
            className="p-4 bg-black/20 rounded-lg cursor-pointer hover:bg-black/30 transition-colors"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">
                  Score: {assessment.metrics.overallScore.toFixed(1)}
                </p>
                <p className="text-sm text-gray-400">
                  {formatDate(getTimestampNumber(assessment.createdAt))}
                </p>
              </div>
              <div className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
                View Details →
              </div>
            </div>
          </div>
        ))}
        {assessments.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            No assessments yet
          </div>
        )}
      </div>
    </Card>
  );
} 