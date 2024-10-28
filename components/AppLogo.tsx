'use client';

import React from 'react';
import Image from 'next/image';
import { useBranding } from '@/contexts/BrandingContext';

export const AppLogo: React.FC = () => {
  const { logo } = useBranding();
  return (
    <div className="mb-12 relative h-48">
      <Image 
        src={logo} 
        alt="App Logo" 
        className="mx-auto"
        fill
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
  );
};
