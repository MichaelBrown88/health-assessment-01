'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserAssessments } from '@/lib/db'
import type { Assessment, ChartData } from '@/types/assessment'
import { ProgressChart } from '@/components/ProgressChart'
import { StatCards } from '@/components/StatCards'
import { RecentAchievements } from '@/components/dashboard/RecentAchievements'
import { 
  Trophy, 
  Award, 
  ArrowUp as ArrowUpIcon, 
  ArrowDown as ArrowDownIcon, 
  Minus as MinusIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from 'lucide-react'
import { calculateStreak, calculateCompletionRate, compareMetrics } from '@/lib/metrics'
import { Card } from "@/components/ui/card"
import { PillarOverview } from '@/components/dashboard/PillarOverview'
import { AssessmentHistory } from '@/components/dashboard/AssessmentHistory'

// Helper function to convert timestamp to number
const getTimestampNumber = (timestamp: number | Date | { seconds: number; nanoseconds: number }): number => {
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }
  if (typeof timestamp === 'number') {
    return timestamp;
  }
  return timestamp.seconds * 1000;
};

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Add these calculations
  const firstAssessmentDate = assessments.length > 0 
    ? new Date(getTimestampNumber(assessments[0].timestamp)).toLocaleDateString()
    : 'No assessments yet';

  const nextAssessmentDate = assessments.length > 0 
    ? new Date(getTimestampNumber(assessments[assessments.length - 1].timestamp) + (7 * 24 * 60 * 60 * 1000)).toLocaleDateString()
    : 'N/A';

  // Add this to calculate latest assessment
  const latestAssessment = assessments.length > 0 
    ? assessments.reduce((latest, current) => {
        const currentDate = getTimestampNumber(current.timestamp);
        const latestDate = getTimestampNumber(latest.timestamp);
        return currentDate > latestDate ? current : latest;
      }, assessments[0])
    : null;

  useEffect(() => {
    async function fetchAssessments() {
      if (!user) return;
      
      try {
        const userAssessments = await getUserAssessments(user.uid);
        
        // Transform the assessments to include the required score property
        const transformedAssessments = userAssessments.map(assessment => ({
          ...assessment,
          metrics: {
            ...assessment.metrics,
            score: assessment.metrics.overallScore // Set score equal to overallScore
          }
        }));

        setAssessments(transformedAssessments);
        
      } catch (error) {
        console.error('Error fetching assessments:', error);
        setError('Failed to load assessments');
      }
    }

    fetchAssessments();
  }, [user]);

  // When passing data to ProgressChart, transform it to match ChartData
  const chartData: ChartData[] = assessments.map(assessment => ({
    ...assessment,
    date: new Date(getTimestampNumber(assessment.timestamp)),
    timestamp: getTimestampNumber(assessment.timestamp),
    answers: Object.fromEntries(
      Object.entries(assessment.answers).map(([key, value]) => [key, String(value)])
    )
  }));

  if (error) {
    return <div className="text-red-500 mt-4">{error}</div>;
  }

  return (
    <div className="min-h-screen relative">
      <SpaceTheme />
      <div className="relative z-10 w-full px-6 py-12 mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white mb-8 px-4">Your Health Dashboard</h1>
            
            {/* Assessment Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
              <Card className="bg-black/30 backdrop-blur-sm border-gray-800 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">First Assessment</h3>
                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-lg font-semibold text-white">{firstAssessmentDate}</p>
              </Card>
              
              <Card className="bg-black/30 backdrop-blur-sm border-gray-800 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Next Assessment</h3>
                  <ClockIcon className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-lg font-semibold text-white">{nextAssessmentDate}</p>
              </Card>
            </div>
            
            {/* Health Score Card */}
            {latestAssessment && (
              <div className="px-4">
                <Card className="bg-black/30 backdrop-blur-sm border-gray-800">
                  <div className="p-6 text-center">
                    <h2 className="text-2xl font-semibold mb-4 text-white">Overall Health Score</h2>
                    <div className="text-5xl font-bold mb-4 text-white">
                      {latestAssessment.metrics.overallScore.toFixed(1)}
                    </div>
                    <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full deep-space-gradient"
                        style={{ width: `${latestAssessment.metrics.overallScore}%` }}
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}
            
            {latestAssessment && (
              <div className="px-4">
                <PillarOverview assessment={latestAssessment} />
              </div>
            )}
            
            {/* StatCards Section */}
            <div className="px-4">
              <StatCards assessments={assessments} />
            </div>
            
            {/* Engagement Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
              <Card className="bg-black/30 backdrop-blur-sm border-gray-800 p-6">
                <div className="text-center">
                  <Trophy className="h-8 w-8 mb-2 mx-auto text-yellow-400" />
                  <p className="text-2xl font-bold text-white">{calculateStreak(assessments)}</p>
                  <p className="text-sm text-gray-400">Day Streak</p>
                </div>
              </Card>
              
              <Card className="bg-black/30 backdrop-blur-sm border-gray-800 p-6">
                <div className="text-center">
                  <Award className="h-8 w-8 mb-2 mx-auto text-purple-400" />
                  <p className="text-2xl font-bold text-white">{calculateCompletionRate(assessments)}%</p>
                  <p className="text-sm text-gray-400">Completion Rate</p>
                </div>
              </Card>
            </div>
            
            {/* Progress Chart */}
            {assessments.length > 1 && (
              <div className="px-4">
                <Card className="bg-black/30 backdrop-blur-sm border-gray-800 p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Your Progress</h2>
                  <div className="h-[400px]">
                    <ProgressChart 
                      assessments={chartData} 
                    />
                  </div>
                </Card>
              </div>
            )}
            
            {/* Recent Achievements */}
            <div className="px-4">
              <RecentAchievements assessments={assessments} />
            </div>
            
            {/* Metric Changes */}
            <div className="px-4">
              <Card className="bg-black/30 backdrop-blur-sm border-gray-800 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Metric Changes</h2>
                {assessments.length >= 2 && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-black/20 rounded-lg">
                      <ArrowUpIcon className="h-6 w-6 text-green-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-500">
                        {compareMetrics(
                          assessments[assessments.length - 1],
                          assessments[assessments.length - 2]
                        ).improved}
                      </p>
                      <p className="text-sm text-gray-400">Improved</p>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded-lg">
                      <MinusIcon className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-yellow-500">
                        {compareMetrics(
                          assessments[assessments.length - 1],
                          assessments[assessments.length - 2]
                        ).unchanged}
                      </p>
                      <p className="text-sm text-gray-400">Unchanged</p>
                    </div>
                    <div className="text-center p-4 bg-black/20 rounded-lg">
                      <ArrowDownIcon className="h-6 w-6 text-red-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-500">
                        {compareMetrics(
                          assessments[assessments.length - 1],
                          assessments[assessments.length - 2]
                        ).declined}
                      </p>
                      <p className="text-sm text-gray-400">Declined</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
            
            {assessments.length > 0 && (
              <div className="px-4">
                <AssessmentHistory assessments={assessments} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

