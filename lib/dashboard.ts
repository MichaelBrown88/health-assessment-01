import { db } from './firebase'
import { 
  collection, 
  query, 
  getDocs, 
  orderBy, 
  limit
} from 'firebase/firestore'
import type { Achievement, MetricTrends } from '@/app/types/dashboard';

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

export interface EnhancedDashboardData extends DashboardData {
  engagement: {
    streak: number;
    completionRate: number;
    achievements: Achievement[];
  };
  trends: {
    shortTerm: MetricTrends; // 7-day
    longTerm: MetricTrends;  // 30-day
  };
  goals: {
    current: string[];
    progress: Record<string, number>;
  };
  insights: {
    improvements: string[];
    concerns: string[];
    recommendations: string[];
  };
}

export async function getUserDashboardData(userId: string): Promise<DashboardData> {
  try {
    const assessmentsRef = collection(db, 'users', userId, 'assessments');
    const q = query(
      assessmentsRef,
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const metrics: HealthMetric[] = [];
    let totalScore = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      metrics.push({
        date: new Date(data.timestamp),
        score: data.metrics.overallScore,
        bmi: data.metrics.bmi,
        bodyFat: data.metrics.bodyFat,
        weight: data.metrics.weight,
        height: data.metrics.height
      });
      totalScore += data.metrics.overallScore;
    });

    const averageScore = metrics.length > 0 ? totalScore / metrics.length : 0;

    return {
      recentMetrics: metrics,
      averageScore,
      assessmentCount: metrics.length,
      lastAssessment: metrics[0]
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}
