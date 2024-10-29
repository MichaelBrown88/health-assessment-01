import { db } from './firebase'
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit
} from 'firebase/firestore'

export interface HealthMetric {
  date: Date;
  score: number;
  bmi: number;
  bodyFat?: number;
  weight: number;
  height: number;
}

export interface DashboardData {
  recentMetrics: HealthMetric[];
  averageScore: number;
  assessmentCount: number;
  lastAssessment?: HealthMetric;
}

export async function getUserDashboardData(userId: string): Promise<DashboardData> {
  try {
    // Get user's assessments
    const assessmentsRef = collection(db, 'assessments')
    const q = query(
      assessmentsRef,
      where('userId', '==', userId),
      orderBy('date', 'desc'),
      limit(10)
    )

    const querySnapshot = await getDocs(q)
    const metrics: HealthMetric[] = []
    let totalScore = 0

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      metrics.push({
        date: data.date.toDate(),
        score: data.score,
        bmi: data.healthCalculations.bmi,
        bodyFat: data.healthCalculations.bodyFat,
        weight: data.healthCalculations.weight,
        height: data.healthCalculations.height
      })
      totalScore += data.score
    })

    const averageScore = metrics.length > 0 ? totalScore / metrics.length : 0

    return {
      recentMetrics: metrics,
      averageScore,
      assessmentCount: metrics.length,
      lastAssessment: metrics[0]
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    throw error
  }
}
