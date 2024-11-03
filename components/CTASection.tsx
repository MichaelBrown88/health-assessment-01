import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const CTASection: React.FC = () => {
  const router = useRouter();

  const handleRetake = useCallback(() => {
    router.push('/questions');
  }, [router]);

  return (
    <div className="mt-8 flex justify-center">
      <Button 
        onClick={handleRetake}
        className="bg-primary hover:bg-primary/90"
      >
        Take Assessment
      </Button>
    </div>
  );
};

export default CTASection;
