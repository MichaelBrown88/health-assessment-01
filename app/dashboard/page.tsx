'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getUserAssessments } from '@/lib/db'
import type { Assessment } from '@/types/assessment'
import { ProgressChart } from '@/components/dashboard/ProgressChart'
import { StatCards } from '@/components/dashboard/StatCards'
import { RecentAchievements } from '@/components/dashboard/RecentAchievements'
import { SpaceTheme } from '@/components/layout/SpaceTheme'
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
import { Card } from "@/components/core/card"
import { PillarOverview } from '@/components/dashboard/PillarOverview'
import { AssessmentHistory } from '@/components/dashboard/AssessmentHistory'
import { useAssessmentData } from '@/hooks/useAssessmentData'
import { useAsync } from '@/hooks/useAsync'
import { HistoricalResults } from '@/components/dashboard/HistoricalResults'

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
  const { user } = useAuth();
  const { data: assessments = [], error, loading, execute } = useAsync<Assessment[]>();
  const { 
    firstAssessmentDate, 
    nextAssessmentDate, 
    latestAssessment, 
    chartData 
  } = useAssessmentData(assessments || []);

  useEffect(() => {
    if (user) {
      execute(() => getUserAssessments(user.uid));
    }
  }, [user, execute]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white" />
    </div>;
  }

  if (error) {
    return <div className="text-red-500 mt-4">{error.message}</div>;
  }

  const hasAssessments = assessments && assessments.length > 0;

  return (
    <div className="min-h-screen relative">
      <SpaceTheme />
      <div className="relative z-10 w-full px-6 py-12 mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-8 px-4">
              <h1 className="text-3xl font-bold text-white">Your Health Dashboard</h1>
              {hasAssessments && (
                <HistoricalResults assessments={assessments} />
              )}
            </div>
            
            {/* Assessment Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
              <Card className="bg-black/30 backdrop-blur-sm border-gray-800 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">First Assessment</h3>
                  <CalendarIcon className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-lg font-semibold text-white">{firstAssessmentDate || 'No assessments yet'}</p>
              </Card>
              
              <Card className="bg-black/30 backdrop-blur-sm border-gray-800 p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-400">Next Assessment</h3>
                  <ClockIcon className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-lg font-semibold text-white">{nextAssessmentDate || 'Complete your first assessment'}</p>
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
            {hasAssessments && (
              <div className="px-4">
                <StatCards assessments={assessments} />
              </div>
            )}
            
            {/* Engagement Metrics Grid */}
            {hasAssessments && (
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
            )}
            
            {/* Progress Chart */}
            {assessments && assessments.length > 1 && (
              <div className="px-4">
                <Card className="bg-black/30 backdrop-blur-sm border-gray-800 p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Your Progress</h2>
                  <div className="h-[400px]">
                    <ProgressChart assessments={chartData} />
                  </div>
                </Card>
              </div>
            )}
            
            {/* Recent Achievements */}
            {hasAssessments && (
              <div className="px-4">
                <RecentAchievements assessments={assessments} />
              </div>
            )}
            
            {/* Metric Changes */}
            {assessments && assessments.length >= 2 && (
              <div className="px-4">
                <Card className="bg-black/30 backdrop-blur-sm border-gray-800 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Metric Changes</h2>
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
                </Card>
              </div>
            )}
            
            {hasAssessments && (
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

