// Password strength calculation
export function passwordStrength(password: string): number {
  let score = 0;
  
  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score++; // Has uppercase
  if (/[a-z]/.test(password)) score++; // Has lowercase
  if (/[0-9]/.test(password)) score++; // Has number
  if (/[^A-Za-z0-9]/.test(password)) score++; // Has special char
  
  // Return normalized score (1-4)
  return Math.min(Math.floor(score / 1.5), 4);
}

// Rate limiting
const attempts = new Map<string, { count: number; timestamp: number }>();

export async function checkAttempts(email: string): Promise<number> {
  const now = Date.now();
  const userAttempts = attempts.get(email);
  
  // Clear old attempts (older than 15 minutes)
  if (userAttempts && now - userAttempts.timestamp > 15 * 60 * 1000) {
    attempts.delete(email);
    return 0;
  }
  
  if (!userAttempts) {
    attempts.set(email, { count: 1, timestamp: now });
    return 1;
  }
  
  const newCount = userAttempts.count + 1;
  attempts.set(email, { count: newCount, timestamp: now });
  return newCount;
}

// Reset attempts for a user (call after successful login)
export function resetAttempts(email: string): void {
  attempts.delete(email);
}

// Firebase error handling
export function getAuthErrorMessage(error: any): string {
  const errorCode = error?.code;
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign up is not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'Please choose a stronger password.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return 'An error occurred. Please try again.';
  }
}

export const handleAuthError = (error: unknown) => {
  console.error('Auth error:', error);
  throw error;
};

export const handleAuthSuccess = (router: any, user: any) => {
  router.push('/welcome');
}; 