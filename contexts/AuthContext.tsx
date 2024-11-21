'use client';  // Add this at the top

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation'
import { 
  doc, 
  setDoc, 
  serverTimestamp,
  collection,
  getDocs,
  query,
  limit,
  getDoc
} from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isFirstRun: boolean;
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  createAdminAccount: (email: string, password: string) => Promise<User>;
  continueAsGuest: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const router = useRouter()

  // Move checkFirstRun into useCallback
  const checkFirstRun = useCallback(async () => {
    console.log('Checking first run status...');
    try {
      const adminRef = collection(db, 'admins');
      const adminQuery = query(adminRef, limit(1));
      const adminSnapshot = await getDocs(adminQuery);
      
      const isEmpty = adminSnapshot.empty;
      console.log('Admin check result:', { 
        empty: isEmpty, 
        size: adminSnapshot.size 
      });
      
      setIsFirstRun(isEmpty);
      setLoading(false);
    } catch (error) {
      console.error('Error in checkFirstRun:', error);
      setIsFirstRun(false);
      setLoading(false);
      setError('Failed to check admin status');
    }
  }, []);

  useEffect(() => {
    checkFirstRun()
  }, [checkFirstRun])

  useEffect(() => {
    // Add offline/online detection
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    setLoading(true); // Set loading true before auth check
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // Check if user is admin
          const adminDoc = await getDocs(collection(db, 'admins'));
          const isUserAdmin = !adminDoc.empty && adminDoc.docs.some(doc => doc.id === user.uid);
          setIsAdmin(isUserAdmin);
          setUser(user);
        } else {
          setIsAdmin(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setLoading(false); // Always set loading to false when done
      }
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      router.push('/landing');
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();

      if (userData?.isAdmin) {
        // Admin goes directly to dashboard
        router.push('/admin/dashboard');
      } else {
        // Regular users go to welcome screen
        router.push('/landing');
      }
    } catch (error) {
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Create or update user document
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        isAdmin: false
      }, { merge: true });

    } catch (error) {
      console.error('Error signing in with Google:', error);
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
    console.log('Creating admin account for:', email);
    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User created:', user.uid);

      // Add to admins collection
      const adminRef = doc(db, 'admins', user.uid);
      await setDoc(adminRef, {
        email: user.email,
        createdAt: serverTimestamp(),
        isAdmin: true
      });
      console.log('Admin document created');

      // Update local state
      setUser(user);
      setIsAdmin(true);
      setIsFirstRun(false);
      console.log('Local state updated');

      return user;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  };

  const continueAsGuest = async () => {
    try {
      const guestUser = await signInAnonymously(auth);
      await setDoc(doc(db, 'users', guestUser.user.uid), {
        isGuest: true,
        createdAt: serverTimestamp()
      });
      router.push('/assessment');
    } catch (error) {
      console.error('Error creating guest session:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAdmin,
    isFirstRun,
    loading,
    error,
    isOffline,
    signIn,
    signUp,
    logout,
    createAdminAccount,
    continueAsGuest,
    signInWithGoogle,
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

