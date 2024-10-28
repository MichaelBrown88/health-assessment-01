'use client';

import { useAuth as useAuthContext } from '@/contexts/AuthContext';

// Re-export the hook with any additional type safety if needed
export const useAuth = useAuthContext;

