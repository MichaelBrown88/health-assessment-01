import { FirebaseError } from 'firebase/app';

export interface ErrorResponse {
  message: string;
  code?: string;
  severity: 'error' | 'warning' | 'info';
}

export function handleError(error: unknown): ErrorResponse {
  if (error instanceof FirebaseError) {
    return handleFirebaseError(error);
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
      severity: 'error'
    };
  }
  
  return {
    message: 'An unexpected error occurred',
    severity: 'error'
  };
}

function handleFirebaseError(error: FirebaseError): ErrorResponse {
  const commonErrors: Record<string, ErrorResponse> = {
    'auth/email-already-in-use': {
      message: 'This email is already registered. Please sign in or use a different email.',
      code: error.code,
      severity: 'warning'
    },
    'auth/invalid-email': {
      message: 'Please enter a valid email address.',
      code: error.code,
      severity: 'warning'
    },
    'auth/weak-password': {
      message: 'Please choose a stronger password. It should be at least 6 characters long.',
      code: error.code,
      severity: 'warning'
    },
    'auth/user-not-found': {
      message: 'No account found with this email. Please check your email or sign up.',
      code: error.code,
      severity: 'warning'
    },
    'auth/wrong-password': {
      message: 'Incorrect password. Please try again or reset your password.',
      code: error.code,
      severity: 'warning'
    },
    'permission-denied': {
      message: 'You do not have permission to perform this action.',
      code: error.code,
      severity: 'error'
    }
  };

  return commonErrors[error.code] || {
    message: error.message,
    code: error.code,
    severity: 'error'
  };
}

export function isFirebaseError(error: unknown): error is FirebaseError {
  return error instanceof FirebaseError;
} 