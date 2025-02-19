export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  isAdmin: boolean;
  isPremium: boolean;
  premiumTier?: 'monthly' | 'yearly';
  premiumExpiry?: Date | { seconds: number; nanoseconds: number };
  lastActive: Date | { seconds: number; nanoseconds: number };
  createdAt: Date | { seconds: number; nanoseconds: number };
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    theme?: 'light' | 'dark' | 'system';
  };
  stats: {
    assessmentsCompleted: number;
    currentStreak: number;
    longestStreak: number;
    lastAssessmentDate?: Date | { seconds: number; nanoseconds: number };
  };
  healthGoals: string[];
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: Date | { seconds: number; nanoseconds: number };
  }>;
}

export interface UserSettings {
  notifications: boolean;
  emailUpdates: boolean;
  theme: 'light' | 'dark' | 'system';
}

export interface PremiumFeatures {
  aiCoach: boolean;
  detailedAnalytics: boolean;
  customGoals: boolean;
  prioritySupport: boolean;
}

export interface UserSubscription {
  tier: 'monthly' | 'yearly';
  startDate: Date | { seconds: number; nanoseconds: number };
  expiryDate: Date | { seconds: number; nanoseconds: number };
  status: 'active' | 'cancelled' | 'expired';
  features: PremiumFeatures;
}