export interface Analytics {
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

export interface Assessment {
  timestamp: Date | { seconds: number; nanoseconds: number };
  metrics: {
    overallScore: number;
    pillarScores?: Record<string, number>;
  };
  userId: string;
}

export interface User {
  id: string;
  isPremium: boolean;
  lastActive: Date | { seconds: number; nanoseconds: number };
  aiInteractions?: number;
  demographics?: {
    age?: string;
    gender?: string;
  };
}