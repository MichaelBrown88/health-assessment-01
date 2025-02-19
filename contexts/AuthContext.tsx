'use client';  // Add this at the top

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation'
import { userService } from '@/lib/services/user';
import type { UserProfile } from '@/types/user';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isPremium: boolean;
  loading: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  createAdminAccount: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  checkPremiumStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isAdmin: false,
    isPremium: false,
    loading: true
  });
  
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await userService.getProfile(user.uid);
          setState({
            user,
            profile,
            isAdmin: profile?.isAdmin || false,
            isPremium: profile?.isPremium || false,
            loading: false
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setState({ user, profile: null, isAdmin: false, isPremium: false, loading: false });
        }
      } else {
        setState({ user: null, profile: null, isAdmin: false, isPremium: false, loading: false });
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await userService.createProfile(user.uid, email);
  };

  const signIn = async (email: string, password: string, rememberMe = false) => {
    if (rememberMe) {
      await setPersistence(auth, browserLocalPersistence);
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    // Check if profile exists, if not create one
    const profile = await userService.getProfile(user.uid);
    if (!profile) {
      await userService.createProfile(user.uid, user.email!);
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const createAdminAccount = async (email: string, password: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await userService.createProfile(user.uid, email);
    await userService.updateProfile(user.uid, { isAdmin: true });
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!state.user) throw new Error('No user logged in');
    await userService.updateProfile(state.user.uid, data);
    
    // Update local state
    setState(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, ...data } : null
    }));
  };

  const checkPremiumStatus = async () => {
    if (!state.user) return false;
    const isPremium = await userService.checkPremiumStatus(state.user.uid);
    
    // Update local state if premium status has changed
    if (isPremium !== state.isPremium) {
      setState(prev => ({ ...prev, isPremium }));
    }
    
    return isPremium;
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signInWithGoogle,
    createAdminAccount,
    logout,
    updateProfile,
    checkPremiumStatus
  };

  if (state.loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white" />
    </div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
