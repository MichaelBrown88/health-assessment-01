import { getFunctions, httpsCallable } from 'firebase/functions';
import type { Analytics } from '@/types/analytics';

// Input type for the function (empty in this case)
type AnalyticsInput = Record<string, never>;

// Response type matching the Firebase function return structure
interface AnalyticsResponseData {
  users: {
    total: number;
    premium: number;
    guest: number;
    activeToday: number;
    activity: {
      daily: number[];
      weekly: number[];
      monthly: number[];
      yearly: number[];
      dates: string[];
    };
    demographics: {
      ageGroups: Record<string, number>;
      genderDistribution: Record<string, number>;
      fitnessLevels: Record<string, number>;
    };
  };
  assessments: {
    total: number;
    averageScore: number;
    completionRate: number;
    trends: {
      scores: number[];
      dates: string[];
    };
  };
  features: {
    aiUsage: {
      total: number;
      uniqueUsers: number;
      averagePerUser: number;
    };
  };
}

export async function getAdminDashboardData(): Promise<Analytics> {
  try {
    const functions = getFunctions();
    const getAnalytics = httpsCallable<AnalyticsInput, AnalyticsResponseData>(
      functions, 
      'getAdminAnalytics'
    );
    
    const result = await getAnalytics({});
    const data = result.data;
    
    return {
      users: {
        total: data.users?.total || 0,
        premium: data.users?.premium || 0,
        guest: data.users?.guest || 0,
        activeToday: data.users?.activeToday || 0,
        activity: {
          daily: data.users?.activity?.daily || [],
          weekly: data.users?.activity?.weekly || [],
          monthly: data.users?.activity?.monthly || [],
          yearly: data.users?.activity?.yearly || [],
          dates: data.users?.activity?.dates || [],
        },
        demographics: {
          ageGroups: data.users?.demographics?.ageGroups || {},
          genderDistribution: data.users?.demographics?.genderDistribution || {},
          fitnessLevels: data.users?.demographics?.fitnessLevels || {},
        },
      },
      assessments: {
        total: data.assessments?.total || 0,
        averageScore: data.assessments?.averageScore || 0,
        completionRate: data.assessments?.completionRate || 0,
        trends: {
          scores: data.assessments?.trends?.scores || [],
          dates: data.assessments?.trends?.dates || [],
        },
      },
      features: {
        aiUsage: {
          total: data.features?.aiUsage?.total || 0,
          uniqueUsers: data.features?.aiUsage?.uniqueUsers || 0,
          averagePerUser: data.features?.aiUsage?.averagePerUser || 0,
        },
      },
    };
  } catch (error) {
    console.error('Analytics Error:', error);
    throw error;
  }
}