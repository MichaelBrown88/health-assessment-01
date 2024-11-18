export interface AdminDashboardStats {
  totalUsers: number;
  totalAssessments: number;
  averageScore: number;
  userDemographics: {
    ageGroups: Record<string, number>;
    genderDistribution: Record<string, number>;
    fitnessLevels: Record<string, number>;
  };
  assessmentTrends: Array<any>;
  conversionRate: number;
  retentionRate: number;
}

export interface LeadAnalytics {
  conversionRate: number;
  averageScore: number;
  demographicBreakdown: {
    ageGroups: Record<string, number>;
    goals: Record<string, number>;
    activityLevels: Record<string, number>;
  };
  dailyLeads: {
    date: string;
    count: number;
  }[];
}
