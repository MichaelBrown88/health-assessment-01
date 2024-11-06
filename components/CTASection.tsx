import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PaywallModal } from '@/components/PaywallModal';
import { useAuth } from '@/contexts/AuthContext';

const CTASection: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [showPaywall, setShowPaywall] = useState(false);

  const handleRetake = useCallback(() => {
    router.push('/questions');
  }, [router]);

  return (
    <>
      <div className="mt-8 flex flex-col items-center space-y-4">
        {user ? (
          <>
            <Button 
              onClick={() => router.push('/dashboard')}
              variant="primary"
              className="w-full md:w-auto px-6 py-3"
            >
              View Dashboard
            </Button>
            <Button 
              onClick={handleRetake}
              variant="outline"
              className="w-full md:w-auto px-6 py-3"
            >
              Take Another Assessment
            </Button>
          </>
        ) : (
          <>
            <Button 
              onClick={() => setShowPaywall(true)}
              variant="primary"
              className="w-full md:w-auto px-6 py-3"
            >
              Unlock Full Access
            </Button>
            <p className="text-sm text-gray-400">
              Get access to your personalized dashboard, progress tracking, and more
            </p>
          </>
        )}
      </div>

      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => setShowPaywall(false)} 
      />
    </>
  );
};

export default CTASection;
