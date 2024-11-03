export interface Achievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  earnedDate?: Date;
}

export interface MetricTrends {
  averageScore: number;
  improvement: number;
  topMetrics: string[];
  concernAreas: string[];
} 