'use client'

import { useEffect, useState } from 'react'
import { SpaceTheme } from '@/components/SpaceTheme'
import { Card } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { getUserAssessments } from '@/lib/db'
import { 
  Activity, 
  Brain, 
  Utensils, 
  Dumbbell,
  TrendingUp,
  Scale,
  Timer
} from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import type { AssessmentResult } from '@/types'
import { ProgressChart } from '@/components/ProgressChart'
import { StatCards } from '@/components/StatCards'
import type { Assessment } from '@/components/StatCards'

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'

type ExerciseIntensity = 'light' | 'moderate' | 'vigorous' | 'very-intense'

type Recovery = 'poor' | 'fair' | 'good' | 'excellent'

type Diet = 'unhealthy' | 'average' | 'healthy' | 'very-healthy'

type MealFrequency = '1-2' | '3-4' | '5-6' | 'more-than-6'

type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent';
type StressLevel = 'very-high' | 'high' | 'moderate' | 'low';

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [assessments, setAssessments] = useState<AssessmentResult[]>([])

  useEffect(() => {
    let mounted = true

    async function loadData() {
      if (!user) {
        router.push('/welcome')
        return
      }

      try {
        console.log('Loading data for user:', user.uid)
        const data = await getUserAssessments(user.uid)
        if (mounted) {
          setAssessments(data)
        }
      } catch (error) {
        console.error('Error loading assessments:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [user, router])

  useEffect(() => {
    const fetchLatestData = async () => {
      if (user) {
        // Fetch latest assessment data
        const results = await getUserAssessments(user.uid);
        setAssessments(results);
      }
    };

    fetchLatestData();
  }, [user]); // Dependency on user ensures it updates when user changes

  const latestAssessment = assessments[0]
  const averageScore = assessments.length 
    ? assessments.reduce((acc, curr) => acc + curr.metrics.overallScore, 0) / assessments.length 
    : 0

  if (loading) {
    return <div className="text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen relative">
      <SpaceTheme />
      <div className="relative z-10 w-full px-4 py-8">
        <div className="max-w-[2000px] mx-auto"> {/* Increased max width */}
          <div className="space-y-6">
            <h1>Your Health Dashboard</h1>
            
            {/* Stat Cards */}
            <StatCards assessments={assessments as unknown as Assessment[]} />
            
            {/* Progress Chart */}
            {assessments.length > 1 && (
              <ProgressChart assessments={assessments} />
            )}
            
            {/* Key Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="p-6 bg-black/50 backdrop-blur-sm border-gray-800">
                <Activity className="h-8 w-8 mb-4 text-blue-400" />
                <h2 className="text-xl font-semibold mb-2 text-white">Overall Health Score</h2>
                <p className="text-4xl font-bold text-white">{averageScore.toFixed(1)}</p>
                <Progress value={averageScore} className="mt-4" />
              </Card>

              <Card className="p-6 bg-black/50 backdrop-blur-sm border-gray-800">
                <Scale className="h-8 w-8 mb-4 text-purple-400" />
                <h2 className="text-xl font-semibold mb-2 text-white">Current BMI</h2>
                <p className="text-4xl font-bold text-white">
                  {latestAssessment?.metrics.bmi.toFixed(1) || '--'}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {getBMICategory(latestAssessment?.metrics.bmi)}
                </p>
              </Card>

              <Card className="p-6 bg-black/50 backdrop-blur-sm border-gray-800">
                <Timer className="h-8 w-8 mb-4 text-green-400" />
                <h2 className="text-xl font-semibold mb-2 text-white">Assessments</h2>
                <p className="text-4xl font-bold text-white">{assessments.length}</p>
                <p className="text-sm text-gray-400 mt-2">Total Completed</p>
              </Card>

              <Card className="p-6 bg-black/50 backdrop-blur-sm border-gray-800">
                <TrendingUp className="h-8 w-8 mb-4 text-yellow-400" />
                <h2 className="text-xl font-semibold mb-2 text-white">Progress</h2>
                <p className="text-4xl font-bold text-white">
                  {calculateProgress(assessments)}%
                </p>
                <p className="text-sm text-gray-400 mt-2">Since First Assessment</p>
              </Card>
            </div>

            {/* Health Categories Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
              <Card className="p-6 bg-black/50 backdrop-blur-sm border-gray-800">
                <Dumbbell className="h-8 w-8 mb-4 text-red-400" />
                <h2 className="text-xl font-semibold mb-2 text-white">Exercise</h2>
                <div className="space-y-4">
                  <MetricItem 
                    label="Activity Level" 
                    value={formatActivityLevel(latestAssessment?.answers.activityLevel as ActivityLevel)} 
                  />
                  <MetricItem 
                    label="Exercise Intensity" 
                    value={formatExerciseIntensity(latestAssessment?.answers.exerciseIntensity as ExerciseIntensity)} 
                  />
                  <MetricItem 
                    label="Recovery Quality" 
                    value={formatRecovery(latestAssessment?.answers.recovery as Recovery)} 
                  />
                </div>
              </Card>

              <Card className="p-6 bg-black/50 backdrop-blur-sm border-gray-800">
                <Utensils className="h-8 w-8 mb-4 text-green-400" />
                <h2 className="text-xl font-semibold mb-2 text-white">Nutrition</h2>
                <div className="space-y-4">
                  <MetricItem 
                    label="Diet Quality" 
                    value={formatDiet(latestAssessment?.answers.diet as Diet)} 
                  />
                  <MetricItem 
                    label="Meal Frequency" 
                    value={formatMealFrequency(latestAssessment?.answers.mealFrequency as MealFrequency)} 
                  />
                  <MetricItem 
                    label="Caloric Needs" 
                    value={`${latestAssessment?.healthCalculations.recommendedCalories || '--'} kcal`} 
                  />
                </div>
              </Card>

              <Card className="p-6 bg-black/50 backdrop-blur-sm border-gray-800">
                <Brain className="h-8 w-8 mb-4 text-blue-400" />
                <h2 className="text-xl font-semibold mb-2 text-white">Wellbeing</h2>
                <div className="space-y-4">
                  <MetricItem 
                    label="Sleep Quality" 
                    value={formatSleepQuality(latestAssessment?.answers.sleepQuality as SleepQuality)} 
                  />
                  <MetricItem 
                    label="Stress Level" 
                    value={formatStress(latestAssessment?.answers.stress as StressLevel)} 
                  />
                  <MetricItem 
                    label="Mental Health" 
                    value={formatMentalHealth(latestAssessment?.answers.mentalHealth as 'often' | 'sometimes' | 'rarely' | 'never')} 
                  />
                </div>
              </Card>
            </div>

            {/* Recent Assessments Table */}
            <Card className="p-6 bg-black/50 backdrop-blur-sm border-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-white">Recent Assessments</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3">Date</th>
                      <th className="text-left py-3">Score</th>
                      <th className="text-left py-3">BMI</th>
                      <th className="text-left py-3">Weight</th>
                      <th className="text-left py-3">Activity Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.slice(0, 5).map((assessment, index) => (
                      <tr key={index} className="border-b border-gray-800">
                        <td className="py-3">{formatDate(assessment.timestamp)}</td>
                        <td className="py-3">{assessment.metrics.overallScore.toFixed(1)}</td>
                        <td className="py-3">{assessment.metrics.bmi.toFixed(1)}</td>
                        <td className="py-3">{assessment.metrics.weight} kg</td>
                        <td className="py-3">{formatActivityLevel(assessment.answers.activityLevel as ActivityLevel)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper Components
function MetricItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  )
}

// Helper Functions
function getBMICategory(bmi: number | undefined): string {
  if (!bmi) return '--'
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal weight'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

function calculateProgress(assessments: AssessmentResult[]): string {
  if (assessments.length < 2) return '0'
  const first = assessments[assessments.length - 1].metrics.overallScore
  const latest = assessments[0].metrics.overallScore
  const progress = ((latest - first) / first) * 100
  return progress.toFixed(1)
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString()
}

// Format helper functions for various metrics
function formatActivityLevel(level: ActivityLevel | null): string {
  if (!level) return '--';
  const mapping: Record<ActivityLevel, string> = {
    sedentary: 'Sedentary',
    light: 'Light',
    moderate: 'Moderate',
    active: 'Active',
    veryActive: 'Very Active'
  };
  return mapping[level];
}

function formatExerciseIntensity(intensity: ExerciseIntensity | null): string {
  if (!intensity) return '--';
  const mapping: Record<ExerciseIntensity, string> = {
    light: 'Light',
    moderate: 'Moderate',
    vigorous: 'Vigorous',
    'very-intense': 'Very Intense'
  };
  return mapping[intensity];
}

function formatDiet(diet: Diet | null): string {
  if (!diet) return '--';
  const mapping: Record<Diet, string> = {
    unhealthy: 'Unhealthy',
    average: 'Average',
    healthy: 'Healthy',
    'very-healthy': 'Very Healthy'
  };
  return mapping[diet];
}

function formatMealFrequency(frequency: MealFrequency | undefined): string {
  if (!frequency) return '--';
  const mapping: { [key: string]: string } = {
    '1-2': '1-2 meals',
    '3-4': '3-4 meals',
    '5-6': '5-6 meals',
    'more-than-6': '6+ meals'
  }
  return mapping[frequency]
}

function formatSleepQuality(quality: SleepQuality | undefined): string {
  const mapping: Record<SleepQuality, string> = {
    poor: 'Poor',
    fair: 'Fair',
    good: 'Good',
    excellent: 'Excellent'
  };
  return quality ? mapping[quality] : '--';
}

function formatStress(stress: StressLevel | undefined): string {
  if (!stress) return '--';
  const mapping: Record<StressLevel, string> = {
    'very-high': 'Very High',
    high: 'High',
    moderate: 'Moderate',
    low: 'Low'
  };
  return mapping[stress];
}

function formatMentalHealth(health: 'often' | 'sometimes' | 'rarely' | 'never' | undefined): string {
  if (!health) return '--';
  const mapping: { [key: string]: string } = {
    often: 'Often Stressed',
    sometimes: 'Sometimes Stressed',
    rarely: 'Rarely Stressed',
    never: 'Never Stressed'
  }
  return mapping[health];
}

function formatRecovery(recovery: string | null): string {
  if (!recovery) return '--';
  const mapping: Record<string, string> = {
    poor: 'Poor',
    fair: 'Fair',
    good: 'Good',
    excellent: 'Excellent'
  };
  return mapping[recovery as keyof typeof mapping] || recovery;
}
