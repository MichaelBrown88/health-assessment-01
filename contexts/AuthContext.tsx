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
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation'
import { setDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';

export type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  createAdminAccount: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      // Check if user is admin
      const checkAdminStatus = async () => {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(adminDoc.exists());
      };
      checkAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      router.push('/welcome');
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string, rememberMe = false) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        // Set persistence to LOCAL
        await setPersistence(auth, browserLocalPersistence);
      }
      setUser(userCredential.user);
      router.push('/welcome');
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      router.push('/welcome');
    } catch (error) {
      console.error('Error in signInWithGoogle:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error in logout:', error);
      throw error;
    }
  };

  const createAdminAccount = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Add admin role to user in Firestore
      await setDoc(doc(db, 'admins', userCredential.user.uid), {
        email,
        createdAt: serverTimestamp(),
        isAdmin: true
      });
      setUser(userCredential.user);
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error in createAdminAccount:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAdmin,
    signIn,
    signUp,
    signInWithGoogle,
    createAdminAccount,
    logout
  };

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
