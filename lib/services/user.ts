import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  serverTimestamp, 
  increment,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile, UserSettings, UserSubscription } from '@/types/user';
import { FirebaseService } from './firebase';

class UserService extends FirebaseService {
  constructor() {
    super('users');
  }

  async createProfile(userId: string, email: string): Promise<void> {
    const defaultProfile: Omit<UserProfile, 'id'> = {
      email,
      isAdmin: false,
      isPremium: false,
      lastActive: serverTimestamp(),
      createdAt: serverTimestamp(),
      preferences: {
        notifications: true,
        emailUpdates: true,
        theme: 'system'
      },
      stats: {
        assessmentsCompleted: 0,
        currentStreak: 0,
        longestStreak: 0
      },
      healthGoals: [],
      achievements: []
    };

    await setDoc(doc(db, 'users', userId), defaultProfile);
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as UserProfile;
  }

  async updateProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, {
      ...data,
      lastActive: serverTimestamp()
    });
  }

  async updateSettings(userId: string, settings: UserSettings): Promise<void> {
    await this.updateProfile(userId, {
      preferences: settings
    });
  }

  async activatePremium(
    userId: string, 
    subscription: UserSubscription
  ): Promise<void> {
    await this.updateProfile(userId, {
      isPremium: true,
      premiumTier: subscription.tier,
      premiumExpiry: subscription.expiryDate
    });

    // Create subscription record
    await setDoc(doc(db, 'subscriptions', userId), subscription);
  }

  async deactivatePremium(userId: string): Promise<void> {
    await this.updateProfile(userId, {
      isPremium: false,
      premiumTier: null,
      premiumExpiry: null
    });

    // Update subscription status
    const subscriptionRef = doc(db, 'subscriptions', userId);
    await updateDoc(subscriptionRef, {
      status: 'cancelled'
    });
  }

  async updateAssessmentStats(userId: string): Promise<void> {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      'stats.assessmentsCompleted': increment(1),
      'stats.lastAssessmentDate': serverTimestamp(),
      lastActive: serverTimestamp()
    });
  }

  async addAchievement(
    userId: string, 
    achievement: { name: string; description: string; }
  ): Promise<void> {
    const userRef = doc(db, 'users', userId);
    const newAchievement = {
      id: crypto.randomUUID(),
      ...achievement,
      earnedAt: serverTimestamp()
    };

    await updateDoc(userRef, {
      achievements: arrayUnion(newAchievement)
    });
  }

  async updateHealthGoals(userId: string, goals: string[]): Promise<void> {
    await this.updateProfile(userId, {
      healthGoals: goals
    });
  }

  async checkPremiumStatus(userId: string): Promise<boolean> {
    const profile = await this.getProfile(userId);
    if (!profile?.isPremium) return false;

    const now = new Date();
    const expiry = profile.premiumExpiry instanceof Date 
      ? profile.premiumExpiry 
      : new Date(profile.premiumExpiry.seconds * 1000);

    return now < expiry;
  }
}

export const userService = new UserService(); 