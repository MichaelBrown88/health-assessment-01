export interface User {
    id: string;
    email: string;
    isAdmin: boolean;
    isPremium: boolean;
    lastActive: Date | { seconds: number; nanoseconds: number };
    // ... other user properties
  }