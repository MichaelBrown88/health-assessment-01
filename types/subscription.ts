export interface SubscriptionFeatures {
  dashboardAccess: boolean;
  historyAccess: boolean;
  progressTracking: boolean;
  aiInsights: boolean;
  exportReports: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[] | SubscriptionFeatures;
  isPopular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired';
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SubscriptionStatus {
  isActive: boolean;
  plan: SubscriptionPlan | null;
  expiryDate: number | null;
  isCanceled: boolean;
}

export interface PricingConfig {
  baseMonthlyPrice: number;
  yearlyDiscount: number;
  currency: {
    code: string;
    symbol: string;
    rate: number;
  };
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic health assessment',
    price: 0,
    interval: 'month',
    features: {
      dashboardAccess: false,
      historyAccess: false,
      progressTracking: false,
      aiInsights: false,
      exportReports: false
    }
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    description: 'Full access to all premium features',
    price: 9.99,
    interval: 'month',
    features: {
      dashboardAccess: true,
      historyAccess: true,
      progressTracking: true,
      aiInsights: true,
      exportReports: true
    },
    isPopular: true
  }
];
