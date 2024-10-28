'use client';

import React from 'react';

export const ForestTheme: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] bg-gradient-to-b from-green-900 to-green-600 opacity-50">
      <div className="absolute inset-0 bg-[url('/forest-texture.png')] opacity-20 mix-blend-overlay"></div>
    </div>
  );
};
