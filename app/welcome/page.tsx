'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function WelcomePage() {
  const { continueAsGuest } = useAuth();

  return (
    <div>
      {/* ... other welcome page content ... */}
      <button 
        onClick={continueAsGuest}
        className="btn btn-secondary"
      >
        Continue as Guest
      </button>
    </div>
  );
}
