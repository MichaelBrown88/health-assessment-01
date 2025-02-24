export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin: boolean;
  isPremium: boolean;
  metadata: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: Error | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

export interface AuthFormProps {
  mode: 'signup' | 'login' | 'admin';
  onSuccess: () => void;
  isPremiumFlow?: boolean;
}

export interface AuthError extends Error {
  code: string;
  message: string;
} 