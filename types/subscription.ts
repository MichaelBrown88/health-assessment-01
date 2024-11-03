export interface SubscriptionFeatures {
  dashboardAccess: boolean;
  historyAccess: boolean;
  progressTracking: boolean;
  aiInsights: boolean;
  exportReports: boolean;
}

export interface SubscriptionTier {
  name: string;
  price: number;
  features: SubscriptionFeatures;
}

export const subscriptionTiers: SubscriptionTier[] = [
  {
    name: 'Free',
    price: 0,
    features: {
      dashboardAccess: false,
      historyAccess: false,
      progressTracking: false,
      aiInsights: false,
      exportReports: false
    }
  },
  {
    name: 'Premium',
    price: 9.99,
    features: {
      dashboardAccess: true,
      historyAccess: true,
      progressTracking: true,
      aiInsights: true,
      exportReports: true
    }
  }
];
