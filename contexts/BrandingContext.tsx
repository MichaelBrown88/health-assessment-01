'use client';  // Add this line at the top of the file

import React, { createContext, useContext, useState, useEffect } from 'react';

interface BrandingContextType {
  primaryColor: string;
  secondaryColor: string;
  buttonGradient: string;
  buttonBorderGradient: string;
  progressBarGradient: string;
  font: string;
  logo: string;
  theme: 'space' | 'forest' | 'custom';
  updateBranding: (newBranding: Partial<BrandingContextType>) => void;
}

const defaultBranding: BrandingContextType = {
  primaryColor: '#121212',
  secondaryColor: '#f7f7f7',
  buttonGradient: 'linear-gradient(90deg, #0a192f 0%, #3a6073 100%)',
  buttonBorderGradient: 'linear-gradient(90deg, #0a192f 0%, #3a6073 100%)',
  progressBarGradient: 'linear-gradient(90deg, #0a192f 0%, #3a6073 100%)',
  font: 'Montserrat, sans-serif',
  logo: '/default-logo.png',
  theme: 'space',
  updateBranding: () => {},
};

const BrandingContext = createContext<BrandingContextType>(defaultBranding);

export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingContextType>(defaultBranding);

  useEffect(() => {
    // Load branding from localStorage or API on initial render
    const savedBranding = localStorage.getItem('appBranding');
    if (savedBranding) {
      setBranding(JSON.parse(savedBranding));
    }
  }, []);

  const updateBranding = (newBranding: Partial<BrandingContextType>) => {
    const updatedBranding = { ...branding, ...newBranding };
    setBranding(updatedBranding);
    localStorage.setItem('appBranding', JSON.stringify(updatedBranding));
  };

  return (
    <BrandingContext.Provider value={{ ...branding, updateBranding }}>
      {children}
    </BrandingContext.Provider>
  );
};
